import { AccountMeta, PublicKey, sendAndConfirmTransaction, Signer, Transaction, TransactionCtorFields, TransactionInstruction, TransactionInstructionCtorFields } from "@solana/web3.js";
import { getConnection, getStakingProgramId } from "../config";
import { getEscrowRewardsTokenAccount } from "./initialize";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { findEscrowRewardsTokenPda, findMetadataPda, findUserStatePda } from "./pda";

export async function getRewards(user: Signer, userRewardsToken: PublicKey, stakingTokenMint: PublicKey, rewardsTokenMint: PublicKey) {
    let programId = getStakingProgramId();
    let [metadata, _1] = await findMetadataPda(stakingTokenMint, rewardsTokenMint);
    let [userStatePda, _2] = await findUserStatePda(user.publicKey, metadata);
    let escrowRewardsToken = await getEscrowRewardsTokenAccount();
    let [escrowRewardsTokenOwner, _3] = await findEscrowRewardsTokenPda(rewardsTokenMint);
    
    let ix = new TransactionInstruction({
        programId: programId,
        data: createData(),
        keys: [
            {pubkey: user.publicKey, isSigner: true, isWritable: false} as AccountMeta,
            {pubkey: userRewardsToken, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: userStatePda, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: metadata, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: escrowRewardsToken, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: escrowRewardsTokenOwner, isSigner: false, isWritable: false} as AccountMeta,
            {pubkey: rewardsTokenMint, isSigner: false, isWritable: false} as AccountMeta,
            {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false} as AccountMeta,
        ]
    } as TransactionInstructionCtorFields);
    
    let connection = getConnection();
    let recentBlockHash = await connection.getLatestBlockhash();
    
    let tx = new Transaction({
        recentBlockHash,
        feePayer: user.publicKey,
    } as TransactionCtorFields);
    
    tx.add(ix);

    let hash = await sendAndConfirmTransaction(connection, tx, [user]);
    console.log(`${user.publicKey.toBase58()} claimed rewards in ${hash}`);
}

function createData() : Buffer {
    return Buffer.from([3]);
}