import logger from "../config/logger.config";
import { mailQueue, SendEmailJob } from "../queues/mail.queue";

export const addEmailToMailQueue = async (emailData: SendEmailJob) => {
  try {
    logger.info("Adding email to mail queue");
    await mailQueue.add("send-email", emailData, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 50,
      removeOnFail: false,
    });
    logger.info("Email added to mail queue");
  } catch (error) {
    logger.error("Error adding email to mail queue", error);
  }
};
