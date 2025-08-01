# Protofy — Decentralized Startup Launchpad

Protofy is a Web3-native platform for launching and funding early-stage startup projects via a decentralized, milestone-based governance system. Built entirely with smart contracts on the Stacks blockchain using Clarity, Protofy empowers communities to support vetted startups transparently.

---

## 🧠 Overview

This system includes ten core smart contracts that collectively power the Protofy launchpad. From proposal submissions to milestone-based funding and dispute resolution, every element is executed on-chain for full transparency and decentralization.

### Smart Contract Components:

1. **Project Factory** — Deploys and registers new startup launch projects.
2. **Project Escrow** — Handles milestone-based fund release to founders.
3. **Proposal Registry** — Stores all submitted startup proposals.
4. **Governance DAO** — Manages proposal approvals and milestone voting.
5. **Milestone Tracker** — Logs project progress and supports impact oracle submissions.
6. **Backer Staking** — Allows users to stake in pre-launch proposal pools.
7. **KYC Registry** — Ensures verified identity for project founders.
8. **Participation NFT** — Issues NFTs to early backers and milestone validators.
9. **Token Contract** — Issues the native `PROTO` token for governance and rewards.
10. **Dispute Resolution** — Enables DAO-driven arbitration for milestone or fund release disputes.

---

## 🚀 Features

- Decentralized project launch and vetting
- DAO-governed proposal approval
- Milestone-based fund release with oracle input
- Backer incentives via staking and NFTs
- Identity verification via on-chain KYC registry
- Transparent dispute resolution process
- Tokenized participation and reputation

---

## 📜 Smart Contracts

### **1. Project Factory**
- Deploys new startup projects with escrow + governance hooks
- Registers active projects and associates founders

### **2. Project Escrow**
- Holds investor funds until milestones are approved
- Supports partial or full disbursement based on DAO votes and oracles

### **3. Proposal Registry**
- Maintains metadata and status of all submitted startup proposals
- Connects with governance contract for voting and history

### **4. Governance DAO**
- Proposal voting by token holders
- Also governs milestone verification and disputes

### **5. Milestone Tracker**
- Stores milestone definitions and completion status
- Receives oracle-submitted proofs (e.g., user metrics, product demos)

### **6. Backer Staking**
- Allows early supporters to stake `PROTO` in promising proposals
- Earns yield or reputation regardless of project success

### **7. KYC Registry**
- Maps founders to decentralized identity credentials
- Enforces KYC requirements for proposal eligibility

### **8. Participation NFT**
- Issues NFTs to early-stage backers and validators
- Used for reputation, governance weight, or event access

### **9. Token Contract**
- Native `PROTO` token for staking, rewards, and governance
- Supports minting, burning, and DAO-controlled inflation

### **10. Dispute Resolution**
- Handles arbitration for milestone disputes
- Requires bonded DAO arbitrators to vote on outcomes

---

## ⚙️ Installation

1. Install [Clarinet CLI](https://docs.stacks.co/docs/clarity/clarinet-cli/)
2. Clone this repository:
   ```bash
   git clone https://github.com/your-org/protofy-launchpad.git
   cd protofy-launchpad
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## 🧪 Testing

All contract tests are written using Clarinet, with mocked interactions and edge case coverage.

Run tests with:
```bash
npm test
```

## 📘 Usage

Each smart contract serves a unique role within the launchpad system. You can deploy them independently or as part of a full stack. Refer to individual contract folders for detailed interfaces and examples.

Example project lifecycle:

1. Founder submits proposal via Proposal Registry
2. DAO votes to approve using Governance DAO
3. Backers stake PROTO to support
4. Project funds locked in Escrow
5. Oracles submit milestone proofs to Tracker
6. DAO releases funds per milestone
7. Disputes (if any) resolved via Dispute Resolution

## 🛡 License

MIT License