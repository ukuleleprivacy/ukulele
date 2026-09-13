import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowBackRounded, ShieldOutlined, PersonOutlineRounded } from '@mui/icons-material';
import styles from '../src/components/privacy.module.css';

const branchNames: Record<string, string> = { RIO: 'Rio de Janeiro', DXB: 'Dubai', IST: 'Istanbul', SIN: 'Singapore' };
export default function Profile() {
  const router = useRouter();
  const branch =
    typeof router.query.branch === 'string' ? branchNames[router.query.branch] || branchNames.RIO : branchNames.RIO;
  const [name, setName] = useState('Alex Morgan');
  const [savedName, setSavedName] = useState('Alex Morgan');
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Head>
        <title>Member profile · Fiducaro Credit</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.topline}>
          <Link href="/dash">
            <ArrowBackRounded sx={{ fontSize: 14, verticalAlign: 'middle' }} /> Back to Credit
          </Link>
          <span>DEMO MEMBER PROFILE</span>
        </div>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>A PRIVATE MEMBER. A WORLD OF POSSIBILITY.</span>
            <h1>
              {savedName}
              <br />
              <em>Your account, in perspective.</em>
            </h1>
            <p>
              A fictional member profile for the Credit concept. Changes here apply only to this profile preview and
              reset on reload.
            </p>
          </div>
          <div className={styles.tokenBadge}>
            <PersonOutlineRounded />
            <strong>
              AM<small>Member 0042</small>
            </strong>
          </div>
        </header>
        <div className={styles.decryptGrid}>
          <section className={styles.decryptCard}>
            <span className={styles.eyebrow}>MEMBER DETAILS</span>
            <h3>A name of your choosing.</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                setSavedName(name.trim());
                setSaved(true);
              }}
            >
              <label className={styles.profileLabel}>
                Display name
                <input
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                />
              </label>
              <button className={styles.profileSave}>Save demo profile</button>
              {saved && <p role="status">Display name saved for this profile preview.</p>}
            </form>
            <div className={styles.fullSummary}>
              <span>Associated branch</span>
              <strong>{branch}</strong>
              <span>Membership</span>
              <strong>Private member · concept</strong>
              <span>Card number</span>
              <strong>**** **** **** ****</strong>
            </div>
          </section>
          <section className={styles.guide}>
            <ShieldOutlined sx={{ color: '#b9e991', fontSize: 36 }} />
            <h2>Share with intention.</h2>
            <p>
              Your portfolio, lending activity and identity belong in separate views. This concept profile demonstrates
              a member identity without exposing a wallet address.
            </p>
            <div className={styles.guideNote}>
              <strong>No real account is created.</strong>
              <p>
                This page has no identity verification, banking connection or profile storage. Return to Credit to
                explore the account and lender desk.
              </p>
            </div>
            <Link
              className={styles.transactionLink}
              href="/dash"
            >
              Return to your private account ↗
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
