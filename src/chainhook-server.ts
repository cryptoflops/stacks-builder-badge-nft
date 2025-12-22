import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3002;
const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to save event to local file
function saveEvent(event: any) {
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        const events = JSON.parse(fileContent);

        // Add timestamp and unique ID
        const eventWithMeta = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            ...event
        };

        events.unshift(eventWithMeta);

        // Keep only last 50 events
        const limitedEvents = events.slice(0, 50);

        fs.writeFileSync(DATA_FILE, JSON.stringify(limitedEvents, null, 2));
        console.log(`💾 Event persisted to ${DATA_FILE}`);
    } catch (error) {
        console.error('❌ Error saving event:', error);
    }
}

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
 * Public API to fetch recent activity
 */
app.get('/api/activity', (req, res) => {
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        res.status(200).json(JSON.parse(fileContent));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read events' });
    }
});

/**
 * Endpoint for Builder Badge NFT Events
 */
app.post('/api/events', (req, res) => {
    const payload = req.body as ChainhookPayload;
    console.log('\n🎨 [NFT] Received Builder Badge Event');

    processEvents(payload, (event) => {
        if (event.data.value.event === "mint") {
            const { buyer, "token-id": tokenId, price } = event.data.value;
            console.log(`   ✨ New Mint: Token #${tokenId} bought by ${buyer} for ${price} uSTX`);
            saveEvent({ type: 'nft_mint', ...event.data.value });
        }
    });

    res.status(200).json({ received: true });
});

/**
 * Endpoint for Passkey Vault Events
 */
app.post('/api/vault-events', (req, res) => {
    const payload = req.body as ChainhookPayload;
    console.log('\n🔒 [VAULT] Received Passkey Vault Event');

    processEvents(payload, (event) => {
        const data = event.data.value;
        const baseEvent = { type: 'vault_action', ...data };

        switch (data.event) {
            case "pubkey-registered":
                console.log(`   👤 Vault Created: ${data.user} registered a new pubkey`);
                saveEvent(baseEvent);
                break;
            case "deposit":
                console.log(`   💰 Deposit: ${data.user} added ${data.amount} uSTX (New Balance: ${data['new-balance']})`);
                saveEvent(baseEvent);
                break;
            case "withdrawal":
                console.log(`   💸 Withdrawal: ${data.user} withdrew ${data.amount} uSTX (Remaining: ${data['remaining-balance']})`);
                saveEvent(baseEvent);
                break;
            case "time-lock-set":
                console.log(`   ⏳ Time-Lock: ${data.user} locked vault until height ${data['unlock-at']}`);
                saveEvent(baseEvent);
                break;
        }
    });

    res.status(200).json({ received: true });
});

/**
 * Helper to process the complex Chainhook payload
 */
function processEvents(payload: ChainhookPayload, handler: (event: any) => void) {
    if (!payload || !payload.apply) return;

    payload.apply.forEach(block => {
        block.transactions.forEach(tx => {
            if (tx.metadata && tx.metadata.kind && tx.metadata.kind.data && tx.metadata.kind.data.success) {
                tx.metadata.receipt.events.forEach(event => {
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
    console.log(`   Activity API:  http://localhost:${port}/api/activity`);
    console.log(`   Badge Hooks:   http://localhost:${port}/api/events`);
    console.log(`   Vault Hooks:   http://localhost:${port}/api/vault-events`);
});
