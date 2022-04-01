import { getAliceKeyPair, getAlicePublicKey, getBobKeyPair, getBobPublicKey } from "./config";
import { getEscrowStakingTokenAccount, initializeStaking } from "./contract/initialize";
import { stake } from "./contract/stake";
import { createMint, createTokenAccount, mintTokensTo } from "./createMint";
import { unstake } from "./contract/unstake";
import { getMetadata, getUserState } from "./contract/state";
import { findMetadataPda } from "./contract/pda";
import { getRewards } from "./contract/getRewards";

async function init() {
    let mintAResult = await createMint(0);
    let mintBResult = await createMint(0);
    console.log("Token mint address: " + mintAResult.publicKey.toBase58());

    let alicePublicKey = getAlicePublicKey();
    let bobPublicKey = getBobPublicKey();

    let aliceStakingTokenAccount = await createTokenAccount(mintAResult.publicKey, alicePublicKey);
    let aliceRewardsTokenAccount = await createTokenAccount(mintBResult.publicKey, alicePublicKey);
    let bobTokenAccount = await createTokenAccount(mintAResult.publicKey, bobPublicKey);

    console.log("Alice token address: " + aliceStakingTokenAccount.toBase58());
    console.log("Bob token address: " + bobTokenAccount.toBase58());

    await mintTokensTo(mintAResult.publicKey, aliceStakingTokenAccount, 12);
    await mintTokensTo(mintAResult.publicKey, bobTokenAccount, 20);

    console.log("Successfully minted");

    await initializeStaking(mintAResult.publicKey, mintBResult.publicKey);
    
    let aliceKeypair = await getAliceKeyPair();
    let bobKeypair = await getBobKeyPair();
    let escrowStakingToken = getEscrowStakingTokenAccount();

    await stake(aliceKeypair, aliceStakingTokenAccount, escrowStakingToken, 5, mintAResult.publicKey, mintBResult.publicKey);
    await stake(bobKeypair, bobTokenAccount, escrowStakingToken, 8, mintAResult.publicKey, mintBResult.publicKey);

    let [metadataPda, _] = await findMetadataPda(mintAResult.publicKey, mintBResult.publicKey);
    await getUserState(aliceKeypair.publicKey, metadataPda);
    await getUserState(bobKeypair.publicKey, metadataPda);

    await getMetadata(mintAResult.publicKey, mintBResult.publicKey);

    await stake(aliceKeypair, aliceStakingTokenAccount, escrowStakingToken, 5, mintAResult.publicKey, mintBResult.publicKey);
    await getUserState(aliceKeypair.publicKey, metadataPda);
    await getMetadata(mintAResult.publicKey, mintBResult.publicKey);
    
    await unstake(aliceKeypair, aliceStakingTokenAccount, 6, mintAResult.publicKey, mintBResult.publicKey);

    await getUserState(aliceKeypair.publicKey, metadataPda);
    await getMetadata(mintAResult.publicKey, mintBResult.publicKey);

    await getRewards(aliceKeypair, aliceRewardsTokenAccount, mintAResult.publicKey, mintBResult.publicKey);

    await getUserState(aliceKeypair.publicKey, metadataPda);
    await getMetadata(mintAResult.publicKey, mintBResult.publicKey);
}

init()
    .then()
    .catch(console.error);