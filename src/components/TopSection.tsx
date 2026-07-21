import ArrowForward from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { brand, pillars } from '../brand';
import Link from '../Link';

const TopSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: '58dvh' },
        mt: { xs: 1, md: 2 },
        mb: { xs: 7, md: 10 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(52, 224, 208, 0.22)',
        borderRadius: '8px',
        backgroundColor: '#07100F',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.55), inset 0 0 120px rgba(52, 224, 208, 0.06)',
      }}
    >
      <Box
        component="img"
        src="/brand/hero-obsidian.webp"
        alt="Obsidian architectural blocks lit by neon teal seams in the dark"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: '68% center', md: 'center center' },
          opacity: { xs: 0.5, md: 0.82 },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(7, 12, 13, 0.96) 0%, rgba(7, 12, 13, 0.74) 44%, rgba(7, 12, 13, 0.14) 100%), linear-gradient(0deg, rgba(7, 12, 13, 0.78) 0%, rgba(7, 12, 13, 0.05) 60%), radial-gradient(circle at 88% 40%, rgba(52, 224, 208, 0.14), transparent 42%)',
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
            <Button
              variant="contained"
              size="large"
              disabled
            >
              FIDU Access
            </Button>
            <Button
              component={Link}
              href="/platform"
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
            >
              Open FIDUCARO
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
                    border: '1px solid rgba(52, 224, 208, 0.18)',
                    backgroundColor: 'rgba(7, 12, 13, 0.55)',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      borderColor: 'rgba(52, 224, 208, 0.5)',
                      boxShadow: '0 0 24px rgba(52, 224, 208, 0.12)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700, color: 'primary.light' }}>
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
