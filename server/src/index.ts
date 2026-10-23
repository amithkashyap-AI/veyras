import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`✨ Veyra's Construction & Interiors Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints: /api/projects, /api/enquiries, /api/categories, /api/company, /api/stats, /api/auth, /api/config, /api/reviews`);
});
