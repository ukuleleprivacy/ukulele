import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import LockRounded from '@mui/icons-material/LockRounded';
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
import { gasLimit } from '../src/constants';

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };

const defaultStatus = {
  title: 'Choose how much to decrypt',
  description:
    'Full decrypt reveals your complete private balance. Partial decrypt reveals only the amount you enter.',
};

type DecryptAction = 'full' | 'partial';

const getTransactionError = (error: unknown) => {
  if (error && typeof error === 'object') {
    const transactionError = error as { code?: number | string; reason?: string; message?: string };

    if (transactionError.code === 4001 || transactionError.reason === 'user rejected transaction') {
      return {
        title: 'Transaction rejected',
        description: 'No balance was decrypted. Submit the action again when you are ready.',
      };
    }

    if (transactionError.message) {
      return {
        title: 'Transaction error',
        description: transactionError.message,
      };
    }
  }

  return {
    title: 'Transaction error',
    description: 'The decrypt action could not be completed. Check your wallet and try again.',
  };
};

export default function Decrypt() {
  const { library, account, active } = useWeb3React();
  const [partialAmount, setPartialAmount] = useState('');
  const [pendingAction, setPendingAction] = useState<DecryptAction | null>(null);
  const [status, setStatus] = useState(defaultStatus);
  const [hasError, setHasError] = useState(false);

  const requireSigner = () => {
    if (!active || !account || !library) {
      setHasError(true);
      setStatus({
        title: 'Wallet required',
        description: 'Connect your wallet from the header before decrypting a balance.',
      });
      return null;
    }

    setHasError(false);
    return library.getSigner();
  };

  const handleFullDecrypt = async () => {
    const signer = requireSigner();

    if (!signer) {
      return;
    }

    setPendingAction('full');
    setStatus({
      title: 'Full decrypt pending',
      description: 'Confirm the transaction in MetaMask and wait for its on-chain confirmation.',
    });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const transaction = await tokenContract.decrypt(transactionOptions);
      await transaction.wait();
      setHasError(false);
      setStatus({
        title: 'Full decrypt complete',
        description: 'Your complete private balance has been returned to your public balance.',
      });
    } catch (transactionError) {
      setHasError(true);
      setStatus(getTransactionError(transactionError));
    } finally {
      setPendingAction(null);
    }
  };

  const handlePartialDecrypt = async () => {
    const signer = requireSigner();

    if (!signer) {
      return;
    }

    let requestedAmount: ethers.BigNumber;

    try {
      requestedAmount = ethers.utils.parseEther(partialAmount);
    } catch {
      setHasError(true);
      setStatus({
        title: 'Valid amount required',
        description: 'Enter a positive numeric amount with no more than 18 decimal places.',
      });
      return;
    }

    if (requestedAmount.lte(0)) {
      setHasError(true);
      setStatus({
        title: 'Valid amount required',
        description: 'Enter a positive numeric amount before submitting a partial decrypt.',
      });
      return;
    }

    setPendingAction('partial');
    setStatus({
      title: 'Partial decrypt pending',
      description: 'Confirm the requested amount in MetaMask and wait for its on-chain confirmation.',
    });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const transaction = await tokenContract.decrypt_partial(requestedAmount, transactionOptions);
      await transaction.wait();
      setPartialAmount('');
      setHasError(false);
      setStatus({
        title: 'Partial decrypt complete',
        description: 'The requested amount has been returned to your public balance.',
      });
    } catch (transactionError) {
      setHasError(true);
      setStatus(getTransactionError(transactionError));
    } finally {
      setPendingAction(null);
    }
  };

  const isPending = pendingAction !== null;

  return (
    <Layout>
      <Head>
        <title>Decrypt | Fiducaro</title>
      </Head>

      <Container disableGutters maxWidth="md" sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 7, md: 11 } }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: '22px 24px!important', sm: '28px 36px!important' } }}>
            <Typography variant="h4" fontWeight="700">
              Decrypt
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              Move all or part of your private FIDUCARO balance back into your public wallet balance.
              Decryption is an on-chain action and makes the decrypted amount public.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: { xs: '28px 24px!important', sm: '42px 52px!important' } }}>
            <Stack gap={3.5}>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                  Full balance
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Calls <code>decrypt()</code> and returns your complete private balance.
                </Typography>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  disabled={isPending}
                  onClick={handleFullDecrypt}
                  sx={{ minHeight: 58, borderRadius: 999 }}
                >
                  {pendingAction === 'full' ? (
                    <>
                      <CircularProgress size={22} sx={{ mr: 2, color: 'inherit' }} />
                      Full decrypt pending
                    </>
                  ) : (
                    'Full Decrypt'
                  )}
                </Button>
              </Box>

              <Box sx={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                  Part of your balance
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Calls <code>decrypt_partial(requestedAmount)</code> for only the amount entered.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Amount"
                      placeholder="0.00"
                      variant="outlined"
                      fullWidth
                      value={partialAmount}
                      disabled={isPending}
                      onChange={(event) => {
                        if (/^\d*(?:\.\d*)?$/.test(event.target.value)) {
                          setPartialAmount(event.target.value);
                        }
                      }}
                      inputProps={{
                        inputMode: 'decimal',
                        pattern: '[0-9]*[.]?[0-9]*',
                        'aria-label': 'Partial decrypt amount',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      size="large"
                      variant="contained"
                      fullWidth
                      disabled={isPending || !partialAmount}
                      onClick={handlePartialDecrypt}
                      sx={{ minHeight: 56, borderRadius: 999 }}
                    >
                      {pendingAction === 'partial' ? (
                        <>
                          <CircularProgress size={22} sx={{ mr: 1.5, color: 'inherit' }} />
                          Pending
                        </>
                      ) : (
                        'Partial Decrypt'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

              <Box>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  disabled
                  startIcon={<LockRounded />}
                  sx={{ minHeight: 58, borderRadius: 999 }}
                >
                  Gasless Decrypt — Locked
                </Button>
                <Typography color="text.secondary" textAlign="center" sx={{ mt: 1.5 }}>
                  Locked until the gasless contract update is available.
                </Typography>
              </Box>

              <Box
                role="status"
                aria-live="polite"
                sx={{
                  p: { xs: 2.25, md: 2.5 },
                  borderRadius: '8px',
                  border: hasError
                    ? '1px solid rgba(52, 224, 208, 0.55)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: hasError
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.035)',
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

      </Container>
    </Layout>
  );
}
