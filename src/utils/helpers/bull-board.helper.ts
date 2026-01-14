import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { mailQueue } from "../../queues/mail.queue";

export function setupBullBoard() {
  const serverAdapter = new ExpressAdapter();

  serverAdapter.setBasePath("/admin/queues");

  createBullBoard({
    queues: [new BullMQAdapter(mailQueue)],
    serverAdapter,
  });

  return serverAdapter;
}
