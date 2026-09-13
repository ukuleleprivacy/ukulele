import { useState } from 'react';
import Head from 'next/head';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import {
  ArrowForwardRounded,
  ArrowOutwardRounded,
  CloseRounded,
  VisibilityOutlined,
  VisibilityOffOutlined,
  ShieldOutlined,
  NorthEastRounded,
  SouthWestRounded,
  PublicRounded,
  LockOutlined,
  AddRounded,
  CheckRounded,
  AccountBalanceOutlined,
} from '@mui/icons-material';
import styles from './dash.module.css';
import { LogoMark } from '../src/Logo';
import { useBodyScrollLock } from '../src/components/useBodyScrollLock';

const initialAssets = [
  {
    name: 'Private USD',
    symbol: 'pUSD',
    amount: 42500,
    price: 1,
    color: '#b9e991',
    detail: 'Private settlement balance',
  },
  { name: 'FIDU tokens', symbol: 'FIDU', amount: 18000, price: 2.5, color: '#88bbb0', detail: 'Native privacy asset' },
  { name: 'TMCA', symbol: 'TMCA', amount: 150, price: 250, color: '#aaa1d0', detail: 'Time Moving Crypto Average' },
];
const branches = [
  {
    city: 'Rio de Janeiro',
    country: 'Brazil',
    code: 'RIO',
    zone: 'America/Sao_Paulo',
    description: 'Between the mountains and the Atlantic.',
    position: [35, 72],
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    code: 'DXB',
    zone: 'Asia/Dubai',
    description: 'A meeting point for a world in motion.',
    position: [65, 49],
  },
  {
    city: 'Istanbul',
    country: 'Türkiye',
    code: 'IST',
    zone: 'Europe/Istanbul',
    description: 'Two continents. One private account.',
    position: [56, 36],
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    code: 'SIN',
    zone: 'Asia/Singapore',
    description: 'Your connection to the next horizon.',
    position: [80, 62],
  },
];
const initialLoans = [
  {
    id: 'FD-2041',
    alias: 'Member • 7A21',
    branch: 'Rio',
    principal: 18000,
    rate: 7.2,
    months: 12,
    interest: 432,
    progress: 33,
    status: 'On schedule',
  },
  {
    id: 'FD-2038',
    alias: 'Member • 9C04',
    branch: 'Dubai',
    principal: 24000,
    rate: 8.4,
    months: 18,
    interest: 1008,
    progress: 50,
    status: 'On schedule',
  },
  {
    id: 'FD-2026',
    alias: 'Member • 2F19',
    branch: 'Istanbul',
    principal: 12000,
    rate: 6.8,
    months: 6,
    interest: 136,
    progress: 33,
    status: 'On schedule',
  },
];
type Modal = 'deposit' | 'proof' | 'borrow' | 'branch' | 'offer' | null;
const usd = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function Dashboard() {
  const [view, setView] = useState<'account' | 'lender'>('account');
  const [hidden, setHidden] = useState(false);
  const [branch, setBranch] = useState(0);
  const [period, setPeriod] = useState('1M');
  const [asset, setAsset] = useState<number | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  useBodyScrollLock(modal !== null);
  const [fidu, setFidu] = useState(18000);
  const [deposit, setDeposit] = useState('2500');
  const [proof, setProof] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loanAmount, setLoanAmount] = useState(8000);
  const [term, setTerm] = useState(12);
  const [borrowed, setBorrowed] = useState(6500);
  const [frozen, setFrozen] = useState(false);
  const [notice, setNotice] = useState('');
  const [offerCreated, setOfferCreated] = useState(false);
  const [reservedCapital, setReservedCapital] = useState(0);
  const [offerAmount, setOfferAmount] = useState('5000');
  const [activity, setActivity] = useState([
    {
      title: 'Private deposit',
      detail: 'FIDU → private balance',
      value: '+ 2,500 FIDU',
      kind: 'in',
      date: 'Today, 09:41',
    },
    { title: 'Loan repayment', detail: 'Credit line · FD-1092', value: '− $580', kind: 'out', date: 'Yesterday' },
    { title: 'Portfolio allocation', detail: 'Private USD → TMCA', value: '$1,250', kind: 'swap', date: '11 Sep 2026' },
  ]);
  const assets = initialAssets.map((a, i) => (i === 1 ? { ...a, amount: fidu } : a));
  const total = assets.reduce((sum, a) => sum + a.amount * a.price, 0);
  const collateral = fidu * 2.5;
  const creditLimit = Math.floor(collateral * 0.5);
  const available = Math.max(0, creditLimit - borrowed);
  const money = (n: number) => (hidden ? '••••••' : usd(n));
  const pct = (i: number) => ((assets[i].amount * assets[i].price) / total) * 100;
  const notify = (message: string) => {
    setNotice(message);
    setModal(null);
  };
  const open = (next: Modal) => {
    setConsent(false);
    setModal(next);
  };
  const addActivity = (title: string, detail: string, value: string) =>
    setActivity((items) => [{ title, detail, value, kind: 'in', date: 'Just now · demo' }, ...items].slice(0, 5));
  const chartPaths: Record<string, string> = {
    '1W': 'M0 100 L30 95 L60 110 L90 78 L120 88 L150 55 L180 65 L210 52 L240 73 L270 43 L300 52 L330 38 L360 45 L390 20 L420 28 L450 12 L480 20 L520 8',
    '1M': 'M0 126 L20 116 L40 119 L60 103 L80 108 L100 88 L120 97 L140 89 L160 110 L180 95 L200 98 L220 70 L240 79 L260 52 L280 59 L300 44 L320 65 L340 47 L360 55 L380 26 L400 36 L420 29 L440 40 L460 17 L480 23 L500 9 L520 12',
    '1Y': 'M0 142 L40 130 L80 134 L120 114 L160 118 L200 84 L240 95 L280 56 L320 75 L360 43 L400 52 L440 25 L480 32 L520 12',
  };

  return (
    <>
      <Head>
        <title>Dash · Fiducaro Private Banking</title>
        <meta
          name="description"
          content="Explore the Fiducaro private banking concept. Illustrative balances, private portfolios and lending."
        />
      </Head>
      <main className={styles.dashboard}>
        <div className={styles.demoBar}>
          <span>
            <span className={styles.dot} /> FIDUCARO LABS <span className={styles.barDivider}>/</span> PRIVATE BANKING
          </span>
          <span>
            Interactive concept <b>DEMO DATA</b>
          </span>
        </div>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>YOUR WORLD. YOUR TERMS.</p>
            <h1>
              A little more private.
              <br />
              <em>A lot more possibility.</em>
            </h1>
            <p>Your assets, your credit, your next move. All in one place.</p>
          </div>
          <div className={styles.member}>
            <span className={styles.avatar}>AM</span>
            <div>
              <strong>Alex Morgan</strong>
              <small>Private member · {branches[branch].code} / 0042</small>
            </div>
            <ShieldOutlined />
          </div>
        </header>
        <div className={styles.toolbar}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Dashboard view"
          >
            <button
              role="tab"
              id="account-tab"
              aria-controls="account-panel"
              aria-selected={view === 'account'}
              onClick={() => setView('account')}
              className={view === 'account' ? styles.selected : ''}
            >
              <AccountBalanceOutlined /> My account
            </button>
            <button
              role="tab"
              id="lender-tab"
              aria-controls="lender-panel"
              aria-selected={view === 'lender'}
              onClick={() => setView('lender')}
              className={view === 'lender' ? styles.selected : ''}
            >
              <NorthEastRounded /> Lender desk
            </button>
          </div>
          <button
            className={styles.quietButton}
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
            {hidden ? 'Show balances' : 'Hide balances'}
          </button>
        </div>
        {notice && (
          <div
            role="status"
            className={styles.notice}
          >
            <CheckRounded />
            {notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice('')}
            >
              <CloseRounded />
            </button>
          </div>
        )}
        {view === 'account' ? (
          <div
            role="tabpanel"
            id="account-panel"
            aria-labelledby="account-tab"
          >
            <div className={styles.mainGrid}>
              <section className={`${styles.panel} ${styles.balancePanel}`}>
                <div className={styles.panelTop}>
                  <span className={styles.label}>TOTAL PRIVATE BALANCE</span>
                  <span className={styles.badge}>
                    <LockOutlined /> Private account
                  </span>
                </div>
                <div className={styles.balance}>
                  {money(total)}
                  <span>USD</span>
                </div>
                <p className={styles.growth}>
                  <NorthEastRounded /> {hidden ? '••••' : '+$8,240 (7.06%)'} <span>illustrative change this month</span>
                </p>
                <div className={styles.chartHeader}>
                  <span>
                    Portfolio value <small>· simulated history</small>
                  </span>
                  <div className={styles.periods}>
                    {['1W', '1M', '1Y'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        aria-pressed={period === p}
                        className={period === p ? styles.activePeriod : ''}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.lineChart}>
                  <div className={styles.gridLines} />
                  <svg
                    viewBox="0 0 520 170"
                    role="img"
                    aria-label={`Illustrative portfolio trend over ${period}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="portfolio-fill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#b9e991"
                          stopOpacity=".2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#b9e991"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${chartPaths[period]} L520 170 L0 170 Z`}
                      fill="url(#portfolio-fill)"
                    />
                    <path
                      d={chartPaths[period]}
                      fill="none"
                      stroke="#b9e991"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                <div className={styles.chartDates}>
                  <span>{period === '1W' ? '07 SEP' : period === '1M' ? '14 AUG' : 'SEP 2025'}</span>
                  <span>{period === '1W' ? '10 SEP' : period === '1M' ? '29 AUG' : 'MAR 2026'}</span>
                  <span>13 SEP 2026</span>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.primaryButton}
                    onClick={() => open('deposit')}
                  >
                    <AddRounded /> Deposit FIDU
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => open('proof')}
                  >
                    <ShieldOutlined /> Prove a balance <ArrowForwardRounded />
                  </button>
                </div>
              </section>
              <section className={`${styles.panel} ${styles.allocation}`}>
                <div className={styles.panelTop}>
                  <h2>Your allocation</h2>
                  <span className={styles.muted}>03 assets</span>
                </div>
                <div
                  className={styles.donut}
                  style={{
                    background: `conic-gradient(#b9e991 0% ${pct(0)}%, #88bbb0 ${pct(0)}% ${pct(0) + pct(1)}%, #aaa1d0 ${pct(0) + pct(1)}% 100%)`,
                  }}
                  role="img"
                  aria-label={
                    hidden
                      ? 'Portfolio allocation hidden'
                      : assets.map((a, i) => `${a.name}: ${pct(i).toFixed(1)} percent`).join(', ')
                  }
                >
                  <div>
                    <ShieldOutlined />
                    <strong>{asset === null ? 'Your balance.' : assets[asset].symbol}</strong>
                    <span>
                      {asset === null ? 'Your business.' : hidden ? '••••' : `${pct(asset).toFixed(1)}% of portfolio`}
                    </span>
                  </div>
                </div>
                <div className={styles.assetLegend}>
                  {assets.map((a, i) => (
                    <button
                      key={a.symbol}
                      onClick={() => setAsset(asset === i ? null : i)}
                      aria-pressed={asset === i}
                    >
                      <i style={{ background: a.color }} />
                      <span>
                        {a.name}
                        <small>
                          {asset === i ? a.detail : hidden ? '••••' : `${a.amount.toLocaleString()} ${a.symbol}`}
                        </small>
                      </span>
                      <strong>{hidden ? '••' : `${pct(i).toFixed(0)}%`}</strong>
                    </button>
                  ))}
                </div>
                <p className={styles.footnote}>
                  Illustrative USD equivalents. TMCA is a proposed time-averaged crypto basket; no live prices.
                </p>
              </section>
              <aside className={styles.rightRail}>
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <LogoMark size={25} />
                    <strong>FIDUCARO</strong>
                    <span>PRIVATE</span>
                  </div>
                  <div className={styles.chip}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.cardNumber}>**** &nbsp; **** &nbsp; **** &nbsp; ****</div>
                  <div className={styles.cardBottom}>
                    <span>
                      ALEX MORGAN<small>PRIVATE MEMBER</small>
                    </span>
                    <span className={styles.cardOrbit}>◯◯</span>
                  </div>
                  <div className={styles.cardWatermark}>F</div>
                </div>
                <div className={styles.cardControls}>
                  <span>
                    <span className={styles.dot} />
                    {frozen ? 'Card frozen · demo' : 'Virtual card · concept'}
                  </span>
                  <button onClick={() => setFrozen(!frozen)}>{frozen ? 'Unfreeze' : 'Freeze card'}</button>
                </div>
                <section className={`${styles.panel} ${styles.branch}`}>
                  <div className={styles.panelTop}>
                    <span className={styles.label}>ASSOCIATED BRANCH</span>
                    <PublicRounded />
                  </div>
                  <div
                    className={styles.mapArt}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 300 120">
                      <path
                        d="M15 25l25-13 29 6 13 17-17 13-14 4-12-13-18 5z M65 56l22 10 4 24-14 25-10-23-10-18z M127 24l24-8 10 13 22-12 32 7 23-6 34 19-9 17-31-4-15 18-18-17-22 5-9-12-21 9-18-13z M138 55l22-5 21 20-16 31-15-9-7-19z M239 88l23-6 17 15-8 13-25-5z"
                        fill="currentColor"
                      />
                    </svg>
                    <i style={{ left: `${branches[branch].position[0]}%`, top: `${branches[branch].position[1]}%` }} />
                  </div>
                  <h3>
                    {branches[branch].city}
                    <ArrowOutwardRounded />
                  </h3>
                  <p>
                    {branches[branch].country} <span>· {branches[branch].code}</span>
                  </p>
                  <button
                    className={styles.branchButton}
                    onClick={() => open('branch')}
                  >
                    Explore branches <ArrowForwardRounded />
                  </button>
                  <small>Concept locations, not operating bank branches.</small>
                </section>
              </aside>
              <section className={`${styles.panel} ${styles.credit}`}>
                <div className={styles.panelTop}>
                  <h2>Credit, on your terms.</h2>
                  <span className={styles.badge}>ILLUSTRATIVE</span>
                </div>
                <p className={styles.muted}>Put your private FIDU balance to work.</p>
                <div className={styles.creditNumbers}>
                  <div>
                    <span>Outstanding loan</span>
                    <strong>{money(borrowed)}</strong>
                  </div>
                  <div>
                    <span>Available to borrow</span>
                    <strong className={styles.green}>{money(available)}</strong>
                  </div>
                </div>
                <div className={styles.creditTrack}>
                  <span style={{ width: `${Math.min(100, (borrowed / creditLimit) * 100)}%` }} />
                </div>
                <div className={styles.creditLabels}>
                  <span>{hidden ? '••' : `${((borrowed / creditLimit) * 100).toFixed(0)}%`} of credit line used</span>
                  <span>{money(creditLimit)} limit</span>
                </div>
                <div className={styles.creditTerms}>
                  <span>
                    7.2% <small>Demo APR</small>
                  </span>
                  <span>
                    50% <small>Maximum LTV</small>
                  </span>
                  <span>
                    FIDU <small>Collateral asset</small>
                  </span>
                </div>
                <button
                  className={styles.secondaryButton}
                  onClick={() => open('borrow')}
                >
                  Explore a loan <ArrowForwardRounded />
                </button>
              </section>
              <section className={`${styles.panel} ${styles.activity}`}>
                <div className={styles.panelTop}>
                  <h2>Only you see the details.</h2>
                  <span className={styles.muted}>Activity</span>
                </div>
                {activity.map((item, i) => (
                  <div
                    key={`${item.title}-${i}`}
                    className={styles.activityRow}
                  >
                    <span className={styles.activityIcon}>
                      {item.kind === 'out' ? <NorthEastRounded /> : <SouthWestRounded />}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                    <div>
                      <strong>{hidden ? '••••••' : item.value}</strong>
                      <small>{item.date}</small>
                    </div>
                  </div>
                ))}
              </section>
            </div>
            <section className={styles.proofBanner}>
              <span className={styles.proofSeal}>
                <ShieldOutlined />
              </span>
              <div>
                <span className={styles.eyebrow}>SELECTIVE DISCLOSURE</span>
                <h2>Prove what matters. Keep the rest yours.</h2>
                <p>
                  A concept for sharing a deposit reference with a chosen lender, without displaying your whole account.
                </p>
              </div>
              <button
                className={styles.secondaryButton}
                onClick={() => open('proof')}
              >
                {proof ? 'Review demo disclosure' : 'Explore a balance proof'}
                <ArrowForwardRounded />
              </button>
            </section>
          </div>
        ) : (
          <div
            role="tabpanel"
            id="lender-panel"
            aria-labelledby="lender-tab"
            className={styles.lenderView}
          >
            <div className={styles.lenderHeading}>
              <div>
                <p className={styles.eyebrow}>THE OTHER SIDE OF POSSIBILITY</p>
                <h2>Capital with somewhere to go.</h2>
                <p>Manage private credit relationships through member aliases.</p>
              </div>
              <button
                className={styles.primaryButton}
                onClick={() => open('offer')}
              >
                <AddRounded /> Create demo offer
              </button>
            </div>
            <div className={styles.lenderStats}>
              {[
                { label: 'Capital deployed', value: 54000, note: 'Across 3 demo loans' },
                { label: 'Interest accrued / owed', value: 1576, note: 'Accrued, not yet collected' },
                { label: 'Principal + interest due', value: 55576, note: 'Illustrative receivables' },
                {
                  label: 'Available capital',
                  value: 26000 - reservedCapital,
                  note: offerCreated ? 'After demo offer reservation' : 'Ready for new opportunities',
                },
              ].map((s) => (
                <section
                  className={styles.panel}
                  key={s.label}
                >
                  <span className={styles.label}>{s.label}</span>
                  <strong>{money(s.value)}</strong>
                  <p>{s.note}</p>
                </section>
              ))}
            </div>
            <section className={`${styles.panel} ${styles.loanBook}`}>
              <div className={styles.panelTop}>
                <h2>Your loan book</h2>
                <span className={styles.badge}>3 ACTIVE · DEMO</span>
              </div>
              <div className={styles.tableScroll}>
                <table>
                  <thead>
                    <tr>
                      <th>Borrower / loan</th>
                      <th>Principal</th>
                      <th>APR</th>
                      <th>Interest owed</th>
                      <th>Term progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialLoans.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <strong>{l.alias}</strong>
                          <small>
                            {l.id} · {l.branch}
                          </small>
                        </td>
                        <td>{money(l.principal)}</td>
                        <td>{l.rate}%</td>
                        <td className={styles.green}>{money(l.interest)}</td>
                        <td>
                          <div className={styles.miniTrack}>
                            <span style={{ width: `${l.progress}%` }} />
                          </div>
                          <small>
                            {Math.round((l.months * l.progress) / 100)} of {l.months} months
                          </small>
                        </td>
                        <td>
                          <span className={styles.badge}>{l.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className={styles.lenderBottom}>
              <section className={styles.panel}>
                <p className={styles.eyebrow}>NEXT COLLECTION · DEMO</p>
                <h2>30 September</h2>
                <div className={styles.collectionValue}>{money(344)}</div>
                <p className={styles.muted}>
                  Scheduled monthly interest across your three loans. Accrued interest is shown separately above.
                </p>
                <div className={styles.collectionBreakdown}>
                  <span>Rio {money(108)}</span>
                  <span>Dubai {money(168)}</span>
                  <span>Istanbul {money(68)}</span>
                </div>
              </section>
              <section className={styles.panel}>
                <ShieldOutlined className={styles.green} />
                <h2>
                  Know the collateral.
                  <br />
                  Respect the person.
                </h2>
                <p className={styles.muted}>
                  This desk imagines credit decisions based on scoped disclosures, not a public financial profile.
                  Deposit ownership, unspent state, collateral locking and liquidation still need protocol design.
                </p>
                {offerCreated && (
                  <div className={styles.notice}>
                    <CheckRounded />
                    Demo offer drafted: {money(reservedCapital)} at 7.2% APR. No funds committed.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
        <div className={styles.bottomNote}>
          <span>
            <LockOutlined /> Your privacy is the starting point.
          </span>
          <span>
            Prototype only · no deposits, proof verification, card issuance or lending · state resets on reload
          </span>
        </div>
      </main>
      <Dialog
        disableScrollLock
        open={modal !== null}
        onClose={() => setModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: styles.dialog }}
      >
        <DialogTitle className={styles.dialogTitle}>
          {modal === 'branch'
            ? 'Choose your connection.'
            : modal === 'deposit'
              ? 'Make a private move.'
              : modal === 'proof'
                ? 'A little proof. On your terms.'
                : modal === 'offer'
                  ? 'Make room for possibility.'
                  : 'Your next move, financed.'}
          <IconButton
            aria-label="Close dialog"
            onClick={() => setModal(null)}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className={styles.dialogIntro}>CONCEPT PREVIEW · NO REAL TRANSACTIONS</p>
          {modal === 'branch' && (
            <div className={styles.branchChoices}>
              {branches.map((b, i) => (
                <button
                  key={b.code}
                  onClick={() => {
                    setBranch(i);
                    notify(`Your demo branch is now ${b.city}.`);
                  }}
                >
                  <span className={styles.branchCode}>{b.code}</span>
                  <span>
                    <strong>{b.city}</strong>
                    <small>
                      {b.country} · {b.description}
                    </small>
                  </span>
                  {branch === i ? <CheckRounded /> : <ArrowForwardRounded />}
                </button>
              ))}
            </div>
          )}
          {modal === 'deposit' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = Number(deposit);
                if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) return;
                setFidu(fidu + amount);
                setProof(false);
                addActivity('Demo private deposit', 'Local preview only', `+ ${amount.toLocaleString()} FIDU`);
                notify('Demo FIDU added to the portfolio. No wallet or funds were accessed.');
              }}
            >
              <p className={styles.muted}>
                Preview adding FIDU to a private account. This changes only the numbers in this session.
              </p>
              <label className={styles.field}>
                Deposit amount · FIDU
                <input
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </label>
              <div className={styles.reviewRow}>
                <span>Illustrative rate</span>
                <strong>1 FIDU = $2.50</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Demo USD value</span>
                <strong>{usd(Number(deposit) * 2.5 || 0)}</strong>
              </div>
              <button
                className={styles.primaryButton}
                type="submit"
              >
                Simulate deposit <ArrowForwardRounded />
              </button>
            </form>
          )}
          {modal === 'proof' && (
            <>
              <p className={styles.muted}>
                Preview revealing SALT, AMOUNT and RECIPIENT for one illustrative deposit to a selected lender. These
                are fixed sample values; never enter a real salt here.
              </p>
              <div className={styles.proofFields}>
                <div>
                  <span>SALT</span>
                  <code>demo-salt-0042-not-a-secret</code>
                </div>
                <div>
                  <span>AMOUNT</span>
                  <code>{fidu.toLocaleString()} FIDU</code>
                </div>
                <div>
                  <span>RECIPIENT</span>
                  <code>Demo member Alex Morgan · 0042</code>
                </div>
                <div>
                  <span>SHARED WITH</span>
                  <code>Demo lender · Atlas Credit</code>
                </div>
              </div>
              <p className={styles.disclosureNote}>
                Disclosure exposes these details to the recipient. A deposit reference alone does not prove an available
                balance or prevent double pledging. This prototype performs no cryptographic verification.
              </p>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I understand these sample details are revealed in this demo.
              </label>
              <button
                className={styles.primaryButton}
                disabled={!consent}
                onClick={() => {
                  setProof(true);
                  notify('Demo disclosure prepared for Atlas Credit. Nothing was sent or cryptographically verified.');
                }}
              >
                Prepare demo disclosure <ShieldOutlined />
              </button>
            </>
          )}
          {modal === 'borrow' && (
            <>
              <p className={styles.muted}>
                Explore a FIDU-backed credit line using a fixed demo valuation and a 50% maximum loan-to-value ratio.
              </p>
              <label className={styles.field}>
                Borrow amount · USD
                <input
                  type="number"
                  min="100"
                  max={available}
                  step="100"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </label>
              <input
                className={styles.slider}
                aria-label="Borrow amount"
                type="range"
                min="0"
                max={available}
                step="100"
                value={Math.min(loanAmount, available)}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <label className={styles.field}>
                Loan term
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                >
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                </select>
              </label>
              <div className={styles.reviewRow}>
                <span>Demo collateral valuation</span>
                <strong>{money(collateral)}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Estimated interest · simple, 7.2% APR</span>
                <strong>{usd((loanAmount * 0.072 * term) / 12)}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Estimated monthly payment</span>
                <strong>{usd(loanAmount / term + (loanAmount * 0.072) / 12)}</strong>
              </div>
              <p className={styles.disclosureNote}>
                {proof
                  ? 'Demo disclosure prepared. '
                  : 'You can explore this quote before preparing a demo disclosure. '}
                No collateral is locked. These terms are illustrative, not a loan offer.
              </p>
              <button
                className={styles.primaryButton}
                disabled={!Number.isFinite(loanAmount) || loanAmount < 100 || loanAmount > available}
                onClick={() => {
                  setBorrowed(borrowed + loanAmount);
                  addActivity('Demo loan preview', `${term}-month term · no funds issued`, usd(loanAmount));
                  notify('Loan added to the demo credit line. No agreement or transaction was created.');
                }}
              >
                Simulate loan <ArrowForwardRounded />
              </button>
            </>
          )}
          {modal === 'offer' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (Number(offerAmount) <= 0 || Number(offerAmount) > 26000) return;
                setOfferCreated(true);
                setReservedCapital(Number(offerAmount));
                notify('Demo lending offer drafted. No funds committed and no borrower contacted.');
              }}
            >
              <p className={styles.muted}>
                Draft a sample credit offer. It stays in this preview and is not matched to a borrower.
              </p>
              <label className={styles.field}>
                Capital to offer · USD
                <input
                  type="number"
                  min="100"
                  max="26000"
                  step="100"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </label>
              <div className={styles.reviewRow}>
                <span>Demo APR / term</span>
                <strong>7.2% / 12 months</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Projected simple interest</span>
                <strong>{usd(Number(offerAmount) * 0.072 || 0)}</strong>
              </div>
              <button
                className={styles.primaryButton}
                type="submit"
              >
                Save demo offer <ArrowForwardRounded />
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
