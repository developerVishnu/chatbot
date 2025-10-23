import type { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  
  res.json({ message: "Hello, TypeScript Express!" });
};

export const signUp = (req: Request, res: Response) => {
  
  res.json({ message: "Hello, TypeScript Express!" });
};

