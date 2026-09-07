import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { ProtocolPanel, SectionLabel, StatusDot } from '../src/components/ProtocolUI';
import { abi as tokenAbi, address as tokenAddress } from '../src/contracts/contract1';
import { gasLimit } from '../src/constants';
import { Layout } from '../src/Layout';

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };
type DecryptAction = 'full' | 'partial';

const defaultStatus = {
  title: 'Choose a decrypt option',
  description: 'Decrypt is live on Ethereum mainnet. Every action requires wallet confirmation.',
};

const getTransactionError = (error: unknown) => {
  const transactionError = error && typeof error === 'object'
    ? error as { code?: number | string; reason?: string; message?: string }
    : null;

  if (transactionError?.code === 4001 || transactionError?.reason === 'user rejected transaction') {
    return { title: 'Transaction rejected', description: 'No balance was decrypted. Try again when you are ready.' };
  }

  return {
    title: 'Transaction error',
    description: transactionError?.message || 'The decrypt action could not be completed. Check your wallet and try again.',
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
      setStatus({ title: 'Wallet required', description: 'Connect your wallet from the header before decrypting.' });
      return null;
    }

    setHasError(false);
    return library.getSigner();
  };

  const handleFullDecrypt = async () => {
    const signer = requireSigner();
    if (!signer || !account) return;

    setPendingAction('full');
    setStatus({ title: 'Full decrypt pending', description: 'Confirm the transaction in your wallet and wait for Ethereum.' });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const transaction = await tokenContract.decrypt(transactionOptions);
      await transaction.wait();
      setHasError(false);
      setStatus({ title: 'Full decrypt complete', description: 'Your complete private balance has returned to public state.' });
    } catch (transactionError) {
      setHasError(true);
      setStatus(getTransactionError(transactionError));
    } finally {
      setPendingAction(null);
    }
  };

  const handlePartialDecrypt = async () => {
    const signer = requireSigner();
    if (!signer || !account) return;

    let requestedAmount: ethers.BigNumber;
    try {
      requestedAmount = ethers.utils.parseEther(partialAmount);
    } catch {
      setHasError(true);
      setStatus({ title: 'Valid amount required', description: 'Enter a positive numeric amount with no more than 18 decimals.' });
      return;
    }

    if (requestedAmount.lte(0)) {
      setHasError(true);
      setStatus({ title: 'Valid amount required', description: 'Enter a positive amount before submitting.' });
      return;
    }

    setPendingAction('partial');
    setStatus({ title: 'Partial decrypt pending', description: 'Confirm the selected amount in your wallet.' });

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const transaction = await tokenContract.decrypt_partial(requestedAmount, transactionOptions);
      await transaction.wait();
      const completedAmount = partialAmount;
      setPartialAmount('');
      setHasError(false);
      setStatus({ title: 'Partial decrypt complete', description: `${completedAmount} FIDU has returned to public state.` });
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
      <Head><title>Decrypt | Fiducaro</title></Head>
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 70px)',
          bgcolor: '#292a2e',
        }}
      >
        <Box sx={{ maxWidth: 1840, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 6, md: 8 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3}>
            <Box>
              <SectionLabel>Decrypt</SectionLabel>
              <Typography component="h1" sx={{ mt: 1.8, fontSize: { xs: 42, md: 66 }, lineHeight: 1, letterSpacing: '-.045em' }}>Bring value back into view.</Typography>
              <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 720, fontSize: { xs: 15, md: 18 } }}>
                Restore all or part of your Fiducaro private balance to your public wallet. Only the amount you decrypt returns to public state.
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} gap={.8}>
              <Stack direction="row" alignItems="center" gap={1}><StatusDot /><Typography>Ethereum Mainnet</Typography></Stack>
              <Typography color="primary.main">Decrypt — Operational</Typography>
            </Stack>
          </Stack>

          <Grid container spacing={2.5} sx={{ mt: 3.5 }}>
            <Grid item xs={12} md={6}>
              <ProtocolPanel sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                <SectionLabel>Option 01</SectionLabel>
                <Typography variant="h3" sx={{ mt: .7 }}>Full Decrypt</Typography>
                <Typography color="text.secondary" sx={{ mt: 1.2, maxWidth: 520 }}>Return your complete private FIDU balance to the connected public wallet.</Typography>
                <Typography component="code" color="text.secondary" sx={{ display: 'block', mt: 2 }}>decrypt()</Typography>
                <ProtocolPanel sx={{ mt: 3.5, p: 2.5 }}>
                  <Stack gap={1.5}>
                    <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Private balance before</Typography><Typography>Encrypted</Typography></Stack>
                    <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Amount returning public</Typography><Typography>Full balance</Typography></Stack>
                    <Box sx={{ height: '1px', bgcolor: 'divider' }} />
                    <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Private balance after</Typography><Typography>0 FIDU</Typography></Stack>
                    <Button variant="contained" disabled={isPending} onClick={handleFullDecrypt} sx={{ mt: 1, minHeight: 52 }}>
                      {pendingAction === 'full' ? <><CircularProgress size={20} sx={{ mr: 1.2, color: 'inherit' }} />Decrypting…</> : 'Decrypt full balance'}
                    </Button>
                  </Stack>
                </ProtocolPanel>
              </ProtocolPanel>
            </Grid>
            <Grid item xs={12} md={6}>
              <ProtocolPanel sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                <SectionLabel>Option 02</SectionLabel>
                <Typography variant="h3" sx={{ mt: .7 }}>Partial Decrypt</Typography>
                <Typography color="text.secondary" sx={{ mt: 1.2, maxWidth: 560 }}>Choose the exact amount that returns to your public wallet while the remainder stays private.</Typography>
                <Typography component="code" color="text.secondary" sx={{ display: 'block', mt: 2 }}>decrypt_partial(requestedAmount)</Typography>
                <ProtocolPanel sx={{ mt: 3.5, p: 2.5 }}>
                  <SectionLabel>Amount to decrypt</SectionLabel>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    value={partialAmount}
                    disabled={isPending}
                    onChange={(event) => { if (/^\d*(?:\.\d*)?$/.test(event.target.value)) setPartialAmount(event.target.value); }}
                    InputProps={{ endAdornment: <Typography color="text.secondary">FIDU</Typography> }}
                    inputProps={{ inputMode: 'decimal', 'aria-label': 'Partial decrypt amount' }}
                    sx={{ mt: 1.2 }}
                  />
                  <Typography color="text.secondary" sx={{ mt: 1.2, fontSize: 11 }}>Percentage and MAX controls are unavailable because private balance is not readable.</Typography>
                  <Button variant="contained" fullWidth disabled={isPending || !partialAmount} onClick={handlePartialDecrypt} sx={{ mt: 2.2, minHeight: 52 }}>
                    {pendingAction === 'partial' ? <><CircularProgress size={20} sx={{ mr: 1.2, color: 'inherit' }} />Decrypting…</> : `Decrypt ${partialAmount || 'selected'} FIDU`}
                  </Button>
                </ProtocolPanel>
              </ProtocolPanel>
            </Grid>
          </Grid>

          <ProtocolPanel role={hasError ? 'alert' : 'status'} aria-live="polite" sx={{ mt: 2.5, p: 2.2, borderColor: hasError ? 'rgba(255,255,255,.45)' : 'rgba(102,255,138,.22)' }}>
            <Typography fontWeight={700}>{status.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: .5, fontSize: 13 }}>{status.description}</Typography>
          </ProtocolPanel>
        </Box>
      </Box>
    </Layout>
  );
}
