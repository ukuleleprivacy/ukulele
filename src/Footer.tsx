import Box from '@mui/material/Box';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FaTelegramPlane } from 'react-icons/fa';

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
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(37, 38, 42, 0.88) 32%, #25262a 100%)',
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
                  width: { xs: 64, sm: 80 },
                  height: { xs: 64, sm: 80 },
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
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {brand.tagline}
        </Typography>
        <Tooltip title="Join Fiducaro on Telegram" arrow>
          <IconButton
            component="a"
            href={brand.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Fiducaro on Telegram"
            sx={{ color: 'primary.main', border: '1px solid rgba(167, 215, 160,.24)', '&:hover': { backgroundColor: 'rgba(167, 215, 160,.1)', boxShadow: '0 0 18px rgba(167, 215, 160,.18)' } }}
          >
            <FaTelegramPlane size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Private investor access" arrow>
          <Box
            component={Link}
            href="/unseen"
            rel="nofollow"
            prefetch={false}
            aria-label="Private investor access"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              flex: '0 0 auto',
              color: 'rgba(237, 241, 242, 0.36)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'color 180ms ease, text-shadow 180ms ease',
              '&:hover, &:focus-visible': {
                color: 'primary.main',
                textShadow: '0 0 14px rgba(167, 215, 160, 0.55)',
              },
            }}
          >
            <LockOutlined sx={{ fontSize: 14 }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Private access
            </Box>
          </Box>
        </Tooltip>
      </Box>
    </Container>
  </Box>
);
