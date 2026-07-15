import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import HubOutlined from '@mui/icons-material/HubOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { brandAssets } from '../src/brand';
import { Layout } from '../src/Layout';
import Link from '../src/Link';

export default function Community() {
  return (
    <Layout>
      <Head>
        <title>Ukulele</title>
      </Head>

      <Box id="assets" component="section" sx={{ py: { xs: 5, md: 9 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            Brand Kit
          </Typography>
          <Typography variant="h3" component="h2">
            Placeholder assets included
          </Typography>
          <Typography color="text.secondary">
            These files are ready for layout and review. Replace them with final production assets
            when the logo and campaign art are approved.
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
                <Box
                  component="img"
                  src={asset.path}
                  alt={`${asset.label} preview`}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'contain',
                    borderRadius: '8px',
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
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
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.025))',
              }}
            >
              <CampaignOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Standard Promotion
              </Typography>
              <Typography color="text.secondary">
                Standard Twitter promotion and basic social media promotion build early awareness
                around the token and public launch materials.
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
              <GroupsOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Increased Decentralization
              </Typography>
              <Typography color="text.secondary">
                The community begins to take over after the token sell-off ends. The frontend is
                torrented, additional privacy contracts can be added, and the founder steps back.
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
              <HubOutlined color="primary" sx={{ fontSize: 38, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Full Decentralization
              </Typography>
              <Typography color="text.secondary">
                A DAO may form, the protocol can stand alone, and anonymous developers can update
                it through GitHub if needed. Contract keys can be handed to trusted developers over
                time.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
