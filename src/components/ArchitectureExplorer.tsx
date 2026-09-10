import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si';
import { FiClock, FiPause, FiPlay, FiUser } from 'react-icons/fi';
import { SectionLabel } from './ProtocolUI';

const networkNodes = [[12, 28], [29, 13], [48, 28], [70, 12], [88, 32], [22, 64], [44, 53], [65, 70], [84, 76], [49, 87]];
const networkEdges = [[0,1],[0,5],[0,2],[1,2],[1,3],[2,3],[2,6],[2,4],[3,4],[4,8],[4,7],[5,6],[5,9],[6,7],[6,9],[7,8],[7,9],[8,9]];

function EthereumNetwork() {
  return <div className="ethereum-network" role="img" aria-label="A distributed network of connected Ethereum nodes">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {networkEdges.map(([a,b], i) => <line key={i} x1={networkNodes[a][0]} y1={networkNodes[a][1]} x2={networkNodes[b][0]} y2={networkNodes[b][1]} style={{ animationDelay: `${i * -.3}s` }} />)}
    </svg>
    {networkNodes.map(([x,y], i) => <span className="ethereum-node" key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -.4}s` }}><SiEthereum /></span>)}
    <span className="network-caption">Distributed nodes · Shared settlement</span>
  </div>;
}

const strands = [
  ['M180 85 C340 95 490 155 700 185', 'M180 85 C530 320 340 5 700 185', 'M630 160 C650 160 690 160 710 160'],
  ['M180 150 C340 150 490 210 700 240', 'M180 150 C460 10 530 330 700 240', 'M710 160 C710 190 710 215 710 245'],
  ['M180 220 C340 210 490 125 700 110', 'M180 220 C480 330 440 5 700 110', 'M710 245 C690 245 650 245 630 245'],
  ['M180 285 C340 260 490 235 700 210', 'M180 285 C530 30 370 320 700 210', 'M630 245 C630 215 630 190 630 160'],
];
// Every shape is one M + C segment, so the same eight coordinates interpolate
// directly. Updating the SVG attribute avoids Safari's unsupported CSS d path.
const strandPoints = strands.map(shapes => shapes.map(shape => shape.match(/-?\d+(?:\.\d+)?/g)!.map(Number)));
const shapeTimeline = [[0, 0], [.1, 0], [.27, 1], [.42, 2], [.7, 2], [.85, 1], [1, 0]];
const ease = (value: number) => value * value * (3 - 2 * value);
const ramp = (time: number, start: number, end: number) => ease(Math.max(0, Math.min(1, (time - start) / (end - start))));

function PrivacyWeave({ running = true }: { running?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const paths = root.current!.querySelectorAll<SVGPathElement>('.weave-strand');
    const detail = root.current!.querySelector<SVGGElement>('.weave-lock-detail')!;
    const shackle = root.current!.querySelector<SVGPathElement>('.weave-shackle')!;
    const labels = root.current!.querySelector<SVGGElement>('.weave-labels')!;
    const render = (time: number) => {
      const end = shapeTimeline.findIndex(([at]) => at > time);
      const [fromTime, fromShape] = shapeTimeline[end - 1];
      const [toTime, toShape] = shapeTimeline[end];
      const progress = ramp(time, fromTime, toTime);
      paths.forEach((path, index) => {
        const from = strandPoints[index][fromShape];
        const to = strandPoints[index][toShape];
        const points = from.map((value, i) => (value + (to[i] - value) * progress).toFixed(2));
        path.setAttribute('d', `M${points[0]} ${points[1]} C${points.slice(2).join(' ')}`);
      });
      // Details appear only once the four strands have formed the lock body.
      const visible = ramp(time, .42, .45) * (1 - ramp(time, .66, .7));
      detail.setAttribute('opacity', String(visible));
      shackle.setAttribute('transform', `rotate(${-38 * ramp(time, .5, .59)} 644 160)`);
      labels.setAttribute('opacity', String(1 - .65 * ramp(time, .15, .42) * (1 - ramp(time, .7, .95))));
    };

    if (reduceMotion) {
      render(.49);
      return;
    }
    render((elapsed.current % 12000) / 12000);
    if (!running) return;
    let frame = 0;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) elapsed.current += now - previous;
      previous = now;
      render((elapsed.current % 12000) / 12000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reduceMotion]);

  return <div ref={root} className="privacy-weave" role="img" aria-label="Address, recipient, amount and SALT intertwine into a lock. The lock opens and the strands return to Fiducaro.">
    <svg viewBox="0 0 850 360" aria-hidden="true">
      <text x="26" y="42" className="weave-brand">FIDUCARO</text>
      <g className="weave-labels">{['ADDRESS', 'RECIPIENT', 'AMOUNT', 'SALT'].map((label, i) => <g className="weave-label" key={label}><rect x="24" y={66 + i * 66} width="136" height="40" rx="8" /><text x="37" y={92 + i * 66}>{label}</text></g>)}</g>
      {strands.map(([start], i) => <path key={i} className={`weave-strand strand-${i}`} d={start} />)}
      <g className="weave-lock-detail" opacity="0">
        <path className="weave-shackle" d="M644 160 V136 C644 98 696 98 696 136 V160" />
        <circle cx="670" cy="198" r="7" /><path d="M670 201 V216" />
      </g>
    </svg>
  </div>;
}

function BridgePool() {
  return <div className="bridge-pool" role="img" aria-label="Bitcoin, Ethereum and Solana travel through a shared pool and re-emerge, alongside other participants. Concept settlement window: 72 hours.">
    <div className="bridge-orbit orbit-one" /><div className="bridge-orbit orbit-two" /><div className="bridge-orbit orbit-three" />
    <div className="bridge-vortex" />
    {[SiBitcoin, SiEthereum, SiSolana].map((Icon, i) => <span key={i} className={`bridge-traveler traveler-${i}`}><Icon /></span>)}
    {[0,1,2,3].map(i => <span key={i} className={`bridge-participant participant-${i}`}><FiUser /></span>)}
    <div className="bridge-clock"><FiClock /><strong>72 hours</strong><span>Concept settlement window</span></div>
    <span className="pool-label pool-label-in">ASSETS IN</span><span className="pool-label pool-label-out">ASSETS OUT</span>
  </div>;
}

const panels = [
  { title: 'Ethereum', label: 'The settlement network', headline: 'Decentralized by design.', body: 'Ethereum’s expansive smart contract network provides a distributed foundation for private applications. Independent nodes make the network resilient to censorship and disruption, including pressure from state actors; no network is immune to every threat.', visual: EthereumNetwork },
  { title: 'Fiducaro', label: 'The privacy layer', headline: 'Separate the visible from the private.', body: 'Address, recipient, amount and SALT enter the private workflow. Watch the strands intertwine, form a lock, then open and return—an illustration of private state and selective recovery.', visual: PrivacyWeave },
  { title: 'Bridge', label: 'The next layer · In development', headline: 'Different assets. A shared private route.', body: 'The Bridge vision brings BTC, ETH and SOL through a shared private settlement layer, with participants entering and leaving over time. The 72-hour window is an illustrative concept, not a live service or settlement guarantee.', visual: BridgePool },
];

export function ArchitectureExplorer() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current!);
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  const running = !paused && visible && pageVisible;
  const panel = panels[selected];
  const Visual = panel.visual;
  return <Box ref={root} className={`architecture-explorer explorer-${selected}${running ? '' : ' animations-paused'}`}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} sx={{ mb: 3 }}>
      <Typography component="h3" sx={{ fontSize: 24, fontWeight: 600, '&:focus': { outline: 'none' } }}>Inside the architecture</Typography>
    </Stack>
    <Tabs value={selected} onChange={(_, value) => setSelected(value)} variant="fullWidth" aria-label="Architecture layers" sx={{ borderBottom: '1px solid rgba(255,255,255,.15)', mb: 3 }}>
      {panels.map(({ title }, i) => <Tab key={title} label={title} id={`architecture-tab-${i}`} aria-controls={`architecture-panel-${i}`} />)}
    </Tabs>
    <div role="tabpanel" id={`architecture-panel-${selected}`} aria-labelledby={`architecture-tab-${selected}`} key={selected} className="explorer-content">
      <div className="explorer-copy"><SectionLabel>{panel.label}</SectionLabel><Typography component="h4" sx={{ fontSize: { xs: 28, md: 38 }, lineHeight: 1.12, letterSpacing: '-.035em', mt: 1.5, mb: 2 }}>{panel.headline}</Typography><Typography sx={{ color: 'text.secondary', fontSize: 15, lineHeight: 1.85 }}>{panel.body}</Typography></div>
      <Visual running={running} />
    </div>
    <Button onClick={() => setPaused(value => !value)} startIcon={paused ? <FiPlay /> : <FiPause />} aria-pressed={paused} sx={{ mt: 2, fontSize: 12 }}>{paused ? 'Resume animation' : 'Pause animation'}</Button>
  </Box>;
}
