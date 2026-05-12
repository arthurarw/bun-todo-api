import { env } from "@/config/env";
import { SignJWT, jwtVerify } from "jose";

export interface JwtPayload {
  sub: string;
  email: string;
}

const secret = new TextEncoder().encode(env.JWT_SECRET);
const algorithm = "HS256";

export async function signJwt(payload: JwtPayload): Promise<string> {
  const ttlSeconds = env.SESSION_TTL_HOURS * 60 * 60;

  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: algorithm })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret, { algorithms: [algorithm] });

  return {
    sub: payload.sub as string,
    email: payload["email"] as string
  };
}
