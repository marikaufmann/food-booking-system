import { jwtVerify } from "jose"

type UserJwtPayload = {
	iat: number
	jti: string
}
export const getJWTSecretKey = () => {
	const secret = process.env.JWT_SECRET_KEY
	if (!secret || secret.length === 0) {
		throw new Error('The environment variable JWT_SECRET_KEY is not set')
	}
	return secret
}

export const verifyAuth = async (token: string) => {
	try {
		const verifyed = await jwtVerify(token, new TextEncoder().encode(getJWTSecretKey()))
		return verifyed.payload as UserJwtPayload
	} catch (err) {
		throw new Error('Your token has expired')
	}
}

          
