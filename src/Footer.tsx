import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { brand } from './brand';
import Link from './Link';
import { Logo } from './Logo';

export const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 'auto',
      pt: { xs: 8, md: 12 },
      pb: 6,
      background:
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(5, 5, 5, 0.88) 32%, #050505 100%)',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={{ xs: 5, md: 8 }} justifyContent="space-between">
        <Grid item xs={12} md={5}>
          <Stack gap={2.5}>
            <Logo />
            <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
              {brand.description}
            </Typography>
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={2}
          sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
        >
          <Stack alignItems="center" gap={0.25}>
            <Tooltip title="OmniOne Bank" arrow>
              <IconButton
                component={Link}
                href={brand.omniOneUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit OmniOne Bank"
                sx={{
                  width: { xs: 124, sm: 160 },
                  height: { xs: 124, sm: 160 },
                  p: 0,
                  border: 0,
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  transition: 'transform 180ms ease, filter 180ms ease',
                  '&:hover, &:focus-visible': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(-3px) scale(1.03)',
                    filter: 'brightness(1.18)',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/brand/omnione-bank-pyramid.png"
                  alt=""
                  aria-hidden="true"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 16px rgba(104, 220, 255, 0.34))',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle2" color="text.primary" fontWeight="700">
              OmniOne
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 7,
          pt: 3,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {brand.tagline}
        </Typography>
      </Box>
    </Container>
  </Box>
);
