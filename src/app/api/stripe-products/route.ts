// src/app/api/stripe-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15", // match your Stripe version
});

export async function GET(req: NextRequest) {
  try {
    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      limit: 100, // adjust if needed
    });

    // Optionally, attach prices for each product
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
        });
        return { ...product, prices: prices.data };
      })
    );

    return NextResponse.json(productsWithPrices);
  } catch (error: any) {
    console.error("Error fetching Stripe products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
