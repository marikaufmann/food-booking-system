import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const menuRouter = createTRPCRouter({
	getMenuItems: publicProcedure.query(async ({ ctx }) => {
		const menuItems = await ctx.db.menuItem.findMany()

		return menuItems
	}),
	checkMenuStatus: publicProcedure.query(async () => {
		await sleep(1000)

		return true
	}),
	getCartItems: publicProcedure
	.input(z.array(z.object({ id: z.string(), quantity: z.number() })))
	.query(async ({ ctx, input }) => {
		const menuItems = await ctx.db.menuItem.findMany({
			where: {
				id: {
					in: input.map((item) => item.id),
				},
			},
		})
			const itemsInCart = menuItems.map(menuItem => {
				return {
					...menuItem,
					quantity: input.find(item => item.id === menuItem.id)?.quantity ?? 0
				}
			})
			return itemsInCart
		})
})