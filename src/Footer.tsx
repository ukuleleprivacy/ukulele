import Box from '@mui/material/Box';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
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
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 8, 11, 0.88) 32%, #03080b 100%)',
    }}
  >
    <Container maxWidth="lg">
      <Stack gap={2.5} sx={{ maxWidth: 720 }}>
        <Logo />
        <Typography color="text.secondary">
          Fiducaro is a live Ethereum protocol for private transfers. Send FIDU privately and
          restore all or part of your private balance to your public wallet.
        </Typography>
      </Stack>

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
            sx={{ color: 'primary.main', border: '1px solid rgba(104, 199, 107,.24)', '&:hover': { backgroundColor: 'rgba(104, 199, 107,.1)', boxShadow: '0 0 18px rgba(104, 199, 107,.18)' } }}
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
                textShadow: '0 0 14px rgba(104, 199, 107, 0.55)',
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
