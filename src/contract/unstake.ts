import { AccountMeta, PublicKey, sendAndConfirmTransaction, Signer, Transaction, TransactionCtorFields, TransactionInstruction, TransactionInstructionCtorFields } from "@solana/web3.js";
import { getConnection, getStakingProgramId } from "../config";
import { getEscrowStakingTokenAccount } from "./initialize";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import { findEscrowStakingTokenPda, findMetadataPda, findUserStatePda } from "./pda";

export async function unstake(user: Signer, userStakingToken: PublicKey, amount: number, stakingTokenMint: PublicKey, rewardsTokenMint: PublicKey) {
    let programId = getStakingProgramId();
    let [metadata, _1] = await findMetadataPda(stakingTokenMint, rewardsTokenMint);
    let [userStatePda, _2] = await findUserStatePda(user.publicKey, metadata);
    let escrowStakingToken = await getEscrowStakingTokenAccount();
    let [escrowStakingTokenOwner, _3] = await findEscrowStakingTokenPda(stakingTokenMint);
    
    let ix = new TransactionInstruction({
        programId: programId,
        data: createData(amount),
        keys: [
            {pubkey: user.publicKey, isSigner: true, isWritable: false} as AccountMeta,
            {pubkey: userStakingToken, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: userStatePda, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: metadata, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: escrowStakingToken, isSigner: false, isWritable: true} as AccountMeta,
            {pubkey: escrowStakingTokenOwner, isSigner: false, isWritable: false} as AccountMeta,
            {pubkey: stakingTokenMint, isSigner: false, isWritable: false} as AccountMeta,
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
    console.log(`${user.publicKey.toBase58()} unstaked ${amount} tokens in ${hash}`);
}

function createData(amount: number) : Buffer {
    let amountBytes = new BN(amount).toArray("le", 8);
    let data = Buffer.of(2, ...amountBytes);
    return data;
}