import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ArrowForward from '@mui/icons-material/ArrowForward';
import DifferenceOutlined from '@mui/icons-material/DifferenceOutlined';
import LockOpenOutlined from '@mui/icons-material/LockOpenOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { pillars, protocolCapabilities, protocolNotes, protocolVisuals, roadmap } from '../src/brand';
import FeatureSection from '../src/components/FeatureSection';
import TopSection from '../src/components/TopSection';
import { ZoomableImage } from '../src/components/ZoomableImage';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { fiducaroToken } from '../src/token';

const pillarIcons = [ScienceOutlined, SwapHorizOutlined, LockOpenOutlined, DifferenceOutlined];

const tokenFacts = [
  { label: 'Network', value: fiducaroToken.network },
  { label: 'Token', value: fiducaroToken.symbol },
  { label: 'Decimals', value: String(fiducaroToken.decimals) },
  { label: 'Total supply', value: `${fiducaroToken.totalSupply.toLocaleString('en-US')} FIDU` },
  { label: 'Status', value: 'Live' },
  { label: 'Execution', value: 'On-chain' },
];

const userFlow = [
  {
    title: 'Command',
    description:
      'Connect MetaMask and take command of the FIDUCARO interface. Every action begins with you and moves only with your explicit approval.',
  },
  {
    title: 'Bury',
    description:
      'Drive a balance beneath ordinary view through the two-part private SEND. PART I opens the passage; your recovery record preserves the route; PART II seals it.',
  },
  {
    title: 'Retrieve',
    description:
      'Unbury the value you concealed. Decrypt restores the entire hidden balance, while Partial Decrypt retrieves only the amount you choose.',
  },
  {
    title: 'Disrupt',
    description:
      'Cast a decoy balance transfer from one party to another onto Etherscan. The event is real and visible; the temporary balance movement collapses back to zero.',
  },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>FIDUCARO · Live on Ethereum</title>
      </Head>

      <TopSection />

      <Box component="section" sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid container spacing={1.5}>
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] || ScienceOutlined;

            return (
              <Grid item xs={12} sm={6} md={3} key={pillar.title}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 212,
                    p: 3,
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.018))',
                    transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: 'rgba(52, 224, 208, 0.4)',
                      boxShadow: '0 0 26px rgba(52, 224, 208, 0.12)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 34, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pillar.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box component="section" id="how-it-works" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack gap={2} sx={{ maxWidth: 780, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            The FIDUCARO Command Sequence
          </Typography>
          <Typography variant="h2" component="h2">
            Bury the balance. Retrieve it. Disrupt the record.
          </Typography>
          <Typography color="text.secondary">
            FIDUCARO concentrates four deliberate powers in one command surface: enter the network,
            bury value, retrieve it on your terms, and project a zero-net transfer signal into the
            public record. Every command executes on Ethereum and requires your wallet approval.
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {userFlow.map((item, index) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 220,
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                }}
              >
                <Typography variant="overline" color="primary.light" fontWeight="700">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.75, mb: 1.25 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mt: 3 }}>
          <Button component={Link} href="/platform" variant="contained" endIcon={<ArrowForward />}>
            Enter SEND
          </Button>
          <Button component={Link} href="/decrypt" variant="outlined">
            Retrieve Balance
          </Button>
          <Button component={Link} href="/disruptor" variant="outlined">
            Launch Disruptor
          </Button>
        </Stack>

      </Box>

      <Box
        component="section"
        id="whitepaper"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          my: { xs: 7, md: 11 },
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: '8px',
          border: '1px solid rgba(52, 224, 208, 0.22)',
          background:
            'radial-gradient(circle at 90% 15%, rgba(52, 224, 208, 0.18), transparent 34%), linear-gradient(180deg, rgba(52, 224, 208, 0.04), rgba(255, 255, 255, 0.02))',
        }}
      >
        <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="overline" color="primary.light" fontWeight="700">
              The Obscura Protocol · Futurist Paper 0.1
            </Typography>
            <Typography variant="h3" component="h2" sx={{ mt: 0.75 }}>
              The Obscura Protocol
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 760 }}>
              A futurist manifesto for financial sovereignty in a world of total visibility. It
              looks beyond today’s interface toward private value, sovereign identity, adversarial
              public signals, and a parallel architecture built for the world ahead—not the system
              already failing behind us.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack gap={1.5}>
              <ZoomableImage
                src="/technical/private-vault.webp"
                alt="The FIDUCARO Private Vault, a protected chamber for hidden value"
                wrapperSx={{
                  overflow: 'hidden',
                  borderRadius: '8px',
                  border: '1px solid rgba(52, 224, 208, 0.24)',
                  backgroundColor: '#050606',
                }}
                imageSx={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '8px',
                }}
              />
              <Button
                component={Link}
                href="/whitepaper/obscura-protocol.txt"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                fullWidth
                endIcon={<OpenInNew />}
                sx={{ minHeight: 58, borderRadius: 999 }}
              >
                Open The Obscura Protocol
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" id="audiobook" sx={{ py: { xs: 7, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack gap={2}>
              <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                The Obscura Covenant
              </Typography>
              <Typography variant="h3" component="h2">
                Watch the full audiobook
              </Typography>
              <Typography color="text.secondary">
                Enter the complete narrated vision behind FIDUCARO: private value, sovereign
                identity, and financial infrastructure built beyond the limits of public-by-default
                systems.
              </Typography>
              <Button
                component={Link}
                href="https://youtu.be/TqpJNWg7wQs"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                endIcon={<OpenInNew />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Watch on YouTube
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: '8px',
                border: '1px solid rgba(52, 224, 208, 0.32)',
                backgroundColor: '#000000',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.5), 0 0 36px rgba(52, 224, 208, 0.08)',
              }}
            >
              <Box
                component="iframe"
                src="https://www.youtube-nocookie.com/embed/TqpJNWg7wQs"
                title="The Obscura Covenant audiobook"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                sx={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  border: 0,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" id="token" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Live on Ethereum
          </Typography>
          <Typography variant="h3" component="h2">
            FIDU is live and operational
          </Typography>
          <Typography color="text.secondary">
            The protocol is deployed and ready. Connect your wallet to bury value through SEND,
            unbury a hidden balance through Decrypt, or project a decoy zero-net transfer onto
            Etherscan through Disruptor.
          </Typography>
        </Stack>

        <Box
          sx={{
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.035)',
          }}
        >
          <Grid container>
            {tokenFacts.map((fact) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={2}
                key={fact.label}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.08)', md: 0 },
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {fact.label}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700, overflowWrap: 'anywhere' }}>
                  {fact.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box component="section" id="protocol-scope" sx={{ py: { xs: 7, md: 11 } }}>
        <Stack gap={2.5} sx={{ maxWidth: 860, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Live Protocol Scope
          </Typography>
          <Typography variant="h2" component="h2">
            What FIDUCARO is built to do
          </Typography>
          <Typography color="text.secondary">
            FIDUCARO is deployed on Ethereum now. Its command surface gives the connected wallet
            direct power to bury value, retrieve it selectively, and disrupt the public record with
            a visible zero-net transfer signal.
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {protocolCapabilities.map((section, index) => (
            <Grid item xs={12} md={6} key={section.title}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 260,
                  p: { xs: 3, md: 4 },
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background:
                    index === 0
                      ? 'linear-gradient(180deg, rgba(52, 224, 208, 0.12), rgba(255, 255, 255, 0.02))'
                      : 'rgba(255, 255, 255, 0.03)',
                  borderColor: index === 0 ? 'rgba(52, 224, 208, 0.28)' : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5, mb: 1.5 }}>
                  {section.title}
                </Typography>
                <Stack gap={1.2}>
                  {section.body.map((paragraph) => (
                    <Typography key={paragraph} color="text.secondary">
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <FeatureSection
        kicker="Private Balance Lifecycle"
        title="Commit private value with irreversible on-chain finality"
        description="Private SEND is FIDUCARO’s established live passage beneath the public-balance surface. Engineered for secure, extremely efficient settlement, it runs entirely on Ethereum and divides execution into two deliberate confirmations."
        imageSrc="/technical/private-balance-lifecycle.webp"
        imageAlt="FIDUCARO Private Balance Lifecycle from public balance through private transfer and selective retrieval"
        reverse
        containImage
        showBrandMark={false}
        showImageOverlay={false}
        points={[
          'PART I opens the private route; PART II seals it. Once both confirmations resolve on chain, the completed SEND is irreversible.',
          'No off-chain settlement layer carries the transaction: every submitted step executes and finalizes on Ethereum.',
          'FIDUCARO has operated as a live protocol over time, turning the private-balance lifecycle into working infrastructure.',
        ]}
      />

      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Stack gap={2}>
              <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                Protocol Expansion
              </Typography>
              <Typography variant="h3" component="h2">
                Live now. Advancing forward.
              </Typography>
              <Typography color="text.secondary">
                The core protocol is operational on Ethereum. The roadmap deepens the hidden-balance
                layer, expands selective retrieval, and strengthens control over public-chain signals.
              </Typography>
              <Button
                component={Link}
                href="/roadmap"
                variant="outlined"
                endIcon={<AutoAwesome />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Full Protocol Roadmap
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack gap={1.5}>
              {roadmap.slice(0, 4).map((item, index) => (
                <Box
                  key={item.title}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '48px 1fr', sm: '64px 1fr' },
                    gap: 2,
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(52, 224, 208, 0.14)',
                      border: '1px solid rgba(52, 224, 208, 0.35)',
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" id="assets" sx={{ py: { xs: 7, md: 11 } }}>
        <Stack gap={2} sx={{ maxWidth: 720, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Protocol Visual Library
          </Typography>
          <Typography variant="h3" component="h2">
            See the architecture of hidden value
          </Typography>
          <Typography color="text.secondary">
            These system posters explain how FIDUCARO buries a public balance, carries value through
            private state, retrieves it selectively, and separates visible event signals from final
            contract state.
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {protocolVisuals.map((visual) => (
            <Grid item xs={12} sm={6} key={visual.path}>
              <Box
                sx={{
                  height: '100%',
                  p: 1.25,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  transition: 'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(52, 224, 208, 0.45)',
                    boxShadow: '0 0 28px rgba(52, 224, 208, 0.16)',
                  },
                }}
              >
                <ZoomableImage
                  src={visual.path}
                  alt={visual.alt}
                  wrapperSx={{ borderRadius: '6px', overflow: 'hidden' }}
                  imageSx={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    backgroundColor: '#050606',
                  }}
                />
                <Typography variant="h6" sx={{ mt: 1.5, px: 0.5, pb: 0.5 }}>
                  {visual.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Protocol Authority
          </Typography>
          <Typography variant="h3" component="h2">
            Live by design. Transparent by command.
          </Typography>
        </Stack>
        <Stack gap={1.5}>
          {protocolNotes.map((item) => (
            <Box
              key={item.title}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.035)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 0.75 }}>
                {item.title}
              </Typography>
              <Typography color="text.secondary">{item.description}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}
