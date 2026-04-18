use anchor_lang::prelude::*; // Imports the core Anchor framework tools, macros, and types (like Context, Result).
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer}; // Imports specific types and functions from the Solana Program Library (SPL) for token operations.
use pyth_sdk_solana::load_price_feed_from_account_info; // Imports the specific Pyth SDK function to deserialize price data from an account.

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Defines the hardcoded public key (address) of this specific smart contract (program).

// 1. Define seeds for our PDAs (The "Combination" to our program's safes)
pub const STATE_SEED: &[u8] = b"state"; // Creates a constant byte slice "state" used to derive the global state PDA address.
pub const VAULT_SEED: &[u8] = b"vault"; // Creates a constant byte slice "vault" used to derive the PDA address where collateral is actually stored.

#[program] // A macro that tells Anchor the following module contains the public endpoints (instructions) of the smart contract.
pub mod credit_engine { // Declares the public module named 'credit_engine' which holds our logic.
    use super::*; // Brings all the imports from the parent scope (above) into this module's scope.

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> { // The initialization endpoint. Takes the `Initialize` context and returns a Result (Success or Error).
        let state = &mut ctx.accounts.state; // Creates a mutable reference to the `state` account so we can modify its data.
        state.admin = ctx.accounts.admin.key(); // Saves the public key of the person running this transaction as the admin.
        state.collateral_mint = ctx.accounts.collateral_mint.key(); // Saves the public key of the token type (e.g., SOL/USDC) this vault will accept.
        state.vault_bump = ctx.bumps.vault; // Saves the cryptographic 'bump' seed of the vault PDA so the program can sign for it later.
        state.total_deposits = 0; // Sets the initial total deposited collateral counter to 0.
        state.total_borrowed = 0; // Sets the initial total borrowed stablecoin counter to 0.
        Ok(()) // Returns an empty `Ok` indicating the transaction completed without errors.
    } // Closes the initialize function block.

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> { // The deposit endpoint. Takes the `Deposit` context and the amount of tokens to deposit.
        // 2. Setup the Cross-Program Invocation (CPI)
        // We are telling the SPL Token Program: "Move 'amount' from the User to the Vault"
        let transfer_instruction = Transfer { // Constructs the data payload required for an SPL Token transfer.
            from: ctx.accounts.user_token_account.to_account_info(), // Defines the source wallet (the user's token account).
            to: ctx.accounts.vault.to_account_info(), // Defines the destination wallet (our program's PDA vault).
            authority: ctx.accounts.user.to_account_info(), // Defines who is authorizing this transfer (the user must sign).
        }; // Closes the Transfer struct instantiation.

        // Bundle the instruction with the required Token Program account
        let cpi_ctx = CpiContext::new( // Creates a new Cross-Program Invocation (CPI) context.
            ctx.accounts.token_program.to_account_info(), // Passes the address of the official SPL Token program which will execute the transfer.
            transfer_instruction, // Passes the transfer instruction payload we just built.
        ); // Closes the CpiContext instantiation.

        // 3. Execute the transfer!
        token::transfer(cpi_ctx, amount)?; // Executes the CPI call to the Token program to move the funds. The '?' will revert the transaction if it fails.

        // 4. Update internal state tracking
        let state = &mut ctx.accounts.state; // Gets a mutable reference to the global state account to record the deposit.
        state.total_deposits += amount; // Adds the newly deposited amount to the running total.
        
        msg!("Deposited {} collateral into the PDA vault.", amount); // Prints a logging message to the Solana transaction logs.
        Ok(()) // Returns success.
    } // Closes the deposit function.

    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> { // The borrow endpoint. Takes the `Borrow` context and the amount of stablecoins requested.
        let state = &mut ctx.accounts.state; // Gets a mutable reference to the global state account.
        
        // 1. Read Price from Pyth Account
        let price_feed = load_price_feed_from_account_info(&ctx.accounts.pyth_price_account) // Uses the Pyth SDK to read and deserialize the oracle data from the provided account.
            .map_err(|_| CustomError::InvalidPrice)?; // If reading fails, maps the error to our custom InvalidPrice error and reverts via '?'.

        // Pyth includes a timestamp. We freeze operations if the price is > 60 seconds old to prevent exploit attacks
        let current_time = Clock::get()?.unix_timestamp; // Asks the Solana blockchain for the current Unix timestamp.
        let price_data = price_feed.get_price_no_older_than(current_time, 60) // Asks Pyth for the price, but strictly fails if the data is older than 60 seconds.
            .ok_or(CustomError::StalePrice)?; // If the price is stale (None), throws our custom StalePrice error and reverts.

        // Ensure the price is mathematically valid
        if price_data.price <= 0 { // Checks if the price returned is zero or negative (which shouldn't happen but is a critical safety check).
            return Err(CustomError::InvalidPrice.into()); // Reverts the transaction if the price is logically invalid.
        } // Closes the if statement.

        // For MVP simplicity, we cast the raw price to u64 
        // (In production, you scale by price_data.expo and the token decimals)
        let sol_price = price_data.price as u64; // Casts the Pyth price (which is an i64) into an unsigned 64-bit integer for our math.

        // 2. Calculate Collateral Value
        // Gross Value = Total SOL Deposited * Pyth SOL Price
        let gross_collateral_value = state.total_deposits.checked_mul(sol_price) // Multiplies deposits by price safely. `checked_mul` prevents overflow bugs.
            .ok_or(CustomError::InvalidPrice)?; // If an overflow occurs, it returns an error instead of crashing/wrapping the numbers.

        // 3. Apply LTV Limit (60% Loan-To-Value)
        let max_borrow_limit = gross_collateral_value // Starts with the gross collateral value.
            .checked_mul(60).unwrap() // Multiplies by 60 safely (representing the 60 in 60%). Unwraps panic if math fails (acceptable here as 60 is hardcoded).
            .checked_div(100).unwrap(); // Divides by 100 to complete the 60% calculation.

        // 4. Check Debt Limits
        let projected_debt = state.total_borrowed.checked_add(amount).unwrap(); // Calculates what the new total debt would be if this transaction succeeds.
        
        // If they ask for more than they are allowed based on current SOL price, reject!
        require!(projected_debt <= max_borrow_limit, CustomError::InsufficientCollateral); // Anchor macro that enforces a condition. If false, it reverts with InsufficientCollateral.
        
        state.total_borrowed += amount; // If the require check passes, we update the state to reflect the new debt.
        
        msg!("Borrowed {} stablecoins. Current SOL Price validation: {} (exponent: {})", amount, price_data.price, price_data.expo); // Logs the transaction and price details for debugging.
        // Minting logic (which requires the program to sign using its PDA) goes here next
        Ok(()) // Returns success.
    } // Closes the borrow function.
} // Closes the credit_engine program module.

#[derive(Accounts)] // A macro that automatically generates the account validation logic for the struct below.
pub struct Initialize<'info> { // Defines the structure of accounts needed when calling the `initialize` function.
    // We use PDAs (seeds + bump) so the address is deterministic and controlled by the program
    #[account( // Anchor attribute to define constraints and initialization rules for the `state` account.
        init, // Tells Anchor to physically create this account on the Solana blockchain.
        payer = admin, // Tells Anchor that the `admin` account will pay the SOL cost (rent) to create this data file.
        space = 8 + 32 + 32 + 1 + 8 + 8, // Pre-allocates the exact byte size needed: Anchor discriminator (8) + 2 Pubkeys (64) + 1 u8 (1) + 2 u64s (16).
        seeds = [STATE_SEED], // Tells Anchor this account's address is a PDA derived from the "state" seed.
        bump // Tells Anchor to automatically find and inject the cryptographic bump for the PDA.
    )] // Closes the account macro attributes.
    pub state: Account<'info, EngineState>, // The actual account object being created, typed to hold `EngineState` data.
    
    // The specific token type this engine accepts (e.g., Devnet USDC or wSOL)
    pub collateral_mint: Account<'info, Mint>, // A read-only account representing the Token Mint (contract) of the accepted collateral.

    // The PDA Vault that will physically hold the user's collateral
    #[account( // Anchor attribute to define constraints for the `vault` token account.
        init, // Tells Anchor to create this token account.
        payer = admin, // The `admin` pays the rent for creating this token account.
        token::mint = collateral_mint, // Tells the SPL Token program that this vault is meant to hold the `collateral_mint` tokens.
        token::authority = vault, // Crucially makes the PDA vault *itself* the owner of the funds, ensuring trustless control.
        seeds = [VAULT_SEED], // Tells Anchor this account's address is derived from the "vault" seed.
        bump // Automatically handles the bump calculation for the vault PDA.
    )] // Closes the account macro attributes.
    pub vault: Account<'info, TokenAccount>, // The newly created token account object.

    #[account(mut)] // Marks the `admin` account as mutable because its SOL balance will decrease when paying for the new accounts.
    pub admin: Signer<'info>, // Ensures the admin has physically signed this transaction.
    pub system_program: Program<'info, System>, // Brings in the core Solana System Program, required to create new accounts.
    pub token_program: Program<'info, Token>, // Brings in the SPL Token Program, required to initialize the `vault` TokenAccount.
    pub rent: Sysvar<'info, Rent>,            // Brings in the Solana Rent system variable, which calculates how much SOL is needed for account storage.
} // Closes the Initialize struct.

#[derive(Accounts)] // Generates account validation for the `Deposit` instruction.
pub struct Deposit<'info> { // Defines the accounts required to process a deposit.
    #[account(mut, seeds = [STATE_SEED], bump)] // Validates the state account is our specific PDA, and marks it mutable to update the deposit counter.
    pub state: Account<'info, EngineState>, // The global state data account.

    #[account(mut)] // Marks the user account mutable as they are signing and sending a transaction.
    pub user: Signer<'info>, // Ensures the user physically signed the transaction to authorize moving their funds.

    // The user's token wallet (where the funds are leaving from)
    #[account(mut)] // Marks the user's token account mutable because its token balance will go down.
    pub user_token_account: Account<'info, TokenAccount>, // The specific SPL token wallet belonging to the user.

    // The program's PDA vault (where the funds are going)
    #[account(mut, seeds = [VAULT_SEED], bump)] // Validates this is the correct PDA vault and marks it mutable because its balance will go up.
    pub vault: Account<'info, TokenAccount>, // The program-controlled token vault.

    pub token_program: Program<'info, Token>, // The SPL Token Program required to execute the transfer.
} // Closes the Deposit struct.

#[derive(Accounts)] // Generates account validation for the `Borrow` instruction.
pub struct Borrow<'info> { // Defines the accounts required to process a borrow request.
    #[account(mut, seeds = [STATE_SEED], bump)] // Validates the state account and marks it mutable to update the borrowed counter.
    pub state: Account<'info, EngineState>, // The global state data account.
    #[account(mut)] // Marks the user account mutable.
    pub user: Signer<'info>, // The user requesting the loan. Must sign the transaction.
    
    /// CHECK: We will verify this is the official Pyth SOL/USD account using the Pyth SDK logic inside the function
    pub pyth_price_account: AccountInfo<'info>, // A raw, untyped account. We must manually verify its data inside the function (which we do with the Pyth SDK).
    
    pub system_program: Program<'info, System>, // The core Solana System Program.
} // Closes the Borrow struct.

#[account] // A macro that tells Anchor this struct defines the layout of data inside an on-chain account.
pub struct EngineState { // The blueprint for the data saved in our `state` PDA.
    pub admin: Pubkey,           // Stores the administrator's Solana address (32 bytes).
    pub collateral_mint: Pubkey, // Stores the address of the accepted token type (32 bytes).
    pub vault_bump: u8,          // Stores the 1-byte number needed to derive the vault's address later (1 byte).
    pub total_deposits: u64,     // Stores the sum of all collateral ever deposited (8 bytes).
    pub total_borrowed: u64,     // Stores the sum of all debt issued (8 bytes).
} // Closes the EngineState struct.

#[error_code] // A macro that converts this enum into standard Solana error codes that wallets can understand.
pub enum CustomError { // A list of specific things that can go wrong in our program.
    #[msg("Insufficient collateral to borrow this amount based on current Oracle prices.")] // The human-readable message displayed if this error is thrown.
    InsufficientCollateral, // Error indicating the LTV math failed.
    #[msg("The Oracle price is stale. Halting operations for security.")] // Message for stale pricing.
    StalePrice, // Error indicating the Pyth data is older than our 60-second safety threshold.
    #[msg("Invalid Oracle price data.")] // Message for zero/negative prices or missing feeds.
    InvalidPrice, // Error indicating the price data is mathematically illogical or couldn't be loaded.
} // Closes the CustomError enum.