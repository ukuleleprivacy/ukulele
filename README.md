# FIDUCARO Ethereum Test Case

FIDUCARO is an experimental Ethereum mainnet case study for a two-transaction private-balance workflow, public balance restoration, and the difference between emitted token events and final contract state. The interface is intended for reproducible, small-value trials—not investment, production use, or a claim of guaranteed privacy.

Transactions use real assets and gas. A tester can acquire roughly 100 FIDU through the verified ETH/FIDU Uniswap v4 pool, then exercise SEND, Decrypt, and Disruptor while recording what the wallet and chain actually show.

## Design Direction

- **Brand name:** FIDUCARO
- **Tagline:** An on-chain privacy test case
- **Primary palette:** `#0E0B16`, `#1A1625`, `#2A2640`, `#7B3FF2`, `#B16AFF`, `#EDEBFF`
- **Accent:** pure white and soft grays over deep black; light is the only accent.
- **Typography:** Montserrat with system fallbacks. Headings are bold, compact, and letter spacing remains neutral.
- **Shape language:** 8px radius cards and buttons, thin translucent borders, dark glass surfaces, no oversized nested cards.
- **Motion:** subtle fade/float effects with `prefers-reduced-motion` support.

## Routes

- `/` - test-case overview, safety boundaries, and verified pool entry point
- `/platform` - experimental two-transaction SEND flow with a downloadable recovery record
- `/decrypt` - full and partial public-balance decryption actions
- `/disruptor` - zero-net `shadowDuster` Transfer records and verified recent activity
- `/gasless` - wallet action surface for SELL and full/partial UI display flows
- `/whitepaper/fiducaro-whitepaper.txt` - published plain-text protocol whitepaper
- `/roadmap` - repeatable test and review plan
- `/community` - test notes, reference assets, and observation guidance

## Brand Assets

Project-bound assets live in `public/brand`:

- `fiducaro-mark.svg` - mark-only logo
- `fiducaro-logo.png` - supplied horizontal logo lockup
- `fiducaro-hero.png` - generated hero artwork
- `wallpaper-desktop.svg` - desktop wallpaper placeholder
- `wallpaper-mobile.svg` - mobile wallpaper placeholder
- `social-banner.svg` - social banner placeholder
- `favicon.svg` - browser/app icon

Protocol explainers live in `public/technical` as optimized WebP assets. Their original
1168 x 880 PNG files remain in `/Users/nik/Documents/Fiducaro/technical`.

The hero bitmap was generated with the built-in image tool and copied into the workspace at `public/brand/fiducaro-hero.png`.

## Protocol Notes

**Test environment:** Ethereum mainnet. Calls, gas costs, receipts, calldata, and event logs are real and publicly observable.

**Token contract:** `0x799C411D50d1D67C517A34C842381673E377007c` on Ethereum mainnet.

**Direct Uniswap pool:** [Open the verified Uniswap v4 ETH/FIDU pool](https://app.uniswap.org/explore/pools/ethereum/0xbcaf2724492673f9157c59bf441d31ffd1623c781179938d36488d2b5a60ed28). It uses a 1% swap fee, tick spacing 200, and no hook. Pool ID: `0xbcaf2724492673f9157c59bf441d31ffd1623c781179938d36488d2b5a60ed28`.

**Get test tokens:** [Open an ETH-to-FIDU swap prefilled for approximately 100 FIDU](https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0x799C411D50d1D67C517A34C842381673E377007c&field=output&value=100). Review the live quote, price impact, token address, and network cost before confirming. This is a test convenience, not an investment suggestion.

**Naglfar/privacy contract:** `0xfFd73306f9359492e65967ccaE322331a2784b4F`.

**Address registry:** `0xB4C40F697f28aac83777Dc52c597c3C11cc192a4`.

**GSN contract:** No GSN contract is deployed for the current protocol release. The frontend has no fallback GSN address.

**Token supply:** 10,000,000 FIDU with 18 decimals.

**Developer distribution:** 100,000 FIDU, equal to 1% of the 10,000,000-token supply, is sold daily until 15% remains for the developer.

**Protocol status:** Experimental, unaudited mainnet test case. No privacy, security, or production-readiness guarantee is made.

## Manual Finish Steps

1. Replace placeholder SVG/PNG artwork in `public/brand` with approved test-case art using the same filenames.
2. Reserve final social handles and add verified links only after they are confirmed.
3. Review `/gasless` copy once the next experiment scope is approved.
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
