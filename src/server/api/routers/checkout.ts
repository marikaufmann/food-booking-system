import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Stripe } from 'stripe'
import { z } from "zod";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export const checkoutRouter = createTRPCRouter({
  checkoutSession: publicProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            id: z.string(),
            quantity: z.number().min(1, 'Quantity must be at least 1'),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const productsInCart = (
          await ctx.db.menuItem.findMany({
            where: {
              id: {
                in: input.products.map((product) => product.id),
              },
            },
          })
        ).map((p) => ({
          ...p,
          quantity: input.products.find((product) => product.id === p.id)?.quantity ?? 0,
        }))

        if (productsInCart.length !== input.products.length) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Some products are not available' })
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],

          mode: 'payment',
          line_items: productsInCart.map((product) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
              },
              unit_amount: product.price * 100,
            },
            quantity: Number(product.quantity),
          })),
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'usd',
                },
                display_name: 'Pickup in store',
              },
            },
          ],
          success_url: `https://food-booking-system.vercel.app/success`,
          cancel_url: `https://food-booking-system.vercel.app/menu`,
        })

        return {
          url: session.url ?? '',
        }
      } catch (error) {
        let msg = ''
        if (error instanceof Error) {
          msg = error.message
        }
        throw new TRPCError({
          message: msg || 'Payment failed',
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),
})