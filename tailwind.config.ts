import { type Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
export default withUt({
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
				sans: ['Work Sans'],
				shadows: ['Shadows Into Light']

			},
			colors: {
				primary: '#5a5d42'

			},
			screens: {
				'xs': '550px'
			}
		},
	},
	plugins: [],
}) satisfies Config;
