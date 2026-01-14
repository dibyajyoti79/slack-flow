import { Worker, Job } from "bullmq";
import { serverConfig } from "../config";
import { SendEmailJob } from "../queues/mail.queue";
import { mailer } from "../config/mail.config";
import logger from "../config/logger.config";

export const mailWorker = new Worker<SendEmailJob>(
  "mailQueue",
  async (job: Job<SendEmailJob>) => {
    if (job.name !== "send-email") return;

    logger.info("📧 Processing email job", {
      jobId: job.id,
      to: job.data.to,
      attempt: job.attemptsMade + 1,
    });

    const { from, to, subject, text, html } = job.data;

    await mailer.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    logger.info(`✅ Email sent to ${job.data.to}`);
  },
  {
    connection: {
      host: serverConfig.REDIS_HOST,
      port: serverConfig.REDIS_PORT,
    },
  }
);
mailWorker.on("failed", (job, err) => {
  if (!job) return;

  logger.error("❌ Email sending failed", {
    jobId: job.id,
    jobName: job.name,
    to: job.data.to,
    subject: job.data.subject,
    attemptsMade: job.attemptsMade,
    maxAttempts: job.opts.attempts,
    error: err.message,
  });
});
