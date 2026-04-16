export type JwtPayload = {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified?: boolean;
}