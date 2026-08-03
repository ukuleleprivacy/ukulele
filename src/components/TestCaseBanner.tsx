import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { faucetAbi, faucetAddress } from '../contracts/faucet';
import { walletBalanceRefreshEvent } from '../lib/wallet';

type FaucetStatus = {
  tone: 'info' | 'success' | 'error';
  message: string;
};

const getFaucetError = (error: unknown) => {
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
    return 'The claim was rejected. No tokens were claimed.';
  }

  if (/already claimed/i.test(errorText)) {
    return 'This wallet has already claimed its 100 FIDU.';
  }

  if (/faucet empty/i.test(errorText)) {
    return 'The Faucet is currently empty.';
  }

  if (/transfer failed/i.test(errorText)) {
    return 'The Faucet could not transfer FIDU. No tokens were claimed.';
  }

  return 'The claim transaction failed. No tokens were claimed; please try again.';
};

export const TestCaseBanner = () => {
  const { active, account, library } = useWeb3React();
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [status, setStatus] = useState<FaucetStatus | null>(null);

  useEffect(() => {
    if (!active || !account || !library) {
      setIsChecking(false);
      setHasClaimed(false);
      setIsEmpty(false);
      setStatus(null);
      return;
    }

    let isCurrent = true;
    const faucet = new ethers.Contract(faucetAddress, faucetAbi, library);

    const loadFaucetState = async () => {
      setIsChecking(true);

      try {
        const [nextHasClaimed, faucetBalance, faucetAmount] = await Promise.all([
          faucet.hasClaimed(account),
          faucet.getBalance(),
          faucet.FAUCET_AMOUNT(),
        ]);

        if (!isCurrent) {
          return;
        }

        const nextIsEmpty = faucetBalance.lt(faucetAmount);
        setHasClaimed(nextHasClaimed);
        setIsEmpty(nextIsEmpty);
        setStatus(
          nextHasClaimed
            ? { tone: 'info', message: 'This wallet has already claimed its 100 FIDU.' }
            : nextIsEmpty
              ? { tone: 'error', message: 'The Faucet is currently empty.' }
              : null,
        );
      } catch (error) {
        console.warn('[Faucet] Could not load the claim state.', error);

        if (isCurrent) {
          setStatus({ tone: 'error', message: 'The Faucet status could not be loaded.' });
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
  }, [account, active, library]);

  const claimTokens = async () => {
    if (!active || !account || !library) {
      setStatus({ tone: 'error', message: 'Connect your wallet before claiming from the Faucet.' });
      return;
    }

    setIsClaiming(true);
    setStatus({ tone: 'info', message: 'Preparing your 100 FIDU claim…' });

    try {
      const network = await library.getNetwork();

      if (network.chainId !== 1) {
        throw new Error('Ethereum mainnet required');
      }

      const faucet = new ethers.Contract(faucetAddress, faucetAbi, library.getSigner());
      const [nextHasClaimed, faucetBalance, faucetAmount] = await Promise.all([
        faucet.hasClaimed(account),
        faucet.getBalance(),
        faucet.FAUCET_AMOUNT(),
      ]);

      if (nextHasClaimed) {
        setHasClaimed(true);
        setStatus({ tone: 'info', message: 'This wallet has already claimed its 100 FIDU.' });
        return;
      }

      if (faucetBalance.lt(faucetAmount)) {
        setIsEmpty(true);
        setStatus({ tone: 'error', message: 'The Faucet is currently empty.' });
        return;
      }

      await faucet.callStatic.claim();
      const transaction = await faucet.claim();
      setStatus({ tone: 'info', message: 'Claim submitted. Waiting for Ethereum confirmation…' });
      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        throw new Error('Claim transaction failed');
      }

      setHasClaimed(true);
      setStatus({ tone: 'success', message: 'Claim confirmed — 100 FIDU is now in your wallet.' });
      window.dispatchEvent(new Event(walletBalanceRefreshEvent));
    } catch (error) {
      console.error('[Faucet] Claim failed.', error);
      setStatus({ tone: 'error', message: getFaucetError(error) });
    } finally {
      setIsClaiming(false);
    }
  };

  const buttonLabel = hasClaimed
    ? 'Already Claimed'
    : isEmpty
      ? 'Faucet Empty'
      : 'Claim 100 FIDU';

  if (isDismissed) {
    return null;
  }

  return (
    <Box
      component="aside"
      role="note"
      sx={{
        position: 'relative',
        mt: 2,
        p: { xs: 2, sm: 2.25 },
        pr: { xs: 5.5, sm: 7 },
        border: '1px solid rgba(102, 255, 138, 0.28)',
        borderRadius: '8px',
        background:
          'linear-gradient(90deg, rgba(102, 255, 138, 0.09), rgba(255, 255, 255, 0.016))',
      }}
    >
      <IconButton
        type="button"
        aria-label="Dismiss faucet notice"
        onClick={() => setIsDismissed(true)}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: 'primary.light',
          border: '1px solid rgba(102, 255, 138, 0.24)',
          backgroundColor: 'rgba(0, 0, 0, 0.28)',
          '&:hover': { backgroundColor: 'rgba(102, 255, 138, 0.12)' },
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Box
          component="img"
          src="/brand/faucet-spacecraft-transparent.png"
          alt="Neon FIDUCARO spacecraft"
          sx={{
            width: { xs: 66, sm: 86 },
            height: { xs: 66, sm: 86 },
            flex: '0 0 auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(102, 255, 138, 0.42))',
          }}
        />

        <Stack gap={0.6} sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight="700">Fiducaro is LIVE</Typography>

          <Typography variant="body2" color="text.secondary">
            And you can claim 100 Tokens from the Faucet.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Test it, send it and marvel in its simplicity, low gas cost and incredible and
            unparalleled privacy.
          </Typography>

          {status && (
            <Typography
              variant="caption"
              role={status.tone === 'error' ? 'alert' : 'status'}
              aria-live={status.tone === 'error' ? 'assertive' : 'polite'}
              sx={{
                color:
                  status.tone === 'success'
                    ? 'primary.light'
                    : status.tone === 'error'
                      ? '#EDF1F2'
                      : 'text.secondary',
                fontWeight: 700,
              }}
            >
              {status.message}
            </Typography>
          )}
        </Stack>

        <Button
          type="button"
          size="small"
          variant="contained"
          disabled={isChecking || isClaiming || hasClaimed || isEmpty}
          onClick={claimTokens}
          sx={{
            minHeight: 38,
            px: 2,
            flex: '0 0 auto',
            alignSelf: { xs: 'flex-end', sm: 'center' },
            mr: { sm: 1 },
          }}
        >
          {isChecking || isClaiming ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
              {isClaiming ? 'Claiming…' : 'Checking…'}
            </>
          ) : (
            buttonLabel
          )}
        </Button>
      </Stack>
    </Box>
  );
};
