import { z } from "zod";
import { positiveIdSchema } from "./common.js";

export const studentIdParamsSchema = z.strictObject({
  studentId: positiveIdSchema,
});

const birthDateSchema = z.iso
  .date()
  .refine((value) => value <= new Date().toISOString().slice(0, 10), {
    message: "must not be in the future",
  });

export const studentBodySchema = z.strictObject({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  studentCode: z.string().trim().min(1).max(20),
  birthDate: birthDateSchema,
  gender: z.enum(["male", "female", "other"]),
});

export const studentUpdateSchema = studentBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "at least one field is required",
  });
