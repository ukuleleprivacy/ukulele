import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './global.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Web3ReactProvider } from '@web3-react/core';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ethers } from 'ethers';

import createEmotionCache from '../src/createEmotionCache';
import { Footer } from '../src/Footer';
import { TopAppBar } from '../src/AppBar';
import { brand } from '../src/brand';
import { WalletSession } from '../src/components/WalletSession';
import theme from '../src/theme';

const clientSideEmotionCache = createEmotionCache();

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
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content={brand.description}
        />
        <meta property="og:title" content={`FIDUCARO · ${brand.tagline}`} />
        <meta property="og:description" content={brand.description} />
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
              'radial-gradient(circle at 78% 6%, rgba(102, 255, 138, 0.14), transparent 32%), radial-gradient(circle at 10% 22%, rgba(102, 255, 138, 0.06), transparent 28%), radial-gradient(circle at 50% 120%, rgba(102, 255, 138, 0.045), transparent 40%), linear-gradient(180deg, #010403 0%, #040A06 46%, #000201 100%)',
          }}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <WalletSession>
              <Box sx={{ width: '100%' }}>
                {!isPrivateArchive && <TopAppBar />}
                <Component {...pageProps} />
              </Box>
              {!isPrivateArchive && <Footer />}
            </WalletSession>
          </Web3ReactProvider>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
