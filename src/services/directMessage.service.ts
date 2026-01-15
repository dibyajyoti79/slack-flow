import { Types } from "mongoose";
import directMessageRepository from "../repositories/directMessage.repository";

export type CreateDirectMessageDto = {
  body: string;
  image?: string;
  senderId: string;
  receiverId: string;
  workspaceId: string;
};

const directMessageService = {
  async createDirectMessage(message: CreateDirectMessageDto) {
    const newMessage = await directMessageRepository.create({
      body: message.body,
      image: message.image,
      senderId: new Types.ObjectId(message.senderId),
      receiverId: new Types.ObjectId(message.receiverId),
      workspaceId: new Types.ObjectId(message.workspaceId),
      read: false,
    });
    return newMessage;
  },

  async getConversation(
    userId1: string,
    userId2: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 50
  ) {
    return directMessageRepository.getConversation(
      userId1,
      userId2,
      workspaceId,
      page,
      limit
    );
  },
};

export default directMessageService;
