import Telegram from '@mui/icons-material/Telegram';
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
            <Stack direction="row" gap={1} flexWrap="wrap">
              {Object.entries(brand.palette).slice(0, 5).map(([name, value]) => (
                <Box
                  key={name}
                  title={`${name}: ${value}`}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    backgroundColor: value,
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle2" color="text.primary" sx={{ mb: 2, fontWeight: 700 }}>
            Social
          </Typography>
          <Stack gap={1.2}>
            <Tooltip title="Telegram" arrow>
              <IconButton
                component={Link}
                href={brand.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UKULELE Telegram"
                sx={{
                  mt: 1,
                  width: 46,
                  height: 46,
                  color: 'text.primary',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '&:hover': {
                    color: 'primary.light',
                    borderColor: 'rgba(255, 255, 255, 0.55)',
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  },
                }}
              >
                <Telegram />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 7,
          pt: 3,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          UKULELE - Private by Default.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Financial sanctuary on Ethereum.
        </Typography>
      </Box>
    </Container>
  </Box>
);
