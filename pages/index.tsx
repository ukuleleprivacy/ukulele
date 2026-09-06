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
import LinearProgress from '@mui/material/LinearProgress';
import { motion, useReducedMotion } from 'framer-motion';

import { ArchitectureExplorer } from '../src/components/ArchitectureExplorer';
import { FaucetClaimButton } from '../src/components/FaucetClaimButton';
import { Metric, ProtocolPanel, SectionLabel, StatusDot, StatusLine } from '../src/components/ProtocolUI';
import { usePublicFiduBalance } from '../src/components/WalletBalance';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { fiducaroToken } from '../src/token';

const summaryCardSx = {
  p: 2,
  minHeight: 92,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

function DevelopmentProgress() {
  return <ProtocolPanel sx={{ p: 3, mt: 3 }}>
    <SectionLabel>Development progress</SectionLabel>
    {[{ label: 'Private Send', value: 100, status: 'Complete' }, { label: 'Bridge', value: 27, status: '27% · In development' }].map(({ label, value, status }) => <Box key={label} sx={{ mt: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{label}</Typography><Typography color="primary" sx={{ fontSize: 13 }}>{status}</Typography></Stack>
      <LinearProgress aria-label={`${label} development`} variant="determinate" value={value} sx={{ height: 5, borderRadius: 5, bgcolor: 'rgba(102,255,138,.08)', '& .MuiLinearProgress-bar': { borderRadius: 5, boxShadow: '0 0 14px #66ff8a' } }} />
    </Box>)}
  </ProtocolPanel>;
}

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
          <ProtocolPanel sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Private Send</Typography>
            <Typography color="text.secondary" sx={{ mt: .65, mb: 2, fontSize: 13, lineHeight: 1.35 }}>
              Move selected value privately through two Ethereum confirmations.
            </Typography>
            <Button component={Link} href="/platform" variant="contained" size="small" endIcon={<ArrowForward />}>Send privately</Button>
          </ProtocolPanel>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProtocolPanel sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Decrypt</Typography>
            <Typography color="text.secondary" sx={{ mt: .65, mb: 2, fontSize: 13, lineHeight: 1.35 }}>
              Recover the full private balance or a specific amount.
            </Typography>
            <Button component={Link} href="/decrypt" variant="outlined" size="small">Open decrypt</Button>
          </ProtocolPanel>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProtocolPanel sx={{ p: 3, height: '100%', opacity: .62 }}>
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
  const reduceMotion = useReducedMotion();
  return (
    <Layout>
      <Head><title>Fiducaro · Private value, live on Ethereum</title></Head>
      <Box component="main" sx={{ background: 'radial-gradient(circle at 63% 12%, rgba(102,255,138,.055), transparent 25%), #080909' }}>
        <Box component="section" className="home-hero" sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 4.5 }, pt: { xs: 6, md: 9 }, pb: { xs: 7, md: 9 } }}>
          <div className="hero-atmosphere" aria-hidden="true">
            <div className="hero-aurora hero-aurora-one" />
            <div className="hero-aurora hero-aurora-two" />
            <div className="hero-perspective-grid" />
            <div className="hero-signal hero-signal-one" />
            <div className="hero-signal hero-signal-two" />
            <div className="hero-signal hero-signal-three" />
          </div>
          <Grid container spacing={{ xs: 5, lg: 7 }} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Stack sx={{ height: '100%' }}>
                <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: .65, border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: 'text.secondary', fontSize: 13 }}>
                  Private Financial Infrastructure
                </Box>
                <Typography component="h1" sx={{ mt: 2.2, maxWidth: 760, fontSize: { xs: 42, sm: 58, xl: 66 }, fontWeight: 600, lineHeight: 1.03, letterSpacing: '-.045em' }}>
                  Private value.<br /><Box component="span" className="hero-highlight">Live on Ethereum.</Box>
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
                <ProtocolPanel sx={{ mt: 4, p: 2.25, borderColor: 'rgba(102,255,138,.2)', background: 'linear-gradient(90deg, rgba(102,255,138,.10), rgba(255,255,255,.035))' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                    <Stack direction="row" gap={1.5} alignItems="center">
                      <StorageRounded sx={{ color: 'primary.main' }} />
                      <Box><SectionLabel>Live FIDU token</SectionLabel><Typography sx={{ mt: .3, fontWeight: 700 }}>Ethereum-native public token</Typography></Box>
                    </Stack>
                    <StatusLine label="FIDU Token" />
                  </Stack>
                </ProtocolPanel>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Stack gap={3.2}>
                <AccountOverview />
                <DevelopmentProgress />
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 5 }}><ProductModules /></Box>
        </Box>

        <Box id="protocol" className="engine-section" component="section" sx={{ borderTop: '1px solid rgba(255,255,255,.1)', background: '#070908' }}>
          <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 9, md: 12 } }}>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} md={7}>
                <SectionLabel>The engine</SectionLabel>
                <Typography component="h2" sx={{ mt: 1.5, maxWidth: 780, fontSize: { xs: 36, md: 56 }, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-.045em' }}>Built before it<br />was marketed.</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography color="text.secondary" sx={{ maxWidth: 520, fontSize: 16, lineHeight: 1.8 }}>Four years of development. Deployed on Ethereum. Used with real value before the current product and brand existed.</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {[
                { icon: <VerifiedOutlined />, value: '4 YEARS', label: 'Development' },
                { icon: <AccountBalanceWalletOutlined />, value: '~$700K', label: 'Historical development' },
                { icon: <CodeRounded />, value: '3', label: 'Core privacy contracts' },
                { icon: <StorageRounded />, value: 'ETHEREUM', label: 'Mainnet deployed' },
              ].map(({ icon, value, label }, index) => <Grid item xs={6} md={3} key={label}>
                <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .6, delay: index * .1 }} className="engine-metric">
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
                  <Metric value={value} label={label} />
                </motion.div>
              </Grid>)}
            </Grid>
            <ProtocolPanel className="engine-status" sx={{ mt: 2, p: { xs: 2, md: 2.5 } }}>
              <SectionLabel>Live protocol status</SectionLabel>
              <Stack direction="row" useFlexGap flexWrap="wrap" gap={{ xs: 1.5, md: 3 }} sx={{ mt: 1.4 }}>
                <StatusLine label="FIDU Token" /><StatusLine label="Private Send" /><StatusLine label="Full Decrypt" /><StatusLine label="Partial Decrypt" /><StatusLine label="Native Asset Bridge" status="In development" tone="muted" /><StatusLine label="Activity" status="Not live" tone="muted" /><StatusLine label="Mobile" status="Planned" tone="muted" />
              </Stack>
            </ProtocolPanel>
            <Box className="fiducaro-grid architecture-stage" sx={{ position: 'relative', mt: 3, p: { xs: 2.5, md: 4 }, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(102,255,138,.14)' }}>
              <ArchitectureExplorer />
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ background: 'radial-gradient(circle at 12% 0%, rgba(102,255,138,.07), transparent 28%), #090a09' }}>
          <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 9, md: 12 } }}>
            <ProtocolPanel className="obscura-card" sx={{ overflow: 'hidden', backgroundImage: 'linear-gradient(90deg, rgba(4,10,6,.88), rgba(4,10,6,.7)), url(/wallpaper/obscura-covenant.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <Grid container alignItems="center" spacing={3} sx={{ p: { xs: 3, md: 5 }, width: '100%', m: 0, '& > .MuiGrid-item': { pt: 0, pl: { xs: 0, md: 3 } }, rowGap: 3 }}>
                <Grid item xs={12} md={7}>
                  <SectionLabel>The paper & the audiobook</SectionLabel>
                  <Typography variant="h4" sx={{ mt: 1 }}>The Obscura Covenant</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 550 }}>A broader thesis on private value, financial sovereignty, and where Fiducaro goes next.</Typography>
                  <Button component={Link} href="/whitepaper/Obscura_Coveneant.pdf" target="_blank" rel="noopener noreferrer" variant="contained" sx={{ mt: 3 }}>Read paper</Button>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box component="iframe" src="https://www.youtube-nocookie.com/embed/TqpJNWg7wQs" title="The Obscura Covenant" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen sx={{ display: 'block', width: '100%', maxWidth: 440, ml: { md: 'auto' }, aspectRatio: '16 / 9', border: '1px solid rgba(102,255,138,.25)', borderRadius: 2 }} />
                </Grid>
              </Grid>
            </ProtocolPanel>
            <ProtocolPanel className="claim-banner" sx={{ mt: 3, p: { xs: 3, md: 5 }, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" gap={4}>
                <Box sx={{ maxWidth: 670 }}>
                  <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}><StatusDot /><SectionLabel>Live on Ethereum</SectionLabel></Stack>
                  <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, letterSpacing: '-.035em' }}>The protocol is live.</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>Claim 100 FIDU and test it yourself. Experience privacy built into Ethereum, with private transfers and selective recovery that put you in control.</Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0, '& button': { minHeight: 52, width: '100%', bgcolor: 'primary.main', color: '#071009' } }}>
                  <FaucetClaimButton />
                  <Typography color="text.secondary" align="center" sx={{ mt: 1.5, fontSize: 12 }}>No account. No registration.</Typography>
                </Box>
              </Stack>
            </ProtocolPanel>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
