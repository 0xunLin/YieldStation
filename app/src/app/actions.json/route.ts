import { ACTIONS_CORS_HEADERS, ActionsJson } from '@solana/actions';

export const GET = async () => {
    // This is the standard definition file that tells X (Twitter) or Wallets
    // "Yes, I am a legitimate Solana Action, and here is how to route the traffic."
    const payload: ActionsJson = {
        rules: [
            {
                // This maps any URL request ending in "/api/actions/borrow"
                // directly to our Next.js API handler
                pathPattern: "/api/actions/borrow",
                apiPath: "/api/actions/borrow",
            },
            // Fallback wildcard rule
            {
                pathPattern: "/**",
                apiPath: "/api/actions/**",
            },
        ],
    };

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
    });
};

export const OPTIONS = GET;
