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
    const validate = v.safeParse(loginSchema, {
      email,
      password,
    });

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: validate.issues.map((item) => item.message),
      });
    }

    const getUser = await db
      .select({
        password: userTable.password,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    console.log("getUser", getUser);

    if (getUser.length === 0) {
      return res.status(400).json({
        success: false,
        message: `${email} User does not exist`,
      });
    }
    const comparePassword = await bcrypt.compare(
      password,
      getUser[0]?.password
    );

    if (comparePassword) {
      res.status(200).json({
        success: true,
        message: "User login successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Password Incorrect`,
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
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

    const getUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (getUser.length !== 0) {
      return res.status(400).json({
        success: false,
        message: `${email} User already exist`,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const response = await db
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
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};