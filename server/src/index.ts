import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { projectsRouter } from "./routes/projects.js";
import { enquiriesRouter } from "./routes/enquiries.js";
import { categoriesRouter } from "./routes/categories.js";
import { companyRouter } from "./routes/company.js";
import { statsRouter } from "./routes/stats.js";
import { authRouter } from "./routes/auth.js";
import { configRouter } from "./routes/config.js";
import { reviewsRouter } from "./routes/reviews.js";
import { interactionsRouter } from "./routes/interactions.js";
import { servicesRouter, menusRouter } from "./routes/services.js";
import { ollamaRouter, socialRouter } from "./routes/ollama.js";
import { usersRouter, adsRouter, reportsRouter } from "./routes/adminSuite.js";
import { ensureDatabaseSchemaAndSeed } from "./initDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Veyra's Construction & Interiors API",
    database: "PostgreSQL",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/projects", projectsRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/company", companyRouter);
app.use("/api/stats", statsRouter);
app.use("/api/auth", authRouter);
app.use("/api/config", configRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/menus", menusRouter);
app.use("/api/ollama", ollamaRouter);
app.use("/api/social", socialRouter);
app.use("/api/users", usersRouter);
app.use("/api/ads", adsRouter);
app.use("/api/reports", reportsRouter);

// Serve the built React frontend (client/dist) so visiting GET / on the server port loads the full web app
const clientDistPath = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      status: "ok",
      app: "Veyra's Construction & Interiors API",
      health: "/api/health"
    });
  });
}

ensureDatabaseSchemaAndSeed().finally(() => {
  app.listen(PORT, () => {
    console.log(`✨ Veyra's Construction & Interiors running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints: /api/projects, /api/enquiries, /api/services, /api/menus, /api/ollama, /api/users, /api/ads, /api/reports, /api/config`);
  });
});
