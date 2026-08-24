import { type ReactNode, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Close from '@mui/icons-material/Close';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Search from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { ProtocolPanel, SectionLabel, StatusDot } from '../src/components/ProtocolUI';
import { usePublicFiduBalance } from '../src/components/WalletBalance';
import { Layout } from '../src/Layout';

type FiducaroActivity = {
  id: string;
  type: 'Private Send' | 'Full Decrypt' | 'Partial Decrypt';
  status: 'Complete' | 'Pending';
  amount?: string;
  destination: string;
  transactionHash: string;
  date: string;
  stage?: string;
};

const filters = ['All', 'Private Send', 'Full Decrypt', 'Partial Decrypt', 'Completed', 'Pending'] as const;

const shortHash = (value: string) => value.length > 14 ? `${value.slice(0, 7)}…${value.slice(-5)}` : value;
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));

export default function Activity() {
  const { account, active } = useWeb3React();
  const { displayBalance } = usePublicFiduBalance();
  const [tab, setTab] = useState<'activity' | 'balance'>('activity');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [search, setSearch] = useState('');
  const activities: FiducaroActivity[] = [];
  const [selected, setSelected] = useState<FiducaroActivity | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return activities.filter((item) => {
      const matchesFilter = filter === 'All'
        || (filter === 'Completed' && item.status === 'Complete')
        || (filter === 'Pending' && item.status === 'Pending')
        || item.type === filter;
      const matchesSearch = !query || [item.transactionHash, item.destination, item.type].some((value) => value.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [activities, filter, search]);

  const privateSends = activities.filter((item) => item.type === 'Private Send').length;
  const decrypts = activities.filter((item) => item.type !== 'Private Send').length;
  const pending = activities.filter((item) => item.status === 'Pending').length;

  return (
    <Layout>
      <Head><title>Activity | Fiducaro</title></Head>
      <Box component="main" sx={{ minHeight: 'calc(100vh - 70px)', background: 'radial-gradient(circle at 80% 0%, rgba(255,255,255,.07), transparent 24%), #050606' }}>
        <Box sx={{ maxWidth: 1540, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 4, md: 7 } }}>
          <Stack direction="row" justifyContent="center" gap={3} sx={{ borderBottom: '1px solid rgba(255,255,255,.15)' }}>
            <Button onClick={() => setTab('activity')} sx={{ minHeight: 48, borderRadius: 0, color: tab === 'activity' ? 'text.primary' : 'text.secondary', borderBottom: tab === 'activity' ? '2px solid white' : '2px solid transparent' }}>Activity</Button>
            <Button onClick={() => setTab('balance')} sx={{ minHeight: 48, borderRadius: 0, color: tab === 'balance' ? 'text.primary' : 'text.secondary', borderBottom: tab === 'balance' ? '2px solid white' : '2px solid transparent' }}>Balance history</Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3} sx={{ mt: 5 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', px: 1.1, py: .5, borderRadius: 1, bgcolor: 'rgba(255,255,255,.08)', color: 'text.secondary', fontSize: 11 }}>ACCOUNT</Box>
              <Typography component="h1" sx={{ mt: 1.1, fontSize: { xs: 42, md: 58 }, lineHeight: 1 }}>{tab === 'activity' ? 'Activity' : 'Balance History'}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
                {tab === 'activity' ? 'Preview the planned interface for reviewing Fiducaro interactions and Ethereum execution status.' : 'Preview the planned public-balance history interface. Private balance and private-balance history will never be exposed.'}
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} gap={1}>
              <Stack direction="row" alignItems="center" gap={1}><StatusDot tone="muted" /><Typography>Activity — Not Live</Typography></Stack>
              <Box sx={{ px: 1.2, py: .45, borderRadius: 4, bgcolor: 'rgba(255,255,255,.08)', color: 'text.secondary', fontSize: 10, textTransform: 'uppercase' }}>Concept preview</Box>
              <Typography color="text.secondary">Wallet: {account ? shortHash(account) : 'Not connected'}</Typography>
            </Stack>
          </Stack>

          <ProtocolPanel sx={{ mt: 3, p: 2, borderColor: 'rgba(255,255,255,.2)' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={1}>
              <Typography fontWeight={700}>Activity is not live yet.</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>Any entries shown are browser-local preview data, not an authoritative protocol history.</Typography>
            </Stack>
          </ProtocolPanel>

          {tab === 'balance' ? (
            <ProtocolPanel sx={{ mt: 5, p: { xs: 3, md: 5 } }}>
              <GridLike>
                <Box><SectionLabel>Current public balance</SectionLabel><Typography sx={{ mt: 1, fontSize: 36, fontWeight: 700 }}>{active ? displayBalance : 'Connect wallet'}</Typography></Box>
                <Box><SectionLabel>Private balance</SectionLabel><Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1 }}><Typography sx={{ fontSize: 30, fontWeight: 700 }}>Encrypted</Typography></Stack><Typography color="text.secondary" sx={{ mt: .7, fontSize: 12 }}>No readable value or balance history is available.</Typography></Box>
              </GridLike>
            </ProtocolPanel>
          ) : (
            <>
              <ProtocolPanel sx={{ mt: 5, p: { xs: 2.5, md: 3 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={3}>
                  {[['Total interactions', activities.length], ['Private sends', privateSends], ['Decrypts', decrypts], ['Pending', pending]].map(([label, value]) => (
                    <Box key={String(label)} sx={{ flex: 1 }}><SectionLabel>{label}</SectionLabel><Typography color={label === 'Pending' && Number(value) > 0 ? 'primary.main' : 'text.primary'} sx={{ mt: .5, fontSize: 30 }}>{value}</Typography></Box>
                  ))}
                </Stack>
              </ProtocolPanel>

              <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
                {filters.map((item) => <Button key={item} variant={filter === item ? 'contained' : 'outlined'} size="small" onClick={() => setFilter(item)} sx={{ borderRadius: 6, color: filter === item ? 'primary.contrastText' : 'text.secondary' }}>{item}</Button>)}
              </Stack>
              <TextField fullWidth placeholder="Transaction hash / address" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} sx={{ mt: 2, maxWidth: 700 }} />

              <ProtocolPanel sx={{ mt: 3, overflow: 'hidden' }}>
                {filtered.length ? (
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow>{['Type', 'Amount', 'Destination', 'Status', 'Date', 'Ethereum transaction'].map((item) => <TableCell key={item} sx={{ color: 'text.secondary', fontSize: 11, textTransform: 'uppercase' }}>{item}</TableCell>)}</TableRow></TableHead>
                      <TableBody>{filtered.map((item) => <TableRow hover key={item.id} onClick={() => setSelected(item)} sx={{ cursor: 'pointer' }}><TableCell>{item.type}</TableCell><TableCell>{item.amount ? `${item.amount} FIDU` : 'Full balance'}</TableCell><TableCell>{shortHash(item.destination)}</TableCell><TableCell><Stack direction="row" alignItems="center" gap={.8}><StatusDot tone={item.status === 'Complete' ? 'live' : 'warning'} /><Typography color={item.status === 'Complete' ? 'text.primary' : 'primary.main'}>{item.status}</Typography></Stack></TableCell><TableCell>{formatDate(item.date)}</TableCell><TableCell>{shortHash(item.transactionHash)}</TableCell></TableRow>)}</TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Stack alignItems="center" sx={{ px: 3, py: 9, textAlign: 'center' }}>
                    <Typography variant="h5">{active ? 'No matching activity on this device' : 'Connect your wallet to view activity'}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560, fontSize: 13 }}>This module is not live. The preview may show browser-local actions, but it does not provide an authoritative or reconstructed private history.</Typography>
                  </Stack>
                )}
              </ProtocolPanel>
            </>
          )}
        </Box>
      </Box>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)} PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 3, background: 'linear-gradient(145deg, #242525, #111212)', borderLeft: '1px solid rgba(255,255,255,.16)' } }}>
        {selected && <>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h4">{selected.type}</Typography><IconButton onClick={() => setSelected(null)}><Close /></IconButton></Stack>
          <Box sx={{ height: '1px', bgcolor: 'divider', my: 3 }} />
          <Stack gap={2.5}>{[['Type', selected.type], ['Status', selected.status], ['Amount', selected.amount ? `${selected.amount} FIDU` : 'Full balance'], ['Recipient', selected.destination], ['Network', 'Ethereum Mainnet'], ['Execution', selected.stage || 'Complete'], ['Transaction Hash', selected.transactionHash]].map(([label, value]) => <Stack direction="row" justifyContent="space-between" gap={3} key={label}><Typography color="text.secondary">{label}</Typography><Typography sx={{ textAlign: 'right', overflowWrap: 'anywhere' }}>{value}</Typography></Stack>)}</Stack>
          <Button component="a" href={`https://etherscan.io/tx/${selected.transactionHash}`} target="_blank" rel="noopener noreferrer" variant="outlined" fullWidth endIcon={<OpenInNew />} sx={{ mt: 4 }}>View on Ethereum</Button>
        </>}
      </Drawer>
    </Layout>
  );
}

function GridLike({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>{children}</Box>;
}
