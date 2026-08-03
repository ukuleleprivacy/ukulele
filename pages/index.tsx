import { keyframes } from '@emotion/react';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import ArrowForward from '@mui/icons-material/ArrowForward';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useState } from 'react';

import { pillars, roadmap } from '../src/brand';
import { FaucetClaimButton } from '../src/components/FaucetClaimButton';
import TopSection from '../src/components/TopSection';
import { ZoomableImage } from '../src/components/ZoomableImage';
import { Layout } from '../src/Layout';
import Link from '../src/Link';
import { fiducaroToken } from '../src/token';

const pillarIcons = [
  '/icons/pillar-engine.webp',
  '/icons/pillar-automation.webp',
  '/icons/pillar-support.webp',
  '/icons/pillar-stake.webp',
];

const tokenFacts = [
  { label: 'Network', value: fiducaroToken.network },
  { label: 'Token', value: fiducaroToken.symbol },
  { label: 'Decimals', value: String(fiducaroToken.decimals) },
  { label: 'Total supply', value: `${fiducaroToken.totalSupply.toLocaleString('en-US')} FIDU` },
  { label: 'Execution', value: 'On-chain' },
];

const livePulse = keyframes`
  0%, 100% {
    opacity: 0.45;
    transform: scale(0.86);
    box-shadow: 0 0 0 0 rgba(102, 255, 138, 0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(102, 255, 138, 0);
  }
`;

const userFlow = [
  {
    title: 'On-Chain',
    description:
      'No hidden bs, no nonsense, no tracking of your assets. Just pure privacy. Plug and play. You can even host the website or platform yourself.',
  },
  {
    title: 'Bury',
    description:
      'Once you send FIDU, your entire balance disappears, then you can decrypt portions or all of it entirely. Go ahead and try it - the privacy aspect work right now and are fully testable. See if you can crack it - go ahead. Waste your time.',
  },
  {
    title: 'Stake',
    description:
      'The full release of the FIDU network will allow you to transfer or stake and transfer to any asset class; ETH -> BTC, BTC -> SOL, XRP -> USDT, etc, etc. With public assets backing the bridge and the Fiducaro engine running the private layer.',
  },
  {
    title: 'Disrupt',
    description:
      'Cast a decoy balance transfer from one party to another onto Etherscan. The event is real and visible; the temporary balance movement collapses back to zero.',
  },
];

export default function Home() {
  const [walletAssetMessage, setWalletAssetMessage] = useState('');
  const [faucetBalance, setFaucetBalance] = useState<string | null>(null);

  const addFiduToMetaMask = async () => {
    const ethereum = (
      window as typeof window & {
        ethereum?: {
          request: (request: { method: string; params?: unknown }) => Promise<unknown>;
        };
      }
    ).ethereum;

    if (!ethereum?.request) {
      setWalletAssetMessage('MetaMask is not available in this browser.');
      return;
    }

    try {
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: fiducaroToken.address,
            symbol: fiducaroToken.symbol,
            decimals: fiducaroToken.decimals,
          },
        },
      });

      setWalletAssetMessage(
        wasAdded ? 'FIDU was added to MetaMask.' : 'The MetaMask request was cancelled.',
      );
    } catch {
      setWalletAssetMessage('FIDU could not be added to MetaMask. Please try again.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Fiducaro</title>
      </Head>

      <TopSection />

      <Box component="section" sx={{ mb: { xs: 8, md: 4 } }}>
        <Grid container spacing={1.5}>
          {pillars.map((pillar, index) => {
            const iconSrc = pillarIcons[index] || pillarIcons[0];

            return (
              <Grid item xs={12} sm={6} md={3} key={pillar.title}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 390,
                    p: 3,
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.018))',
                    transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: 'rgba(102, 255, 138, 0.4)',
                      boxShadow: '0 0 26px rgba(102, 255, 138, 0.12)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    sx={{
                      display: 'block',
                      width: 84,
                      height: 84,
                      mb: 2,
                      objectFit: 'contain',
                      objectPosition: 'left center',
                      filter:
                        'grayscale(1) sepia(1) saturate(8) hue-rotate(72deg) brightness(1.3) drop-shadow(0 0 12px rgba(102, 255, 138, 0.42))',
                    }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pillar.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box
        component="section"
        id="how-it-works"
        sx={{ pt: { xs: 7, md: 4 }, pb: { xs: 7, md: 10 } }}
      >
        <Stack gap={2} sx={{ maxWidth: 780, mb: 4 }}>
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            The FIDUCARO Command Sequence
          </Typography>
          <Typography variant="h2" component="h2">
            Claim Your FIDU. Then Send a Disrupting Transaction. Test the Privacy Itself.
          </Typography>
          <Typography color="text.secondary">
            FIDUCARO runs on an elite smart contract engine which took four years to develop, bought
            for a a firesale price, the engine is being refitted to make the most extensive, advanced
            and ready player one bridge available - one that all can participate in; either by
            staking or utilizing.
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {userFlow.map((item, index) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 220,
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                }}
              >
                <Typography variant="overline" color="primary.light" fontWeight="700">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.75, mb: 1.25 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

      </Box>

      <Box
        component="section"
        id="whitepaper"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          my: { xs: 7, md: 11 },
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: '8px',
          border: '1px solid rgba(102, 255, 138, 0.22)',
          background:
            'radial-gradient(circle at 90% 15%, rgba(102, 255, 138, 0.18), transparent 34%), linear-gradient(180deg, rgba(102, 255, 138, 0.04), rgba(255, 255, 255, 0.02))',
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Grid item xs={12} md={4}>
            <Stack gap={2} alignItems="flex-start">
              <Typography variant="overline" color="primary.light" fontWeight="700">
                The Obscura Protocol · Futurist Paper 0.1
              </Typography>
              <Typography variant="h3" component="h2">
                The Obscura Protocol
              </Typography>
              <Typography color="text.secondary">
                A futurist manifesto for financial sovereignty in a world of total visibility. It
                looks beyond today’s interface toward private value, sovereign identity,
                adversarial public signals, and a parallel architecture built for the world
                ahead—not the system already failing behind us.
              </Typography>
              <Button
                component={Link}
                href="/whitepaper/obscura-protocol.txt"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                endIcon={<OpenInNew />}
                sx={{ minHeight: 52, px: 3, borderRadius: 999 }}
              >
                Open The Obscura Protocol
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              id="audiobook"
              sx={{
                overflow: 'hidden',
                borderRadius: '8px',
                border: '1px solid rgba(102, 255, 138, 0.32)',
                backgroundColor: '#000000',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.5), 0 0 36px rgba(102, 255, 138, 0.08)',
              }}
            >
              <Box
                component="iframe"
                src="https://www.youtube-nocookie.com/embed/TqpJNWg7wQs"
                title="The Obscura Covenant audiobook"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                sx={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  border: 0,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" id="token" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack gap={2} sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Typography variant="h3" component="h2">
              FIDU is live and operational
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                flex: '0 0 auto',
                borderRadius: 999,
                border: '1px solid rgba(102, 255, 138, 0.3)',
                backgroundColor: 'rgba(102, 255, 138, 0.08)',
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  animation: `${livePulse} 1.5s ease-in-out infinite`,
                }}
              />
              <Typography variant="caption" color="primary.light" fontWeight="700">
                Live on Ethereum
              </Typography>
            </Box>
          </Stack>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            The protocol is deployed and ready. Connect your wallet to bury value through SEND,
            unbury a hidden balance through Decrypt, or project a decoy zero-net transfer onto
            Etherscan through Disruptor.
          </Typography>
        </Stack>

        <Box
          sx={{
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.035)',
          }}
        >
          <Grid container>
            {tokenFacts.map((fact) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={12 / tokenFacts.length}
                key={fact.label}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.08)', md: 0 },
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {fact.label}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700, overflowWrap: 'anywhere' }}>
                  {fact.value}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary" fontWeight="700">
                FIDU remaining in the Faucet
              </Typography>
              <Typography
                sx={{ mt: 0.35, mb: 2, color: 'primary.light', fontWeight: 700 }}
              >
                {faucetBalance === null ? 'Loading faucet balance…' : `${faucetBalance} FIDU`}
              </Typography>
              <Typography variant="overline" color="text.secondary" fontWeight="700">
                Ethereum token address
              </Typography>
              <Typography
                component="code"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: 'text.primary',
                  fontFamily: 'monospace',
                  fontSize: { xs: '0.76rem', sm: '0.92rem' },
                  overflowWrap: 'anywhere',
                }}
              >
                {fiducaroToken.address}
              </Typography>
            </Box>
            <Stack
              gap={0.9}
              alignItems={{ xs: 'stretch', md: 'flex-end' }}
              sx={{ width: { xs: '100%', md: 330 }, flex: '0 0 auto' }}
            >
              <Button
                type="button"
                variant="contained"
                fullWidth
                startIcon={<AccountBalanceWallet />}
                onClick={addFiduToMetaMask}
                sx={{ flex: '0 0 auto' }}
              >
                Add FIDU to MetaMask
              </Button>
              <FaucetClaimButton onBalanceChange={setFaucetBalance} />
              {walletAssetMessage && (
                <Typography variant="caption" color="text.secondary" role="status">
                  {walletAssetMessage}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack
          gap={2.2}
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}
        >
          <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700 }}>
            How does it work?
          </Typography>
          <Typography variant="h3" component="h2">
            Commit private value with irreversible on-chain finality
          </Typography>
          <Typography color="text.secondary">
            A one way hash function which gets destroyed after finality; think of Fiducaro’s privacy
            as a type of Zk-Snark with destruction of the note after the fact. The difference between
            it and other traditional Zk-Snark technology such as Z-cash, is that Fiducaro has the
            added benefit of changing liquidity, meaning that after the traditional Zk-snark
            technology, it has the added benefit of being mixed in with traditional buys and sells.
          </Typography>
        </Stack>

        <Box
          sx={{
            width: '100%',
            maxWidth: 1040,
            mx: 'auto',
            overflow: 'hidden',
            borderRadius: '8px',
            border: '1px solid rgba(102, 255, 138, 0.24)',
            backgroundColor: '#000000',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.48)',
          }}
        >
          <ZoomableImage
            src="/technical/zk-snark-private-route.png"
            alt="Zk-SNARK private route through PART I and PART II followed by destruction"
            wrapperSx={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#000000',
            }}
            imageSx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              backgroundColor: '#000000',
            }}
          />
        </Box>

        <Stack gap={1.5} sx={{ maxWidth: 1040, mx: 'auto', mt: 3 }}>
          {[
            'The Zk-Snark technology is split into two parts; PART I and PART II where PART I opens the private route; PART II seals it and then destroys it. Once both confirmations resolve on chain, the user must decrypt their balance over time.',
            'The future bridge updates will include the transfer of assets, from one asset class to another or the same, meaning BTC can be converted privately to BTC as well - with the private send being offered at no additional discount.',
            'Essentially, a user will select one asset, then another that they wish to transfer it to and based on traffic will be given a set time and then have their assets sent to several different wallets. After the completion period, the user can collect their tokens or coins. Stakers will be incentivized to leave their assets so that they can be swapped over (for example an ETH staked user can swap their ETH into BTC as someone with BTC converts to ETH).',
          ].map((paragraph, index) => (
            <Box
              key={paragraph}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '48px 1fr', sm: '64px 1fr' },
                gap: 2,
                p: { xs: 2.5, sm: 3 },
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(102, 255, 138, 0.14)',
                  border: '1px solid rgba(102, 255, 138, 0.35)',
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Box>
              <Typography color="text.secondary">{paragraph}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1040,
            mx: 'auto',
            mb: { xs: 5, md: 7 },
            overflow: 'hidden',
            borderRadius: '8px',
            border: '1px solid rgba(102, 255, 138, 0.2)',
            backgroundColor: '#020905',
          }}
        >
          <ZoomableImage
            src="/technical/future-bridge-updates.png"
            alt="Future bridge updates from BTC through an ETH staker bridge into ETH"
            wrapperSx={{ display: 'block', width: '100%', borderRadius: '8px' }}
            imageSx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </Box>

        <Stack gap={1.5} sx={{ width: '100%', maxWidth: 1040, mx: 'auto' }}>
          {roadmap.slice(0, 4).map((item, index) => (
                <Box
                  key={item.title}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '48px 1fr', sm: '64px 1fr' },
                    gap: 2,
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(102, 255, 138, 0.14)',
                      border: '1px solid rgba(102, 255, 138, 0.35)',
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography
                      variant="overline"
                      color="primary.light"
                      sx={{ display: 'block', mt: 1.5, fontWeight: 700 }}
                    >
                      {item.nextTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.nextDescription}
                    </Typography>
                  </Box>
                </Box>
          ))}
        </Stack>
      </Box>

    </Layout>
  );
}
