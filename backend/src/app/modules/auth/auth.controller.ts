import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import type { LoginInput, SignupInput } from "./auth.interface";

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup(req.validated!.body as SignupInput);
  sendResponse(res, 201, result);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.validated!.body as LoginInput);
  sendResponse(res, 200, result);
});

const me = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.me(req.user!.id);
  sendResponse(res, 200, result);
});

export const AuthController = {
  signup,
  login,
  me,
};
