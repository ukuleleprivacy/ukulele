import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CodeRounded from '@mui/icons-material/CodeRounded';
import StorageRounded from '@mui/icons-material/StorageRounded';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import LinearProgress from '@mui/material/LinearProgress';
import { motion, useReducedMotion } from 'framer-motion';

import { ArchitectureExplorer } from '../src/components/ArchitectureExplorer';
import { FaucetClaimButton } from '../src/components/FaucetClaimButton';
import { Metric, ProtocolPanel, SectionLabel, StatusDot, StatusLine } from '../src/components/ProtocolUI';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { fiducaroToken } from '../src/token';
import { brand } from '../src/brand';

function DevelopmentProgress() {
  return (
    <Box component="section" aria-labelledby="development-title" className="development-timeline">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1} sx={{ mb: 3 }}>
        <Box>
          <SectionLabel>Development progress</SectionLabel>
          <Typography component="h2" id="development-title" sx={{ mt: .7, fontSize: { xs: 23, md: 28 }, fontWeight: 600, letterSpacing: '-.03em' }}>From private crypto to private value rails.</Typography>
        </Box>
        <Typography color="text.secondary" sx={{ fontSize: 14, alignSelf: { sm: 'flex-end' } }}>Built on Ethereum. Built to expand.</Typography>
      </Stack>
      <Box component="ol" className="development-stages">
        {[
          { label: 'Private Send', value: 100, status: 'Complete', detail: 'Private Ethereum-native transfers', href: '/platform' },
          { label: 'Bridge', value: 27, status: 'In development', detail: 'Cross-asset private settlement', href: '/gasless' },
          { label: 'Funding', value: 2, status: 'In progress', detail: 'Supporting the next phase of growth' },
          { label: 'Separate Omnione Chain', value: 7, status: 'In development', detail: 'A dedicated infrastructure layer' },
        ].map(({ label, value, status, detail, href }, index) => (
          <Box component="li" key={label} className="development-stage">
            <Box className="development-node" aria-hidden="true">{String(index + 1).padStart(2, '0')}</Box>
            <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, mt: 2.5, minHeight: { sm: 54 } }}>{label}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={1} sx={{ mt: 1.5, mb: 1.25 }}>
              <Typography color="primary" sx={{ fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{value}<Box component="span" sx={{ fontSize: 16 }}>%</Box></Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>{status}</Typography>
            </Stack>
            <LinearProgress aria-label={`${label} progress`} variant="determinate" value={value} sx={{ height: 6, borderRadius: 6, bgcolor: 'rgba(255,255,255,.12)', '& .MuiLinearProgress-bar': { borderRadius: 6 } }} />
            <Typography color="text.secondary" sx={{ fontSize: 14, mt: 1.5, lineHeight: 1.5 }}>{detail}</Typography>
            {href && <Button component={Link} href={href} size="small" endIcon={<ArrowForward sx={{ fontSize: 16 }} />} sx={{ mt: .75, px: 0, fontSize: 13 }}>{value === 100 ? 'Send privately' : 'Explore bridge'}</Button>}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  return (
    <Layout>
      <Head><title>Fiducaro · Private value, live on Ethereum</title></Head>
      <Box component="main" sx={{ background: 'radial-gradient(ellipse at 78% 4%, rgba(220,224,228,.07), transparent 35%), #060c10' }}>
        <Box component="section" className="home-hero" sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2.5, sm: 4, lg: 5 }, pt: { xs: 5, md: 6 }, pb: { xs: 6, md: 7 } }}>
          <Grid container spacing={{ xs: 5, lg: 7 }} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Stack sx={{ height: '100%' }}>
                <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: .65, border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: 'text.secondary', fontSize: 13 }}>
                  Private Financial Infrastructure
                </Box>
                <Typography component="h1" sx={{ mt: 3, maxWidth: 760, fontSize: { xs: 42, sm: 58, xl: 66 }, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-.045em' }}>
                  Private value.<br /><Box component="span" className="hero-highlight">Live on Ethereum.</Box>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 760, fontSize: { xs: 16, md: 18 }, lineHeight: 1.55 }}>
                  Claim FIDU, move value into private state, send privately, or recover selected portions of value through live on-chain contracts.
                </Typography>
                <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.5} sx={{ mt: 3 }}>
                  <Button component={Link} href="/platform" variant="contained" endIcon={<ArrowForward />}>Send privately</Button>
                  <Button component={Link} href="/decrypt" variant="outlined">Open decrypt</Button>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1.1} sx={{ mt: 4, color: 'primary.main' }}>
                  <StatusDot />
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>FIDUCARO MAINNET SYSTEM — OPERATIONAL</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1, ml: 2.25, fontSize: 12 }}>
                  Ethereum Mainnet • {fiducaroToken.totalSupply.toLocaleString('en-US')} FIDU • On-chain execution
                </Typography>
                <ProtocolPanel sx={{ mt: 3, p: 2.25 }}>
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
              <Box className="privacy-portrait">
                <Box component="img" src="/brand/fiducaro-dark-wallpaper.webp" alt="Fiducaro — Enabling Privacy Across International Markets" width={1440} height={810} className="privacy-portrait-image" fetchPriority="high" />
                <Box className="privacy-portrait-copy">
                  <Typography component="h2" sx={{ fontSize: { xs: 27, sm: 34 }, fontWeight: 600, lineHeight: 1.18, letterSpacing: '-.035em' }}>{brand.tagline}.</Typography>
                  <Typography sx={{ mt: 1.5, maxWidth: 465, fontSize: { xs: 15, sm: 16 }, lineHeight: 1.65, color: 'primary.main' }}>Privacy is the norm. Fiducaro is the rail.</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: { xs: 5, md: 6 } }}><DevelopmentProgress /></Box>
        </Box>

        <Box id="protocol" className="engine-section" component="section" sx={{ borderTop: '1px solid rgba(255,255,255,.1)', background: '#03080b' }}>
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
            <Box className="fiducaro-grid architecture-stage" sx={{ position: 'relative', mt: 3, p: { xs: 2.5, md: 4 }, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(104, 199, 107,.14)' }}>
              <ArchitectureExplorer />
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ background: 'radial-gradient(circle at 12% 0%, rgba(104, 199, 107,.07), transparent 28%), #091116' }}>
          <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 9, md: 12 } }}>
            <ProtocolPanel className="obscura-card" sx={{ overflow: 'hidden', backgroundImage: 'linear-gradient(90deg, rgba(6,12,16,.94), rgba(6,12,16,.82)), url(/wallpaper/obscura-covenant.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <Grid container alignItems="center" spacing={3} sx={{ p: { xs: 3, md: 5 }, width: '100%', m: 0, '& > .MuiGrid-item': { pt: 0, pl: { xs: 0, md: 3 } }, rowGap: 3 }}>
                <Grid item xs={12} md={7}>
                  <SectionLabel>The paper & the audiobook</SectionLabel>
                  <Typography variant="h4" sx={{ mt: 1 }}>The Obscura Covenant</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 550 }}>A broader thesis on private value, financial sovereignty, and where Fiducaro goes next.</Typography>
                  <Button component={Link} href="/whitepaper/Obscura_Coveneant.pdf" target="_blank" rel="noopener noreferrer" variant="contained" sx={{ mt: 3 }}>Read paper</Button>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box component="iframe" src="https://www.youtube-nocookie.com/embed/TqpJNWg7wQs" title="The Obscura Covenant" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen sx={{ display: 'block', width: '100%', maxWidth: 440, ml: { md: 'auto' }, aspectRatio: '16 / 9', border: '1px solid rgba(104, 199, 107,.25)', borderRadius: 2 }} />
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
