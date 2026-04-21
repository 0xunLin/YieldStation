import { // Opens the import block to pull in specific functions from the @solana/actions library.
    ActionPostResponse, // Type definition for the structured response we must send back after a POST request.
    createPostResponse, // Helper function to correctly wrap our Solana transaction into the Action format.
    ActionGetResponse, // Type definition for the structured metadata response we must send after a GET request.
    ActionPostRequest, // Type definition representing the incoming data (like the user's wallet address) from a POST request.
    ACTIONS_CORS_HEADERS, // A pre-built set of security headers required by Solana to allow cross-origin requests.
} from "@solana/actions"; // Specifies the npm package we are importing the above tools from.
import { // Opens the import block to pull in core Solana web3.js tools.
    Connection, // Used to establish a connection to the Solana blockchain network (RPC).
    PublicKey, // Used to create, format, and validate base-58 Solana wallet and program addresses.
    SystemProgram, // The core Solana program required for basic operations like transferring SOL or creating accounts.
    TransactionInstruction, // Represents a single action/command (like "borrow") to be executed on the blockchain.
    TransactionMessage, // A structure used to bundle multiple instructions and the blockhash together before signing.
    VersionedTransaction, // The modern, optimized transaction format used in Solana to process the message.
} from "@solana/web3.js"; // Specifies the npm package we are importing the web3 tools from.

// The GET handler generates the "Blink" UI (Image, Title, Description, Button)
export const GET = async (req: Request) => { // Defines the API endpoint that handles incoming GET requests from the wallet.
    console.log("-> 📲 Blink requested by wallet!"); // Logs to the terminal that a user just scanned the QR code or clicked the link.

    // Construct the metadata payload following the Solana Pay spec
    const payload: ActionGetResponse = { // Creates a JSON object meticulously formatted to match the ActionGetResponse rules.
        title: "YieldStation: Instant Flash Credit", // The main headline that appears at the top of the Blink UI.
        icon: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80", // Polished placeholder image providing visual context for the user.
        description: "Deposit your SOL into YieldStation to autonomously earn yield, and instantly receive a CRED stablecoin line of credit.", // The subtext explaining the value proposition of the action.
        label: "Deposit 1 SOL & Borrow CRED", // Default button text that the user will click to initiate the transaction.
        // You can add multiple buttons or text inputs using 'links' in a later iteration!
    }; // Closes the payload definition.

    return Response.json(payload, { // Sends the finalized payload back to the user's wallet as a JSON response.
        headers: ACTIONS_CORS_HEADERS, // Attaches the mandatory CORS headers so the wallet's browser doesn't block the response.
    }); // Closes the response return.
}; // Closes the GET function.

// The OPTIONS handler manages Cross-Origin Resource Sharing
// Crucial: Without this, Phantom wallet will block the request for security
export const OPTIONS = async () => Response.json(null, { headers: ACTIONS_CORS_HEADERS }); // A necessary boilerplate endpoint that instantly returns CORS headers to approve "pre-flight" security checks by web browsers.

// The POST handler receives the user's wallet address and returns the raw Transaction
export const POST = async (req: Request) => { // Defines the API endpoint that handles incoming POST requests containing the user's wallet address.
    try { // Begins a try-catch block to safely handle any errors during transaction building without crashing the server.
        console.log("-> ⚙️ Transaction requested by user!"); // Logs that the user clicked the button and requested the transaction payload.

        // 1. Extract the user's public key from the wallet's request body
        const body: ActionPostRequest = await req.json(); // Parses the incoming JSON data from the wallet's POST request.
        const userPubkey = new PublicKey(body.account); // Extracts the user's base58 wallet string and converts it into a valid Solana PublicKey object.

        // 2. Connect to the Solana Network
        // We use Devnet here for the Hackathon MVP
        const connection = new Connection("https://api.devnet.solana.com", "confirmed"); // Establishes a connection to the Solana test network (Devnet).

        // 3. Stubbing the Transaction ("Mocking")
        // Instead of building the highly complex 10-account Anchor CPI payload right now,
        // we build a perfectly formatted, harmless transaction (sending 0 SOL to ourselves)
        // to prove the Blink pipeline and UI functions flawlessly.
        
        // --- START REAL TX ---
        // 3a. Define the Program & Find PDAs
        const PROGRAM_ID = new PublicKey("5pvTQ3VBns8oWnQRBZnvfgseWBEfTZNN2ExBoXxuKbxJ"); // Sets the strict address of our YieldStation smart contract.
        
        // This is how you calculate a PDA in TypeScript without a private key!
        // We use the exact 'state' seed we defined in our Rust lib.rs
        const [statePda] = PublicKey.findProgramAddressSync( // A synchronous cryptographic function to derive an address the program uniquely controls.
            [Buffer.from("state")], // The exact byte string "state" we used as the seed in our Rust code.
            PROGRAM_ID // The program ID that owns the resulting PDA.
        ); // Closes the state PDA derivation.
        
        // Find the vault PDA
        const [vaultPda] = PublicKey.findProgramAddressSync( // A synchronous cryptographic function to find the vault address.
            [Buffer.from("vault")], // The exact byte string "vault" we used to create the token vault in Rust.
            PROGRAM_ID // The program ID that owns the vault.
        ); // Closes the vault PDA derivation.

        // 3b. Manually Construct the Instruction Data (Skipping IDL for MVP)
        // Anchor uses Sha256("global:borrow")[0..8] to mathematically identify functions.
        // We calculate this discriminator manually to tell the program we want to execute 'borrow'.
        const borrowDiscriminator = Buffer.from([227, 147, 56, 177, 243, 237, 219, 198]); // The literal 8-byte hash signature representing the 'borrow' function name in Anchor.
        
        // We pack the 'amount' (100 CRED) as a 64-bit integer into the buffer payload
        const amountBuffer = Buffer.alloc(8); // Allocates a raw 8-byte chunk of memory (a buffer) to hold our number.
        amountBuffer.writeBigUInt64LE(BigInt(100 * 1_000_000)); // Writes the number "100" (scaled to 6 decimal places) into the buffer formatting it as Little-Endian for Rust.
        
        const data = Buffer.concat([borrowDiscriminator, amountBuffer]); // Splices the function hash and the amount data into a single continuous byte array.

        // Constants we need to fill out our Accounts list
        const pythOraclePubkey = new PublicKey("H6ARFtSyxeCbKmVQUkcJ1Tofh6KkY6SAs54KjZ4gGv8U"); // Defines the official address for the real-time SOL/USD price feed on Devnet.
        const tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"); // Defines the official address of the core Solana SPL Token Program.

        // Note: For a local hackathon test where user token accounts aren't fully baked, 
        // we use mock placeholders for the mint addresses just to prove the Blink mechanics package properly.
        const mockStablecoinMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Provides a generic USDC Devnet token address for testing purposes.

        // 3c. Assemble the precise Accounts array our Rust code expects!
        const borrowInstruction = new TransactionInstruction({ // Creates the final, formalized single instruction object.
            programId: PROGRAM_ID, // Associates this entire instruction specifically with our credit-engine program.
            data: data, // Attaches the raw byte array we built (the function name + the borrow amount).
            keys: [ // An ordered array of EVERY account our Rust code's 'Borrow' struct demands. The order MUST match Rust perfectly.
                { pubkey: statePda, isSigner: false, isWritable: true }, // The global state account, marked writable so its data can be updated.
                { pubkey: userPubkey, isSigner: true, isWritable: true }, // The user. Marked as a signer because their wallet handles authorization.
                { pubkey: pythOraclePubkey, isSigner: false, isWritable: false }, // The Pyth oracle account. Read-only because we only fetch the price.
                { pubkey: mockStablecoinMint, isSigner: false, isWritable: true }, // The protocol's stablecoin mint, writable because new tokens are created.
                { pubkey: userPubkey, isSigner: false, isWritable: true }, // Simplified user stable account. Writable so their balance goes up.
                { pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"), isSigner: false, isWritable: false }, // The native Solana Rent Sysvar account to handle storage costs.
                { pubkey: tokenProgram, isSigner: false, isWritable: false }, // The Token Program address (read-only) passed as a dependency.
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // The System Program address (read-only) passed as a dependency.
            ] // Closes the keys array.
        }); // Closes the TransactionInstruction object.

        // Get the latest blockhash required for the transaction signature validity
        const { blockhash } = await connection.getLatestBlockhash(); // Fetches a recent fingerprint of the blockchain to prove this transaction is fresh and prevent replay attacks.

        // Construct the V0 transaction message
        const messageV0 = new TransactionMessage({ // Creates a modern (Version 0) message container for our instructions.
            payerKey: userPubkey, // Specifies who will pay the tiny gas fee for this transaction (the user).
            recentBlockhash: blockhash, // Attaches the fresh blockchain fingerprint we just pulled.
            instructions: [borrowInstruction], // Wraps our customized borrow instruction inside the transaction array. (We could add multiple here if we wanted).
        }).compileToV0Message(); // Compiles all of this into the highly-optimized V0 binary format required by the network.

        // Build the final transaction object
        const transaction = new VersionedTransaction(messageV0); // Packages the compiled message into a mathematically complete Transaction ready for signing.
        // --- END REAL TX ---

        // 4. Return the Base64 serialized transaction back to the Wallet
        // The wallet will interpret this base64 string, decode it into a standard Solana Transaction
        // and pop up the "Approve" button!
        const payload: ActionPostResponse = await createPostResponse({ // Calls the helper function to properly package our complex transaction into the simple response wallet expects.
            fields: { // Opens the data fields.
                type: "transaction", // Explicitly tells the wallet: "I am sending you a transaction to sign."
                transaction, // The compiled VersionedTransaction object we built above.
                message: `Successfully mocked a YieldStation Borrow transaction for ${userPubkey.toBase58().substring(0,6)}...`, // A quick success message that appears in the wallet's UI post-approval.
            }, // Closes the fields.
        }); // Closes the createPostResponse call.

        return Response.json(payload, { // Converts the final prepared object into JSON and sends it back across the internet to the wallet.
            headers: ACTIONS_CORS_HEADERS, // Re-attaches the CORS headers so the wallet accepts the response.
        }); // Closes the response return.

    } catch (err: any) { // Catches any fatal errors (like bad keys, network drops, math bugs) that happen anywhere above.
        console.error("Action POST Error:", err); // Prints the exact error to the server terminal for debugging.
        return Response.json( // Sends an emergency formatted error response back to the wallet so the user isn't stuck loading forever.
            { error: "An unknown error occurred while building the transaction." }, // The actual error message text displayed to the user via UI.
            { status: 400, headers: ACTIONS_CORS_HEADERS } // Sets a "Bad Request" HTTP 400 status code plus the required security headers.
        ); // Closes the error response return.
    } // Closes the catch block.
}; // Closes the POST function.
