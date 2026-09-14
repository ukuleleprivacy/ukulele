import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { SwapHorizRounded, TimelineRounded, PeopleOutlineRounded, LockOutlined } from '@mui/icons-material';
import Bridge from './gasless';
import { BrandTheme } from '../src/components/BrandTheme';
import { PanelLoading } from '../src/components/PanelLoading';
import { handleTabNavigation } from '../src/lib/tabNavigation';
import styles from '../src/components/privacy.module.css';
import crypto from './crypto.module.css';

const Activity = dynamic(() => import('./activity'), { loading: PanelLoading });
const People = dynamic(() => import('./people'), { loading: PanelLoading });

const sections = [
  { name: 'Bridge', detail: 'Between assets', icon: SwapHorizRounded },
  { name: 'Activity', detail: 'A clearer picture', icon: TimelineRounded },
  { name: 'People', detail: 'The privacy world', icon: PeopleOutlineRounded },
] as const;

export default function Crypto() {
  const [tab, setTab] = useState(0);
  return (
    <BrandTheme>
      <Head>
        <title>Crypto · Fiducaro</title>
      </Head>
      <main className={`${styles.page} ${crypto.page}`}>
        <h1 className="sr-only">Crypto</h1>
        <div className={styles.topline}>
          <span>FIDUCARO / CRYPTO</span>
          <span className={crypto.status}>
            <i /> NOT LIVE · CONCEPT PREVIEW
          </span>
        </div>
        <div className={`${styles.tabbar} ${crypto.tabs}`}>
          <div
            role="tablist"
            aria-label="Crypto sections"
            onKeyDown={handleTabNavigation}
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
    </BrandTheme>
  );
}
