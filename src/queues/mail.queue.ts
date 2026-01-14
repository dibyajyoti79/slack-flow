import { Queue } from "bullmq";
import { serverConfig } from "../config";

export type SendEmailJob = {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

export const mailQueue = new Queue<SendEmailJob>("mailQueue", {
  connection: {
    host: serverConfig.REDIS_HOST,
    port: serverConfig.REDIS_PORT,
  },
});
