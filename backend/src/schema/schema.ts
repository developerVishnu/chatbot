import * as v from "valibot";

export const signUpSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(5)),
  username: v.pipe(v.string(), v.minLength(1, "User Name is required")),
});

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(5)),
});
