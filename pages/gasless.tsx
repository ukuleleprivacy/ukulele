import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { ProtocolPanel, SectionLabel, StatusDot } from '../src/components/ProtocolUI';
import { Layout } from '../src/Layout';

const Coin = ({ symbol, color }: { symbol: string; color: string }) => (
  <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: `${color}20`, color, border: `1px solid ${color}70`, fontWeight: 800 }}>{symbol}</Box>
);

export default function Bridge() {
  return (
    <Layout>
      <Head><title>Bridge Concept | Fiducaro</title></Head>
      <Box component="main" sx={{ minHeight: 'calc(100vh - 70px)', background: 'radial-gradient(circle at 60% 34%, rgba(167, 215, 160,.09), transparent 28%), #292a2e' }}>
        <Box sx={{ maxWidth: 1840, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 6, md: 8 } }}>
          <Stack direction="row" alignItems="center" gap={1.2}>
            <StatusDot tone="muted" />
            <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '.04em' }}>Fiducaro Bridge</Typography>
            <Box sx={{ px: 1.2, py: .45, borderRadius: 4, bgcolor: 'rgba(255,255,255,.09)', color: 'text.secondary', fontSize: 10, textTransform: 'uppercase' }}>Not live · In development</Box>
          </Stack>

          <Grid container spacing={{ xs: 5, lg: 3 }} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Stack sx={{ height: '100%' }}>
                <Typography component="h1" sx={{ mt: 1, maxWidth: 1200, fontSize: { xs: 44, md: 68 }, lineHeight: 1.03, letterSpacing: '-.05em', fontWeight: 500 }}>
                  Move between assets without leaving the private layer.
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <ProtocolPanel sx={{ p: { xs: 2.5, md: 5 }, background: 'linear-gradient(145deg, rgba(76,78,82,.96), rgba(29,30,32,.98))' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 700 }}>PRIMARY BRIDGE INTERFACE</Typography>
                  <Box sx={{ px: 1, py: .45, borderRadius: 4, bgcolor: 'rgba(255,255,255,.12)', fontSize: 10 }}>CONCEPT PREVIEW</Box>
                </Stack>
                <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SectionLabel>You send</SectionLabel>
                    <ProtocolPanel sx={{ mt: 1, p: 1.5 }}><Stack direction="row" alignItems="center" gap={1}><Coin symbol="₿" color="#f5a623" /><Typography>BTC — Bitcoin</Typography></Stack></ProtocolPanel>
                    <TextField disabled fullWidth value="12.000000 BTC" sx={{ mt: 1.2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SectionLabel>You receive</SectionLabel>
                    <ProtocolPanel sx={{ mt: 1, p: 1.5 }}><Stack direction="row" alignItems="center" gap={1}><Coin symbol="◆" color="#edf1f2" /><Typography>ETH — Ethereum</Typography></Stack></ProtocolPanel>
                    <TextField disabled fullWidth value="≈ 532.41 ETH" sx={{ mt: 1.2 }} />
                  </Grid>
                </Grid>
                <Stack direction="row" alignItems="center" gap={1.2} sx={{ mt: 2.5 }}><LockOutlined color="primary" /><Box><SectionLabel>Privacy status</SectionLabel><Typography color="primary.main">Designed for private routing</Typography></Box></Stack>
                <ProtocolPanel sx={{ mt: 2.5, p: 2.5, textAlign: 'center' }}>
                  <SectionLabel>Estimated private settlement window</SectionLabel>
                  <Typography sx={{ mt: .7, fontSize: { xs: 34, md: 46 }, lineHeight: 1 }}>72–96 Hours</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, fontSize: 11 }}>Concept estimate only. No bridge service is currently available.</Typography>
                </ProtocolPanel>
                <Box sx={{ mt: 2.4, pt: 2.2, borderTop: '1px solid rgba(255,255,255,.12)' }}>
                  <Typography variant="h5">Destination Addresses</Typography>
                  <Grid container spacing={1.2} sx={{ mt: .5 }}>{['50%', '30%', '20%'].map((amount, index) => <Grid item xs={12} sm={4} key={amount}><ProtocolPanel sx={{ p: 1.4 }}><SectionLabel>Address 0{index + 1}</SectionLabel><Typography sx={{ mt: .4 }}>0x…</Typography><Typography color="text.secondary" sx={{ fontSize: 11 }}>Allocation: {amount}</Typography></ProtocolPanel></Grid>)}</Grid>
                </Box>
              </ProtocolPanel>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
