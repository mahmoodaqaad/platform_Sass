import jwt from "jsonwebtoken"
import { JwtPayload } from "./Types"
import { serialize } from 'cookie';

export const generateToken = (JwtPayload: JwtPayload | { email: string, id: string }) => {
    if (!JwtPayload) {
        console.error("generateToken Error: JwtPayload is null or undefined!");
    }
    return jwt.sign(JwtPayload, process?.env?.JWT_SECRET, { expiresIn: "30d" })
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
export const setOTPCookie = async (email: string, id: string) => {
    const token = generateToken({ email, id })

    const cookie = serialize("otp_code", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 *10,
        path: "/"
    })
    return cookie
}