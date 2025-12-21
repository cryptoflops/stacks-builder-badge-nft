import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Chainhook payload structure
interface ChainhookPayload {
    apply: {
        block_identifier: {
            index: number;
            hash: string;
        };
        transactions: {
            transaction_identifier: {
                hash: string;
            };
            metadata: {
                kind: {
                    data: {
                        success: boolean;
                        result: string;
                    };
                };
                receipt: {
                    events: any[];
                };
            };
        }[];
    }[];
}

/**
 * Endpoint for Builder Badge NFT Events
 * Predicate: chainhooks/badge-events.yaml
 */
app.post('/api/events', (req, res) => {
    const payload = req.body as ChainhookPayload;
    console.log('\n🎨 [NFT] Received Builder Badge Event');

    processEvents(payload, (event) => {
        if (event.data.value.event === "mint") {
            const { buyer, "token-id": tokenId, price } = event.data.value;
            console.log(`   ✨ New Mint: Token #${tokenId} bought by ${buyer} for ${price} uSTX`);
        }
    });

    res.status(200).json({ received: true });
});

/**
 * Endpoint for Passkey Vault Events
 * Predicate: chainhooks/vault-events.yaml
 */
app.post('/api/vault-events', (req, res) => {
    const payload = req.body as ChainhookPayload;
    console.log('\n🔒 [VAULT] Received Passkey Vault Event');

    processEvents(payload, (event) => {
        const data = event.data.value;
        switch (data.event) {
            case "pubkey-registered":
                console.log(`   👤 Vault Created: ${data.user} registered a new pubkey`);
                break;
            case "deposit":
                console.log(`   💰 Deposit: ${data.user} added ${data.amount} uSTX (New Balance: ${data['new-balance']})`);
                break;
            case "withdrawal":
                console.log(`   💸 Withdrawal: ${data.user} withdrew ${data.amount} uSTX (Remaining: ${data['remaining-balance']})`);
                break;
            case "time-lock-set":
                console.log(`   ⏳ Time-Lock: ${data.user} locked vault until height ${data['unlock-at']}`);
                break;
        }
    });

    res.status(200).json({ received: true });
});

/**
 * Helper to process the complex Chainhook payload
 */
function processEvents(payload: ChainhookPayload, handler: (event: any) => void) {
    if (!payload.apply) return;

    payload.apply.forEach(block => {
        block.transactions.forEach(tx => {
            if (tx.metadata.kind.data.success) {
                tx.metadata.receipt.events.forEach(event => {
                    // Filter for Clarity print() events
                    if (event.type === 'SmartContractEvent' && event.data.topic === 'print') {
                        handler(event);
                    }
                });
            }
        });
    });
}

app.listen(port, () => {
    console.log(`🚀 Chainhook server listening at http://localhost:${port}`);
    console.log(`   Badge Events:  /api/events`);
    console.log(`   Vault Events:  /api/vault-events`);
});
