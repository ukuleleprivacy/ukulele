import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CodeRounded from '@mui/icons-material/CodeRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import StorageRounded from '@mui/icons-material/StorageRounded';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { ConnectWallet } from '../src/components/ConnectWallet';
import { FaucetClaimButton } from '../src/components/FaucetClaimButton';
import { Metric, ProtocolPanel, SectionLabel, StatusDot, StatusLine } from '../src/components/ProtocolUI';
import { usePublicFiduBalance } from '../src/components/WalletBalance';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { fiducaroToken } from '../src/token';

const quickStart = [
  ['01', 'Claim', 'Claim 100 FIDU from the public faucet.'],
  ['02', 'Private', "Move value through Fiducaro's private state."],
  ['03', 'Send', 'Complete the two-confirmation private send.'],
  ['04', 'Decrypt', 'Return all or a selected amount to public state.'],
];

const summaryCardSx = {
  p: 2,
  minHeight: 92,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const Cube = ({ index }: { index: number }) => (
  <Box
    sx={{
      position: 'relative',
      width: { xs: 60, sm: 96, md: 118 },
      height: { xs: 90, sm: 132, md: 162 },
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: 1,
      background: 'linear-gradient(90deg, #070907, #151816 42%, #060706 44%, #111411 72%, #020302)',
      boxShadow: '0 28px 30px rgba(0,0,0,.7), inset 0 0 30px rgba(102,255,138,.07), 0 0 22px rgba(102,255,138,.08)',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: -5,
        right: -5,
        top: 20,
        height: 4,
        bgcolor: 'primary.main',
        boxShadow: '0 0 15px #66ff8a',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: index === 2 ? '41px 24px 22px' : '46px 25px 18px',
        border: '1px solid rgba(102,255,138,.52)',
        borderTop: 0,
        opacity: .75,
      },
    }}
  />
);

const FlowLine = ({ tone = 'green' }: { tone?: 'green' | 'white' }) => (
  <Box
    sx={{
      width: { xs: 3, sm: 'auto' },
      height: { xs: 30, sm: 3 },
      flex: { xs: '0 0 auto', sm: 1 },
      minWidth: { xs: 0, sm: 10, md: 34 },
      bgcolor: tone === 'green' ? 'primary.main' : 'rgba(255,255,255,.82)',
      boxShadow: tone === 'green' ? '0 0 14px rgba(102,255,138,.8)' : '0 0 10px white',
    }}
  />
);

function AccountOverview() {
  const { active, displayBalance } = usePublicFiduBalance();

  return (
    <Box>
      <SectionLabel>Account overview</SectionLabel>
      <Grid container spacing={1.25} sx={{ mt: .2 }}>
        <Grid item xs={12} sm={5}>
          <ProtocolPanel sx={summaryCardSx}>
            <SectionLabel>Public balance</SectionLabel>
            <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{active ? displayBalance : 'Connect wallet'}</Typography>
          </ProtocolPanel>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Tooltip title="To be implemented" arrow>
            <Box tabIndex={0} sx={{ height: '100%' }}>
              <ProtocolPanel sx={{ ...summaryCardSx, height: '100%', cursor: 'help' }}>
                <Stack direction="row" alignItems="center" gap={.75}>
                  <SectionLabel>Active private sends</SectionLabel>
                  <LockOutlined sx={{ fontSize: 15, color: 'text.secondary' }} />
                </Stack>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.secondary' }}>—</Typography>
              </ProtocolPanel>
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <ProtocolPanel sx={{ ...summaryCardSx, height: '100%' }}>
            <SectionLabel>Network</SectionLabel>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Ethereum Mainnet</Typography>
          </ProtocolPanel>
        </Grid>
      </Grid>
    </Box>
  );
}

function ProductModules() {
  return (
    <Box>
      <SectionLabel>Product modules</SectionLabel>
      <Grid container spacing={1.25} sx={{ mt: .2 }}>
        <Grid item xs={12} sm={4}>
          <ProtocolPanel sx={{ p: 2.1, height: '100%' }}>
            <Typography variant="h6">Private Send</Typography>
            <Typography color="text.secondary" sx={{ mt: .65, mb: 2, fontSize: 13, lineHeight: 1.35 }}>
              Move selected value privately through two Ethereum confirmations.
            </Typography>
            <Button component={Link} href="/platform" variant="contained" size="small" endIcon={<ArrowForward />}>Send privately</Button>
          </ProtocolPanel>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProtocolPanel sx={{ p: 2.1, height: '100%' }}>
            <Typography variant="h6">Decrypt</Typography>
            <Typography color="text.secondary" sx={{ mt: .65, mb: 2, fontSize: 13, lineHeight: 1.35 }}>
              Recover the full private balance or a specific amount.
            </Typography>
            <Button component={Link} href="/decrypt" variant="outlined" size="small">Open decrypt</Button>
          </ProtocolPanel>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProtocolPanel sx={{ p: 2.1, height: '100%', opacity: .62 }}>
            <Typography variant="h6" color="text.secondary">Bridge</Typography>
            <Typography color="text.secondary" sx={{ mt: .65, mb: 1.3, fontSize: 13, lineHeight: 1.35 }}>
              Future private cross-asset settlement for BTC, ETH, and SOL.
            </Typography>
            <Typography sx={{ mb: 1, fontSize: 10, textTransform: 'uppercase', color: 'text.secondary' }}>Not live · In development</Typography>
            <Button component={Link} href="/gasless" variant="outlined" size="small">Explore concept</Button>
          </ProtocolPanel>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Home() {
  return (
    <Layout>
      <Head><title>Fiducaro · Private value, live on Ethereum</title></Head>
      <Box component="main" sx={{ background: 'radial-gradient(circle at 63% 12%, rgba(102,255,138,.055), transparent 25%), #080909' }}>
        <Box component="section" sx={{ minHeight: { md: 'calc(100vh - 70px)' }, maxWidth: 1920, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 4.5 }, pt: { xs: 6, md: 6.5 }, pb: { xs: 7, md: 5 } }}>
          <Grid container spacing={{ xs: 7, lg: 3.5 }} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <Stack sx={{ height: '100%' }}>
                <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: .65, border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: 'text.secondary', fontSize: 13 }}>
                  Private Financial Infrastructure
                </Box>
                <Typography component="h1" sx={{ mt: 2.2, maxWidth: 760, fontSize: { xs: 42, sm: 58, xl: 66 }, fontWeight: 600, lineHeight: 1.03, letterSpacing: '-.045em' }}>
                  Private value, live on Ethereum.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 760, fontSize: { xs: 16, md: 18 }, lineHeight: 1.55 }}>
                  Claim FIDU, move value into private state, send privately, or recover selected portions of value through live on-chain contracts.
                </Typography>
                <Stack direction="row" alignItems="center" gap={1.1} sx={{ mt: 4, color: 'primary.main' }}>
                  <StatusDot />
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>FIDUCARO MAINNET SYSTEM — OPERATIONAL</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1, ml: 2.25, fontSize: 12 }}>
                  Ethereum Mainnet • {fiducaroToken.totalSupply.toLocaleString('en-US')} FIDU • On-chain execution
                </Typography>
                <ProtocolPanel sx={{ mt: { xs: 5, md: 'auto' }, p: 2.25, borderColor: 'rgba(102,255,138,.2)', background: 'linear-gradient(90deg, rgba(102,255,138,.10), rgba(255,255,255,.035))' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                    <Stack direction="row" gap={1.5} alignItems="center">
                      <StorageRounded sx={{ color: 'primary.main' }} />
                      <Box><SectionLabel>Live FIDU token</SectionLabel><Typography sx={{ mt: .3, fontWeight: 700 }}>Ethereum-native public token</Typography></Box>
                    </Stack>
                    <StatusLine label="FIDU Token" />
                  </Stack>
                </ProtocolPanel>
                <Box sx={{ mt: 3 }}>
                  <SectionLabel>Quick start</SectionLabel>
                  <Grid container sx={{ mt: 1, overflow: 'hidden', borderRadius: 1, border: '1px solid rgba(255,255,255,.12)' }}>
                    {quickStart.map(([number, title, body], index) => (
                      <Grid item xs={12} sm={6} md={3} key={number}>
                        <Box sx={{ height: '100%', minHeight: 98, p: 1.6, borderRight: { md: index < 3 ? '1px solid rgba(255,255,255,.1)' : 0 }, borderBottom: { xs: index < 3 ? '1px solid rgba(255,255,255,.1)' : 0, md: 0 }, background: index < 2 ? 'linear-gradient(120deg, rgba(102,255,138,.2), rgba(255,255,255,.06))' : 'rgba(255,255,255,.05)' }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{number} — {title.toUpperCase()}</Typography>
                          <Typography color="text.secondary" sx={{ mt: .9, fontSize: 11.5, lineHeight: 1.35 }}>{body}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Stack gap={3.2}>
                <AccountOverview />
                <ProductModules />
                <Box>
                  <SectionLabel>Protocol status</SectionLabel>
                  <ProtocolPanel sx={{ mt: 1, px: 2, py: 1.6 }}>
                    <Stack direction="row" useFlexGap flexWrap="wrap" gap={{ xs: 1.5, md: 2.4 }}>
                      <StatusLine label="FIDU Token" /><StatusLine label="Private Send" /><StatusLine label="Full Decrypt" /><StatusLine label="Partial Decrypt" /><StatusLine label="Native Asset Bridge" status="Not live" tone="muted" /><StatusLine label="Activity" status="Not live" tone="muted" />
                    </Stack>
                  </ProtocolPanel>
                </Box>
                <Box>
                  <SectionLabel>Evidence strip</SectionLabel>
                  <Typography variant="h4" sx={{ mt: 1.2 }}>Built before it was marketed.</Typography>
                  <Grid container spacing={2.4} sx={{ mt: 1.2 }}>
                    <Grid item xs={6} sm={3}><Metric value="4 YEARS" label="Development" /></Grid>
                    <Grid item xs={6} sm={3}><Metric value="~$700K" label="Historical development" /></Grid>
                    <Grid item xs={6} sm={3}><Metric value="3" label="Core privacy contracts" /></Grid>
                    <Grid item xs={6} sm={3}><Metric value="ETHEREUM" label="Mainnet deployed" /></Grid>
                  </Grid>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box id="protocol" component="section" sx={{ borderTop: '1px solid rgba(255,255,255,.1)', background: '#070908' }}>
          <Box sx={{ maxWidth: 1840, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 9, md: 12 } }}>
            <SectionLabel>The engine</SectionLabel>
            <Typography component="h2" sx={{ mt: 1.2, fontSize: { xs: 36, md: 56 }, lineHeight: 1, fontWeight: 600, letterSpacing: '-.045em' }}>Built before it was marketed.</Typography>
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 850, fontSize: { xs: 15, md: 17 } }}>
              Fiducaro’s privacy system was developed over four years, deployed on Ethereum, and used with real value before the current product and brand existed.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={6} md={3}><Metric icon={<VerifiedOutlined color="primary" />} value="4 YEARS" label="Development" /></Grid>
              <Grid item xs={6} md={3}><Metric icon={<AccountBalanceWalletOutlined color="primary" />} value="~$700K" label="Historical development" /></Grid>
              <Grid item xs={6} md={3}><Metric icon={<CodeRounded color="primary" />} value="3" label="Core privacy contracts" /></Grid>
              <Grid item xs={6} md={3}><Metric icon={<StorageRounded color="primary" />} value="ETHEREUM" label="Mainnet deployed" /></Grid>
            </Grid>
            <ProtocolPanel sx={{ mt: 5, p: 2.2 }}>
              <SectionLabel>Live protocol status</SectionLabel>
              <Stack direction="row" useFlexGap flexWrap="wrap" gap={{ xs: 1.5, md: 3 }} sx={{ mt: 1.4 }}>
                <StatusLine label="FIDU Token" /><StatusLine label="Private Send" /><StatusLine label="Full Decrypt" /><StatusLine label="Partial Decrypt" /><StatusLine label="Native Asset Bridge" status="In development" tone="muted" /><StatusLine label="Activity" status="Not live" tone="muted" /><StatusLine label="Mobile" status="Planned" tone="muted" />
              </Stack>
            </ProtocolPanel>
            <Box className="fiducaro-grid" sx={{ position: 'relative', mt: 4, p: { xs: 2.5, md: 5 }, minHeight: { md: 510 }, overflow: 'hidden', border: '1px solid rgba(102,255,138,.14)' }}>
              <SectionLabel>Core architecture</SectionLabel>
              <Typography align="center" sx={{ mt: 1, color: 'primary.main', fontSize: 28, fontWeight: 700 }}>FIDUCARO</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center" sx={{ mt: { xs: 4, md: 7 } }}>
                <ProtocolPanel sx={{ p: { xs: 1, md: 2 }, maxWidth: 150, textAlign: 'center', bgcolor: 'rgba(255,255,255,.9)', color: '#111' }}><Typography sx={{ fontSize: { xs: 8, md: 12 }, fontWeight: 800 }}>PUBLIC ETHEREUM STATE</Typography></ProtocolPanel>
                <FlowLine tone="white" />
                <Stack direction="row" gap={{ xs: .7, md: 2 }} alignItems="center">{[0, 1, 2].map((item) => <Cube index={item} key={item} />)}</Stack>
                <FlowLine />
                <ProtocolPanel sx={{ p: { xs: 1, md: 2 }, maxWidth: 150, textAlign: 'center', borderColor: 'rgba(102,255,138,.65)', boxShadow: '0 0 30px rgba(102,255,138,.25)' }}><Typography sx={{ fontSize: { xs: 8, md: 12 }, fontWeight: 800 }}>PRIVATE BALANCE STATE</Typography></ProtocolPanel>
              </Stack>
              <Typography align="center" color="text.secondary" sx={{ mt: 5, fontSize: 12 }}>Public execution enters the protocol; private balance state is deliberately not exposed as a readable wallet balance.</Typography>
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ background: 'radial-gradient(circle at 12% 0%, rgba(102,255,138,.07), transparent 28%), #090a09' }}>
          <Box sx={{ maxWidth: 1840, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 9, md: 12 } }}>
            <Grid container spacing={{ xs: 6, md: 4 }}>
              <Grid item xs={12} md={6}>
                <SectionLabel>Premium editorial</SectionLabel>
                <Typography variant="h3" sx={{ mt: 1.2 }}>Ethereum underneath.<br />Fiducaro above it.</Typography>
                <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 620 }}>Ethereum provides settlement, liquidity, execution, and wallet infrastructure. Fiducaro adds private balance state, private send, and selective decrypt above it.</Typography>
                <Stack gap={1.1} sx={{ mt: 4, maxWidth: 660 }}>
                  <ProtocolPanel sx={{ p: 2.2 }}><Typography variant="h6">BRIDGE <Box component="span" sx={{ float: 'right', color: 'text.secondary', fontSize: 12 }}>Future expansion</Box></Typography></ProtocolPanel>
                  <ProtocolPanel sx={{ p: 2.2, borderColor: 'rgba(102,255,138,.45)', bgcolor: 'rgba(102,255,138,.08)' }}><Typography variant="h5" color="primary">FIDUCARO</Typography><Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>Private Balance · Private Send · Selective Decrypt</Typography></ProtocolPanel>
                  <ProtocolPanel sx={{ p: 2.2 }}><Typography variant="h5">ETHEREUM</Typography><Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>Settlement · Liquidity · Execution · Wallet infrastructure</Typography></ProtocolPanel>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <SectionLabel>Core breakthrough</SectionLabel>
                <Typography variant="h3" sx={{ mt: 1.2, maxWidth: 760 }}>Making the relationship difficult to reconstruct from public execution.</Typography>
                <ProtocolPanel sx={{ mt: 4, p: { xs: 2.5, md: 4 } }}>
                  <Stack direction="row" alignItems="center" gap={1.4}>
                    <Stack gap={1} sx={{ width: 100 }}>{['ADDRESS', 'RECIPIENT', 'AMOUNT', 'SALT'].map((item) => <Box key={item} sx={{ p: .65, borderRadius: .7, bgcolor: 'rgba(255,255,255,.08)', fontSize: 10 }}>{item}</Box>)}</Stack>
                    <Box sx={{ flex: 1, height: 160, position: 'relative', overflow: 'hidden' }}>{[25, 55, 85, 115].map((top, index) => <Box key={top} sx={{ position: 'absolute', left: 0, right: 0, top, height: 3, bgcolor: index % 2 ? 'primary.main' : 'rgba(255,255,255,.8)', transform: `rotate(${index % 2 ? -6 : 6}deg)`, transformOrigin: 'center', boxShadow: index % 2 ? '0 0 14px #66ff8a' : 'none' }} />)}</Box>
                    <LockOutlined sx={{ color: 'primary.main', fontSize: 38 }} />
                  </Stack>
                </ProtocolPanel>
              </Grid>
            </Grid>
            <ProtocolPanel sx={{ mt: 7, overflow: 'hidden' }}>
              <Grid container>
                <Grid item xs={12} md={7} sx={{ minHeight: 270, backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,.14)), url(/brand/wall-cubes.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Grid item xs={12} md={5}>
                  <Stack alignItems="flex-start" justifyContent="center" sx={{ height: '100%', p: { xs: 3, md: 4 } }}>
                    <SectionLabel>Clean editorial</SectionLabel>
                    <Typography variant="h4" sx={{ mt: 1 }}>The Obscura Protocol</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.2 }}>A broader thesis on private value, financial sovereignty, and where Fiducaro goes next.</Typography>
                    <Stack direction="row" gap={1.2} sx={{ mt: 2.5 }}>
                      <Button component={Link} href="/whitepaper/obscura-protocol.txt" target="_blank" variant="contained">Read paper</Button>
                      <Button component={Link} href="https://www.youtube.com/watch?v=TqpJNWg7wQs" target="_blank" variant="outlined">Listen</Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </ProtocolPanel>
            <Box sx={{ py: { xs: 9, md: 12 }, textAlign: 'center' }}>
              <Typography variant="h3">The protocol is live.</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5 }}>Claim 100 FIDU and test it yourself.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="flex-start" gap={1.5} sx={{ mt: 3.5, maxWidth: 560, mx: 'auto' }}>
                <Box sx={{ flex: 1, width: '100%', '& button': { minHeight: 48, bgcolor: 'primary.main', color: '#071009' } }}><FaucetClaimButton /></Box>
                <ConnectWallet sx={{ flex: 1, width: '100%', minHeight: 48 }} />
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 2, fontSize: 11 }}>No account. No registration. Ethereum wallet required.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
