import { NextResponse } from "next/server";
import { serialize } from "cookie";

export const POST = async () => {
    const cookie = serialize("myplatform_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
    });

    return NextResponse.json({ message: "Logged out" }, {
        status: 200,
        headers: { "Set-Cookie": cookie }
    });
};
