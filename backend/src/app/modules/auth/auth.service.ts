import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { signToken } from "../../shared/jwt";
import { ApiError } from "../../errors/ApiError";
import type { LoginInput, SignupInput } from "./auth.interface";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

const signup = async (input: SignupInput) => {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (existing) {
    throw new ApiError(409, "EMAIL_TAKEN", "This email is already registered.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
        role: "STUDENT",
      },
      select: publicUserSelect,
    });

    return { user, token: signToken(user) };
  } catch (error) {
    // The unique constraint is the final safeguard if two requests race.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ApiError(409, "EMAIL_TAKEN", "This email is already registered.");
    }
    throw error;
  }
};

const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;

  return { user: safeUser, token: signToken(user) };
};

const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Your session is no longer valid.");
  }

  return { user };
};

export const AuthService = {
  signup,
  login,
  me,
};
