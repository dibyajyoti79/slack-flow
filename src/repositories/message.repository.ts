import Message, { MessageAttrs } from "../models/message.model";
import { UserDoc } from "../models/user.model";
import crudRepository from "./crud.repository";

const messageRepository = {
  ...crudRepository<MessageAttrs>(Message),
  async getPaginatedMessages(channelId: string, page: number, limit: number) {
    const messages = await Message.find({ channelId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<UserDoc>("senderId");

    return messages;
  },
};

export default messageRepository;
