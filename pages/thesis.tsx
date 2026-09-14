import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowForwardRounded,
  ArrowOutwardRounded,
  LockOutlined,
  CheckRounded,
  HomeOutlined,
  CloudOutlined,
  FingerprintRounded,
  ShieldOutlined,
  PlayArrowRounded,
  ReplayRounded,
  MenuBookRounded,
  HeadphonesRounded,
} from '@mui/icons-material';
import { BrandTheme } from '../src/components/BrandTheme';
import { ObscuraVideo } from '../src/components/ObscuraVideo';
import styles from './thesis.module.css';

const paper = '/whitepaper/Obscura_Coveneant.pdf';
const concepts = [
  {
    name: 'The missing boundary',
    number: '01',
    eyebrow: 'FROM PHYSICAL WALLS TO DIGITAL LIFE',
    title: 'The home changed.\nThe principle shouldn’t.',
    body: 'The Covenant argues that privacy should follow the person, not stop at the walls of a house. A letter becomes an inbox. A strongbox becomes a wallet. The need for a protected private space remains.',
    source: 'Chapter II · pages 8–15',
    page: 8,
    action: 'Move into the digital world',
    result: 'The paper’s argument: protect the contents of a life, not just the physical container.',
  },
  {
    name: 'Your life, in receipts',
    number: '02',
    eyebrow: 'MORE THAN A BALANCE',
    title: 'A ledger can become\na portrait.',
    body: 'The paper calls it “Wealth DNA”: financial records can expose associations, habits, and intimate parts of a life. These fictional receipts illustrate how separate payments can be assembled into a revealing profile.',
    source: 'Chapter V · page 32',
    page: 32,
    action: 'Connect the dots',
    result:
      'Illustrative inferences, not certain conclusions. Financial records can reveal more than the amount spent.',
  },
  {
    name: 'Prove less. Keep more.',
    number: '03',
    eyebrow: 'SELECTIVE DISCLOSURE',
    title: 'Answer a question.\nNot every question.',
    body: 'The Covenant proposes ways to prove a relevant fact without handing over an entire record. Its identity and payroll examples ask: could someone confirm eligibility or income origin without exposing the rest of their life?',
    source: 'Chapters IV–V · pages 25, 33–34',
    page: 33,
    action: 'Share only the answer',
    result: 'Concept only: this animation generates no cryptographic proof and transmits no personal information.',
  },
];

function ConceptIllustration({ selected, revealed }: { selected: number; revealed: boolean }) {
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  if (selected === 0)
    return (
      <div className={styles.boundaryVisual}>
        <div className={styles.visualLabel}>{revealed ? 'THE DIGITAL SANCTUARY' : 'THE PHYSICAL SANCTUARY'}</div>
        <motion.div
          className={styles.sanctuary}
          animate={{
            borderRadius: revealed ? 28 : 8,
            rotate: revealed ? 0 : -4,
            borderColor: revealed ? '#b9e991' : '#627564',
          }}
          transition={transition}
        >
          <motion.div
            key={String(revealed)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            {revealed ? <CloudOutlined /> : <HomeOutlined />}
            <strong>{revealed ? 'Your digital life' : 'Your private home'}</strong>
          </motion.div>
          <div className={styles.recordGrid}>
            {(revealed
              ? ['Messages', 'Private keys', 'Payment history', 'Identity']
              : ['Letters', 'Strongbox', 'Ledgers', 'Personal papers']
            ).map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0.3, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduced ? 0 : i * 0.07 }}
              >
                <LockOutlined />
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
        <span className={styles.visualCaption}>A boundary should follow what it protects.</span>
      </div>
    );
  if (selected === 1)
    return (
      <div className={styles.receiptVisual}>
        <div className={styles.visualLabel}>FICTIONAL FINANCIAL TRAIL</div>
        <div className={styles.receipts}>
          {[
            ['Community donation', 'Associations', '$40'],
            ['Pharmacy purchase', 'Health interests', '$28'],
            ['Recurring train fare', 'Daily routines', '$12'],
          ].map(([receipt, insight, amount], i) => (
            <motion.div
              key={receipt}
              animate={{ x: revealed ? 0 : (i - 1) * 7, backgroundColor: revealed ? '#203422' : '#102019' }}
              transition={{ ...transition, delay: reduced ? 0 : i * 0.12 }}
            >
              <span>
                {receipt}
                <small>DEMO TRANSACTION</small>
              </span>
              <strong>{revealed ? insight : amount}</strong>
            </motion.div>
          ))}
        </div>
        <motion.div
          className={styles.portrait}
          animate={{ opacity: revealed ? 1 : 0.3, scale: revealed ? 1 : 0.93 }}
          transition={transition}
        >
          <FingerprintRounded />
          <span>{revealed ? 'A picture of a person.' : 'Three ordinary payments.'}</span>
        </motion.div>
      </div>
    );
  return (
    <div className={styles.proofVisual}>
      <div className={styles.visualLabel}>ILLUSTRATIVE AGE CHECK / NO REAL DATA</div>
      <div className={styles.identity}>
        <ShieldOutlined />
        <strong>Private identity</strong>
        {['Full name', 'Date of birth', 'Home address'].map((label) => (
          <div key={label}>
            <span>{label}</span>
            <span className={styles.mask}>••••••••••</span>
          </div>
        ))}
      </div>
      <motion.div
        className={styles.answer}
        animate={{
          y: revealed ? 0 : 15,
          opacity: revealed ? 1 : 0.45,
          borderColor: revealed ? '#b9e99190' : '#b9e99120',
        }}
        transition={transition}
      >
        {revealed ? <CheckRounded /> : <LockOutlined />}
        <span>
          {revealed ? 'Over 21? Yes.' : 'Question: over 21?'}
          <small>{revealed ? 'Only the answer is shared in this illustration.' : 'No record has been shared.'}</small>
        </span>
      </motion.div>
      <span className={styles.visualCaption}>The underlying details stay masked.</span>
    </div>
  );
}

export default function Thesis() {
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [format, setFormat] = useState<'read' | 'listen'>('read');
  const [readerOpen, setReaderOpen] = useState(false);
  const reduced = useReducedMotion();
  const concept = concepts[selected];
  const chooseConcept = (next: number) => {
    setSelected(next);
    setRevealed(false);
  };
  return (
    <BrandTheme>
      <Head>
        <title>The Thesis · The Obscura Covenant · Fiducaro</title>
        <meta
          name="description"
          content="The argument behind Fiducaro: privacy should follow us into the digital world. Explore The Obscura Covenant through interactive explanations, the paper, and the audiobook."
        />
      </Head>
      <main className={styles.page}>
        <div className={styles.topline}>
          <span>FIDUCARO / THE THESIS</span>
          <span>AN ARGUMENT FOR THE UNSEEN</span>
        </div>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>THE OBSCURA COVENANT</span>
            <h1>
              The founders wrote liberty.
              <br />
              <em>
                Privacy was left
                <br />
                between the lines.
              </em>
            </h1>
            <p>
              The Covenant’s central argument: a right so fundamental should never have been left implicit. As life
              becomes digital, privacy needs to be deliberately protected—in principle, in law, and in the systems we
              build.
            </p>
            <a
              href="#ideas"
              className={styles.primary}
            >
              Explore the argument <ArrowForwardRounded />
            </a>
            <a
              href="#library"
              className={styles.secondary}
            >
              Read or listen <ArrowOutwardRounded />
            </a>
          </div>
          <div
            className={styles.manifesto}
            aria-label="The Obscura Covenant, a thesis in five chapters"
          >
            <span>FIDUCARO / ESSAYS ON SOVEREIGNTY</span>
            <div className={styles.bookGlyph}>
              <span />
              <span />
              <span />
            </div>
            <h2>
              The Obscura
              <br />
              <em>Covenant</em>
            </h2>
            <p>
              Privacy is not an exception.
              <br />
              It is the starting point.
            </p>
            <small>38 PAGES · 5 CHAPTERS · ONE ARGUMENT</small>
          </div>
        </header>

        <aside className={styles.context}>
          <span>THE DISTINCTION THAT MATTERS</span>
          <p>
            The founders did not ignore private life: the Fourth Amendment protects against unreasonable searches and
            seizures. This thesis argues that an explicit, technology-independent privacy guarantee was left unfinished.
            That is an argument for stronger protection—not a claim that privacy has no constitutional protection.
          </p>
          <a
            href="https://www.archives.gov/founding-docs/bill-of-rights-transcript"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the original Bill of Rights ↗
          </a>
        </aside>

        <section
          id="ideas"
          className={styles.ideas}
          aria-labelledby="ideas-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>THREE IDEAS, MADE VISIBLE</span>
              <h2 id="ideas-title">
                A few moments.
                <br />
                <em>A different perspective.</em>
              </h2>
            </div>
            <p>
              Click through the explanations.
              <br />
              Illustrations—not live financial or identity tools.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Thesis concepts"
            className={styles.tabs}
          >
            {concepts.map(({ name, number }, index) => (
              <button
                key={name}
                role="tab"
                id={'concept-tab-' + index}
                aria-selected={selected === index}
                aria-controls="concept-panel"
                tabIndex={selected === index ? 0 : -1}
                onClick={() => chooseConcept(index)}
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
                    chooseConcept(next);
                    document.getElementById('concept-tab-' + next)?.focus();
                  }
                }}
              >
                <small>{number}</small>
                {name}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="concept-panel"
            aria-labelledby={'concept-tab-' + selected}
            className={styles.conceptPanel}
          >
            <div className={styles.conceptCopy}>
              <span className={styles.eyebrow}>{concept.eyebrow}</span>
              <h3>{concept.title}</h3>
              <p>{concept.body}</p>
              <button
                className={styles.primary}
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? <ReplayRounded /> : <PlayArrowRounded />}
                {revealed ? 'Reset illustration' : concept.action}
              </button>
              <a
                className={styles.source}
                href={paper + '#page=' + concept.page}
                target="_blank"
                rel="noopener noreferrer"
              >
                {concept.source} ↗
              </a>
            </div>
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                className={styles.visual}
                key={selected}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.15 }}
              >
                <ConceptIllustration
                  selected={selected}
                  revealed={revealed}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <p
            className={styles.result}
            role="status"
          >
            {revealed ? concept.result : 'Press play to explore this idea. Nothing is sent, collected, or verified.'}
          </p>
        </section>

        <section
          className={styles.library}
          id="library"
          aria-labelledby="library-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>GO BEYOND THE SHORT VERSION</span>
              <h2 id="library-title">
                The paper.
                <br />
                <em>The whole perspective.</em>
              </h2>
            </div>
            <p>
              Historical argument, speculative fiction, and a proposed future ecosystem. The paper is a vision
              document—not a list of features available today.
            </p>
          </div>
          <div className={styles.libraryGrid}>
            <nav
              className={styles.chapters}
              aria-label="Paper chapters"
            >
              {[
                ['01', 'The Ancient Origins of Privacy', 3, 'Privacy before the modern state.'],
                ['02', 'Designing a Republic', 8, 'The seen, the unseen, and the missing guarantee.'],
                ['03', 'The Algorithm and the Abyss', 17, 'Two fictional futures. One warning.'],
                ['04', 'The Architecture of Sovereignty', 24, 'A proposed financial and identity ecosystem.'],
                ['05', 'The Wolf’s Howl', 31, 'Advocacy, selective disclosure, and digital sovereignty.'],
              ].map(([number, title, page, description]) => (
                <a
                  key={number}
                  href={paper + '#page=' + page}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </div>
                  <ArrowOutwardRounded />
                </a>
              ))}
            </nav>
            <div className={styles.readerCard}>
              <div
                className={styles.formatTabs}
                role="tablist"
                aria-label="Paper format"
              >
                <button
                  id="format-read"
                  role="tab"
                  aria-selected={format === 'read'}
                  aria-controls="paper-format"
                  onClick={() => setFormat('read')}
                >
                  <MenuBookRounded />
                  Read
                </button>
                <button
                  id="format-listen"
                  role="tab"
                  aria-selected={format === 'listen'}
                  aria-controls="paper-format"
                  onClick={() => setFormat('listen')}
                >
                  <HeadphonesRounded />
                  Listen
                </button>
              </div>
              <div
                role="tabpanel"
                id="paper-format"
                aria-labelledby={'format-' + format}
              >
                {format === 'listen' ? (
                  <ObscuraVideo />
                ) : (
                  <div className={styles.readIntro}>
                    <MenuBookRounded />
                    <h3>The Obscura Covenant</h3>
                    <p>The complete 38-page paper, including its sources and annotations.</p>
                    <a
                      href={paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.primary}
                    >
                      Open the full paper <ArrowOutwardRounded />
                    </a>
                    <button
                      className={styles.inlineReaderButton}
                      aria-expanded={readerOpen}
                      aria-controls="inline-paper"
                      onClick={() => setReaderOpen(!readerOpen)}
                    >
                      {readerOpen ? 'Close inline reader' : 'Read it on this page'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {readerOpen && format === 'read' && (
            <div
              id="inline-paper"
              className={styles.inlineReader}
            >
              <iframe
                src={paper}
                title="The Obscura Covenant — full PDF paper"
              />
              <p>
                If your browser cannot display the PDF,{' '}
                <a
                  href={paper}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open the paper in a new tab ↗
                </a>
                .
              </p>
            </div>
          )}
        </section>
        <section className={styles.closing}>
          <ShieldOutlined />
          <div>
            <h2>
              An argument becomes meaningful
              <br />
              <em>when you can build with it.</em>
            </h2>
            <p>
              FIDU Send and Decrypt are live. Credit, cross-asset bridging, and the paper’s wider proposals are not live
              services.
            </p>
          </div>
          <Link
            href="/privacy"
            className={styles.primary}
          >
            Explore live Privacy <ArrowForwardRounded />
          </Link>
        </section>
      </main>
    </BrandTheme>
  );
}
