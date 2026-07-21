import CloseRounded from '@mui/icons-material/CloseRounded';
import ZoomInRounded from '@mui/icons-material/ZoomInRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

type ZoomableImageProps = {
  src: string;
  alt: string;
  eager?: boolean;
  wrapperSx?: Record<string, unknown>;
  imageSx?: Record<string, unknown>;
};

export const ZoomableImage = ({
  src,
  alt,
  eager = false,
  wrapperSx = {},
  imageSx = {},
}: ZoomableImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label={`Enlarge image: ${alt}`}
        onClick={() => setOpen(true)}
        sx={{
          all: 'unset',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'block',
          width: '100%',
          cursor: 'zoom-in',
          WebkitTapHighlightColor: 'transparent',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            border: '1px solid transparent',
            pointerEvents: 'none',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
          },
          '&:hover::after, &:focus-visible::after': {
            borderColor: 'rgba(52, 224, 208, 0.78)',
            boxShadow: '0 0 0 3px rgba(52, 224, 208, 0.15), 0 0 30px rgba(52, 224, 208, 0.18)',
          },
          '&:focus-visible': {
            outline: 'none',
          },
          '& .zoomable-image-hint': {
            opacity: 0.78,
            transform: 'translateY(0)',
          },
          '&:hover .zoomable-image-hint, &:focus-visible .zoomable-image-hint': {
            opacity: 1,
            transform: 'translateY(-2px)',
            backgroundColor: 'rgba(52, 224, 208, 0.95)',
            color: '#07100F',
          },
          ...wrapperSx,
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          sx={{ display: 'block', width: '100%', height: 'auto', ...imageSx }}
        />
        <Box
          className="zoomable-image-hint"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            display: 'grid',
            placeItems: 'center',
            width: 38,
            height: 38,
            borderRadius: '50%',
            color: '#EDF1F2',
            backgroundColor: 'rgba(5, 8, 8, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            pointerEvents: 'none',
            transition: 'opacity 180ms ease, transform 180ms ease, background-color 180ms ease, color 180ms ease',
          }}
        >
          <ZoomInRounded sx={{ fontSize: 22 }} />
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-label={`Expanded image: ${alt}`}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(7px)',
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1.5, sm: 3.5 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            outline: 'none',
          }}
        >
          <Box
            component="img"
            src={src}
            alt={alt}
            draggable={false}
            sx={{
              display: 'block',
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: 'calc(100vh - 24px)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid rgba(52, 224, 208, 0.55)',
              backgroundColor: '#000000',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 80px rgba(0, 0, 0, 0.8)',
              animation: 'fiducaroImageReveal 180ms ease-out',
              '@keyframes fiducaroImageReveal': {
                from: { opacity: 0, transform: 'scale(0.96)' },
                to: { opacity: 1, transform: 'scale(1)' },
              },
            }}
          />
          <IconButton
            type="button"
            aria-label="Close enlarged image"
            onClick={() => setOpen(false)}
            sx={{
              position: 'fixed',
              top: { xs: 12, sm: 22 },
              right: { xs: 12, sm: 22 },
              zIndex: 1,
              width: 48,
              height: 48,
              color: '#EDF1F2',
              backgroundColor: 'rgba(10, 13, 14, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              '&:hover': {
                color: '#07100F',
                backgroundColor: 'primary.main',
              },
            }}
          >
            <CloseRounded />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
};

