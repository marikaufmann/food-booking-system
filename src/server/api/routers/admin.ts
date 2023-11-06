/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SignJWT } from "jose";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getJWTSecretKey } from "~/lib/auth";
import cookie from 'cookie'
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/uploadthing";
export const adminRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ email: z.string(), password: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { res } = ctx
			const { email, password } = input
			if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
				const token = await new SignJWT({})
					.setProtectedHeader({ alg: 'HS256' })
					.setJti(nanoid())
					.setIssuedAt()
					.setExpirationTime('1h')
					.sign(new TextEncoder().encode(getJWTSecretKey()))

				res.setHeader(
					'Set-Cookie',
					cookie.serialize('user-token', token, {
						httpOnly: true,
						path: '/',
						secure: process.env.NODE_ENV === 'production',
					})
				)
				
				return { success: true }
			}

			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Invalid email or password',
			})
		}),
	addMenuItem: adminProcedure
    .input(
      z.object({
        imageKey: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        price: z.number(),
        categories: z.array(z.union([z.literal('breakfast'), z.literal('lunch'), z.literal('dinner'), z.literal('desserts'), z.literal('drinks')])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { imageUrl, imageKey, name, categories, price } = input
      const menuItem = await ctx.db.menuItem.create({
        data: {
					imageUrl,
          imageKey,
          name,
          categories,
          price,
        },
      })

      return menuItem
    }),
		deleteMenuItem: adminProcedure
    .input(z.object({ imageKey: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { imageKey, id } = input
			await utapi.deleteFiles(imageKey)

      await ctx.db.menuItem.delete({ where: { id } })

    }),
		
})