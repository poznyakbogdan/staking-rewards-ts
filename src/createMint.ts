import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, Signer } from "@solana/web3.js";
import * as config from "./config";

async function createToken(tokenMint: PublicKey) {
    let connection = config.getConnection();
    let payer = await config.getPayer();
    return new Token(connection, tokenMint, TOKEN_PROGRAM_ID, payer);
}

export interface ICreateMint {
    publicKey: PublicKey;
}

export async function createTokenAccount(tokenMint: PublicKey, account: PublicKey) : Promise<PublicKey> {
    let token = await createToken(tokenMint);
    let tokenAccount = await token.createAccount(account);
    return tokenAccount;
}

export async function mintTokensTo(tokenMint: PublicKey, toAccount: PublicKey, amount: number) {
    let authority = await config.getMintAuthKeyPair();
    let token = await createToken(tokenMint);
    await token.mintTo(toAccount, authority, [], amount);
}

export async function createMint(decimals: number = 0) : Promise<ICreateMint> {
    let connection = config.getConnection();
    let payer: Signer = await config.getPayer();
    let mintAuth: PublicKey = await config.getMintAuth();
    let freezeAuth: PublicKey = await config.getFreezeAuth();

    let createMintResult = await Token.createMint(connection, payer, mintAuth, freezeAuth, decimals, TOKEN_PROGRAM_ID);
    return {
        publicKey: createMintResult.publicKey
    } as ICreateMint;
}