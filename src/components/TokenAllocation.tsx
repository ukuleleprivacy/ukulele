import { useId, useState, type CSSProperties } from 'react';
import styles from './TokenAllocation.module.css';

const allocations = [
  {
    name: 'Faucet',
    amount: 77_000,
    color: '#b9e991',
    purpose: 'A first step into privacy.',
    description:
      'Tokens allocated to the faucet so people can receive FIDU and try the private-send and decrypt tools for themselves.',
  },
  {
    name: 'Airdrop',
    amount: 250_000,
    color: '#88bbb0',
    purpose: 'Put FIDU into more hands.',
    description:
      'Tokens allocated to community distribution through an airdrop, helping introduce more people to Fiducaro and its privacy tools.',
  },
  {
    name: 'VCs',
    amount: 3_500_000,
    color: '#aaa1d0',
    purpose: 'Support the next stage of growth.',
    description:
      'Tokens allocated to venture-capital participation, intended to support funding for Fiducaro’s development and growth.',
  },
  {
    name: 'Team / founder',
    amount: 6_173_000,
    color: '#609c76',
    purpose: 'Keep building for the long term.',
    description:
      'Tokens allocated to the team and founder, intended to support continued development, maintenance, and the long-term work behind Fiducaro.',
  },
] as const;

const total = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
const number = (amount: number) => amount.toLocaleString('en-US');
const share = (amount: number) => `${Number(((amount / total) * 100).toFixed(2))}%`;

function point(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return `${160 + radius * Math.cos(radians)},${160 + radius * Math.sin(radians)}`;
}

function slicePath(start: number, end: number) {
  const largeArc = end - start > 180 ? 1 : 0;
  return `M${point(142, start)} A142,142 0 ${largeArc} 1 ${point(142, end)}
    L${point(103, end)} A103,103 0 ${largeArc} 0 ${point(103, start)} Z`;
}

const slices = allocations.map((allocation, index) => {
  const start = (allocations.slice(0, index).reduce((sum, item) => sum + item.amount, 0) / total) * 360;
  return { ...allocation, path: slicePath(start, start + (allocation.amount / total) * 360) };
});

export function TokenAllocation() {
  const [selected, setSelected] = useState(0);
  const detailId = useId();
  const headingId = useId();
  const allocation = allocations[selected];

  return (
    <section
      className={styles.allocation}
      aria-labelledby={headingId}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>THE FIDU ALLOCATION</span>
          <h3 id={headingId}>One token. Four purposes.</h3>
        </div>
        <p>Select a slice to explore its purpose.</p>
      </header>
      <div className={styles.layout}>
        <div className={styles.chartColumn}>
          <svg
            className={styles.chart}
            viewBox="0 0 320 320"
            role="group"
            aria-label="FIDU token allocation"
          >
            {slices.map((slice, index) => (
              <path
                key={slice.name}
                d={slice.path}
                fill={slice.color}
                className={selected === index ? styles.selectedSlice : styles.slice}
                role="button"
                tabIndex={0}
                aria-label={`${slice.name}: ${number(slice.amount)} FIDU, ${share(slice.amount)}`}
                aria-pressed={selected === index}
                aria-controls={detailId}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelected(index);
                  }
                }}
              />
            ))}
            <text
              x="160"
              y="156"
              textAnchor="middle"
              className={styles.total}
            >
              10,000,000
            </text>
            <text
              x="160"
              y="181"
              textAnchor="middle"
              className={styles.totalLabel}
            >
              FIDU ALLOCATED
            </text>
          </svg>
          <div
            className={styles.legend}
            aria-label="Select a token allocation"
          >
            {allocations.map((item, index) => (
              <button
                type="button"
                key={item.name}
                aria-pressed={selected === index}
                aria-controls={detailId}
                className={styles.legendButton}
                style={{ '--allocation-color': item.color } as CSSProperties}
                onClick={() => setSelected(index)}
              >
                <span
                  className={styles.swatch}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
                <strong>{share(item.amount)}</strong>
              </button>
            ))}
          </div>
        </div>
        <div
          id={detailId}
          className={styles.detail}
          style={{ '--allocation-color': allocation.color } as CSSProperties}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={styles.category}>
            <span
              className={styles.swatch}
              aria-hidden="true"
            />
            {allocation.name}
          </span>
          <div className={styles.amount}>
            {number(allocation.amount)} <span>FIDU</span>
          </div>
          <p className={styles.percentage}>{share(allocation.amount)} of the allocation</p>
          <div className={styles.description}>
            <h4>{allocation.purpose}</h4>
            <p>{allocation.description}</p>
          </div>
          <span className={styles.detailFooter}>TOKEN ALLOCATION · {number(total)} FIDU</span>
        </div>
      </div>
    </section>
  );
}
