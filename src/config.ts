import { Connection, PublicKey, Signer } from "@solana/web3.js";
import { getKeyPairFromFile } from "./utils";
import config from "./config.json";

const connection = new Connection("http://localhost:8899", "confirmed");

export function getConfig() : object {
    return config;
}

export async function getAliceKeyPair() : Promise<Signer> {
    let keyPair = await getKeyPairFromFile(config.accounts.alice.skPath);
    return keyPair;
}

export async function getBobKeyPair() : Promise<Signer> {
    let keyPair = await getKeyPairFromFile(config.accounts.bob.skPath);
    return keyPair;
}

export function getAlicePublicKey() : PublicKey {
    let pkString = config.accounts.alice.pk;
    return new PublicKey(pkString);
}

export function getBobPublicKey() : PublicKey {
    let pkString = config.accounts.bob.pk;
    return new PublicKey(pkString);
}

export async function getMintAuth() : Promise<PublicKey> {
    let keyPair = await getKeyPairFromFile(config.accounts.mintAuth.skPath);
    return keyPair.publicKey;
}

export async function getStakingAuth() : Promise<PublicKey> {
    let keyPair = await getKeyPairFromFile(config.accounts.stakingAuth.skPath);
    return keyPair.publicKey;
}

export async function getMintAuthKeyPair() : Promise<Signer> {
    let keyPair = await getKeyPairFromFile(config.accounts.mintAuth.skPath);
    return keyPair;
}

export async function getStakingAuthKeyPair() : Promise<Signer> {
    let keyPair = await getKeyPairFromFile(config.accounts.stakingAuth.skPath);
    return keyPair;
}

export async function getFreezeAuth() : Promise<PublicKey> {
    let keyPair = await getKeyPairFromFile(config.accounts.freezeAuth.skPath);
    return keyPair.publicKey;
}

export function getConnection() : Connection {
    return connection;
}

export async function getDefaultPayer() : Promise<Signer> {
    return await getKeyPairFromFile("/Users/poznyakbogdan/.config/solana/prograrm1.json");
}

export function getStakingProgramId() : PublicKey {
    return new PublicKey(config.stakingProgramId);
}

export async function getPayer() : Promise<Signer> {
    return await getDefaultPayer();
}