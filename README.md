# UKULELE Frontend Rebrand

UKULELE is now presented as a premium, minimal, black-and-white brand system with a privacy-first tone. This repo update is intentionally frontend-only: layout, copy, visual identity, static assets, responsiveness, accessibility, and build output.

## Design Direction

- **Brand name:** UKULELE
- **Tagline:** Private by default
- **Primary palette:** `#0E0B16`, `#1A1625`, `#2A2640`, `#7B3FF2`, `#B16AFF`, `#EDEBFF`
- **Accent:** pure white and soft grays over deep black; light is the only accent.
- **Typography:** Montserrat with system fallbacks. Headings are bold, compact, and letter spacing remains neutral.
- **Shape language:** 8px radius cards and buttons, thin translucent borders, dark glass surfaces, no oversized nested cards.
- **Motion:** subtle fade/float effects with `prefers-reduced-motion` support.

## Routes

- `/` - primary UKULELE landing experience
- `/platform` - two-transaction private SEND flow with a downloadable recovery record
- `/decrypt` - full and partial public-balance decryption actions
- `/disruptor` - zero-net `shadowDuster` Transfer records and verified recent activity
- `/gasless` - wallet action surface for SELL and full/partial UI display flows
- `/whitepaper/ukulele-whitepaper.txt` - published plain-text protocol whitepaper
- `/roadmap` - launch sequence and distribution plan
- `/community` - brand kit, social assets, and protocol notes

## Brand Assets

Project-bound assets live in `public/brand`:

- `ukulele-mark.svg` - mark-only logo
- `ukulele-logo.png` - supplied horizontal logo lockup
- `ukulele-hero.png` - generated hero artwork
- `wallpaper-desktop.svg` - desktop wallpaper placeholder
- `wallpaper-mobile.svg` - mobile wallpaper placeholder
- `social-banner.svg` - social banner placeholder
- `favicon.svg` - browser/app icon

Finished protocol explainers live in `public/technical` as optimized WebP assets. Their original
1168 x 880 PNG files remain in `/Users/nik/Documents/ukulele/technical`.

The hero bitmap was generated with the built-in image tool and copied into the workspace at `public/brand/ukulele-hero.png`.

## Protocol Notes

**On-chain:** UKULELE is presented as fully on chain, meaning transactions cannot be manipulated.

**Token contract:** `0x799C411D50d1D67C517A34C842381673E377007c` on Ethereum mainnet.

**Uniswap pool:** Uniswap v4 ETH/UNK pool with a 1% swap fee and tick spacing 200. Pool ID: `0xbcaf2724492673f9157c59bf441d31ffd1623c781179938d36488d2b5a60ed28`.

**Buy UNK:** [Open the official ETH-to-UNK swap on Uniswap](https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0x799C411D50d1D67C517A34C842381673E377007c).

**Naglfar/privacy contract:** `0xfFd73306f9359492e65967ccaE322331a2784b4F`.

**Address registry:** `0xB4C40F697f28aac83777Dc52c597c3C11cc192a4`.

**GSN contract:** No GSN contract is deployed for the current protocol release. The frontend has no fallback GSN address.

**Token supply:** 10,000,000 UNK with 18 decimals.

**Developer distribution:** 100,000 UNK, equal to 1% of the 10,000,000-token supply, is sold daily until 15% remains for the developer.

**Protocol status:** Decentralized, fully finished protocol.

## Manual Finish Steps

1. Replace placeholder SVG/PNG artwork in `public/brand` with final approved production art using the same filenames.
2. Reserve final social handles and add verified links only after they are confirmed.
3. Review `/gasless` copy once final product terminology is approved.
4. Re-run `npm run build` before publishing.

## Gasless Configuration

The website intentionally keeps only ABI/function references. Solidity source should stay outside this repo.

Build-time environment:

```bash
# Optional; there is no default GSN deployment.
NEXT_PUBLIC_GSN_ADDRESS=0x...
NEXT_PUBLIC_PRIVACY_ADDRESS=0x...
NEXT_PUBLIC_GSN_RELAY_URL=https://...
```

Relay environment for `code/webhook.js`:

```bash
GSN_ADDRESS=0x...
RELAY_RPC_URL=https://...
RELAYER_PRIVATE_KEY=...
RELAY_ALLOWED_ORIGIN=https://...
RELAY_GAS_LIMIT=900000
```

When both `NEXT_PUBLIC_GSN_ADDRESS` and `NEXT_PUBLIC_GSN_RELAY_URL` are set, supported actions sign an EIP-712 `GaslessAction` and send it to the relay. No GSN transactions are attempted without an explicitly configured contract address.

## Verification

Run:

```bash
npm ci
npm run build
```

The current build passes with Next static export enabled.
