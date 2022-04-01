import { PublicKey } from "@solana/web3.js";
import { getStakingProgramId } from "../config";
import * as BufferLayout from "@solana/buffer-layout";

export async function findMetadataPda(stakingTokenMint: PublicKey, rewardsTokenMint: PublicKey) : Promise<[PublicKey, number]> {
    const SEED_STRING = "metadata";
    let bytesForSeed = new Uint8Array(SEED_STRING.length);
    BufferLayout.cstr().encode(SEED_STRING, bytesForSeed);
    let seeds = [
        stakingTokenMint.toBytes(),
        rewardsTokenMint.toBytes(),
        bytesForSeed
    ];
    let stakingProgramId = getStakingProgramId();
    return await PublicKey.findProgramAddress(seeds, stakingProgramId);
}

export async function findEscrowStakingTokenPda(stakingTokenMint: PublicKey) : Promise<[PublicKey, number]> {
    const SEED_STRING = "staking-token";
    let bytesForSeed = new Uint8Array(SEED_STRING.length);
    BufferLayout.cstr().encode(SEED_STRING, bytesForSeed);
    let seeds = [
        stakingTokenMint.toBytes(),
        bytesForSeed
    ];
    let stakingProgramId = getStakingProgramId();
    return await PublicKey.findProgramAddress(seeds, stakingProgramId);
}

export async function findEscrowRewardsTokenPda(rewardsTokenMint: PublicKey) : Promise<[PublicKey, number]> {
    const SEED_STRING = "rewards-token";
    let bytesForSeed = new Uint8Array(SEED_STRING.length);
    BufferLayout.cstr().encode(SEED_STRING, bytesForSeed);
    let seeds = [
        rewardsTokenMint.toBytes(),
        bytesForSeed
    ];
    let stakingProgramId = getStakingProgramId();
    return await PublicKey.findProgramAddress(seeds, stakingProgramId);
}

export async function findUserStatePda(user: PublicKey, metadata: PublicKey) : Promise<[PublicKey, number]> {
    const SEED_STRING = "user-state";
    let bytesForSeed = new Uint8Array(SEED_STRING.length);
    BufferLayout.cstr().encode(SEED_STRING, bytesForSeed);
    let seeds = [
        metadata.toBytes(),
        user.toBytes(),
        bytesForSeed
    ];
    let stakingProgramId = getStakingProgramId();
    return await PublicKey.findProgramAddress(seeds, stakingProgramId);
}