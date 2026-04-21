# YieldStation (Work in Progress) ⚙️


**YieldStation** is an open, neutral protocol for proximity-triggered yield generation. It resolves the severe disconnect between physical hardware endpoints (like vending machines, point-of-sale systems, and kiosks) and the speed of decentralized finance (DeFi). 

By natively issuing self-repaying stablecoin loans triggered by real-world physical actions, YieldStation creates win-win economies that orchestrate agentic payments at scale via the Solana Blockchain.

---

## What Does YieldStation Do?
YieldStation bridges the physical world and the Solana ecosystem using a 3-Tier Architecture:
1. **The Edge Layer (Hardware Node):** A stark, brutalist interface running on a physical kiosk displaying a QR code or NFC transmitter.
2. **The Magic Link (Solana Actions & Blinks):** A user taps the Node with their mobile phone. A native UI perfectly unfurls inside their Phantom or Solflare wallet, asking them to deposit SOL collateral. 
3. **The Credit Engine (Smart Contracts & The Crank):** The user receives an instant stablecoin line of credit (CRED) to buy physical goods from the kiosk. The overarching "Crank" bot (Yield Harvester) autonomously reinvests their deposited SOL into yield-generating protocols, and systematically uses the earned interest to permanently shave down the user's debt. 

**TL;DR:** Your money works autonomously in the background to pay off the soda you just bought from a smart vending machine.

---

## Target Market & Audience
YieldStation is engineered for three primary markets:
1. **Real-World Merchants & Vendors:** Looking for zero-fee, instant-settlement smart kiosk terminals without the draconian fees of legacy credit card processors.
2. **Web3 Consumers & Power Users:** Individuals who want instant flash credit for real-world purchases without sacrificing their Solana compound interest or selling their core assets.
3. **Hardware Manufacturers:** Teams building autonomous, agentic hardware economies that require embedded DeFi financial primitives natively.

---

## The Vision
We need a new way to interact with hardware. The old way of interacting with kiosks (Sign up &rarr; link credit card &rarr; KYC delay &rarr; pre-paid commitments) is barely working for a human world, let alone an agentic future. 

YieldStation's vision is **Zero Friction, Zero Wait, Zero Fees, and Zero Centralization**. Simply walk up to a terminal, scan it, and receive instant liquidity backed by your assets while the protocol does the heavy financial lifting on the backend. Yield pays for physical products.

---

## Architecture & Installation Guide

YieldStation is split into three technical tiers. Here is how to run the entire protocol locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) & npm
- [Rust & Cargo](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

### Setup Instructions

First, clone the repository to your local machine:
```bash
git clone https://github.com/your-username/YieldStation.git
cd YieldStation
```

### Tier 1: The Base Layer (Anchor Smart Contract)
This is the core `credit-engine` that holds vaults, calculates Pyth Oracle Loan-To-Value limits, and mints stablecoins.

**Deployment (Fast Track via SolPG):**
1. Head to [beta.solpg.io](https://beta.solpg.io/).
2. Create an Anchor (Rust) project and paste the contents of `programs/credit-engine/src/lib.rs` into the editor.
3. Build and Deploy to the Solana Devnet.
4. Copy the newly generated Program ID and replace it in the Next.js `route.ts` and Node.js `yield_harvester.ts` files.

### Tier 2: The Middleware (The Crank)
This handles asynchronous hardware web-sockets and the autonomous yield harvester bot.

```bash
cd services
npm install
```
1. Rename `services/.env.example` to `services/.env` and inject your Helius API key (`HELIUS_API_KEY=your_key`).
2. Run the RPC event listener or the Yield Harvester:
```bash
npx ts-node yield_harvester.ts
```

### Tier 3: The Edge Layer (Hardware Kiosk UI)
This is the Next.js frontend acting as the literal screen for your physical hardware nodes, emitting Solana Action Blinks.

```bash
cd app
npm install
npm run dev
```

1. Open `http://localhost:3000` to view the active Hardware Node Kiosk UI. 
2. Use a mobile wallet to scan the matrix code, or copy the URL and test it via the [Dialect Validator](https://dial.to).
