import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { brand } from './brand';
import Link from './Link';

export const LogoMark = ({ size = 52 }: { size?: number }) => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      width: size,
      height: size,
      flex: '0 0 auto',
      display: 'block',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundImage: 'url(/brand/ukulele-logo.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: '0 0 32px rgba(255, 255, 255, 0.25)',
    }}
  />
);

export const Logo = () => (
  <Link href="/" aria-label={`${brand.name} home`}>
    <Stack
      direction="row"
      alignItems="center"
      gap={1.4}
      sx={{
        color: 'text.primary',
        transition: 'opacity 180ms ease, transform 180ms ease',
        '&:hover': {
          opacity: 0.86,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <LogoMark />
      <Typography
        variant="h5"
        component="span"
        sx={{
          display: { xs: 'none', sm: 'block' },
          color: 'inherit',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {brand.name}
      </Typography>
    </Stack>
  </Link>
);
