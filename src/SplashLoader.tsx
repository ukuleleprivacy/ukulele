import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

const SplashLoader = ({ videoVisible, setVideoVisible }: any) => {
  const [splashVisible, setSplashVisible] = useState(true);

  const handleSplashEnd = () => {
    setSplashVisible(false);
    setTimeout(() => {
      setVideoVisible(false);
    }, 240);
  };

  useEffect(() => {
    const timer = window.setTimeout(handleSplashEnd, 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Fade in={videoVisible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          color: 'text.primary',
          background:
            'radial-gradient(circle at 50% 42%, rgba(102, 255, 138, 0.2), transparent 34%), #0B0D0E',
        }}
      >
        <Fade in={splashVisible}>
          <Box>
            <Box
              component="img"
              src="/brand/fiducaro-logo-with-text.png"
              alt="FIDUCARO"
              sx={{
                display: 'block',
                width: { xs: 210, sm: 260 },
                height: { xs: 210, sm: 260 },
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 24px rgba(102, 255, 138, 0.45))',
              }}
            />
          </Box>
        </Fade>
      </Box>
    </Fade>
  );
};

export default SplashLoader;
