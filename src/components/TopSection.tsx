import ArrowForward from '@mui/icons-material/ArrowForward';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { brand, pillars } from '../brand';

const TopSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: '74dvh' },
        mt: { xs: 1, md: 2 },
        mb: { xs: 7, md: 10 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '8px',
        backgroundColor: '#0A0A0A',
      }}
    >
      <Box
        component="img"
        src="/brand/ukulele-hero.png"
        alt="Black and white ukulele silhouette glowing in the dark"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: '58% center', md: 'center center' },
          opacity: { xs: 0.58, md: 0.72 },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.70) 42%, rgba(0, 0, 0, 0.18) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.74) 0%, rgba(0, 0, 0, 0.08) 58%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          px: { xs: 2.5, sm: 5, md: 7 },
          py: { xs: 7, sm: 8, md: 9 },
        }}
      >
        <Stack gap={{ xs: 4, md: 6 }} sx={{ maxWidth: 760 }}>
          <Stack gap={2.5}>
            <Typography
              component="p"
              variant="overline"
              color="primary.light"
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              {brand.tagline}
            </Typography>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: 58, sm: 88, md: 122 },
                maxWidth: 720,
              }}
            >
              {brand.name}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 620, fontWeight: 400, lineHeight: 1.55 }}
            >
              {brand.description}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Button href="/roadmap" variant="contained" size="large" endIcon={<ArrowForward />}>
              View Roadmap
            </Button>
            <Button href="/community#assets" variant="outlined" size="large" startIcon={<AutoAwesome />}>
              Brand Assets
            </Button>
          </Stack>

          <Grid container spacing={1.5} sx={{ maxWidth: 820 }}>
            {pillars.map((pillar) => (
              <Grid item xs={6} md={3} key={pillar.title}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 116,
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.48)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                    {pillar.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default TopSection;
