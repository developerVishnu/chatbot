import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import bcrypt from "bcrypt";
import { loginSchema, signUpSchema } from "../schema/schema.js";
import * as v from "valibot";
import { eq } from "drizzle-orm";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const validate = v.safeParse(loginSchema, { email, password });

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: validate.issues.map((item) => item.message),
      });
    }

    const user = await db
      .select({ password: userTable.password })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: `${email} user does not exist`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password, username } = req.body;

  try {
    const validate = v.safeParse(signUpSchema, {
      name,
      email,
      password,
      username,
    });

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: validate.issues.map((item) => item.message),
      });
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (existingUser.length) {
      return res.status(400).json({
        success: false,
        message: `${email} user already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [createdUser] = await db
      .insert(userTable)
      .values({
        name,
        email,
        password: hashedPassword,
        username,
      })
      .returning({ id: userTable.id });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (err) {
    console.error("SignUp Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
