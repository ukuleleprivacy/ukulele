import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
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
import Link from '../src/Link';
import { TechnicalArtwork } from '../src/components/TechnicalArtwork';
import { gasLimit } from '../src/constants';
import { abi as tokenAbi, address as tokenAddress } from '../src/contracts/contract1';

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };
const transferHistoryBlockRange = 25_000;
const transferHistoryBatchSize = 5_000;
const transferHistoryCandidateLimit = 250;
const transactionLookupBatchSize = 12;
const recentShadowSendLimit = 8;

type ShadowSend = {
  transactionHash: string;
  blockNumber: number;
  user: string;
  recipient: string;
  amount: string;
};

const shortenAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

const getTransactionError = (error: unknown) => {
  if (error && typeof error === 'object') {
    const transactionError = error as { code?: number | string; reason?: string; message?: string };

    if (transactionError.code === 4001 || transactionError.reason === 'user rejected transaction') {
      return 'The transaction was rejected. No shadow send was created.';
    }

    if (transactionError.message) {
      return transactionError.message;
    }
  }

  return 'The shadow send could not be completed. Check the inputs and try again.';
};

export default function Disruptor() {
  const { library, account, active } = useWeb3React();
  const [userAddress, setUserAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    title: 'Disruptor ready',
    description: 'Enter the displayed sender, recipient, and amount for the shadow send.',
  });
  const [hasError, setHasError] = useState(false);
  const [recentShadowSends, setRecentShadowSends] = useState<ShadowSend[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyMessage, setHistoryMessage] = useState(
    'Connect MetaMask to scan recent on-chain shadow sends.',
  );

  useEffect(() => {
    setUserAddress(account || '');
  }, [account]);

  const loadRecentShadowSends = useCallback(async () => {
    if (!library) {
      setRecentShadowSends([]);
      setHistoryMessage('Connect MetaMask to scan recent on-chain shadow sends.');
      return;
    }

    setIsLoadingHistory(true);
    setHistoryMessage('Scanning recent token events for shadowDuster transactions…');

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, library);
      const latestBlock = await library.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - transferHistoryBlockRange);
      const shadowDusterSelector = tokenContract.interface.getSighash('shadowDuster').toLowerCase();
      const nextShadowSends: ShadowSend[] = [];
      const checkedTransactionHashes = new Set<string>();
      let candidateCount = 0;
      let batchEnd = latestBlock;

      while (
        batchEnd >= fromBlock &&
        candidateCount < transferHistoryCandidateLimit &&
        nextShadowSends.length < recentShadowSendLimit
      ) {
        const batchStart = Math.max(fromBlock, batchEnd - transferHistoryBatchSize + 1);
        const transferEvents = await tokenContract.queryFilter(
          tokenContract.filters.Transfer(),
          batchStart,
          batchEnd,
        );
        const batchCandidates = transferEvents
          .slice()
          .reverse()
          .filter((event) => {
            if (checkedTransactionHashes.has(event.transactionHash)) {
              return false;
            }

            checkedTransactionHashes.add(event.transactionHash);
            return true;
          })
          .slice(0, transferHistoryCandidateLimit - candidateCount);

        candidateCount += batchCandidates.length;

        for (let index = 0; index < batchCandidates.length; index += transactionLookupBatchSize) {
          const lookupBatch = batchCandidates.slice(index, index + transactionLookupBatchSize);
          const transactions = await Promise.all(
            lookupBatch.map(async (event) => ({
              event,
              transaction: await library.getTransaction(event.transactionHash),
            })),
          );

          for (const { event, transaction } of transactions) {
            if (
              !transaction?.data.toLowerCase().startsWith(shadowDusterSelector) ||
              !event.args
            ) {
              continue;
            }

            const user = String(event.args.from);
            const recipient = String(event.args.to);
            const eventAmount = ethers.BigNumber.from(event.args.value);

            nextShadowSends.push({
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              user,
              recipient,
              amount: ethers.utils.formatEther(eventAmount),
            });

            if (nextShadowSends.length >= recentShadowSendLimit) {
              break;
            }
          }

          if (nextShadowSends.length >= recentShadowSendLimit) {
            break;
          }
        }

        batchEnd = batchStart - 1;
      }

      setRecentShadowSends(nextShadowSends);
      setHistoryMessage(
        nextShadowSends.length
          ? `Showing ${nextShadowSends.length} verified shadowDuster transaction${
              nextShadowSends.length === 1 ? '' : 's'
            }.`
          : 'No shadowDuster transactions were found among the latest scanned token transfers.',
      );
    } catch (historyError) {
      console.error('[Disruptor] Could not load recent shadow sends.', historyError);
      setRecentShadowSends([]);
      setHistoryMessage('Recent sends could not be loaded from the connected Ethereum provider.');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [library]);

  useEffect(() => {
    if (active && library) {
      void loadRecentShadowSends();
    }
  }, [active, library, loadRecentShadowSends]);

  const handleShadowSend = async () => {
    if (!active || !account || !library) {
      setHasError(true);
      setStatus({
        title: 'Wallet required',
        description: 'Connect MetaMask from the header before creating a shadow send.',
      });
      return;
    }

    if (!ethers.utils.isAddress(userAddress) || !ethers.utils.isAddress(recipientAddress)) {
      setHasError(true);
      setStatus({
        title: 'Valid addresses required',
        description: 'Enter valid Ethereum addresses for both the displayed sender and recipient.',
      });
      return;
    }

    let shadowAmount: ethers.BigNumber;

    try {
      shadowAmount = ethers.utils.parseEther(amount);
    } catch {
      setHasError(true);
      setStatus({
        title: 'Valid amount required',
        description: 'Enter a positive numeric amount with no more than 18 decimal places.',
      });
      return;
    }

    if (shadowAmount.lte(0)) {
      setHasError(true);
      setStatus({
        title: 'Valid amount required',
        description: 'The shadow send amount must be greater than zero.',
      });
      return;
    }

    setHasError(false);
    setIsSubmitting(true);
    setStatus({
      title: 'Shadow send pending',
      description: 'Confirm the real Ethereum transaction in MetaMask and wait for its confirmation.',
    });

    try {
      const signer = library.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const transaction = await tokenContract.shadowDuster(
        ethers.utils.getAddress(userAddress),
        ethers.utils.getAddress(recipientAddress),
        shadowAmount,
        transactionOptions,
      );
      const receipt = await transaction.wait();

      setHasError(false);
      setStatus({
        title: 'Shadow send confirmed',
        description: `The zero-net Transfer log was confirmed in block ${receipt.blockNumber}.`,
      });
      await loadRecentShadowSends();
    } catch (transactionError) {
      setHasError(true);
      setStatus({
        title: 'Shadow send failed',
        description: getTransactionError(transactionError),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Disruptor | Fiducaro</title>
      </Head>

      <Container disableGutters maxWidth="md" sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 7, md: 11 } }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: '22px 24px!important', sm: '28px 36px!important' } }}>
            <Typography variant="overline" color="primary.light" fontWeight="700">
              Zero-net transfer signal
            </Typography>
            <Typography variant="h4" fontWeight="700" sx={{ mt: 0.5 }}>
              Disruptor
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              <code>shadowDuster(user, recipient, amount)</code> emits a standard Transfer record
              while reversing both temporary balance adjustments inside the same execution. The
              Ethereum transaction and event are real; no lasting token balance is transferred.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: { xs: '28px 24px!important', sm: '42px 52px!important' } }}>
            <Stack gap={2.5}>
              <TextField
                label="Displayed sender"
                placeholder="0x…"
                value={userAddress}
                onChange={(event) => setUserAddress(event.target.value)}
                inputProps={{ maxLength: 42 }}
                fullWidth
              />
              <TextField
                label="Displayed recipient"
                placeholder="0x…"
                value={recipientAddress}
                onChange={(event) => setRecipientAddress(event.target.value)}
                inputProps={{ maxLength: 42 }}
                fullWidth
              />
              <TextField
                label="Displayed amount"
                placeholder="0.00"
                value={amount}
                onChange={(event) => {
                  if (/^\d*(?:\.\d*)?$/.test(event.target.value)) {
                    setAmount(event.target.value);
                  }
                }}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*[.]?[0-9]*',
                  'aria-label': 'Shadow send amount',
                }}
                fullWidth
              />

              <Button
                size="large"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                onClick={handleShadowSend}
                sx={{ minHeight: 58, borderRadius: 999 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={22} sx={{ mr: 2, color: 'inherit' }} />
                    Shadow send pending
                  </>
                ) : (
                  'Create Shadow Send'
                )}
              </Button>

              <Box
                role="status"
                aria-live="polite"
                sx={{
                  p: 2.5,
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

        <Box sx={{ mt: 3 }}>
          <TechnicalArtwork
            src="/technical/event-log-final-state.webp"
            alt="Ethereum event log and final contract state shown as two distinct views of one transaction"
            caption="One Ethereum transaction can leave a visible Transfer event while its final contract state resolves with zero net balance movement."
          />
        </Box>

        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent sx={{ p: { xs: '24px!important', sm: '32px!important' } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              gap={2}
            >
              <Box>
                <Typography variant="h5" fontWeight="700">
                  Recent on-chain shadow sends
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {historyMessage}
                </Typography>
              </Box>
              <Button
                type="button"
                variant="outlined"
                startIcon={
                  isLoadingHistory ? <CircularProgress size={18} color="inherit" /> : <RefreshRounded />
                }
                disabled={!active || isLoadingHistory}
                onClick={() => void loadRecentShadowSends()}
                sx={{ flex: '0 0 auto' }}
              >
                Refresh
              </Button>
            </Stack>

            <Stack gap={1.5} sx={{ mt: 3 }}>
              {recentShadowSends.map((shadowSend) => (
                <Box
                  key={`${shadowSend.transactionHash}-${shadowSend.user}-${shadowSend.recipient}`}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  }}
                >
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Typography fontWeight="700" sx={{ overflowWrap: 'anywhere' }}>
                        {shortenAddress(shadowSend.user)} → {shortenAddress(shadowSend.recipient)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {shadowSend.amount} FIDU · block {shadowSend.blockNumber.toLocaleString('en-US')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Button
                        component={Link}
                        href={`https://etherscan.io/tx/${shadowSend.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewRounded />}
                        size="small"
                      >
                        Etherscan
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2.5 }}>
              The scanner checks up to the latest {transferHistoryCandidateLimit} Transfer events
              within {transferHistoryBlockRange.toLocaleString('en-US')} blocks, then verifies that
              each transaction called shadowDuster before displaying it.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
