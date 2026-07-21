export const brand = {
  name: 'FIDUCARO',
  tagline: 'Private value. Public disruption. Live on Ethereum.',
  description:
    'FIDUCARO is a live Ethereum protocol for burying balances, retrieving hidden value, and projecting zero-net transfer signals onto the public record.',
  telegramUrl: 'https://t.me/+qMHrV95v_rAxYTE1',
  twitterHandle: '@fiducaroprivacy',
  twitterUrl: 'https://x.com/fiducaroprivacy',
  palette: {
    neon: '#34E0D0',
    neonLight: '#6FF0E4',
    neonDark: '#15B7A8',
    white: '#EDF1F2',
    silver: '#9AA6AD',
    black: '#0B0D0E',
    ink: '#14181B',
    graphite: '#1F252A',
    pearl: '#C4CDD2',
  },
};

// Cut-out obsidian sculpture shapes (transparent PNG/WebP) used as decorative accents.
export const shapes = Array.from(
  { length: 18 },
  (_, i) => `/shapes/shape-${String(i + 1).padStart(2, '0')}.webp`,
);

export const navItems = [
  { label: 'Home', url: '/' },
  { label: 'Send', url: '/platform' },
  { label: 'Decrypt', url: '/decrypt' },
  { label: 'Disruptor', url: '/disruptor' },
  { label: 'Gasless', url: '/gasless' },
  { label: 'Protocol', url: '/community' },
];

export const pillars = [
  {
    title: 'Private SEND',
    description: 'Bury value through an explicit two-part Ethereum transaction sequence.',
  },
  {
    title: 'Hidden balance',
    description: 'Move FIDU beneath the ordinary public-balance surface while retaining control.',
  },
  {
    title: 'Selective retrieval',
    description: 'Unbury the entire hidden balance or retrieve only the amount you choose.',
  },
  {
    title: 'Public disruption',
    description: 'Cast a decoy Transfer signal onto Etherscan with zero lasting balance movement.',
  },
];

export const roadmap = [
  {
    title: 'Live Foundation',
    description: 'FIDUCARO is deployed on Ethereum with SEND, Decrypt, and Disruptor ready for use.',
  },
  {
    title: 'Strengthen the Vault',
    description: 'Advance the hidden-balance layer, recovery controls, and user-owned transaction records.',
  },
  {
    title: 'Expand Retrieval',
    description: 'Make full and selective Decrypt faster, clearer, and more powerful across the interface.',
  },
  {
    title: 'Scale the Disruptor',
    description: 'Extend public-chain signal control while preserving zero-net final balance state.',
  },
];

export const protocolNotes = [
  {
    title: 'Live on Ethereum',
    description: 'SEND, Decrypt, and Disruptor execute through deployed contracts on Ethereum mainnet.',
  },
  {
    title: 'User-commanded execution',
    description:
      'Every action begins in the interface, requires explicit wallet approval, and resolves on chain.',
  },
  {
    title: 'Visible chain surface',
    description: 'Ethereum metadata and emitted events remain public even when value enters the hidden-balance layer.',
  },
];

export const brandAssets = [
  { label: 'Logo', path: '/01.png' },
  { label: 'Hero artwork', path: '/brand/fiducaro-hero.png' },
  { label: 'Desktop wallpaper', path: '/brand/wallpaper-desktop.png' },
  { label: 'Mobile wallpaper', path: '/brand/wallpaper-mobile.png' },
  { label: 'Social banner', path: '/brand/social-banner.png' },
  { label: 'Event log and final state', path: '/technical/event-log-final-state.webp' },
  { label: 'Private balance lifecycle', path: '/technical/private-balance-lifecycle.webp' },
  { label: 'Private flow', path: '/technical/private-flow.webp' },
  { label: 'Private vault', path: '/technical/private-vault.webp' },
  { label: 'Gasless upgrade path', path: '/technical/10.webp' },
];

export const protocolVisuals = [
  {
    label: 'Private Balance Lifecycle',
    path: '/technical/private-balance-lifecycle.webp',
    alt: 'FIDUCARO Private Balance Lifecycle from public balance through private transfer and selective retrieval',
  },
  {
    label: 'Event Log and Final State',
    path: '/technical/event-log-final-state.webp',
    alt: 'Ethereum event log and final contract state shown as two distinct views of one transaction',
  },
  {
    label: 'The Private Vault',
    path: '/technical/private-vault.webp',
    alt: 'The FIDUCARO Private Vault shown as a protected protocol chamber for hidden value',
  },
  {
    label: 'Private Flow',
    path: '/technical/private-flow.webp',
    alt: 'FIDUCARO flow from public balance to private balance and full or partial Decrypt',
  },
  {
    label: 'Private Balance Architecture',
    path: '/technical/private-balance-architecture.webp',
    alt: 'FIDUCARO private balance architecture showing send, transfer, recipient, and retrieval paths',
  },
  {
    label: 'Vault System',
    path: '/technical/private-vault-system.webp',
    alt: 'Engineering systems view of the FIDUCARO Private Vault',
  },
];

export const protocolCapabilities = [
  {
    title: 'Bury Value',
    body: [
      'Private SEND drives FIDU beneath the ordinary public-balance surface through two deliberate Ethereum confirmations.',
      'A private recovery record is forged between PART I and PART II so the route remains in your custody.',
    ],
  },
  {
    title: 'Retrieve on Command',
    body: [
      'Decrypt unburies the complete hidden balance and restores it to the public wallet surface.',
      'Partial Decrypt retrieves only the amount you choose, leaving the remainder concealed.',
    ],
  },
  {
    title: 'Disrupt the Record',
    body: [
      'Disruptor projects a real Transfer event from one party to another into Etherscan’s public view.',
      'The visible signal survives while the temporary contract balances collapse back to zero net movement.',
    ],
  },
  {
    title: 'Operate With Authority',
    body: [
      'FIDUCARO is live now: its core powers execute on Ethereum and answer to the connected wallet.',
      'The interface exposes every command, recovery checkpoint, and resulting chain record without surrendering user control.',
    ],
  },
];
