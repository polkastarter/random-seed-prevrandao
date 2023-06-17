// import hre from "hardhat";
import { ethers, network } from "hardhat";
import { abort } from "process";
import * as readline from "readline";

import { mine, mineUpTo } from "@nomicfoundation/hardhat-network-helpers";

const BLOCKTIME = 15; // average Ethereum BlockTime in seconds
const PERIOD_HARDHAT = 24 * 60 * 60; // 1 day (simulated time periods) on hardhat
const PERIOD_BLOCKCHAIN = 60; // 1 minutes on "real" blockchains

export function absDiff(a: bigint | number, b: bigint | number): bigint {
    if (a > b) {
        return BigInt(a) - BigInt(b);
    } else {
        return BigInt(b) - BigInt(a);
    }
}

/**
 * Block helper functions
 */

// Returns the latest mined block number.
export async function getBlockNumber(): Promise<number> {
    const blockNumber: number = await ethers.provider.getBlockNumber();
    return blockNumber;
}

// Forces blocks to be mined until the the target block height is reached.
export async function mineBlock() {
    await mine();
}

// Forces blocks to be mined until the the target block height is reached.
export async function mineBlocks(amount: number) {
    await mine(amount, { interval: BLOCKTIME });
}

// Mines new blocks until the latest block number is blockNumber
// blockNumber: Must be greater than the latest block's number.
export async function mineBlocksUpTo(blockNumber: number) {
    await mineUpTo(blockNumber);
}


/**
 * @note return a appropriate timePeriod depending on blockchain used
 * @returns timePeriod (interval) used for testing in seconds
 */
export function timePeriod(): number {
    return network.name == "hardhat" ? PERIOD_HARDHAT : PERIOD_BLOCKCHAIN;
}

export const consoleLog_timestamp = async (t0: number) => {
    const currentTime = await getTimestamp();
    console.log("currentTime =", currentTime, "period =", (currentTime - t0) / timePeriod());
};


// console.log a string and a time in human readable format converted to days
export function logStringTime(text: string, t: number) {
    console.log(text, (t / timePeriod()).toFixed(3));
};

// export const logCurrentTimeRelative = async () => {
//     const currentTime = await getTimestamp();
//     logStringTime("current relative time :", currentTime - globalTestStartTime);
// };


/**
 * @dev helper function to get block.timestamp from hardhat provider
 * @returns block.timestamp in unix epoch time (seconds)
 */
export const getBlockTimestamp = async (): Promise<number> => {
    const block = await ethers.provider.getBlock("latest");

    if (block != null) {
        return block.timestamp;
    } else
        return 0;
};

export const getTimestamp = async (): Promise<number> => {
    let currentTime: number;
    if (network.name == "hardhat") {
        currentTime = await getBlockTimestamp();
    } else {
        currentTime = Math.floor(Date.now() / 1000);
    }
    return currentTime;
};

/**
 * @dev helper function for hardhat local blockchain to move time
 * @param timeAmount in seconds blockchain time should move forward
 */
export const moveTime = async (timeAmount: number): Promise<number> => {
    console.log("Jumping ", timeAmount, "seconds into the future ...");
    await ethers.provider.send("evm_increaseTime", [timeAmount]);
    await ethers.provider.send("evm_mine", []);
    const blockNumber = await ethers.provider.getBlockNumber();
    const timeNow = await getBlockTimestamp();
    console.log("moveTime : timeNow =", timeNow);
    console.log("----------------------------------------------------------------------------");
    return timeNow;
};

/**
 * @dev move time forward on hardhat
 * @dev wait if on a "real" blockchain
 * @param waitSeconds in seconds blockchain time should move forward
 */
export const waitTime = async (waitSeconds: number): Promise<number> => {
    if (waitSeconds < 0) {
        console.log("ERROR : waitTime is negative", waitSeconds);
        abort;
    }

    let newTime: number;
    if (network.name == "hardhat") {
        newTime = await moveTime(waitSeconds);
    } else {
        for (let s = waitSeconds; s > 0; s--) {
            // console.log(s, "seconds to wait     \r");
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(s + " seconds to wait     ");
            await new Promise(f => setTimeout(f, 1000));
        }
        // process.stdout.write("\n");
        readline.cursorTo(process.stdout, 0);
        newTime = Math.floor(Date.now() / 1000);
    }
    return newTime;
};

/**
 * @dev to move time to an absolute time in the future
 * @param time in unix epoch seconds
 */
export const setTime = async (time: number): Promise<number> => {
    console.log("----------------------------------------------------------------------------");
    console.log("setTime : Jumping to unix time :", time);

    if (network.name == "hardhat") {
        await ethers.provider.send("evm_setNextBlockTimestamp", [time]);
        await ethers.provider.send("evm_mine", []);
    } else {
        const now = await getTimestamp();
        await waitTime(time - now);
    }

    const timeNow = await getTimestamp();
    console.log("----------------------------------------------------------------------------");
    return timeNow;
};
