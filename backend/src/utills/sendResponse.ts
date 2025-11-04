import type { Response } from "express";
import { HttpStatusCode } from "./statusCode";

interface IPayload<T = unknown> {
  code: HttpStatusCode;
  message?: string | Error | unknown;
  data?: T;
}

export const sendResponse = (res: Response, payload: IPayload) => {
  return res.status(payload.code).json({
    success: payload.code >= 200 && payload.code < 300,
    ...(payload?.message
      ? {
          message:
            payload?.message instanceof Error
              ? payload.message.message
              : payload.message,
        }
      : {}),
    ...(payload.data ? { data: payload.data } : {}),
  });
};
