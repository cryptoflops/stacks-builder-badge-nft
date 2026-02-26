import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export type NetworkMode = "mainnet" | "testnet";

export function getNetworkMode(): NetworkMode {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("stacks-network-mode");
        if (stored === "mainnet" || stored === "testnet") return stored;
    }
    return "mainnet";
}

export function setNetworkMode(mode: NetworkMode) {
    if (typeof window !== "undefined") {
        localStorage.setItem("stacks-network-mode", mode);
        window.location.reload();
    }
}

export function getConfig() {
    const isMainnet = getNetworkMode() === "mainnet";

    return {
        network: isMainnet ? STACKS_MAINNET : STACKS_TESTNET,
        networkName: isMainnet ? 'mainnet' : 'testnet',
        badgeContractAddress: isMainnet ? ADDRESS_MAINNET : ADDRESS_TESTNET,
        badgeContractName: 'builder-badge',
        vaultContractAddress: isMainnet ? ADDRESS_MAINNET : ADDRESS_TESTNET,
        vaultContractName: 'passkey-vault',
    };
}
