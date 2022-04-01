import { AccountMeta, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionCtorFields, TransactionInstruction, TransactionInstructionCtorFields } from "@solana/web3.js";
import { getConnection, getMintAuthKeyPair, getStakingAuthKeyPair, getStakingProgramId } from "../config";
import { createTokenAccount, mintTokensTo } from "../createMint";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as PdaHelper from "./pda";

let escrowStakingTokenAccount: PublicKey;
let escrowRewardsTokenAccount: PublicKey;

export async function initializeStaking(stakeTokenMint: PublicKey, rewardTokenMint: PublicKey) {
    let authority = await getStakingAuthKeyPair();
    let feePayer = await getMintAuthKeyPair();
    let metadata_acc = await PdaHelper.findMetadataPda(stakeTokenMint, rewardTokenMint);
    let escrowStakingTokenAcc = await createEscrowStakingTokenAccount(stakeTokenMint);
    let escrowRewardsTokenAcc = await createEscrowRewardsTokenAccount(rewardTokenMint);
    
    await mintTokensTo(rewardTokenMint, escrowRewardsTokenAcc, 1000);
    
    let data = Buffer.from([0]);
    
    let ix = new TransactionInstruction({
        data,
        keys: [
            { pubkey: authority.publicKey, isSigner: true, isWritable: true } as AccountMeta,
            { pubkey: metadata_acc[0], isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: stakeTokenMint, isSigner: false, isWritable: false } as AccountMeta,
            { pubkey: rewardTokenMint, isSigner: false, isWritable: false } as AccountMeta,
            { pubkey: escrowStakingTokenAcc, isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: escrowRewardsTokenAcc, isSigner: false, isWritable: true } as AccountMeta,
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false } as AccountMeta,
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false } as AccountMeta,
        ],
        programId: getStakingProgramId(),
    } as TransactionInstructionCtorFields);

    let connection = getConnection();
    let recentBlockHash = await connection.getLatestBlockhash();
    
    let tx = new Transaction({
        recentBlockHash,
        feePayer: feePayer.publicKey
    } as TransactionCtorFields);
    
    tx.add(ix);

    let hash = await sendAndConfirmTransaction(connection, tx, [feePayer, authority]);
    console.log(`Staking initialized at ${hash}`);
}

async function createEscrowStakingTokenAccount(stakeTokenMint: PublicKey) : Promise<PublicKey> {
    let [pda, _] = await PdaHelper.findEscrowStakingTokenPda(stakeTokenMint);
    escrowStakingTokenAccount = await createTokenAccount(stakeTokenMint, pda);
    return escrowStakingTokenAccount;
}

async function createEscrowRewardsTokenAccount(rewardTokenMint: PublicKey) : Promise<PublicKey> {
    let [pda, _] = await PdaHelper.findEscrowRewardsTokenPda(rewardTokenMint);
    escrowRewardsTokenAccount = await createTokenAccount(rewardTokenMint, pda);
    return escrowRewardsTokenAccount;
}

export function getEscrowStakingTokenAccount() {
    return escrowStakingTokenAccount;
}

export function getEscrowRewardsTokenAccount() {
    return escrowRewardsTokenAccount;
}