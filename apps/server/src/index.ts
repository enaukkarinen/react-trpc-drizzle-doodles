import "dotenv/config";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@einari/api";

import { db } from "./db/client";

const app = express();

app.use(cors({ origin: "http://localhost:5173" /* Web App */ }));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ db, req, res }),
  })
);
app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 3001);
console.log("Starting server...");
console.log(port);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
