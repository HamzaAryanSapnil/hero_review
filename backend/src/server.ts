import type { Server } from "node:http";
import app from "./app";
import config from "./config";
import { prisma } from "./app/shared/prisma";

let server: Server;

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing server...`);

  const closeServer = () => {
    prisma
      .$disconnect()
      .catch((error) => console.error("Failed to disconnect Prisma:", error))
      .finally(() => process.exit(0));
  };

  if (server) {
    server.close(closeServer);
  } else {
    closeServer();
  }
};

const bootstrap = () => {
  try {
    server = app.listen(config.port, () => {
      console.log(`HeroReview API running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  shutdown("unhandledRejection");
});

bootstrap();
