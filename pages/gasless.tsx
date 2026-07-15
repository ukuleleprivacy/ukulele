import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { Layout } from '../src/Layout';
import { abi as tokenAbi, address as tokenAddress } from '../src/contracts/contract1';
import { abi as gsnAbi, address as gsnAddress } from '../src/contracts/contract4';
import { gasLimit } from '../src/constants';
import {
  GASLESS_ACTION,
  isGaslessRelayConfigured,
  relayGaslessAction,
  signGaslessAction,
} from '../src/lib/gaslessRelay';

const gaslessMessage = {
  title: 'Gasless UKULELE Actions',
  description:
    'Gasless is the UKULELE interface for lower-friction wallet actions on Ethereum. The UI is designed for a fully on-chain system while keeping copy, controls, and feedback calm and minimal.',
};

const defaultStatus = {
  title: 'Wallet actions ready',
  description: 'Connect your wallet from the header, then choose the action you want to run.',
};

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };

type ActionKey = 'sell' | 'fullDisplay' | 'partialDisplay';

const getTransactionError = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'reason' in error &&
    typeof error.reason === 'string' &&
    error.reason === 'user rejected transaction'
  ) {
    return {
      title: 'User rejected the transaction',
      description: 'No transaction was completed. Submit the action again when you are ready.',
    };
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return {
      title: 'Transaction error',
      description: error.message,
    };
  }

  return {
    title: 'Transaction error',
    description: 'The action could not be completed. Please check your wallet and try again.',
  };
};

export default function Gasless() {
  const { library, account, active } = useWeb3React();
  const [partialAmount, setPartialAmount] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<ActionKey | null>(null);

  const requireWallet = () => {
    if (!active || !account || !library) {
      setError('Please connect your wallet from the header before using these actions.');
      setStatus({
        title: 'Wallet required',
        description: 'Connect your wallet from the header, then submit the action again.',
      });
      return null;
    }

    setError('');
    return library.getSigner();
  };

  const handleSell = async () => {
    const signer = requireWallet();

    if (!signer) {
      return;
    }

    setPendingAction('sell');
    setStatus({
      title: 'SELL pending',
      description: isGaslessRelayConfigured()
        ? 'Sign the gasless request in your wallet and wait for the relay to finish.'
        : 'Confirm the transaction in your wallet and wait for it to finish.',
    });

    try {
      const gsnContract = new ethers.Contract(gsnAddress, gsnAbi, signer);

      if (isGaslessRelayConfigured()) {
        const nonce = await gsnContract.nonces(account);
        const { chainId } = await library.getNetwork();
        const deadline = Math.floor(Date.now() / 1000) + 20 * 60;
        const signature = await signGaslessAction({
          signer,
          user: account as string,
          chainId,
          verifyingContract: gsnAddress,
          action: GASLESS_ACTION.swapBV3ForETH,
          nonce,
          deadline,
        });

        await relayGaslessAction({
          target: gsnAddress,
          functionName: 'executeSwapBV3ForETH',
          request: {
            user: account as string,
            deadline,
            signature,
          },
        });
      } else {
        const tx = await gsnContract.Swap_BV3_for_ETH(transactionOptions);
        await tx.wait();
      }

      setStatus({
        title: 'SELL complete',
        description: 'The SELL action completed successfully.',
      });
    } catch (transactionError) {
      const nextError = getTransactionError(transactionError);
      setError(nextError.description);
      setStatus(nextError);
    } finally {
      setPendingAction(null);
    }
  };

  const handleFullDisplay = async () => {
    const signer = requireWallet();

    if (!signer) {
      return;
    }

    setPendingAction('fullDisplay');
    setStatus({
      title: 'Full UI display pending',
      description: 'Confirm the transaction in your wallet and wait for it to finish.',
    });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const tx = await tokenContract.decrypt(transactionOptions);
      await tx.wait();
      setStatus({
        title: 'Full UI display complete',
        description: 'The full display action completed successfully.',
      });
    } catch (transactionError) {
      const nextError = getTransactionError(transactionError);
      setError(nextError.description);
      setStatus(nextError);
    } finally {
      setPendingAction(null);
    }
  };

  const handlePartialDisplay = async () => {
    const signer = requireWallet();

    if (!signer) {
      return;
    }

    if (!partialAmount || Number(partialAmount) <= 0) {
      setError('Enter a positive amount for partial display.');
      setStatus({
        title: 'Amount required',
        description: 'Enter a positive amount, then submit the partial display action again.',
      });
      return;
    }

    setPendingAction('partialDisplay');
    setStatus({
      title: 'Partial UI display pending',
      description: 'Confirm the transaction in your wallet and wait for it to finish.',
    });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amount = ethers.utils.parseEther(partialAmount);
      const tx = await tokenContract.decrypt_partial(amount, transactionOptions);
      await tx.wait();
      setPartialAmount('');
      setStatus({
        title: 'Partial UI display complete',
        description: 'The partial display action completed successfully.',
      });
    } catch (transactionError) {
      const nextError = getTransactionError(transactionError);
      setError(nextError.description);
      setStatus(nextError);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Gasless | Ukulele</title>
      </Head>

      <Container disableGutters maxWidth="md" sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 7, md: 11 } }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: '22px 24px!important', sm: '28px 36px!important' } }}>
            <Typography variant="h5" fontWeight="700">
              {gaslessMessage.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              {gaslessMessage.description}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: { xs: '28px 24px!important', sm: '42px 52px!important' } }}>
            <Stack gap={3.5}>
              <Button
                size="large"
                variant="contained"
                fullWidth
                disabled={Boolean(pendingAction)}
                onClick={handleSell}
                sx={{
                  minHeight: 62,
                  borderRadius: 999,
                  fontSize: { xs: 16, sm: 20 },
                }}
              >
                {pendingAction === 'sell' ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2, color: '#fff', minWidth: 24 }} />
                    SELL pending
                  </>
                ) : (
                  'SELL'
                )}
              </Button>

              <Button
                size="large"
                variant="contained"
                fullWidth
                disabled={Boolean(pendingAction)}
                onClick={handleFullDisplay}
                sx={{
                  minHeight: 62,
                  borderRadius: 999,
                  fontSize: { xs: 16, sm: 20 },
                }}
              >
                {pendingAction === 'fullDisplay' ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2, color: '#fff', minWidth: 24 }} />
                    Full UI display pending
                  </>
                ) : (
                  'Full UI Display'
                )}
              </Button>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    variant="outlined"
                    fullWidth
                    value={partialAmount}
                    disabled={Boolean(pendingAction)}
                    onChange={(event) => setPartialAmount(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        ['e', 'E', '+', '-'].includes(event.key) &&
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.altKey &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    disabled={Boolean(pendingAction)}
                    onClick={handlePartialDisplay}
                    sx={{
                      minHeight: 62,
                      borderRadius: 999,
                    }}
                  >
                    {pendingAction === 'partialDisplay' ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 2, color: '#fff', minWidth: 24 }} />
                        Pending
                      </>
                    ) : (
                      'Partial UI Display'
                    )}
                  </Button>
                </Grid>
              </Grid>

              <Box
                sx={{
                  p: { xs: 2.25, md: 2.5 },
                  borderRadius: '8px',
                  border: error
                    ? '1px solid rgba(255, 255, 255, 0.42)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: error ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.035)',
                }}
              >
                <Typography fontWeight="700">{status.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {status.description}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            mt: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.035)',
          }}
        >
          <Typography color="text.secondary">
            UKULELE is on Ethereum mainnet and is designed to be fully on chain. Connect your wallet
            from the header to use wallet-aware UI states.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}
