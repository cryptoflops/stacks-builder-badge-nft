import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// 🛑 FORCE MAINNET: Bypassing env vars to ensure production stability
// The discrepancy between Vercel env vars and client-side execution caused Testnet fallback
// which conflicts with the user's Mainnet wallet.
const isMainnet = true;

// Validated Mainnet Address from 'default.mainnet-plan.yaml' (41 chars)
// Previous attempt with 39 chars was likely invalid/truncated, causing 'Unexpected error'.
const ADDRESS_MAINNET = 'SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ';
const ADDRESS_TESTNET = 'ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P';

export const config = {
    network: isMainnet ? STACKS_MAINNET : STACKS_TESTNET,
    networkName: isMainnet ? 'mainnet' : 'testnet',

    badgeContractAddress: isMainnet ? ADDRESS_MAINNET : ADDRESS_TESTNET,
    badgeContractName: 'builder-badge',

    vaultContractAddress: isMainnet ? ADDRESS_MAINNET : ADDRESS_TESTNET,
    vaultContractName: 'passkey-vault',
};

console.log('Stacks Config Locked:', {
    network: config.networkName,
    badgeAddress: config.badgeContractAddress,
    forcedMainnet: isMainnet
});
