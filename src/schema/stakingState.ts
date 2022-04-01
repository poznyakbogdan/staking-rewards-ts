import * as BufferLayout from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export class MetadataState {
    public admin: PublicKey;
    public stakingTokenMint: PublicKey;
    public rewardTokenMint: PublicKey;
    public totalSupply: BN;
    public lastUpdateTimestamp: BN; 
    
    constructor(obj: any) {
        this.admin = new PublicKey(obj.admin);
        this.stakingTokenMint = new PublicKey(obj.stakingTokenMint);
        this.rewardTokenMint = new PublicKey(obj.rewardTokenMint);
        this.totalSupply = obj.totalSupply;
        this.lastUpdateTimestamp = obj.lastUpdateTimestamp;
    }
}

export class UserStakingState {
    public balance: BN;
    public rewardPerTokenPaid: BN; 
    public rewards: BN; 
    
    constructor(obj: any) {
        this.balance = obj.balance;
        this.rewardPerTokenPaid = obj.rewardPerTokenPaid;
        this.rewards = obj.rewards;
    }
}

const metadataSchema = new Map([
    [
        MetadataState, 
        { 
            kind: 'struct', 
            fields: [
                ['admin', [32]], 
                ['stakingTokenMint', [32]], 
                ['rewardTokenMint', [32]],
                ['totalSupply', 'u64'],
                ['rewardPerTokenStored', 'u64'],
                ['lastUpdateTimestamp', 'u64'],
            ]
        }
    ]
]);

const userStakingSchema = new Map([
    [
        UserStakingState, 
        { 
            kind: 'struct', 
            fields: [
                ['balance', 'u64'],
                ['rewardPerTokenPaid', 'u64'],
                ['rewards', 'u64']
            ]
        }
    ]
]);

const STAKING_STATE_LAYOUT = BufferLayout.struct<any>([
    BufferLayout.blob(32, 'admin'),
    BufferLayout.blob(32, 'stakingTokenMint'),
    BufferLayout.blob(32, 'rewardTokenMint'),
    BufferLayout.blob(8, 'totalSupply'),
    BufferLayout.blob(8, 'rewardPerTokenStored'),
    BufferLayout.blob(8, 'lastUpdateTimestamp')
]);

const USER_STAKING_STATE_LAYOUT = BufferLayout.struct<any>([
    BufferLayout.blob(8, 'balance'),
    BufferLayout.blob(8, 'rewardPerTokenPaid'),
    BufferLayout.blob(8, 'rewards')
]);

export { metadataSchema, STAKING_STATE_LAYOUT, USER_STAKING_STATE_LAYOUT, userStakingSchema };