import {
    ActionPostResponse,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
    ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import {
    Connection,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

// The GET handler generates the "Blink" UI (Image, Title, Description, Button)
export const GET = async (req: Request) => {
    console.log("-> 📲 Blink requested by wallet!");

    // Construct the metadata payload following the Solana Pay spec
    const payload: ActionGetResponse = {
        title: "YieldStation: Instant Flash Credit",
        icon: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80", // Polished placeholder image
        description: "Deposit your SOL into YieldStation to autonomously earn yield, and instantly receive a CRED stablecoin line of credit.",
        label: "Deposit 1 SOL & Borrow CRED", // Default button text
        // You can add multiple buttons or text inputs using 'links' in a later iteration!
    };

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
    });
};

// The OPTIONS handler manages Cross-Origin Resource Sharing
// Crucial: Without this, Phantom wallet will block the request for security
export const OPTIONS = async () => Response.json(null, { headers: ACTIONS_CORS_HEADERS });

// The POST handler receives the user's wallet address and returns the raw Transaction
export const POST = async (req: Request) => {
    try {
        console.log("-> ⚙️ Transaction requested by user!");

        // 1. Extract the user's public key from the wallet's request body
        const body: ActionPostRequest = await req.json();
        const userPubkey = new PublicKey(body.account);

        // 2. Connect to the Solana Network
        // We use Devnet here for the Hackathon MVP
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // 3. Stubbing the Transaction ("Mocking")
        // Instead of building the highly complex 10-account Anchor CPI payload right now,
        // we build a perfectly formatted, harmless transaction (sending 0 SOL to ourselves)
        // to prove the Blink pipeline and UI functions flawlessly.
        
        // --- START MOCK TX ---
        // A simple instruction that transfers 0 Lamports from the User to the User
        const mockInstruction = SystemProgram.transfer({
            fromPubkey: userPubkey,
            toPubkey: userPubkey,
            lamports: 0,
        });

        // Get the latest blockhash required for the transaction signature validity
        const { blockhash } = await connection.getLatestBlockhash();

        // Construct the V0 transaction message
        const messageV0 = new TransactionMessage({
            payerKey: userPubkey,
            recentBlockhash: blockhash,
            instructions: [mockInstruction], // We wrap our mock logic here
        }).compileToV0Message();

        // Build the final transaction object
        const transaction = new VersionedTransaction(messageV0);
        // --- END MOCK TX ---

        // 4. Return the Base64 serialized transaction back to the Wallet
        // The wallet will interpret this base64 string, decode it into a standard Solana Transaction
        // and pop up the "Approve" button!
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: "transaction",
                transaction,
                message: `Successfully mocked a YieldStation Borrow transaction for ${userPubkey.toBase58().substring(0,6)}...`,
            },
        });

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });

    } catch (err: any) {
        console.error("Action POST Error:", err);
        return Response.json(
            { error: "An unknown error occurred while building the transaction." },
            { status: 400, headers: ACTIONS_CORS_HEADERS }
        );
    }
};
