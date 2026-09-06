export const brand = {
  name: 'FIDUCARO',
  tagline: 'Unseen. Unbreakable. Unmatched.',
  description:
    'FIDUCARO is a settlement layer for privacy preserving transactions on the blockchain; expanding into all digital assets - with reserves being managed by OmniOne Bank.',
  twitterUrl: 'https://x.com/fiducaroprivacy',
  omniOneUrl: 'https://omnione.netlify.app',
  palette: {
    neon: '#66FF8A',
    neonLight: '#9AFFB0',
    neonDark: '#24D85E',
    white: '#EDF1F2',
    silver: '#9AA6AD',
    black: '#010403',
    ink: '#050A07',
    graphite: '#0B1510',
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
  { label: 'Bridge', url: '/gasless' },
  { label: 'Activity', url: '/activity' },
];

export const pillars = [
  {
    title: 'The Engine',
    description:
      "A former uncrackable, totally on-chain privacy token, light years ahead of competition. That's what powers the Fiducaro bridge underneath, securing all your assets privately.",
  },
  {
    title: 'Automation',
    description:
      'Over the course of hours, to days, based on traffic, your assets are securely moved from one address to others, across asset classes and with peace of mind with a full refund guaranteed if failure occurs.',
  },
  {
    title: 'Top Tier Customer Support',
    description:
      "No more AI BS, speak to a dedicated customer service support specialist if your asset classes fail to transfer along the way. With our dedicated specialists, you'll get your money and with ATMs placed strategically, you can get cash, check or wire.",
  },
  {
    title: 'Stake & Earn',
    description:
      "Crypto's point is to facilitate the transfer of money, by staking assets, you can transfer assets to a new asset class and help facilitate the private bridge necessary, while it takes time, you'll earn interest with minimal risk.",
  },
];

export const roadmap = [
  {
    title: 'Live Foundation',
    description: 'FIDUCARO is deployed on Ethereum with SEND, Decrypt, and Disruptor ready for use.',
    nextTitle: 'Raise Funds',
    nextDescription:
      'Fiducaro needs to get a small Series A or large Seed funding round to complete the necessary bridge update.',
  },
  {
    title: 'Strengthen the Vault',
    description: 'Advance the hidden-balance layer, recovery controls, and user-owned transaction records.',
    nextTitle: 'Setup the Bridge',
    nextDescription:
      'The network goes live with assets allowed to be swapped privately as well as staking.',
  },
  {
    title: 'Expand Retrieval',
    description: 'Make full and selective Decrypt faster, clearer, and more powerful across the interface.',
    nextTitle: 'Real World Presence',
    nextDescription:
      'The creation of full cash ATMs in various countries as well as a bank card applicable only in certain countries.',
  },
  {
    title: 'Scale the Disruptor',
    description: 'Extend public-chain signal control while preserving zero-net final balance state.',
    nextTitle: 'Network Effects',
    nextDescription:
      'Aegis Shield is created, lobbying and other key targets are informed about the Privacy Wolf Pact.',
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
  { label: 'Bridge upgrade path', path: '/technical/10.webp' },
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
