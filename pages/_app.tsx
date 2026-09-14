import localFont from 'next/font/local';
import './global.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Web3ReactProvider } from '@web3-react/core';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import { ethers } from 'ethers';

import createEmotionCache from '../src/createEmotionCache';
import { Footer } from '../src/Footer';
import { TopAppBar } from '../src/AppBar';
import { brand } from '../src/brand';
import theme from '../src/theme';

const clientSideEmotionCache = createEmotionCache();
const montserratFont = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const getLibrary = (provider: any) => new ethers.providers.Web3Provider(provider, 'any');

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, router } = props;
  const isPrivateArchive = router.pathname === '/unseen';

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Fiducaro</title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content={brand.description}
        />
        <meta
          property="og:title"
          content={`FIDUCARO · ${brand.tagline}`}
        />
        <meta
          property="og:description"
          content={brand.description}
        />
        <meta
          property="og:image"
          content="/brand/fiducaro-dark-wallpaper.webp"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { '--font-montserrat': montserratFont.style.fontFamily } }} />
        <Box
          sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: 'background.default',
            backgroundImage:
              'radial-gradient(ellipse at 78% 6%, rgba(225, 228, 233, 0.07), transparent 38%), linear-gradient(180deg, #060c10 0%, #0b1419 46%, #03080b 100%)',
          }}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <a
              className="skip-link"
              href="#main-content"
            >
              Skip to content
            </a>
            <Box sx={{ width: '100%' }}>
              {!isPrivateArchive && <TopAppBar />}
              <div
                id="main-content"
                tabIndex={-1}
              >
                <Component {...pageProps} />
              </div>
            </Box>
            {!isPrivateArchive && <Footer />}
          </Web3ReactProvider>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
