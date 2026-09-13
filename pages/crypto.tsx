import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { SwapHorizRounded, TimelineRounded, PeopleOutlineRounded, LockOutlined } from '@mui/icons-material';
import Bridge from './gasless';
import Activity from './activity';
import People from './people';
import styles from '../src/components/privacy.module.css';
import crypto from './crypto.module.css';

const sections = [
  { name: 'Bridge', detail: 'Between assets', icon: SwapHorizRounded },
  { name: 'Activity', detail: 'A clearer picture', icon: TimelineRounded },
  { name: 'People', detail: 'The privacy world', icon: PeopleOutlineRounded },
] as const;

export default function Crypto() {
  const [tab, setTab] = useState(0);
  const baseTheme = useTheme();
  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        palette: {
          primary: { main: '#b9e991', light: '#d1f3b5', dark: '#8fbc6b', contrastText: '#142211' },
          background: { paper: '#0d1b17' },
          text: { primary: '#e7eeea', secondary: '#95aa9c' },
        },
      }),
    [baseTheme],
  );
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Crypto · Fiducaro</title>
      </Head>
      <main className={`${styles.page} ${crypto.page}`}>
        <div className={styles.topline}>
          <span>FIDUCARO / CRYPTO</span>
          <span className={crypto.status}>
            <i /> NOT LIVE · CONCEPT PREVIEW
          </span>
        </div>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>THE NEXT CHAPTER. STILL TAKING SHAPE.</span>
            <h1>
              A bigger crypto world.
              <br />
              <em>A more private way through.</em>
            </h1>
            <p>
              Explore the bridge concept, the activity interface, and people in the privacy world. One space for what
              comes next.
            </p>
          </div>
          <div className={crypto.previewCard}>
            <LockOutlined />
            <span>
              LOOK AROUND.
              <br />
              <strong>Nothing moves here.</strong>
            </span>
            <p>No swaps, deposits, or transfers are available in Crypto.</p>
          </div>
        </header>
        <div className={`${styles.tabbar} ${crypto.tabs}`}>
          <div
            role="tablist"
            aria-label="Crypto sections"
          >
            {sections.map(({ name, detail, icon: Icon }, index) => (
              <button
                key={name}
                role="tab"
                id={`crypto-tab-${index}`}
                aria-selected={tab === index}
                aria-controls={`crypto-panel-${index}`}
                tabIndex={tab === index ? 0 : -1}
                className={tab === index ? styles.selected : ''}
                onClick={() => setTab(index)}
                onKeyDown={(event) => {
                  const next =
                    event.key === 'ArrowRight'
                      ? (index + 1) % 3
                      : event.key === 'ArrowLeft'
                        ? (index + 2) % 3
                        : event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? 2
                            : null;
                  if (next !== null) {
                    event.preventDefault();
                    setTab(next);
                    document.getElementById(`crypto-tab-${next}`)?.focus();
                  }
                }}
              >
                <Icon />
                {name}
                <small>{detail}</small>
              </button>
            ))}
          </div>
        </div>
        <p className={styles.liveNote}>
          <LockOutlined />
          Crypto is a preview, not a working financial service. For live FIDU Send and Decrypt,{' '}
          <Link href="/privacy">open Privacy ↗</Link>
        </p>
        <div
          className={crypto.content}
          role="tabpanel"
          id={`crypto-panel-${tab}`}
          aria-labelledby={`crypto-tab-${tab}`}
        >
          {tab === 0 ? <Bridge embedded /> : tab === 1 ? <Activity embedded /> : <People embedded />}
        </div>
      </main>
    </ThemeProvider>
  );
}
