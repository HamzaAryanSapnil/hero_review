import express from "express";
import helmet from "helmet";
import config from "./config";
import apiRouter from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// Recording aid for the live dashboard demo: set DEMO_DELAY_MS=1000 to make
// loading skeletons visible. It stays 0 in normal development.
if (config.demoDelayMs > 0) {
  app.use(async (_req, _res, next) => {
    await new Promise((resolve) => setTimeout(resolve, config.demoDelayMs));
    next();
  });
}

app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "HeroReview API is running.",
    health: "/api/health",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
