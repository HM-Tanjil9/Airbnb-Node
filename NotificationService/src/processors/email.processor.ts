import { Job, Worker } from "bullmq";
import { NotificationDto } from "../dto/notification.dto";
import { MAILER_QUEUE } from "../queues/mailer.queue";
import { getRedisConnObj } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { renderMailTemplate } from "../templates/template.handler";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";

export const setupMailerWorker = () => {
  const emailProcessor = new Worker<NotificationDto>(
    MAILER_QUEUE,
    async (job: Job) => {
      if (job.name !== MAILER_PAYLOAD) {
        throw new Error("Invalid job name");
      }
      // Call the service layer from here
      const payload = job.data;
      console.log(`Processing email for: ${JSON.stringify(payload)}`);

      const emailContent = await renderMailTemplate(
        payload.templateId,
        payload.params,
      );
      await sendEmail(payload.to, payload.subject, emailContent);
      logger.info(
        `Email sent to ${payload.to} with subject ${payload.subject}`,
      );
    }, // Process function
    {
      connection: getRedisConnObj(),
    },
  );

  emailProcessor.on("failed", () => {
    console.error("Email processing failed");
  });

  emailProcessor.on("completed", () => {
    console.error("Email processing completed successfully");
  });
};
