# GreenStake Shashikant

## Links
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

### Basic stack
- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS 4
- Animation/UI: Framer Motion, Lucide icons
- Wallets: Stellar Wallets Kit
- Contract: Soroban SDK 27, Rust, Stellar

### What this project does
- Planter submits tree claim with photo hash, grid cell, and stake
- Wallet connect uses Stellar Wallets Kit
- Verifiers review claim and vote
- Approved claim returns stake and pays fixed reward
- Rejected claim refunds stake
- Expired or cancelled claims free claim slots again

## Contract details
Contract lives in [`contract/src/lib.rs`](./contract/src/lib.rs).

### Contract name
- `tree-planting-verification`

### Core state
- Admin address
- Authorized verifier set
- Next claim ID
- Claim records
- Photo hash index
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
- Photo hash must stay unique
- Grid cell must stay unique
- Stake must be positive
- Verifier can vote once per claim
- Two approvals trigger payout
- Two rejections trigger refund
- Expired claims release indexes

## How it works
1. Planter submits claim with photo hash, grid cell, and stake.
2. Contract locks stake and stores claim as `Pending`.
3. Authorized verifiers vote on claim.
4. Two approvals move claim to `Approved` and pay out reward.
5. Two rejections move claim to `Rejected` and refund stake.
6. Expired or cancelled claims clear reserved indexes.

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

Suggested set:
- Home page
- Submit claim form
- Dashboard with claim cards
- How it works flow
- Why Stellar page

Suggested path:
- `docs/screenshots/home.png`
- `docs/screenshots/submit.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/how-it-works.png`

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
- CI uses `npm install --no-package-lock` so frontend checks do not depend on `package-lock.json`.
