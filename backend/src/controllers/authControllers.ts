import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import bcrypt from "bcrypt";

export const login = (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  res.json({ message: "Hello, TypeScript Express!" });
};

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password, username } = req.body;

  try {
    let passwordHash = await bcrypt.hashSync(password, 10);

    let response = await db
      .insert(userTable)
      .values({
        name,
        email,
        password: passwordHash,
        username,
      })
      .returning({ id: userTable.id });

    res.status(200).json({
      success: true,
      message: "User registerd successfully",
      data: response[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
