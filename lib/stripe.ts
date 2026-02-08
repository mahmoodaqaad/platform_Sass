export const STRIPE_PLANS = {
    BASIC: {
        id: "price_basic_id",
        name: "Basic Plan",
        price: 29.99,
        features: ["Manage up to 5 Services", "Up to 100 Monthly Bookings", "Standard Support"]
    },
    PREMIUM: {
        id: "price_premium_id",
        name: "Premium Plan",
        price: 79.99,
        features: ["Unlimited Services", "Unlimited Bookings", "Priority Support", "Advanced Analytics"]
    }
};

export const StripeService = {
    async createCheckoutSession(userId: string, planId: string) {
        console.log(`Creating Stripe checkout session for user ${userId} on plan ${planId}`);
        // This is where real Stripe logic would go:
        // const session = await stripe.checkout.sessions.create({ ... });
        // return session;
        return { url: "#" };
    }
};
