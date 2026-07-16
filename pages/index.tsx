import AutoAwesome from '@mui/icons-material/AutoAwesome';
import HubOutlined from '@mui/icons-material/HubOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { brand, brandAssets, philosophySections, pillars, protocolNotes, roadmap } from '../src/brand';
import FeatureSection from '../src/components/FeatureSection';
import TopSection from '../src/components/TopSection';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { ukuleleToken } from '../src/token';

const pillarIcons = [ShieldOutlined, VisibilityOffOutlined, LockOutlined, HubOutlined];

const tokenFacts = [
  { label: 'Network', value: ukuleleToken.network },
  { label: 'Token', value: ukuleleToken.symbol },
  { label: 'Decimals', value: String(ukuleleToken.decimals) },
  { label: 'Total supply', value: `${ukuleleToken.totalSupply.toLocaleString('en-US')} UNK` },
  {
    label: 'Daily sale',
    value: `${ukuleleToken.dailySaleTokens.toLocaleString('en-US')} UNK (${ukuleleToken.dailySalePercent}%)`,
  },
  { label: 'Developer reserve', value: `${ukuleleToken.developerReservePercent}%` },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Ukulele</title>
      </Head>

      <TopSection />

      <Box component="section" sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid container spacing={1.5}>
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] || ShieldOutlined;

            return (
              <Grid item xs={12} sm={6} md={3} key={pillar.title}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 212,
                    p: 3,
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025))',
                  }}
                >
                  <Icon color="primary" sx={{ fontSize: 34, mb: 2 }} />
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

      <Box component="section" id="token" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Token Details
          </Typography>
          <Typography variant="h3" component="h2">
            UKULELE on Ethereum
          </Typography>
          <Typography color="text.secondary">
            The supply is fixed at 10,000,000 UNK. Each day, 100,000 UNK, equal to 1% of the
            total supply, is sold until 15% remains for the developer.
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
          <Box sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              Token contract
            </Typography>
            <Box
              component={Link}
              href={ukuleleToken.etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: 'fit-content',
                maxWidth: '100%',
                color: 'text.primary',
                '&:hover': { color: 'primary.light' },
              }}
            >
              <Typography
                component="span"
                sx={{
                  minWidth: 0,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: { xs: 13, sm: 16 },
                  overflowWrap: 'anywhere',
                }}
              >
                {ukuleleToken.address}
              </Typography>
              <OpenInNew aria-hidden="true" sx={{ flex: '0 0 auto', fontSize: 19 }} />
            </Box>
          </Box>

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

      <Box component="section" id="philosophy" sx={{ py: { xs: 7, md: 11 } }}>
        <Stack gap={2.5} sx={{ maxWidth: 860, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            The Ukulele Philosophy
          </Typography>
          <Typography variant="h2" component="h2">
            Private by Default
          </Typography>
          <Typography color="text.secondary">
            {brand.name} is a covenant for financial sanctuary: a fully on-chain Ethereum system
            built around the oldest human right, the right to choose what remains unseen.
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {philosophySections.map((section, index) => (
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
                      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.025))'
                      : 'rgba(255, 255, 255, 0.035)',
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
        kicker="Privacy Routing"
        title="Token flow through the privacy engine"
        description="UKULELE routes token movement into the privacy engine, converts it into a privacy hash, and returns it back to token form through a tested flow that has been used before and proven effective."
        imageSrc="/brand/social-banner.png"
        imageAlt="UKULELE social banner concept"
        reverse
        points={[
          'The token can expand anonymously and in a decentralized way because it lives on Ethereum without centralized management.',
          'The platform is designed for decentralized distribution, including torrent-based mirrors that help access spread across many users.',
          'Copy and interface states have been cleaned up for clearer grammar, calmer controls, and a more consistent UKULELE experience.',
        ]}
      />

      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Stack gap={2}>
              <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                The Plan
              </Typography>
              <Typography variant="h3" component="h2">
                Rebrand, launch, and keep expanding
              </Typography>
              <Typography color="text.secondary">
                The roadmap focuses the public rollout around identity, community, the launch pool,
                Gasless, and a transparent developer distribution schedule.
              </Typography>
              <Button
                component={Link}
                href="/roadmap"
                variant="outlined"
                endIcon={<AutoAwesome />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Full Roadmap
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
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      color: 'primary.light',
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
            Asset Kit
          </Typography>
          <Typography variant="h3" component="h2">
            Ready-to-place brand placeholders
          </Typography>
          <Typography color="text.secondary">
            The project now includes logo, favicon, wallpaper, social, and hero art placeholders.
            The README includes protocol notes and manual finish steps for the rebrand.
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {brandAssets.slice(0, 6).map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset.path}>
              <Box
                component={Link}
                href={asset.path}
                target="_blank"
                sx={{
                  display: 'block',
                  height: '100%',
                  minHeight: 220,
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  transition: 'transform 180ms ease, border-color 180ms ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={asset.path}
                  alt={`${asset.label} preview`}
                  sx={{
                    width: '100%',
                    height: 148,
                    objectFit: 'contain',
                    borderRadius: '8px',
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                />
                <Typography variant="subtitle1" sx={{ mt: 1.5, fontWeight: 700 }}>
                  {asset.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Protocol Notes
          </Typography>
          <Typography variant="h3" component="h2">
            On-chain positioning
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
