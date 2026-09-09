import { useMemo, useState } from 'react';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import NativeSelect from '@mui/material/NativeSelect';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { ProtocolPanel, SectionLabel, StatusDot } from '../src/components/ProtocolUI';
import { Layout } from '../src/Layout';
import { countActiveUsers, fiducaroActivities } from '../src/activityData';

type CryptoAsset = {
  ticker: string;
  name: string;
  mark: string;
  color: string;
  exampleUsd: number;
};

type WaitChoice = {
  value: string;
  hours: number;
  label: string;
  status: string;
  message: string;
  color: string;
};

const activeUsers = countActiveUsers(fiducaroActivities);

const waitChoices: WaitChoice[] = [
  {
    value: '24',
    hours: 24,
    label: '24 hours',
    status: 'Caution!',
    message: 'There may not be enough activity to justify that wait.',
    color: '#ef6b65',
  },
  {
    value: '54',
    hours: 54,
    label: '54 hours',
    status: 'Oh oh!',
    message: 'This is the minimum safety standard.',
    color: '#e6c45b',
  },
  {
    value: '72',
    hours: 72,
    label: '72 hours',
    status: 'Yes, well…',
    message: 'We may need more juice!',
    color: '#f2994a',
  },
  {
    value: '168',
    hours: 168,
    label: 'One week',
    status: 'Safe!',
    message: 'The conservative wait-time choice.',
    color: '#68c76b',
  },
  {
    value: '336',
    hours: 336,
    label: 'Two weeks — Maximum',
    status: 'Maximum safety window',
    message: 'Two weeks is the longest available wait.',
    color: '#4fda72',
  },
];

const cryptoAssets: CryptoAsset[] = [
  { ticker: 'BTC', name: 'Bitcoin', mark: '₿', color: '#f5a623', exampleUsd: 100000 },
  { ticker: 'ETH', name: 'Ethereum', mark: '◆', color: '#edf1f2', exampleUsd: 2253.9 },
  { ticker: 'SOL', name: 'Solana', mark: 'S', color: '#80f4c8', exampleUsd: 210 },
  { ticker: 'USDC', name: 'USD Coin', mark: '$', color: '#4f9cf9', exampleUsd: 1 },
  { ticker: 'USDT', name: 'Tether', mark: '₮', color: '#53ae94', exampleUsd: 1 },
  { ticker: 'BNB', name: 'BNB', mark: 'B', color: '#f3ba2f', exampleUsd: 630 },
  { ticker: 'XRP', name: 'XRP', mark: 'X', color: '#d7e1e5', exampleUsd: 2.2 },
  { ticker: 'ADA', name: 'Cardano', mark: 'A', color: '#5c8df6', exampleUsd: 0.85 },
  { ticker: 'AVAX', name: 'Avalanche', mark: 'A', color: '#e84142', exampleUsd: 35 },
  { ticker: 'DOGE', name: 'Dogecoin', mark: 'Ð', color: '#c7a541', exampleUsd: 0.22 },
  { ticker: 'DOT', name: 'Polkadot', mark: '●', color: '#e6007a', exampleUsd: 6.5 },
  { ticker: 'LINK', name: 'Chainlink', mark: '⬡', color: '#5d83ee', exampleUsd: 18 },
];

const Coin = ({ symbol, color }: { symbol: string; color: string }) => (
  <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: `${color}20`, color, border: `1px solid ${color}70`, fontWeight: 800 }}>{symbol}</Box>
);

const AssetSelector = ({
  asset,
  value,
  unavailable,
  label,
  onChange,
}: {
  asset: CryptoAsset;
  value: string;
  unavailable: string;
  label: string;
  onChange: (value: string) => void;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={1.2}
    sx={{
      mt: 1,
      height: 70,
      px: 1.5,
      border: '1px solid rgba(104, 199, 107, .24)',
      borderRadius: 1.25,
      background:
        'linear-gradient(145deg, rgba(104, 199, 107, .14), rgba(16, 28, 34, .92))',
      '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 1px #68c76b' },
    }}
  >
    <Coin symbol={asset.mark} color={asset.color} />
    <NativeSelect
      fullWidth
      disableUnderline
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputProps={{ 'aria-label': label }}
      sx={{
        height: '100%',
        color: 'text.primary',
        '& select': { height: '100%', cursor: 'pointer', py: 0 },
        '& .MuiNativeSelect-icon': { color: 'primary.main' },
      }}
    >
      {cryptoAssets.map((option) => (
        <option key={option.ticker} value={option.ticker} disabled={option.ticker === unavailable}>
          {option.ticker} — {option.name}
        </option>
      ))}
    </NativeSelect>
  </Stack>
);

const Hourglass = ({ color }: { color: string }) => (
  <Box
    className="bridge-hourglass"
    sx={{ '--hourglass-color': color } as React.CSSProperties}
    aria-hidden="true"
  >
    <svg viewBox="0 0 160 200">
      <path className="hourglass-frame" d="M34 18 H126 M34 182 H126 M43 22 C43 66 61 82 78 99 C60 116 43 135 43 178 M117 22 C117 66 99 82 82 99 C100 116 117 135 117 178" />
      <path className="hourglass-sand-top" d="M51 45 H109 C105 70 94 81 80 94 C66 81 55 70 51 45Z" />
      <path className="hourglass-stream" d="M80 96 V139" />
      <path className="hourglass-sand-bottom" d="M50 167 C57 139 67 129 80 124 C93 129 103 139 110 167Z" />
    </svg>
  </Box>
);

export default function Bridge() {
  const [sendTicker, setSendTicker] = useState('BTC');
  const [receiveTicker, setReceiveTicker] = useState('ETH');
  const [waitValue, setWaitValue] = useState('56');
  const sendAsset = cryptoAssets.find(({ ticker }) => ticker === sendTicker)!;
  const receiveAsset = cryptoAssets.find(({ ticker }) => ticker === receiveTicker)!;
  const receiveAmount = useMemo(
    () => (12 * sendAsset.exampleUsd / receiveAsset.exampleUsd).toLocaleString('en-US', { maximumFractionDigits: 6 }),
    [sendAsset, receiveAsset],
  );
  const waitChoice = waitChoices.find(({ value }) => value === waitValue);
  const waitHours = waitChoice?.hours ?? 56;
  const waitColor = waitChoice?.color ?? '#a2e69b';

  return (
    <Layout>
      <Head><title>Bridge Concept | Fiducaro</title></Head>
      <Box component="main" sx={{ minHeight: 'calc(100vh - 70px)', background: 'radial-gradient(circle at 60% 34%, rgba(104, 199, 107,.09), transparent 28%), #060c10' }}>
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
              <ProtocolPanel
                sx={{
                  p: { xs: 2.5, md: 5 },
                  borderColor: 'rgba(104, 199, 107, .28)',
                  background:
                    'radial-gradient(circle at 12% 0%, rgba(104, 199, 107, .09), transparent 34%), linear-gradient(145deg, #101c22 0%, #0b1419 58%, #071014 100%)',
                  boxShadow:
                    'inset 0 1px rgba(255,255,255,.035), 0 22px 70px rgba(0,0,0,.36)',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(104, 199, 107, .055)',
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: '#edf1f2',
                    WebkitTextFillColor: '#edf1f2',
                    opacity: 1,
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 700 }}>PRIMARY BRIDGE INTERFACE</Typography>
                  <Box sx={{ px: 1, py: .45, borderRadius: 4, bgcolor: 'rgba(255,255,255,.12)', fontSize: 10 }}>CONCEPT PREVIEW</Box>
                </Stack>
                <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SectionLabel>You send</SectionLabel>
                    <AssetSelector asset={sendAsset} value={sendTicker} unavailable={receiveTicker} label="Asset you send" onChange={setSendTicker} />
                    <TextField disabled fullWidth value={`12.000000 ${sendAsset.ticker}`} sx={{ mt: 1.2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SectionLabel>You receive</SectionLabel>
                    <AssetSelector asset={receiveAsset} value={receiveTicker} unavailable={sendTicker} label="Asset you receive" onChange={setReceiveTicker} />
                    <TextField disabled fullWidth value={`≈ ${receiveAmount} ${receiveAsset.ticker}`} sx={{ mt: 1.2 }} />
                  </Grid>
                </Grid>
                <Stack direction="row" alignItems="center" gap={1.2} sx={{ mt: 2.5 }}><LockOutlined color="primary" /><Box><SectionLabel>Privacy status</SectionLabel><Typography color="primary.main">Designed for private routing</Typography></Box></Stack>
                <ProtocolPanel
                  sx={{
                    mt: 2.5,
                    p: { xs: 2.5, md: 3.5 },
                    borderColor: `${waitColor}55`,
                    background: `radial-gradient(circle at 24% 50%, ${waitColor}16, transparent 36%), #09161b`,
                  }}
                >
                  <Grid container spacing={{ xs: 2.5, md: 4 }} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Stack direction="row" alignItems="center" justifyContent="center" gap={{ xs: 2, sm: 3 }}>
                        <Hourglass color={waitColor} />
                        <Box>
                          <SectionLabel>Private wait clock</SectionLabel>
                          <Typography
                            aria-label={`${waitHours} hour wait`}
                            sx={{ mt: .7, color: waitColor, fontSize: { xs: 39, sm: 48 }, lineHeight: 1, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.04em' }}
                          >
                            {waitHours}:00
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: .8, fontSize: 11 }}>HOURS : MINUTES</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5}>
                        <Box>
                          <SectionLabel>Activity-based estimate</SectionLabel>
                          <Typography sx={{ mt: .5, color: activeUsers === 0 ? 'text.secondary' : 'primary.main', fontSize: 13 }}>
                            Active users: {activeUsers}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: { sm: 250 } }}>
                          <Typography component="label" htmlFor="wait-time-select" sx={{ display: 'block', mb: .6, color: 'text.secondary', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                            Choose Wait Time
                          </Typography>
                          <NativeSelect
                            id="wait-time-select"
                            fullWidth
                            value={waitValue}
                            onChange={(event) => {
                              const hours = Number(event.target.value);
                              if (hours >= 24 && hours <= 336) setWaitValue(event.target.value);
                            }}
                            sx={{ color: waitColor, '& .MuiNativeSelect-icon': { color: waitColor } }}
                          >
                            <option value="56">56 hours — Pre-launch baseline</option>
                            {waitChoices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                          </NativeSelect>
                        </Box>
                      </Stack>
                      <Box sx={{ mt: 2, minHeight: 55, pl: 1.5, borderLeft: `3px solid ${waitColor}` }}>
                        {activeUsers === 0 && !waitChoice ? (
                          <Typography sx={{ lineHeight: 1.5 }}>
                            Until launch, maximum activity peak should result in a 56 hour wait.
                          </Typography>
                        ) : (
                          <>
                            <Typography sx={{ color: waitColor, fontWeight: 700 }}>{waitChoice?.status}</Typography>
                            <Typography color="text.secondary" sx={{ mt: .25, fontSize: 13 }}>{waitChoice?.message}</Typography>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
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
