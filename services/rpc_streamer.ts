import { Connection, PublicKey } from '@solana/web3.js'; // Imports the core Solana tools to connect to the blockchain and handle public keys.
import * as dotenv from 'dotenv'; // Imports the library used to load secret keys (like your Helius API key) from a hidden .env file.

// Load environment variables (e.g., HELIUS_API_KEY)
dotenv.config(); // Triggers the loading process so the script can access your secrets via 'process.env'.

/**
 * rpc_streamer.ts
 * 
 * This is the Tier 2 Middleware "Pub/Sub" service.
 * Instead of wasting API calls asking the blockchain "did anything happen?",
 * we open a persistent WebSocket connection to Helius.
 * 
 * The moment a user interacts with our credit-engine (e.g., a hardware tap),
 * Helius pushes the log data directly to this server in milliseconds.
 */

// Your custom Credit Engine Anchor Program ID
const CREDIT_ENGINE_PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Creates a constant identifier for the smart contract we want to listen to.

async function startStream() { // Declares an asynchronous function to start the live listener service.
    console.log("🚀 Initializing YieldStation RPC Streamer..."); // Prints a message to your terminal indicating the startup process has begun.

    const heliusApiKey = process.env.HELIUS_API_KEY; // Retrieves your Helius API key from the environment variables we loaded earlier.
    if (!heliusApiKey) { // Checks if the API key is missing (if you forgot to create or fill your .env file).
        console.error("❌ ERROR: HELIUS_API_KEY is missing from your .env file."); // Prints an error message to the console for your debugging.
        console.error("Please sign up at dev.helius.xyz, get your free key, and add it to services/.env"); // Provides instructions on where to get the missing key.
        process.exit(1); // Shuts down the script immediately with an error status (1) because we can't continue without a connection.
    } // Closes the if statement.

    // Connect to the Helius Devnet using BOTH standard HTTP and WebSockets (WSS)
    // WSS is what enables the low-latency push notifications.
    const rpcUrl = `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`; // Constructs the standard web address for sending individual data requests to Helius.
    const wssUrl = `wss://devnet.helius-rpc.com/?api-key=${heliusApiKey}`; // Constructs the "WebSocket" address which allows Helius to "push" data to us without us asking.
    
    const connection = new Connection(rpcUrl, { // Creates a new connection object to manage the dialogue between this script and the Solana blockchain.
        wsEndpoint: wssUrl, // Tells the connection specifically where to find the WebSocket "push" notification endpoint.
        commitment: 'confirmed' // Sets the security level: we only care about transactions that have been confirmed by the validators.
    }); // Closes the Connection configuration.

    console.log(`📡 Connected to Helius WSS API. Listening for events on Program: ${CREDIT_ENGINE_PROGRAM_ID.toBase58()}`); // Logs a successful connection message showing the monitored program ID.

    // System Design: Event-Driven Architecture
    // We subscribe specifically to logs emitted by our program.
    const subscriptionId = connection.onLogs( // Starts the subscription process. We are telling Helius: "Watch these account logs for me."
        CREDIT_ENGINE_PROGRAM_ID, // Specifies which program we are stalking (our Credit Engine).
        (logs, ctx) => { // This is a "callback" function. Helius will run this block of code automatically every time a transaction hits our program.
            console.log("\n⚡ [EVENT DETECTED] New transaction hit the Credit Engine!"); // Prints a message the moment a target transaction is detected.
            console.log(`Slot: ${ctx.slot} | Signature: ${logs.signature}`); // Prints the specific technical details (Slot and Signature) of the transaction.
            
            // Check if our transaction threw an error
            if (logs.err) { // Checks if the transaction actually failed on the blockchain (e.g., someone with no money trying to borrow).
                console.error("❌ Transaction Failed:", logs.err); // Logs the failure details to the console.
                return; // Exits the callback early because we don't want to process failed actions.
            } // Closes the error check if statement.

            // Parse the logs for the specific msg!() lines we wrote in our Rust smart contract
            const depositRegex = /Deposited (\d+) collateral into the PDA vault/; // Defines a pattern (Regex) to look for the "Deposited" message we wrote in our Rust code.
            const borrowRegex = /Borrowed (\d+) stablecoins/; // Defines a pattern (Regex) to look for the "Borrowed" message we wrote in our Rust code.

            for (const logLine of logs.logs) { // Loops through every line of text (log) emitted by the transaction during execution.
                const depositMatch = logLine.match(depositRegex); // Checks if the current log line matches our "Deposit" pattern.
                if (depositMatch) { // If a match was found (meaning someone just deposited collateral).
                    const amount = depositMatch[1]; // Extracts the specific number (amount) from the log message using the capture group in the Regex.
                    console.log(`💰 DEPOSIT SUCCESS: Hardware Kiosk detected a deposit of ${amount} lamports.`); // Logs the specific deposit amount detected by the bot.
                    // --> Trigger hardware vending machine logic here!
                } // Closes the deposit detection if statement.

                const borrowMatch = logLine.match(borrowRegex); // Checks if the current log line matches our "Borrow" pattern.
                if (borrowMatch) { // If a match was found (meaning someone just successfully borrowed stablecoins).
                    const amount = borrowMatch[1]; // Extracts the specific borrowed amount from the log message.
                    console.log(`🏦 BORROW SUCCESS: Issued ${amount} CRED to the user.`); // Logs the specific borrow event detected by the bot.
                    // --> Send confirmation push notification to user's app here!
                } // Closes the borrow detection if statement.
            } // Closes the for-loop through the logs.
        }, // Closes the callback function body.
        'confirmed' // Reinforces the commitment level: only notify us for confirmed transactions.
    ); // Closes the onLogs tool call.

    // Keep the process alive to listen
    process.on('SIGINT', async () => { // Tells the script what to do when you press Ctrl+C to stop it.
        console.log("Shutting down streamer..."); // Logs a message indicating the script is cleaning up before closing.
        await connection.removeOnLogsListener(subscriptionId); // Formally asks Helius to stop sending us notifications for this subscription.
        process.exit(0); // Safely closes the Node.js process with a success status (0).
    }); // Closes the interrupt listener.
} // Closes the startStream function.

startStream().catch(console.error); // Executes the function we just defined and catches any top-level errors that might occur during startup.
