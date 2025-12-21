# Builder Badge NFT 🚀

> A premium Stacks-native NFT collection and personal vault system, showcasing the power of Clarity 2.0 and Next.js 15.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stacks](https://img.shields.io/badge/Network-Stacks-orange)](https://stacks.co)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org)

## 🌟 Overview

Builder Badge is a dual-utility Web3 platform built for the Stacks ecosystem. It consists of a SIP-009 compliant NFT collection for community recognition and a secure **PasskeyVault** for cryptographic asset protection.

### Key Features
- **NFT Minting:** A high-performance minting engine with SIP-016 compliant metadata on IPFS.
- **PasskeyVault:** A secure personal vault using `secp256k1` signature verification for withdrawals.
- **Stacks v7 Integration:** Seamless wallet connection using `@stacks/connect` with session persistence.
- **Real-time Monitoring:** Integrated Chainhooks for monitoring contract events (mints, deposits, withdrawals).

---

## 🏗️ Technical Architecture

### Smart Contracts (Clarity 2.0)
- **`builder-badge.clar`**: SIP-009 NFT with 3,333 supply, dynamic URIs, and admin controls.
- **`passkey-vault.clar`**: Advanced vault featuring time-locks, contract hash verification, and signature-based authentication.

### Frontend (Next.js 15)
- **Modern UI:** Built with Tailwind CSS, Framer Motion, and Lucide icons.
- **Security:** Patched against Next.js CVE-2025-66478.
- **Provider:** Custom `StacksProvider` context for unified session management.

---

## 🚀 Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet)
- [Node.js](https://nodejs.org) (v18+)
- [Leather](https://leather.io) or [Xverse](https://www.xverse.app) Wallet

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cryptoflops/stacks-builder-badge-nft.git
   cd stacks-builder-badge-nft
   ```

2. **Install frontend dependencies:**
   ```bash
   cd web
   npm install --legacy-peer-deps
   ```

3. **Verify contracts:**
   ```bash
   cd ..
   clarinet check
   ```

### Running Locally
```bash
cd web
npm run dev
```
Navigate to `http://localhost:3000`.

---

## ⛓️ Deployment

### Contracts
To deploy via Clarinet:
```bash
# Testnet
clarinet deployments apply --testnet --no-dashboard

# Mainnet
clarinet deployments apply --mainnet --no-dashboard
```

### Chainhooks
Predicate files are available in the `/chainhooks` directory to facilitate event monitoring on the Hiro Platform.

---

## 📜 Metadata
NFT metadata is SIP-016 compliant and pinned to IPFS:
- **Base URI:** `ipfs://QmYS79t3EaT6X5yK9nS1YhMscYjDyr75sX4zK2Mbm5b4aB/`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Community & Support
- **Author:** [cryptoflops](https://github.com/cryptoflops)
- **Project Link:** [https://web-stacks-builder-badge-nft.vercel.app](https://web-m33syx3kv-cryptoflops00-3036s-projects.vercel.app)
