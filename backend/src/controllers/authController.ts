import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  res.json({ message: "Register endpoint working" });
};

export const login = async (req: Request, res: Response) => {
  res.json({ message: "Login endpoint working" });
};

export const getMe = async (req: any, res: Response) => {
  res.json({ message: "Get me endpoint working" });
};
