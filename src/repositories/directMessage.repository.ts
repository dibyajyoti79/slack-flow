import DirectMessage, { DirectMessageAttrs } from "../models/directMessage.model";
import crudRepository from "./crud.repository";

const directMessageRepository = {
  ...crudRepository<DirectMessageAttrs>(DirectMessage),

  async getConversation(
    userId1: string,
    userId2: string,
    workspaceId: string,
    page: number,
    limit: number
  ) {
    const messages = await DirectMessage.find({
      workspaceId,
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "name username avatar")
      .populate("receiverId", "name username avatar");

    return messages;
  },

  async markAsRead(messageIds: string[]) {
    return DirectMessage.updateMany(
      { _id: { $in: messageIds } },
      { read: true }
    );
  },

  /**
   * Get all unique user IDs that this user has DM conversations with
   */
  async getDMPartners(userId: string): Promise<string[]> {
    const sentTo = await DirectMessage.distinct("receiverId", { senderId: userId });
    const receivedFrom = await DirectMessage.distinct("senderId", { receiverId: userId });
    
    const allPartners = new Set([
      ...sentTo.map((id) => id.toString()),
      ...receivedFrom.map((id) => id.toString()),
    ]);
    
    return Array.from(allPartners);
  },
};

export default directMessageRepository;
