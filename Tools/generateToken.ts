import jwt from "jsonwebtoken"
import { JwtPayload } from "./Types"
import { serialize } from 'cookie';

export const generateToken = (JwtPayload: JwtPayload) => {
    if (!JwtPayload) {
        console.error("generateToken Error: JwtPayload is null or undefined!");
    }
    return jwt.sign(JwtPayload, process.env.JWT_SECRET, { expiresIn: "30d" })
}
export const setCookie = async (JwtPayload: JwtPayload) => {
    const token = generateToken(JwtPayload)
    const JWT_COOKIE_NAME = "myplatform_token"
    const cookie = serialize(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
    })
    return cookie
}