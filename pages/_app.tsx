import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './global.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Web3ReactProvider } from '@web3-react/core';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ethers } from 'ethers';

import createEmotionCache from '../src/createEmotionCache';
import { Footer } from '../src/Footer';
import { TopAppBar } from '../src/AppBar';
import { WalletSession } from '../src/components/WalletSession';
import theme from '../src/theme';

const clientSideEmotionCache = createEmotionCache();

const getLibrary = (provider: any) => new ethers.providers.Web3Provider(provider, 'any');

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Ukulele</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="UKULELE is a privacy-first digital currency brand with a premium monochrome identity in pure black and white."
        />
        <meta property="og:title" content="Ukulele" />
        <meta property="og:description" content="Private by default." />
        <meta property="og:image" content="/brand/social-banner.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: 'background.default',
            backgroundImage:
              'radial-gradient(circle at 75% 8%, rgba(255, 255, 255, 0.18), transparent 30%), radial-gradient(circle at 12% 28%, rgba(210, 210, 210, 0.08), transparent 25%), linear-gradient(180deg, #0A0A0A 0%, #101010 44%, #070707 100%)',
          }}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <WalletSession>
              <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
                <TopAppBar />
                <Component {...pageProps} />
              </Container>
              <Footer />
            </WalletSession>
          </Web3ReactProvider>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
