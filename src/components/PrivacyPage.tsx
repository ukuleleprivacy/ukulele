import { useState } from 'react';
import Head from 'next/head';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { LockOutlined, NorthEastRounded, SouthWestRounded } from '@mui/icons-material';
import { PrivacySend } from './PrivacySend';
import { PrivacyDecrypt } from './PrivacyDecrypt';
import { ConnectWallet } from './ConnectWallet';
import { fiducaroToken } from '../token';
import styles from './privacy.module.css';

export function PrivacyPage({ initialTab = 'send' }: { initialTab?: 'send' | 'decrypt' }) {
  const [tab, setTab] = useState(initialTab);
  const [sendBusy, setSendBusy] = useState(false);
  const [decryptBusy, setDecryptBusy] = useState(false);
  const theme = useTheme();
  const privacyTheme = createTheme(theme, { palette: { primary: { main: '#b9e991', contrastText: '#142211' } } });
  return (
    <ThemeProvider theme={privacyTheme}>
      <Head>
        <title>Privacy · Fiducaro</title>
        <meta
          name="description"
          content="Send FIDU privately or decrypt a selected balance with Fiducaro’s live Ethereum token flows."
        />
      </Head>
      <main className={styles.page}>
        <div className={styles.topline}>
          <span>FIDUCARO / PRIVACY</span>
          <span className={styles.tokenStatus}>
            <a
              href={`https://etherscan.io/token/${fiducaroToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              FIDU token ↗
            </a>
            <span>
              <i /> ETHEREUM MAINNET · LIVE
            </span>
          </span>
        </div>
        <div className={styles.tabbar}>
          <div
            role="tablist"
            aria-label="FIDU privacy tools"
          >
            {(['send', 'decrypt'] as const).map((value) => (
              <button
                key={value}
                type="button"
                id={`privacy-${value}-tab`}
                role="tab"
                aria-selected={tab === value}
                aria-controls={`privacy-${value}-panel`}
                disabled={(sendBusy || decryptBusy) && tab !== value}
                className={tab === value ? styles.selected : ''}
                onClick={() => setTab(value)}
              >
                {value === 'send' ? <NorthEastRounded /> : <SouthWestRounded />}
                {value === 'send' ? 'Send' : 'Decrypt'}
                <small>{value === 'send' ? 'Move into private state' : 'Return to public state'}</small>
              </button>
            ))}
          </div>
          <ConnectWallet />
        </div>
        <div className={styles.liveNote}>
          <LockOutlined />
          <span>
            Live FIDU transactions. Wallet approval and ETH gas are required.
            {(sendBusy || decryptBusy) &&
              ' Finish or resolve this operation before switching tabs or leaving the page.'}
          </span>
        </div>
        <div
          id="privacy-send-panel"
          role="tabpanel"
          aria-labelledby="privacy-send-tab"
          hidden={tab !== 'send'}
        >
          <PrivacySend onBusyChange={setSendBusy} />
        </div>
        <div
          id="privacy-decrypt-panel"
          role="tabpanel"
          aria-labelledby="privacy-decrypt-tab"
          hidden={tab !== 'decrypt'}
        >
          <PrivacyDecrypt onBusyChange={setDecryptBusy} />
        </div>
      </main>
    </ThemeProvider>
  );
}
