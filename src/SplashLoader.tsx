import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import { brand } from './brand';

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
            'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.22), transparent 32%), #0A0A0A',
        }}
      >
        <Fade in={splashVisible}>
          <Box>
            <Box
              component="img"
              src="/01.png"
              alt=""
              aria-hidden="true"
              sx={{ width: 108, height: 108, mb: 2 }}
            />
            <Typography variant="h5">{brand.name}</Typography>
          </Box>
        </Fade>
      </Box>
    </Fade>
  );
};

export default SplashLoader;
