import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AccountMeta, PublicKey, sendAndConfirmTransaction, Signer, SystemProgram, Transaction, TransactionCtorFields, TransactionInstruction, TransactionInstructionCtorFields } from "@solana/web3.js";
import { getConnection, getStakingProgramId } from "../config";
import BN from "bn.js";
import { findMetadataPda, findUserStatePda } from "./pda";

export async function stake(
    staker: Signer, 
    stakerToken: PublicKey, 
    escrowStakingToken: PublicKey, 
    amount: number, 
    stakingTokenMint: PublicKey, 
    rewardsTokenMint: PublicKey) 
    {
    let amountBytes = new BN(amount).toArray("le", 8);
    let data = Buffer.of(1, ...amountBytes);
    let metadata = await findMetadataPda(stakingTokenMint, rewardsTokenMint);
    let [userStatePda, _] = await findUserStatePda(staker.publicKey, metadata[0]);
    let ix = new TransactionInstruction({
        data,
        keys: [
            { pubkey: staker.publicKey, isSigner: true, isWritable: false } as AccountMeta,
            { pubkey: stakerToken, isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: escrowStakingToken, isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: userStatePda, isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: metadata[0], isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: stakingTokenMint, isSigner: false, isWritable: false } as AccountMeta,
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false } as AccountMeta,
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false } as AccountMeta,
        ],
        programId: getStakingProgramId(),
    } as TransactionInstructionCtorFields);

    let connection = getConnection();
    let recentBlockHash = await connection.getLatestBlockhash();
    
    let tx = new Transaction({
        recentBlockHash,
        feePayer: staker.publicKey
    } as TransactionCtorFields);
    
    tx.add(ix);

    let hash = await sendAndConfirmTransaction(connection, tx, [staker]);
    console.log(`${staker.publicKey.toBase58()} staked ${amount} tokens in ${hash}`);
}