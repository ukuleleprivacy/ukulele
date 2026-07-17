import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Link from '../Link';

type TechnicalArtworkProps = {
  src: string;
  alt: string;
  caption: string;
  eager?: boolean;
};

export const TechnicalArtwork = ({
  src,
  alt,
  caption,
  eager = false,
}: TechnicalArtworkProps) => (
  <Box
    component="figure"
    sx={{
      width: '100%',
      maxWidth: { md: 720 },
      mx: 'auto',
      my: 0,
    }}
  >
    <Box
      component={Link}
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${caption} Open the full-resolution image.`}
      sx={{
        display: 'block',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        backgroundColor: '#000000',
        transition: 'border-color 180ms ease, transform 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(255, 255, 255, 0.46)',
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sx={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: '1168 / 880',
          objectFit: 'contain',
        }}
      />
    </Box>
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 1.25 }}>
      <Typography component="figcaption" variant="body2" color="text.secondary">
        {caption}
      </Typography>
      <OpenInNewRounded aria-hidden="true" sx={{ ml: 'auto', flex: '0 0 auto', fontSize: 17 }} />
    </Stack>
  </Box>
);
