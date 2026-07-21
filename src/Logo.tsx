import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { brand } from './brand';
import Link from './Link';

export const LogoMark = ({ size = 46 }: { size?: number }) => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      width: size,
      height: size,
      flex: '0 0 auto',
      display: 'block',
      backgroundImage: 'url(/brand/logo-mark.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'drop-shadow(0 0 14px rgba(52, 224, 208, 0.45))',
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
