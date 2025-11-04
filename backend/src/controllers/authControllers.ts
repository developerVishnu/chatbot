import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import bcrypt from "bcrypt";
import { loginSchema, signUpSchema } from "../schema/schema.js";
import * as v from "valibot";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utills/sendResponse.js";
import { HttpStatusCode } from "../utills/statusCode.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const validate = v.safeParse(loginSchema, { email, password });

    if (!validate.success) {
      return sendResponse(res, {
        code: HttpStatusCode.NOT_FOUND,
        message: validate.issues.map((item) => item.message),
      });
    }

    const user = await db
      .select({ password: userTable.password })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user.length) {
      return sendResponse(res, {
        code: HttpStatusCode.NOT_FOUND,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      return sendResponse(res, {
        code: HttpStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(res, {
      code: HttpStatusCode.OK,
      message: "User logged in successfully",
    });
  } catch (err) {
    return sendResponse(res, {
      code: HttpStatusCode.BAD_REQUEST,
      message: err,
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
      return sendResponse(res, {
        code: HttpStatusCode.NOT_FOUND,
        message: validate.issues.map((item) => item.message),
      });
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (existingUser.length) {
      return sendResponse(res, {
        code: HttpStatusCode.NOT_FOUND,
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

    return sendResponse(res, {
      code: HttpStatusCode.CREATED,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (err) {
    console.error("SignUp Error:", err);
    return sendResponse(res, {
      code: HttpStatusCode.BAD_REQUEST,
      message: err,
    });
  }
};
