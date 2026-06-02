# Stacks Chainhooks Guide ⚡️

> Orchestrate real-time event monitoring for your contracts on Testnet and Mainnet.

This guide explains how to use the provided Chainhook predicates in this repository to monitor NFT mints and Vault interactions.

## 🏗️ Requirements

To successfully deploy and run a Chainhook, you need three components:

1.  **Predicate Files**: The logic that defines what to monitor (found in `/chainhooks`).
2.  **Event Server**: An HTTP endpoint capable of receiving and processing POST requests.
3.  **Registration**: Activating the hook on the [Hiro Platform](https://platform.hiro.so) or via a local scanner.

---

## 🛠️ Step 1: Prepare the Event Server

Your server must handle a JSON payload delivered via HTTP POST. A basic implementation is provided in the repository logic.

### Local Development (Tunneling)
If your server is running on `localhost:3002`, you must use a tunneling service to provide a public URL for the Hiro Platform to reach.

#### Option 1: Localtunnel (Zero Installation - Recommended)
```bash
npx localtunnel --port 3002
```

#### Option 2: Ngrok (Requires Account)
```bash
ngrok http 3002
```

### Production
For production, use your Vercel/Cloudflare deployment URL.
- **Endpoint 1**: `/api/events` (Badge Mints)
- **Endpoint 2**: `/api/vault-events` (Vault Actions)
- **Activity API**: `/api/activity` (GET request for recent events)

---

## 📄 Step 2: Configure Predicates

Review the files in the `/chainhooks` directory. Ensure the `contract_identifier` matches your deployed contracts and the URLs point to port `3002` (if local).

- **`badge-events.yaml`**: Monitors `print_event` for `builder-badge`.
- **`vault-events.yaml`**: Monitors `print_event` for `passkey-vault`.

> [!IMPORTANT]
> Change the `authorization_header` to a secure Bearer token in production to verify requests are coming from Hiro.

---

## 🚀 Step 3: Registration

### Option A: Hiro Platform (Recommended)
1.  Log in to [platform.hiro.so](https://platform.hiro.so).
2.  Create a new **Chainhook**.
3.  Select **Upload Manifest** and upload your `.yaml` file.
4.  The platform will immediately start scanning for events.

### Option B: Local CLI
If you prefer to run a local scanner:

### 1. Start Event Server
This local server receives JSON payloads from Chainhook.
```bash
npm run server
# Listening at http://localhost:3002
```

### 2. Register Chainhook
```bash
# Register a local chainhook instance
clarinet chainhook register chainhooks/badge-events.yaml --mainnet
```

---

## 📊 Event Examples

### Mint Event
When a user mints a Builder Badge, your server will receive:
```json
{
  "contract_identifier": "SP1TN...M3CKVJJ.builder-badge",
  "event": {
    "type": "print_event",
    "value": { "event": "mint", "token-id": "1", "buyer": "..." }
  }
}
```

---

## 🛡️ Security Best Practices
- **Verify Signatures**: In a professional setup, verify the Hiro payload signature.
- **Rate Limiting**: Protect your event endpoints from spam.
- **Idempotency**: Ensure your service can handle duplicate event deliveries gracefully.
