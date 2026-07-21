import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { brandAssets } from '../src/brand';
import { ZoomableImage } from '../src/components/ZoomableImage';
import { Layout } from '../src/Layout';
import Link from '../src/Link';

export default function Community() {
  return (
    <Layout>
      <Head>
        <title>Protocol | FIDUCARO</title>
      </Head>

      <Box id="assets" component="section" sx={{ py: { xs: 5, md: 9 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Protocol Library
          </Typography>
          <Typography variant="h3" component="h2">
            Protocol diagrams and reference assets
          </Typography>
          <Typography color="text.secondary">
            Open the diagrams and identity assets that define the live FIDUCARO command surface,
            its hidden-balance flow, selective retrieval, and public-chain disruption layer.
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {brandAssets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset.path}>
              <Box
                sx={{
                  height: '100%',
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                }}
              >
                <ZoomableImage
                  src={asset.path}
                  alt={`${asset.label} preview`}
                  wrapperSx={{
                    overflow: 'hidden',
                    borderRadius: '8px',
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  imageSx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mt: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {asset.label}
                  </Typography>
                  <Button
                    component={Link}
                    href={asset.path}
                    target="_blank"
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadOutlined />}
                  >
                    Open
                  </Button>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" sx={{ py: { xs: 5, md: 9 } }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: '8px',
                border: '1px solid rgba(52, 224, 208, 0.28)',
                background:
                  'linear-gradient(180deg, rgba(52, 224, 208, 0.12), rgba(255, 255, 255, 0.02))',
              }}
            >
              <ScienceOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Enter With Control
              </Typography>
              <Typography color="text.secondary">
                Connect deliberately, read every wallet request, and keep the recovery record under
                your control until the complete two-part SEND resolves.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.035)',
              }}
            >
              <FactCheckOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Verify Each Step
              </Typography>
              <Typography color="text.secondary">
                Check the network, active account, token and protocol addresses, requested method,
                amount, and resulting receipt before drawing a conclusion.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.035)',
              }}
            >
              <ForumOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Read the Chain
              </Typography>
              <Typography color="text.secondary">
                Inspect transaction hashes, interface state, emitted events, and final balances.
                Never publish SALTs, recovery records, private keys, or identifying wallet details.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
