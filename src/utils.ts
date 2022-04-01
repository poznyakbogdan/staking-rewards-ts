import { CreateAccountParams, Keypair, PublicKey, SystemProgram, Transaction, TransactionCtorFields } from "@solana/web3.js";
import * as fs from "fs";
import { getConnection } from "./config";

export async function getKeyPairFromFile(filePath: string) : Promise<Keypair> {
    if (!fs.existsSync(filePath)) throw new Error(`file does not exist: ${filePath}`);

    let secretKeyString = await fs.promises.readFile(filePath, {encoding: "utf-8"});
    let secretKey =  Uint8Array.from(JSON.parse(secretKeyString));
    let keyPair = Keypair.fromSecretKey(secretKey);
    return keyPair;
}

export async function createSystemAccount(feePayer: Keypair, space: number, programId: PublicKey) : Promise<PublicKey> {
    let connection = getConnection();

    let recentBlockHash = await connection.getLatestBlockhash();
    let tx = new Transaction({
        recentBlockHash,
        feePayer: feePayer.publicKey
    } as TransactionCtorFields);
    
    let lamports = await connection.getMinimumBalanceForRentExemption(space);
    let newAccountKeypair = new Keypair();
    let ix = SystemProgram.createAccount({
        space,
        lamports,
        programId,
        newAccountPubkey: newAccountKeypair.publicKey,
        fromPubkey: feePayer.publicKey
    } as CreateAccountParams);
    tx.add(ix);

    let hash = await connection.sendTransaction(tx, [feePayer, newAccountKeypair]);
    console.log(`Acount ${newAccountKeypair.publicKey.toBase58()} created in tx: ${hash}`);
    return newAccountKeypair.publicKey;
}