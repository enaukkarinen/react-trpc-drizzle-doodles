import "dotenv/config";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@einari/api";

import { createContext } from "./trpc/createContext";

import { chatRouter } from "./routes/chat";
import { tilesRouter } from "./routes/tiles";
import { initLadTileIndex } from "./services/tiles/datasets/lad/ladIndex";
import { tilesLadRouter } from "./routes/tilesLad";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api", chatRouter);

await initLadTileIndex();
app.use("/tiles", tilesRouter);

app.use("/tiles2", tilesLadRouter);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
