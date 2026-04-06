import { Job, Worker } from "bullmq";
import { NotificationDto } from "../dto/notification.dto";
import { MAILER_QUEUE } from "../queues/mailer.queue";
import { getRedisConnObj } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";

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
