import { useState } from 'react';
import Link from 'next/link';
import { ExpandMoreRounded, ArrowForwardRounded } from '@mui/icons-material';
import styles from './BuildRoadmap.module.css';

export function BuildRoadmap() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.roadmap}>
      <button
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="header-roadmap"
        onClick={() => setOpen(!open)}
      >
        <span className={styles.label}>COMING NEXT</span>
        <span>
          Crypto <ArrowForwardRounded /> Credit
        </span>
        <ExpandMoreRounded style={{ transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      <div className={styles.shell + (open ? ' ' + styles.open : '')}>
        <div
          className={styles.inner}
          id="header-roadmap"
        >
          <nav
            aria-label="Development roadmap"
            className={styles.steps}
          >
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
            >
              <small>01 / LIVE NOW</small>
              <strong>
                <i />
                Privacy
              </strong>
              <p>FIDU Send & Decrypt on Ethereum.</p>
            </Link>
            <Link
              href="/crypto"
              onClick={() => setOpen(false)}
            >
              <small>02 / NEXT TO ACTIVATE</small>
              <strong>
                <i className={styles.pending} />
                Crypto
              </strong>
              <p>Bridge development · 27% estimate.</p>
            </Link>
            <Link
              href="/dash"
              onClick={() => setOpen(false)}
            >
              <small>03 / FOLLOWS CRYPTO</small>
              <strong>
                <i className={styles.pending} />
                Credit
              </strong>
              <p>Private accounts and lending · concept.</p>
            </Link>
          </nav>
          <p className={styles.note}>Planned order, not a launch commitment. Crypto and Credit are not live.</p>
        </div>
      </div>
    </div>
  );
}
