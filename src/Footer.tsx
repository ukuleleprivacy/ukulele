import Link from 'next/link';
import { ArrowForwardRounded, NorthEastRounded } from '@mui/icons-material';
import { LogoMark } from './Logo';
import { brand } from './brand';
import { fiducaroToken } from './token';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link
            href="/"
            className={styles.wordmark}
            aria-label="Fiducaro home"
          >
            <LogoMark size={42} />
            <span>FIDUCARO</span>
          </Link>
          <h2>
            Spend freely.
            <br />
            Prove everything.
            <br />
            <em>Reveal nothing.</em>
          </h2>
          <p>Private credit. A world of possibility.</p>
        </div>
        <nav aria-label="Footer navigation">
          <span className={styles.label}>EXPLORE</span>
          <Link href="/privacy">
            Privacy <NorthEastRounded />
          </Link>
          <Link href="/crypto">
            Crypto <NorthEastRounded />
          </Link>
          <Link href="/dash">
            Credit <NorthEastRounded />
          </Link>
          <Link href="/thesis">
            Thesis <NorthEastRounded />
          </Link>
        </nav>
        <div className={styles.connect}>
          <span className={styles.label}>STAY CLOSE</span>
          <p>
            Follow the work.
            <br />
            Be part of what comes next.
          </p>
          <a
            href={brand.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegram}
          >
            Join the conversation <ArrowForwardRounded />
          </a>
          <a
            href="/whitepaper/Obscura_Coveneant.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.paper}
          >
            Read The Obscura Covenant ↗
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.network}>
          <i />
          FIDU · Ethereum Mainnet
        </span>
        <a
          href={`https://etherscan.io/token/${fiducaroToken.address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Token contract <code>0x5203…Cf9d</code> ↗
        </a>
        <span className={styles.note}>Privacy protocol live · Credit & Crypto are concept previews</span>
      </div>
    </div>
  </footer>
);
