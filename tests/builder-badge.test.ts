
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { tx } from "@stacks/clarinet-sdk";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe("Builder Badge NFT (Edition Model)", () => {

  it("should enforce mint fee of 0.1 STX", () => {
    // Mint #1
    const block = simnet.mineBlock([
      tx.callPublicFn("builder-badge", "mint", [], address1),
    ]);

    expect(block[0].result).toBeOk(Cl.uint(1));

    // Check STX transfer event
    const stxEvent = block[0].events.find(
      (e: any) => e.event === "stx_transfer_event"
        && e.data.sender === address1
        && e.data.amount === "100000"
    );
    expect(stxEvent).toBeDefined();
    expect(stxEvent?.data.recipient).toBe(deployer);
  });

  it("should return the same static URI for any ID", () => {
    // Mint #1
    simnet.mineBlock([
      tx.callPublicFn("builder-badge", "mint", [], address1),
    ]);

    const expectedUri = "ipfs://Qmd286K6pohQcTKYqnS1YhMscYjDyr75sX4zK2Mbm5b4aB/1.json";

    // Check ID 1
    const uri1 = simnet.callReadOnlyFn(
      "builder-badge", "get-token-uri", [Cl.uint(1)], address1
    );
    expect(uri1.result).toBeOk(Cl.some(Cl.stringAscii(expectedUri)));

    // Check ID 999 (should be same)
    const uri999 = simnet.callReadOnlyFn(
      "builder-badge", "get-token-uri", [Cl.uint(999)], address1
    );
    expect(uri999.result).toBeOk(Cl.some(Cl.stringAscii(expectedUri)));
  });

  it("should allow admin to update token URI", () => {
    const newUri = "ipfs://NewHash/metadata.json";

    // Non-admin fail
    const failBlock = simnet.mineBlock([
      tx.callPublicFn("builder-badge", "set-token-uri", [Cl.stringAscii(newUri)], address1),
    ]);
    expect(failBlock[0].result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED

    // Admin success
    const block = simnet.mineBlock([
      tx.callPublicFn("builder-badge", "set-token-uri", [Cl.stringAscii(newUri)], deployer),
    ]);
    expect(block[0].result).toBeOk(Cl.bool(true));

    // Verify update
    const uri = simnet.callReadOnlyFn(
      "builder-badge", "get-token-uri", [Cl.uint(1)], address1
    );
    expect(uri.result).toBeOk(Cl.some(Cl.stringAscii(newUri)));
  });

  it("should fail validation on insufficient funds", () => {
    // Blind drain of 100,000,000 STX (default balance) from address2
    simnet.mineBlock([
      tx.transferSTX(100000000000000, deployer, address2),
    ]);

    // Now try to mint (should fail)
    const block = simnet.mineBlock([
      tx.callPublicFn("builder-badge", "mint", [], address2),
    ]);

    // Expect err u1 (insufficient funds)
    expect(block[0].result).toBeErr(Cl.uint(1));
  });
});
