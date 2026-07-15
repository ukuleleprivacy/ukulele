import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import RocketLaunchOutlined from '@mui/icons-material/RocketLaunchOutlined';
import SchemaOutlined from '@mui/icons-material/SchemaOutlined';
import WidgetsOutlined from '@mui/icons-material/WidgetsOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { roadmap } from '../src/brand';
import { Layout } from '../src/Layout';

const icons = [
  RocketLaunchOutlined,
  SchemaOutlined,
  GroupsOutlined,
  WidgetsOutlined,
  LinkOutlined,
  LanguageOutlined,
];

export default function Roadmap() {
  return (
    <Layout>
      <Head>
        <title>Ukulele</title>
      </Head>

      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack gap={2.5}>
              <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                The Plan
              </Typography>
              <Typography variant="h2" component="h1">
                A focused launch plan for UKULELE.
              </Typography>
              <Typography color="text.secondary">
                This sequence covers the rebrand, community development, pool launch, Gasless
                rollout, daily founder sale schedule, and continued marketing expansion.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                minHeight: { xs: 300, md: 460 },
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundImage:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.7)), url(/brand/wallpaper-desktop.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box component="section" sx={{ py: { xs: 5, md: 9 } }}>
        <Stack gap={1.5}>
          {roadmap.map((item, index) => {
            const Icon = icons[index] || RocketLaunchOutlined;

            return (
              <Box
                key={item.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '54px 1fr', sm: '76px 1fr' },
                  gap: { xs: 1.5, sm: 2.5 },
                  p: { xs: 2, sm: 3 },
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background:
                    index % 2 === 0
                      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.025))'
                      : 'linear-gradient(90deg, rgba(210, 210, 210, 0.07), rgba(255, 255, 255, 0.025))',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 44, sm: 58 },
                    height: { xs: 44, sm: 58 },
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.58)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'primary.light',
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
                    Step {index + 1}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 0.75 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Layout>
  );
}
