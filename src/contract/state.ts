import { PublicKey } from "@solana/web3.js";
import { getConnection } from "../config";
import { metadataSchema, MetadataState, userStakingSchema, UserStakingState } from "../schema/stakingState";
import { findMetadataPda, findUserStatePda } from "./pda";
import * as borsh from "borsh";

export async function getMetadata(stakingTokenMint: PublicKey, rewardsTokenMint: PublicKey) {
    let metadataPda = await findMetadataPda(stakingTokenMint, rewardsTokenMint);
    let connection = getConnection();

    let accountInfo = await connection.getAccountInfo(metadataPda[0]);
    let state = borsh.deserialize(metadataSchema, MetadataState, accountInfo?.data as Buffer);
    
    console.log(`--------Staking Metadata--------`);
    console.log(`admin: ${state.admin.toBase58()}`);
    console.log(`totalSupply: ${state.totalSupply.toNumber()}`);
    console.log(`lastUpdateTimestamp: ${state.lastUpdateTimestamp.toNumber()}`);
    console.log(`stakingTokenMint: ${state.stakingTokenMint.toBase58()}`);
    console.log(`rewardTokenMint: ${state.rewardTokenMint.toBase58()}`);
} 

export async function getUserState(user: PublicKey, metadata: PublicKey) {
    let [userStatePda, _] = await findUserStatePda(user, metadata); 

    let connection = getConnection();

    let accountInfo = await connection.getAccountInfo(userStatePda);
    let state = borsh.deserialize(userStakingSchema, UserStakingState, accountInfo?.data as Buffer);

    console.log(`--------${user.toBase58()}--------`);
    console.log(`balance: ${state.balance.toNumber()}`);
    console.log(`rewardPerTokenPaid: ${state.rewardPerTokenPaid.toNumber()}`);
    console.log(`rewards: ${state.rewards.toNumber()}`);
}