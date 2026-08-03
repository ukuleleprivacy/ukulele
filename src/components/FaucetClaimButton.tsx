import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { faucetAbi, faucetAddress } from '../contracts/faucet';
import { walletBalanceRefreshEvent } from '../lib/wallet';
import { fiducaroToken } from '../token';

type FaucetMessage = {
  tone: 'info' | 'success' | 'error';
  text: string;
};

type FaucetClaimButtonProps = {
  onBalanceChange?: (balance: string | null) => void;
};

const mainnetReadProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://ethereum-rpc.publicnode.com',
);

const formatFaucetBalance = (balance: ethers.BigNumber) =>
  ethers.utils.commify(ethers.utils.formatUnits(balance, fiducaroToken.decimals));

const getClaimError = (error: unknown) => {
  const transactionError =
    error && typeof error === 'object'
      ? (error as {
          code?: number | string;
          reason?: string;
          message?: string;
          error?: { reason?: string; message?: string };
        })
      : null;
  const errorText = [
    transactionError?.reason,
    transactionError?.message,
    transactionError?.error?.reason,
    transactionError?.error?.message,
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  if (
    transactionError?.code === 4001 ||
    /user rejected|user denied|action_rejected/i.test(errorText)
  ) {
    return 'The claim was rejected.';
  }

  if (/already claimed/i.test(errorText)) {
    return 'This wallet has already claimed its 100 FIDU.';
  }

  if (/faucet empty/i.test(errorText)) {
    return 'The Faucet is currently empty.';
  }

  return 'The claim failed. No tokens were claimed; please try again.';
};

export const FaucetClaimButton = ({ onBalanceChange }: FaucetClaimButtonProps) => {
  const { active, account, library } = useWeb3React();
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [message, setMessage] = useState<FaucetMessage | null>(null);

  useEffect(() => {
    if (!account) {
      setHasClaimed(false);
    }

    let isCurrent = true;
    const faucet = new ethers.Contract(faucetAddress, faucetAbi, library || mainnetReadProvider);

    const loadFaucetState = async () => {
      setIsChecking(true);

      try {
        const [nextHasClaimed, balance, faucetAmount] = await Promise.all([
          account ? faucet.hasClaimed(account) : Promise.resolve(false),
          faucet.getBalance(),
          faucet.FAUCET_AMOUNT(),
        ]);

        if (!isCurrent) {
          return;
        }

        const nextIsEmpty = balance.lt(faucetAmount);
        const formattedBalance = formatFaucetBalance(balance);
        setHasClaimed(nextHasClaimed);
        setIsEmpty(nextIsEmpty);
        onBalanceChange?.(formattedBalance);
        setMessage(
          nextHasClaimed
            ? { tone: 'info', text: 'This wallet has already claimed its 100 FIDU.' }
            : nextIsEmpty
              ? { tone: 'error', text: 'The Faucet is currently empty.' }
              : null,
        );
      } catch (error) {
        console.warn('[Faucet] Could not load getBalance().', error);

        if (isCurrent) {
          onBalanceChange?.(null);
          setMessage({ tone: 'error', text: 'The Faucet balance could not be loaded.' });
        }
      } finally {
        if (isCurrent) {
          setIsChecking(false);
        }
      }
    };

    void loadFaucetState();

    return () => {
      isCurrent = false;
    };
  }, [account, active, library, onBalanceChange]);

  const claimTokens = async () => {
    if (!active || !account || !library) {
      setMessage({ tone: 'error', text: 'Connect your wallet before claiming from the Faucet.' });
      return;
    }

    setIsClaiming(true);
    setMessage({ tone: 'info', text: 'Preparing your 100 FIDU claim…' });

    try {
      const network = await library.getNetwork();

      if (network.chainId !== 1) {
        setMessage({ tone: 'error', text: 'Switch MetaMask to Ethereum mainnet first.' });
        return;
      }

      const faucet = new ethers.Contract(faucetAddress, faucetAbi, library.getSigner());
      const [nextHasClaimed, balance, faucetAmount] = await Promise.all([
        faucet.hasClaimed(account),
        faucet.getBalance(),
        faucet.FAUCET_AMOUNT(),
      ]);

      onBalanceChange?.(formatFaucetBalance(balance));

      if (nextHasClaimed) {
        setHasClaimed(true);
        setMessage({ tone: 'info', text: 'This wallet has already claimed its 100 FIDU.' });
        return;
      }

      if (balance.lt(faucetAmount)) {
        setIsEmpty(true);
        setMessage({ tone: 'error', text: 'The Faucet is currently empty.' });
        return;
      }

      await faucet.callStatic.claim();
      const transaction = await faucet.claim();
      setMessage({ tone: 'info', text: 'Claim submitted. Waiting for confirmation…' });
      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        throw new Error('Claim transaction failed');
      }

      const remainingBalance = await faucet.getBalance();
      onBalanceChange?.(formatFaucetBalance(remainingBalance));
      setHasClaimed(true);
      setMessage({ tone: 'success', text: 'Claim confirmed — 100 FIDU is now in your wallet.' });
      window.dispatchEvent(new Event(walletBalanceRefreshEvent));
    } catch (error) {
      console.error('[Faucet] Claim failed.', error);
      setMessage({ tone: 'error', text: getClaimError(error) });
    } finally {
      setIsClaiming(false);
    }
  };

  const buttonLabel = hasClaimed
    ? 'Already Claimed'
    : isEmpty
      ? 'Faucet Empty'
      : 'Claim 100 FIDU from the Faucet';

  return (
    <Stack gap={0.75} sx={{ width: '100%' }}>
      <Button
        type="button"
        variant="outlined"
        fullWidth
        disabled={isChecking || isClaiming || hasClaimed || isEmpty}
        onClick={claimTokens}
      >
        {isChecking || isClaiming ? (
          <>
            <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
            {isClaiming ? 'Claiming…' : 'Checking Faucet…'}
          </>
        ) : (
          buttonLabel
        )}
      </Button>

      {message && (
        <Typography
          variant="caption"
          role={message.tone === 'error' ? 'alert' : 'status'}
          sx={{
            color:
              message.tone === 'success'
                ? 'primary.light'
                : message.tone === 'error'
                  ? 'text.primary'
                  : 'text.secondary',
            textAlign: 'right',
          }}
        >
          {message.text}
        </Typography>
      )}
    </Stack>
  );
};
