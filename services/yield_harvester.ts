import * as anchor from '@coral-xyz/anchor'; // Imports the Anchor framework for interacting with Solana programs.
import { Connection, PublicKey, Keypair } from '@solana/web3.js'; // Imports core Solana web3 tools for connections, addresses, and keys.
import * as dotenv from 'dotenv'; // Imports the library to pull secrets (like API keys) from your .env file into the script.
import * as fs from 'fs'; // Imports the File System library to read files (like your wallet's keypair) from your computer.

// 1. Setup & Environment
dotenv.config(); // Loads the variables from your .env file so they are available in 'process.env'.

/**
 * yield_harvester.ts
 * 
 * This is the Tier 2 "Crank" service. 
 * It acts as the heartbeat of the protocol, periodically checking the vault 
 * and applying "Yield" to reduce the global debt.
 */

// Your credit-engine program ID
const PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Sets the permanent address of your smart contract so the bot knows where to look.

async function startHarvester() { // Defines an asynchronous function that will run the background bot logic.
    console.log("🚜 Starting the YieldStation Harvester (The Crank)..."); // Prints a message to let you know the bot is waking up.

    // Load the Helius RPC
    const heliusApiKey = process.env.HELIUS_API_KEY; // Grabs your Helius API key from the environment.
    if (!heliusApiKey) { // Checks if you forgot to add your API key to the .env file.
        console.error("❌ ERROR: HELIUS_API_KEY missing."); // Prints a helpful error if the key is gone.
        process.exit(1); // Shuts down the script immediately with an error status (1).
    } // Closes the if statement.

    const connection = new Connection(`https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`, 'confirmed'); // Establishes a formal connection to the Solana blockchain via Helius.

    // For this MVP, we need a wallet to pay for the "Crank" transactions.
    // In production, this would be a secure 'hot wallet' owned by the protocol admin.
    let adminKeypair: Keypair; // Declares a variable to hold the "admin" wallet that will sign the bot's transactions.
    try { // Attempts to find and load an existing wallet file.
        const secretKey = JSON.parse(fs.readFileSync('./admin-keypair.json', 'utf8')); // Reads the 'admin-keypair.json' file and parses its contents.
        adminKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKey)); // Converts the file data into a valid Solana Keypair object.
    } catch (e) { // Runs if the 'admin-keypair.json' file doesn't exist yet.
        console.warn("⚠️  No admin-keypair.json found. Creating a temporary one for this session..."); // Warns you that it's creating a new, temporary wallet.
        adminKeypair = Keypair.generate(); // Generates a brand new throwaway public/private keypair.
        console.log("Temporary Public Key:", adminKeypair.publicKey.toBase58()); // Prints the address of the new temporary wallet.
        console.log("Note: This key needs SOL to send transactions. Use 'solana airdrop 1' on Devnet."); // Reminds you that even bots need to pay gas (SOL) for transactions.
    } // Closes the catch block.

    // --- Simulation Logic ---
    // In a real protocol, you'd fetch the actual balance from the vault account.
    // Here, we'll poll the Program State every 30 seconds.
    
    setInterval(async () => { // Starts a timer that will repeat the following code block forever.
        console.log("\n--- [CRANK CYCLE START] ---"); // Prints a header so you can see when a new cycle begins in the logs.
        
        try { // Starts a block of code and watches for any errors during the cycle.
            // we skip the actual Anchor IDL fetch for this script to keep it simple and standalone
            // In the next step, we will use the full @coral-xyz/anchor library to call instructions.
            
            console.log("🔍 Checking YieldStation State..."); // Logs that the bot is now "looking" at the blockchain data.
            
            // --- MOCK YIELD CALCULATION ---
            // For now, let's pretend our vault has earned 10 "CRED" worth of interest
            const mockYieldStored = 10; // Creates a fake yield amount to demonstrate the "debt shaving" math.
            
            if (mockYieldStored > 0) { // Checks if there is any harvested yield ready to be applied.
                console.log(`✨ Yield Detected! Attempting to shave off ${mockYieldStored} from total debt.`); // Logs precisely how much debt the bot is about to pay off.
                
                // --- THE SELF-REPAYMENT MAGIC ---
                // This is where the script would call: 
                // await program.methods.applyYield(new anchor.BN(mockYieldStored)).accounts({ state, admin }).rpc();
                
                console.log(`✅ SUCCESS: Applied ${mockYieldStored} yield. Total borrowed amount decreased.`); // Logs a successful "shave" event after the math finishes.
                console.log("🚀 YieldStation: Your money just worked for you."); // Prints a motivational message highlighting the protocol's value proposition.
            } else { // Runs if there is no yield (zero) to harvest yet.
                console.log("😴 No significant yield to harvest yet. Sleeping..."); // Logs that the bot is going back to sleep until the next cycle.
            } // Closes the yield check if statement.
            
        } catch (err) { // Runs if anything went wrong (like a lost internet connection).
            console.error("❌ Crank Failure:", err); // Logs the specific error that stopped the cycle.
        } // Closes the try/catch block.
        
    }, 30000); // Sets the "heartbeat" interval to 30,000 milliseconds (30 seconds).
} // Closes the startHarvester function.

startHarvester().catch(console.error); // Kicks off the entire harvester process and catches any top-level startup errors.
