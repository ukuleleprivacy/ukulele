import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ZoomableImage } from './ZoomableImage';

interface FeatureSectionProps {
  kicker?: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  points?: string[];
  reverse?: boolean;
  containImage?: boolean;
  showBrandMark?: boolean;
  showImageOverlay?: boolean;
}

const FeatureSection = ({
  kicker,
  title,
  description,
  imageSrc,
  imageAlt,
  videoSrc,
  points = [],
  reverse = false,
  containImage = false,
  showBrandMark = true,
  showImageOverlay = true,
}: FeatureSectionProps) => (
  <Box
    component="section"
    sx={{
      py: { xs: 4, md: 7 },
    }}
  >
    <Grid
      container
      spacing={{ xs: 4, md: 7 }}
      alignItems="center"
      sx={{
        flexDirection: {
          xs: 'column',
          md: reverse ? 'row-reverse' : 'row',
        },
      }}
    >
      <Grid item xs={12} md={6}>
        <Stack gap={2.2}>
          {kicker ? (
            <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
              {kicker}
            </Typography>
          ) : null}
          <Typography variant="h3" component="h2" sx={{ maxWidth: 620 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
            {description}
          </Typography>
          {points.length ? (
            <Stack gap={1.2} sx={{ pt: 1 }}>
              {points.map((point) => (
                <Stack key={point} direction="row" gap={1.25} alignItems="flex-start">
                  <CheckCircleOutline color="primary" sx={{ mt: 0.2, flex: '0 0 auto' }} />
                  <Typography color="text.secondary">{point}</Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 280, sm: 360, md: 430 },
            overflow: 'hidden',
            borderRadius: '8px',
            border: '1px solid rgba(52, 224, 208, 0.16)',
            background:
              'radial-gradient(circle at 50% 38%, rgba(52, 224, 208, 0.22), transparent 36%), linear-gradient(135deg, rgba(52, 224, 208, 0.06), rgba(255, 255, 255, 0.02))',
          }}
        >
          {videoSrc ? (
            <Box
              component="video"
              src={videoSrc}
              muted
              loop
              playsInline
              autoPlay
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.64,
              }}
            />
          ) : imageSrc ? (
            <ZoomableImage
              src={imageSrc}
              alt={imageAlt || title}
              wrapperSx={{
                position: 'absolute',
                inset: 0,
                height: '100%',
              }}
              imageSx={{
                width: '100%',
                height: '100%',
                objectFit: containImage ? 'contain' : 'cover',
                opacity: containImage ? 1 : 0.84,
              }}
            />
          ) : null}
          {showImageOverlay ? (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.72) 100%)',
                pointerEvents: 'none',
              }}
            />
          ) : null}
          {showBrandMark ? (
            <Box
              component="img"
              src="/brand/logo-mark.png"
              alt=""
              aria-hidden="true"
              sx={{
                position: 'absolute',
                width: { xs: 138, md: 184 },
                height: { xs: 138, md: 184 },
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 34px rgba(52, 224, 208, 0.5))',
                animation: 'fiducaroFloat 7s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          ) : null}
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default FeatureSection;
