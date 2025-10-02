import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// 📌 Connect DB + Cloudinary
(async () => {
  await connectDB();
  await connectCloudinary();
})();


// ✅ Clerk Webhooks (raw body required only here)
// Clerk Webhook (must be raw body)
// app.post(
//   "/webhooks",
//   bodyParser.raw({ type: "application/json" }),
//   clerkWebhooks
// );



// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/webhooks', bodyParser.raw({ type: '*/*' }));

// Health route
app.get("/", (req, res) => res.send("API WORKING"));

// Debug Sentry route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


// API Routes
app.post('/webhooks', clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
