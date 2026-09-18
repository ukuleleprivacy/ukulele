import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { LockOutlined, NorthEastRounded, SouthWestRounded } from '@mui/icons-material';
import { BrandTheme } from './BrandTheme';
import { PanelLoading } from './PanelLoading';
import { handleTabNavigation } from '../lib/tabNavigation';
import { fiducaroToken } from '../token';
import styles from './privacy.module.css';

const PrivacySend = dynamic(() => import('./PrivacySend').then((module) => module.PrivacySend), {
  loading: PanelLoading,
});
const PrivacyDecrypt = dynamic(() => import('./PrivacyDecrypt').then((module) => module.PrivacyDecrypt), {
  loading: PanelLoading,
});

export function PrivacyPage({ initialTab = 'send' }: { initialTab?: 'send' | 'decrypt' }) {
  const [tab, setTab] = useState(initialTab);
  // Keep a visited form mounted so switching tabs preserves its draft and pending transaction.
  const [visited, setVisited] = useState({ send: initialTab === 'send', decrypt: initialTab === 'decrypt' });
  const [sendBusy, setSendBusy] = useState(false);
  const [decryptBusy, setDecryptBusy] = useState(false);
  return (
    <BrandTheme>
      <Head>
        <title>Privacy · Fiducaro</title>
        <meta
          name="description"
          content="Send FIDU privately or decrypt a selected balance with Fiducaro’s live Ethereum token flows."
        />
      </Head>
      <main className={styles.page}>
        <h1 className="sr-only">FIDU Privacy: Send and Decrypt</h1>
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
            onKeyDown={handleTabNavigation}
          >
            {(['send', 'decrypt'] as const).map((value) => (
              <button
                key={value}
                type="button"
                id={`privacy-${value}-tab`}
                role="tab"
                aria-selected={tab === value}
                tabIndex={tab === value ? 0 : -1}
                aria-controls={`privacy-${value}-panel`}
                disabled={(sendBusy || decryptBusy) && tab !== value}
                className={tab === value ? styles.selected : ''}
                onClick={() => {
                  setVisited((previous) => ({ ...previous, [value]: true }));
                  setTab(value);
                }}
              >
                {value === 'send' ? <NorthEastRounded /> : <SouthWestRounded />}
                {value === 'send' ? 'Send' : 'Decrypt'}
                <small>{value === 'send' ? 'Move into private state' : 'Return to public state'}</small>
              </button>
            ))}
          </div>
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
          {visited.send && <PrivacySend onBusyChange={setSendBusy} />}
        </div>
        <div
          id="privacy-decrypt-panel"
          role="tabpanel"
          aria-labelledby="privacy-decrypt-tab"
          hidden={tab !== 'decrypt'}
        >
          {visited.decrypt && <PrivacyDecrypt onBusyChange={setDecryptBusy} />}
        </div>
      </main>
    </BrandTheme>
  );
}
