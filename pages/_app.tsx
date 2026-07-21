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
import { TestCaseBanner } from '../src/components/TestCaseBanner';
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
        <title>Fiducaro</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="FIDUCARO is a live Ethereum protocol for burying balances, retrieving hidden value, and projecting zero-net transfer signals onto the public record."
        />
        <meta property="og:title" content="FIDUCARO · Live on Ethereum" />
        <meta property="og:description" content="Bury value. Retrieve it. Disrupt the public record." />
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
              'radial-gradient(circle at 78% 6%, rgba(52, 224, 208, 0.16), transparent 32%), radial-gradient(circle at 10% 22%, rgba(52, 224, 208, 0.07), transparent 28%), radial-gradient(circle at 50% 120%, rgba(52, 224, 208, 0.05), transparent 40%), linear-gradient(180deg, #0B0D0E 0%, #101416 46%, #070909 100%)',
          }}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <WalletSession>
              <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
                <TopAppBar />
                <TestCaseBanner />
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
