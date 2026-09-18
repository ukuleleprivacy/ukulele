import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { utils } from 'ethers';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { BrandTheme } from '../src/components/BrandTheme';
import { deletePrivateSend, privateHistoryEvent, readPrivateSends, type PrivateSendRecord } from '../src/lib/privateSendHistory';
import { readPrivateBalance, setPrivateBalance, type CachedPrivateBalance } from '../src/lib/privateBalanceCache';

const statusLabels: Record<PrivateSendRecord['status'], string> = {
  prepared: 'Prepared',
  'part-one-pending': 'PART I submitted',
  'part-one-confirmed': 'PART I confirmed · PART II needed',
  'part-two-pending': 'PART II submitted',
  complete: 'Complete',
  incomplete: 'Not completed',
};

export default function Account() {
  const { account } = useWeb3React();
  const [records, setRecords] = useState<PrivateSendRecord[]>([]);
  const [error, setError] = useState('');
  const [loadedAccount, setLoadedAccount] = useState('');
  const [selected, setSelected] = useState<PrivateSendRecord | null>(null);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [cachedBalance, setCachedBalance] = useState<CachedPrivateBalance | null>(null);
  const [balanceInput, setBalanceInput] = useState('');

  useEffect(() => {
    setRevealed([]);
    setSelected(null);
    setBalanceInput('');
    const load = () => {
      setError('');
      try {
        setRecords(account ? readPrivateSends(account) : []);
        setCachedBalance(account ? readPrivateBalance(account) : null);
      } catch {
        setRecords([]);
        setCachedBalance(null);
        setError('Your saved history could not be read. Check browser storage access. No records have been removed.');
      }
      setLoadedAccount(account || '');
    };
    load();
    window.addEventListener(privateHistoryEvent, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(privateHistoryEvent, load);
      window.removeEventListener('storage', load);
    };
  }, [account]);

  const removeRecord = () => {
    if (!account || !selected || selected.sender.toLowerCase() !== account.toLowerCase()) return;
    try {
      deletePrivateSend(account, selected.id);
      setSelected(null);
    } catch {
      setError('The record could not be deleted. Check browser storage access and try again.');
      setSelected(null);
    }
  };
  const visibleRecords = loadedAccount === (account || '') ? records : [];

  return (
    <BrandTheme>
      <Head><title>Account · Fiducaro</title><meta name="robots" content="noindex" /></Head>
      <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 4 }, py: { xs: 4, md: 6 } }}>
        <Typography color="primary.main" sx={{ fontSize: 12, letterSpacing: '.16em' }}>FIDUCARO / ACCOUNT</Typography>
        <Typography component="h1" sx={{ fontSize: { xs: 36, md: 52 }, mt: 1, mb: 2 }}>Your private sends</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 780 }}>
          Your send records, recipients, SALTs and notes are saved in Account. Account data stays in this browser and is removed when you clear site data.
        </Typography>
        {account && <Typography sx={{ mt: 2, overflowWrap: 'anywhere', fontSize: 13 }}>Wallet: {account}</Typography>}
        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        {account && loadedAccount === account && (
          <Card variant="outlined" sx={{ mt: 3, borderColor: '#b9e99140' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary">Private balance · cached</Typography>
              <Typography sx={{ fontSize: { xs: 28, sm: 38 }, my: 1, overflowWrap: 'anywhere' }}>
                {cachedBalance?.amount != null ? `${utils.formatUnits(cachedBalance.amount, 18)} FIDU` : 'Opening balance needed'}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                An estimate based on confirmed sends and decrypts recorded here, even when your public balance is zero. Activity on other devices or through other apps may be missing. Deleting a send record does not change this total.
              </Typography>
              <Box component="details" sx={{ mt: 2, '& summary': { cursor: 'pointer', color: 'primary.main' } }}>
                <summary>Set or correct cached balance</summary>
                <Typography color="text.secondary" sx={{ fontSize: 13, my: 1 }}>Enter your current private FIDU balance if you held tokens before tracking began or have activity missing from Account.</Typography>
                <Box component="form" onSubmit={(event) => {
                  event.preventDefault();
                  try {
                    setPrivateBalance(account, balanceInput);
                    setBalanceInput('');
                    setError('');
                  } catch { setError('Could not save the balance. Enter a non-negative amount with up to 18 decimal places and check browser storage access.'); }
                }} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <TextField label="Current private balance (FIDU)" value={balanceInput} onChange={(event) => setBalanceInput(event.target.value)} inputProps={{ inputMode: 'decimal' }} size="small" />
                  <Button type="submit" variant="outlined">Save balance</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
        <Stack spacing={2} sx={{ mt: 4 }}>
          {!visibleRecords.length && !error && (
            <Card variant="outlined"><CardContent sx={{ p: 4 }}>
              <Typography variant="h6">{account ? 'No private sends saved yet' : 'Connect your wallet to view its saved sends'}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                New sends made in this browser appear here automatically. Previous sends and records on other devices are not imported.
              </Typography>
            </CardContent></Card>
          )}
          {visibleRecords.map((record) => (
            <Card key={record.id} variant="outlined" sx={{ borderColor: '#b9e99130', background: 'linear-gradient(145deg, #101c22, #071014)' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                  <Box>
                    <Typography component="h2" variant="h5">{record.amount} FIDU</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>{new Date(record.createdAt).toLocaleString()}</Typography>
                  </Box>
                  <Tooltip title="Delete local record"><IconButton aria-label={`Delete send of ${record.amount} FIDU to ${record.recipient}`} onClick={() => setSelected(record)}><DeleteOutline /></IconButton></Tooltip>
                </Stack>
                <Chip size="small" label={statusLabels[record.status]} color={record.status === 'complete' ? 'success' : 'default'} sx={{ my: 2, maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 } }} />
                <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '90px minmax(0, 1fr)' }, gap: 1, '& dt': { color: 'text.secondary', fontSize: 13 }, '& dd': { m: 0, overflowWrap: 'anywhere', fontSize: 13 } }}>
                  <dt>From</dt><dd>{record.sender}</dd>
                  <dt>To</dt><dd>{record.recipient}</dd>
                  <dt>Network</dt><dd>Ethereum Mainnet</dd>
                  {record.note && <><dt>Note</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{record.note}</dd></>}
                  <dt>SALT</dt><dd>
                    {revealed.includes(record.id) ? record.salt : 'Hidden'}
                    <Button size="small" onClick={() => setRevealed((ids) => ids.includes(record.id) ? ids.filter((id) => id !== record.id) : [...ids, record.id])} sx={{ ml: 1 }}>
                      {revealed.includes(record.id) ? 'Hide SALT' : 'Show SALT'}
                    </Button>
                  </dd>
                </Box>
                <Stack direction="row" useFlexGap flexWrap="wrap" gap={2} sx={{ mt: 2 }}>
                  {([['PART I', record.partOneHash], ['PART II', record.partTwoHash]] as const).map(([label, hash]) => hash && (
                    <Button key={label} component="a" href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" size="small">{label} on Etherscan ↗</Button>
                  ))}
                </Stack>
                {record.status !== 'complete' && <Typography color="text.secondary" sx={{ fontSize: 12, mt: 1 }}>Last saved status. Check submitted transactions on Etherscan before starting another send.</Typography>}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} aria-labelledby="delete-record-title">
        <DialogTitle id="delete-record-title">Delete this local record?</DialogTitle>
        <DialogContent>This removes the saved recipient, amount, SALT and transaction links from this browser. It cannot be undone and does not cancel or erase Ethereum transactions.</DialogContent>
        <DialogActions><Button onClick={() => setSelected(null)}>Keep record</Button><Button color="error" onClick={removeRecord}>Delete record</Button></DialogActions>
      </Dialog>
    </BrandTheme>
  );
}
