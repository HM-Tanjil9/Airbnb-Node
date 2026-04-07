import express from "express";
import { serverConfig } from "./config";
import v1Router from "./routers/v1/index.router";
import v2Router from "./routers/v2/index.router";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { setupMailerWorker } from "./processors/email.processor";
import { addEmailToQueue } from "./producers/email.producer";
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
  setupMailerWorker();
  logger.info(`Mailer worker setup completed`);

  // const response = await renderMailTemplate("welcome", {
  //   name: "screaM",
  //   appName: "booking.com",
  // });
  // console.log(`Rendered email template: \n${response}`);
  addEmailToQueue({
    to: "rtanjil0@gmail.com",
    subject: "Test Email",
    templateId: "welcome",
    params: {
      name: "Tanjil Rahman",
      appName: "Booking app",
    },
  });
});
