import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowForwardRounded,
  ArrowOutwardRounded,
  AccountBalanceWalletOutlined,
  CodeRounded,
  ExpandMoreRounded,
  StorageRounded,
  VerifiedOutlined,
  ShieldOutlined,
} from '@mui/icons-material';
import { BrandTheme } from '../src/components/BrandTheme';
import { HeroVideo } from '../src/components/HeroVideo';
import { TokenAllocation } from '../src/components/TokenAllocation';
import { FaucetClaimButton } from '../src/components/FaucetClaimButton';
import { ArchitectureExplorer } from '../src/components/ArchitectureExplorer';
import { fiducaroToken } from '../src/token';
import { address as naglfarAddress } from '../src/contracts/contract2';
import { address as registryAddress } from '../src/contracts/contract3';
import { faucetAddress } from '../src/contracts/faucet';
import styles from './home.module.css';

const metrics = [
  { Icon: VerifiedOutlined, value: '4 years', label: 'Development' },
  { Icon: AccountBalanceWalletOutlined, value: '~$700K', label: 'Historical development' },
  { Icon: CodeRounded, value: '3', label: 'Core privacy contracts' },
  { Icon: StorageRounded, value: 'Ethereum', label: 'Mainnet deployed' },
];
const contracts = [
  { label: 'ADDR REGISTRY', address: registryAddress },
  { label: 'FIDUCARO', address: fiducaroToken.address },
  { label: 'NAGLFAR', address: naglfarAddress },
  { label: 'FAUCET', address: faucetAddress },
];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [story, setStory] = useState(false);
  const [engine, setEngine] = useState(false);
  const [directory, setDirectory] = useState(false);
  return (
    <BrandTheme>
      <Head>
        <title>Fiducaro · Private Credit. A more private world.</title>
        <meta
          name="description"
          content="Spend freely. Prove everything. Reveal nothing. Explore live FIDU privacy tools and the vision for private credit."
        />
      </Head>
      <main className={styles.page}>
        <div className={styles.topline}>
          <span>FIDUCARO / YOUR WORLD. YOUR TERMS.</span>
          <span>
            <i /> FIDU PRIVACY · LIVE ON ETHEREUM
          </span>
        </div>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>PRIVATE BY PRINCIPLE. OPEN TO POSSIBILITY.</span>
            <h1>
              Private Credit
              <br />
              <em>
                Without the
                <br className={styles.desktopBreak} /> spotlight.
              </em>
            </h1>
            <p>
              Your money is part of your life. It shouldn’t have to tell your whole story. Start with live FIDU privacy
              tools. Explore what private credit could become.
            </p>
            <div className={styles.actions}>
              <Link
                href="/privacy"
                className={styles.primary}
              >
                Test the Most Secure Crypto Token <ArrowForwardRounded />
              </Link>
              <Link
                href="/dash"
                className={styles.textLink}
              >
                Explore private credit <ArrowOutwardRounded />
              </Link>
            </div>
            <div className={styles.heroStatus}>
              <span>
                <i />
                Privacy tools live
              </span>
              <span>
                <i className={styles.red} />
                Credit is a concept
              </span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.videoEyebrow}>
              <ShieldOutlined />
              <span>THE FIDUCARO FILM</span>
              <span>01 / INTRODUCTION</span>
            </div>
            <HeroVideo />
            <div className={styles.videoCaption}>
              <span>
                Spend freely.
                <br />
                Prove everything.
                <br />
                <em>Reveal nothing.</em>
              </span>
              <p>Click the film to start from the beginning, with sound.</p>
            </div>
          </div>
        </section>

        <section
          className={styles.directory}
          aria-label="Live FIDU token"
        >
          <button
            className={styles.directoryToggle}
            aria-expanded={directory}
            aria-controls="contract-directory"
            onClick={() => setDirectory(!directory)}
          >
            <StorageRounded />
            <span>
              <small>THE LIVE FOUNDATION</small>
              <strong>FIDU on Ethereum</strong>
            </span>
            <span className={styles.contractHint}>
              {directory ? 'Hide' : 'View'} contracts{' '}
              <ExpandMoreRounded style={{ transform: directory ? 'rotate(180deg)' : undefined }} />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {directory && (
              <motion.div
                id="contract-directory"
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                style={{ overflow: 'hidden' }}
              >
                <div className={styles.contracts}>
                  {contracts.map(({ label, address }) => (
                    <a
                      key={label}
                      href={'https://etherscan.io/address/' + address}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{label}</span>
                      <code>{address}</code>
                      <ArrowOutwardRounded />
                    </a>
                  ))}
                </div>
                <TokenAllocation />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section
          className={styles.pathways}
          aria-label="Explore Fiducaro"
        >
          {[
            {
              href: '/privacy',
              label: '01 / PRIVACY',
              title: 'Move on your terms.',
              body: 'Send and decrypt the Fiducaro token through live Ethereum contracts.',
              status: 'Live tools',
              live: true,
              Icon: ShieldOutlined,
            },
            {
              href: '/crypto',
              label: '02 / CRYPTO',
              title: 'Beyond a single asset.',
              body: 'Explore the bridge, the activity interface, and voices in the privacy world.',
              status: 'Concept preview',
              live: false,
              Icon: CodeRounded,
            },
            {
              href: '/dash',
              label: '03 / CREDIT',
              title: 'A different kind of account.',
              body: 'A private portfolio, selective disclosure, and a new vision for lending.',
              status: 'Concept preview',
              live: false,
              Icon: AccountBalanceWalletOutlined,
            },
          ].map(({ href, label, title, body, status, live, Icon }) => (
            <Link
              key={href}
              href={href}
              className={styles.pathway}
            >
              <div className={styles.pathwayTop}>
                <span>{label}</span>
                <Icon />
              </div>
              <h2>{title}</h2>
              <p>{body}</p>
              <div className={styles.pathwayBottom}>
                <span>
                  <i className={live ? '' : styles.red} />
                  {status}
                </span>
                <ArrowOutwardRounded />
              </div>
            </Link>
          ))}
        </section>

        <section
          id="protocol"
          className={styles.engine}
          aria-labelledby="engine-title"
        >
          <div className={styles.sectionTop}>
            <div>
              <span className={styles.eyebrow}>THE ENGINE / YEARS IN THE MAKING</span>
              <h2 id="engine-title">
                A Computer
                <br />
                <em>Science Miracle</em>
              </h2>
            </div>
            <p>
              Four years of development. Deployed on Ethereum. Used with real value before the current product and brand
              existed.
            </p>
          </div>
          <button
            className={styles.mobileToggle}
            aria-expanded={engine}
            aria-controls="engine-details"
            onClick={() => {
              setEngine(!engine);
              if (engine) setStory(false);
            }}
          >
            {engine ? 'Hide engine details' : 'Explore the engine'}
            <ExpandMoreRounded style={{ transform: engine ? 'rotate(180deg)' : undefined }} />
          </button>
          <div className={styles.mobileCollapse + (engine ? ' ' + styles.expanded : '')}>
            <div
              className={styles.collapseInner}
              id="engine-details"
            >
              <div className={styles.metrics}>
                {metrics.map(({ Icon, value, label }, index) => {
                  const content = (
                    <>
                      <Icon />
                      <strong>{value}</strong>
                      <span>{label}</span>
                      {index === 0 && <small>{story ? 'CLOSE THE STORY −' : 'READ THE STORY ↗'}</small>}
                    </>
                  );
                  return index === 0 ? (
                    <button
                      key={label}
                      aria-expanded={story}
                      aria-controls="development-origin-story"
                      onClick={() => setStory(!story)}
                      className={story ? styles.activeMetric : ''}
                    >
                      {content}
                    </button>
                  ) : (
                    <div key={label}>{content}</div>
                  );
                })}
              </div>
              <AnimatePresence initial={false}>
                {story && (
                  <motion.div
                    id="development-origin-story"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <article className={styles.story}>
                      <div>
                        <span className={styles.eyebrow}>FOUR YEARS OF DEVELOPMENT</span>
                        <button onClick={() => setStory(false)}>Close story</button>
                      </div>
                      <p>
                        At first, it wasn&apos;t even believed that privacy could occur on an open blockchain. Ethereum
                        itself fought against us, by making the task as difficult as possible. It was nothing short of a
                        scientific miracle that privacy did actually get achieved, but the implications - that people
                        could operate a privacy based banking system anywhere in the world, have yet to fully reveal
                        themselves.
                      </p>
                    </article>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={styles.protocolStatus}>
                <span className={styles.eyebrow}>PROTOCOL STATUS</span>
                <div>
                  {['FIDU token', 'Private Send', 'Full Decrypt', 'Partial Decrypt'].map((label) => (
                    <span key={label}>
                      <i />
                      {label} · Live
                    </span>
                  ))}
                  <span>
                    <i className={styles.red} />
                    Bridge · In development
                  </span>
                </div>
              </div>
              <div className={styles.architecture}>
                <ArchitectureExplorer />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.thesisLink}>
          <span className={styles.eyebrow}>THE IDEA BEHIND THE INTERFACE</span>
          <div>
            <h2>
              Freedom needs
              <br />
              <em>a private space.</em>
            </h2>
            <p>The Obscura Covenant asks what happens when our lives move beyond the walls that once protected them.</p>
            <Link
              href="/thesis"
              className={styles.textLink}
            >
              Explore the thesis <ArrowOutwardRounded />
            </Link>
          </div>
        </section>

        <section
          className={styles.faucet}
          aria-labelledby="faucet-title"
        >
          <div>
            <span className={styles.eyebrow}>
              <i /> THE PROTOCOL IS LIVE
            </span>
            <h2 id="faucet-title">
              Don’t just read about it.
              <br />
              <em>Try a private move.</em>
            </h2>
            <p>
              Claim 100 FIDU, then explore Send and Decrypt in Privacy. You’ll need a connected Ethereum wallet and ETH
              for network fees.
            </p>
          </div>
          <div className={styles.claim}>
            <FaucetClaimButton />
            <span>No site account. No registration.</span>
            <Link href="/privacy">
              Continue to Privacy <ArrowForwardRounded />
            </Link>
          </div>
        </section>
      </main>
    </BrandTheme>
  );
}
