import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { Role } from "@prisma/client";
import config from "../../config";

export type AuthTokenPayload = JwtPayload & {
  sub: string;
  role: Role;
};

export const signToken = (user: { id: string; role: Role }): string => {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: config.jwtExpiresIn,
  };

  return jwt.sign({ role: user.role }, config.jwtSecret, options);
};

export const verifyToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, config.jwtSecret);

  if (
    typeof decoded === "string" ||
    !decoded.sub ||
    (decoded.role !== "STUDENT" && decoded.role !== "MENTOR")
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthTokenPayload;
};
