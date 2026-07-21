import ZoomInRounded from '@mui/icons-material/ZoomInRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ZoomableImage } from './ZoomableImage';

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
    <ZoomableImage
      src={src}
      alt={alt}
      eager={eager}
      wrapperSx={{
        display: 'block',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: '#000000',
        transition: 'border-color 180ms ease, transform 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(52, 224, 208, 0.5)',
        },
      }}
      imageSx={{
          width: '100%',
          height: 'auto',
          aspectRatio: '1168 / 880',
          objectFit: 'contain',
      }}
    />
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 1.25 }}>
      <Typography component="figcaption" variant="body2" color="text.secondary">
        {caption}
      </Typography>
      <ZoomInRounded aria-hidden="true" sx={{ ml: 'auto', flex: '0 0 auto', fontSize: 19 }} />
    </Stack>
  </Box>
);
