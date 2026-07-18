# GreenStake Shashikant

## Links
- [Live site](https://green-stake-mocha.vercel.app/)
- [Demo video](#demo-video)
- [Project details](#project-details)
- [Contract details](#contract-details)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Screenshots](#screenshots)
- [Local setup](#local-setup)
- [Scripts](#scripts)
- [App routes](#app-routes)

## Project details
GreenStake is a tree-plantation verification app built with Next.js and a Soroban smart contract.

### Live site
- https://green-stake-mocha.vercel.app/

### Demo video
- https://drive.google.com/file/d/1bWOhtKgSNgE365eaci0XivH2lps4qiAB/view?usp=sharing

### Basic stack
- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS 4
- Animation/UI: Framer Motion, Lucide icons
- Wallets: Stellar Wallets Kit
- Image storage: Pinata upload API + IPFS gateway URL
- Contract: Soroban SDK 27, Rust, Stellar

### What this project does
- Planter uploads photo to Pinata, then submits claim with IPFS URI, grid cell, and stake
- Wallet connect uses Stellar Wallets Kit
- Verifiers review claim and vote
- Approved claim returns stake and pays fixed reward
- Rejected claim refunds stake
- Expired or cancelled claims free claim slots again

## User Feedback
| Feedback | Solution | Commit ID |
|----------|----------|-----------|
| The submit button lacks a clear animated loading state other than the spinner. | Added pulse animation to button when processing | `312eba6` |
| The input fields do not have a prominent focus ring when clicked. | Added focus:ring-2 and focus:ring-forest to input elements | `3c32a2d` |
| Nav links are a bit static on hover. | Increased background opacity and added scale transform on hover | `6917b4c` |
| Claim cards don't pop enough when hovering over them. | Added shadow-xl and increased translateY on hover | `9433078` |
| The pending status badge color blends in too much. | Updated Pending badge to be brighter amber with a border | `7e2b6c6` |
| The empty state on the dashboard is confusing when filters hide all claims. | Appended 'Try adjusting filters' to the empty state message | `ad734f1` |
| The statistical numbers in the counter are too small. | Increased font size to text-7xl and made them extrabold | `082d936` |
| The hero section text is hard to read against the busy background. | Added drop-shadow-md to hero headings | `7ce7e8d` |
| The footer lacks visual separation from the rest of the page. | Added a top margin and subtle shadow to the footer | `e01d78d` |
| The tree growth visualizer lacks a continuous pulse effect. | Added animate-pulse to the canopy rings | `8f8566c` |

## Contract details
Contract lives in [`contract/src/lib.rs`](./contract/src/lib.rs).

### Contract name
- `tree-planting-verification`

### Current deployed contract
- `CAAWZAJZ6HNZ7VQTPUT6M6N4SKOAVGW5V7NO6Y5B4LHF5Q7CJST5G5TG`

### Core state
- Admin address
- Authorized verifier set
- Next claim ID
- Claim records
- Photo URI index
- Grid cell index
- Vote lists for approve and reject

### Main functions
- `init`: sets admin and verifier set
- `submit_claim`: stores claim, transfers stake, indexes photo and grid cell
- `vote`: records verifier vote and closes claim after 2 approvals or 2 rejections
- `update_claim`: lets planter update pending claim
- `cancel_claim`: lets planter cancel pending claim
- `expire_claim`: closes stale claim after expiry ledger
- `get_claim`: returns one claim
- `list_claims`: returns claims with optional status filter

### Claim rules
- Photo URI must stay unique
- Grid cell must stay unique
- Stake must be positive
- Verifier can vote once per claim
- Two approvals trigger payout
- Two rejections trigger refund
- Expired claims release indexes

## How it works
1. Planter picks photo and app uploads it to Pinata.
2. App stores returned `ipfs://CID` on-chain with grid cell and stake.
3. Contract locks stake and stores claim as `Pending`.
4. Authorized verifiers vote on claim.
5. Two approvals move claim to `Approved` and pay out reward.
6. Two rejections move claim to `Rejected` and refund stake.
7. Expired or cancelled claims clear reserved indexes.

## Project structure
```text
.
├── app
│   ├── page.tsx
│   ├── submit
│   ├── dashboard
│   ├── how-it-works
│   └── why-stellar
├── components
├── contract
│   ├── Cargo.toml
│   ├── deploy.sh
│   └── src/lib.rs
├── lib
└── README.md
```

## Screenshots
Add app screenshots here when ready.

| Screenshot 1 | Screenshot 2 |
|--------------|--------------|
| Home page<br><br>`docs/screenshots/home.png` | Submit claim form<br><br>`docs/screenshots/submit.png` |
| Dashboard<br><br>`docs/screenshots/dashboard.png` | How it works<br><br>`docs/screenshots/how.png` |
| CI<br><br>`docs/screenshots/ci.png` | Mobile responsive<br><br>`docs/screenshots/mobile-responsive.png` |

## Local setup
### Frontend
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Frontend checks
```bash
npm run typecheck
npm run lint
```

### Contract build
```bash
npm run contract:build
```

### CD / Docker
- `Dockerfile` added for containerized deployment.
- Next uses `output: "standalone"` so Docker image can run without full source tree.
- Build image with `docker build -t greenstake-shashikant:local .`

### Environment variables
- `NEXT_PUBLIC_CONTRACT_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_NETWORK_PASSPHRASE`
- `NEXT_PUBLIC_PINATA_GATEWAY`
- `PINATA_JWT`
- `PINATA_GATEWAY`
- `ADMIN_ADDRESS`

## Scripts
- `npm run dev`: start Next.js dev server
- `npm run build`: build frontend
- `npm run typecheck`: run TypeScript check
- `npm run lint`: run ESLint
- `npm run contract:build`: build Soroban contract to `wasm32v1-none`

## App routes
- `/` - landing page
- `/submit` - claim submission flow
- `/dashboard` - claim dashboard
- `/how-it-works` - contract flow explanation
- `/why-stellar` - Stellar rationale

## Notes
- `contract/deploy.sh` builds, deploys, and initializes contract on Stellar testnet.
- Current testnet contract ID is `CAAWZAJZ6HNZ7VQTPUT6M6N4SKOAVGW5V7NO6Y5B4LHF5Q7CJST5G5TG`.
- Contract schema now stores `ipfs://CID` strings, so redeploy contract and refresh `NEXT_PUBLIC_CONTRACT_ID` after this change.
- CI uses `npm install --no-package-lock` so frontend checks do not depend on `package-lock.json`.
- Dashboard and claim pages render photo from Pinata/IPFS URI, not local file path.

## Verification Results
- `npm run test`: 4 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `docker build -t greenstake-shashikant:local .`: Docker daemon required locally.
