import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Link from '../Link';

const TopSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 1120,
        mx: 'auto',
        mt: { xs: 1, md: 2 },
        mb: { xs: 7, md: 10 },
        overflow: 'hidden',
        border: '1px solid rgba(104, 199, 107, 0.22)',
        borderRadius: '8px',
        background:
          'radial-gradient(circle at 72% 24%, rgba(20, 116, 75, 0.2), transparent 36%), radial-gradient(circle at 38% 48%, rgba(17, 75, 54, 0.14), transparent 42%), #020604',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.55), inset 0 0 120px rgba(104, 199, 107, 0.06)',
      }}
    >
      <Box
        component="img"
        src="/brand/fiducaro-hero-o3.webp"
        alt="Neon green Fiducaro spacecraft with the Fiducaro emblem and wordmark"
        sx={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: '1376 / 768',
          objectFit: 'contain',
          objectPosition: 'center',
          backgroundColor: '#020604',
          filter: 'drop-shadow(0 0 28px rgba(43, 244, 130, 0.12))',
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={1.5}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: { xs: 10, sm: 20, md: 26 },
          left: { xs: 10, sm: 20, md: 26 },
          alignItems: { xs: 'stretch', sm: 'center' },
          maxWidth: { xs: 'calc(100% - 20px)', sm: 'none' },
        }}
      >
        <Button
          component={Link}
          href="/whitepaper/obscura-covenant.pdf"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="medium"
          endIcon={<ArrowForward />}
          sx={{ backgroundColor: 'rgba(5, 12, 7, 0.84)', backdropFilter: 'blur(10px)' }}
        >
          Obscura Covenant Document
        </Button>
        <Button
          component={Link}
          href="https://omnione.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size="medium"
          endIcon={<ArrowForward />}
          sx={{ backgroundColor: 'rgba(2, 6, 3, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          OmniOne Bank
        </Button>
      </Stack>
    </Box>
  );
};

export default TopSection;
