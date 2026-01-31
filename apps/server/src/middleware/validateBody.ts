import type { RequestHandler } from "express";
import type { z } from "zod";

export function validateBody(schema: z.ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: result.error.flatten(),
      });
    }

    next();
  };
}
