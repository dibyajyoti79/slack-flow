import channelRepository from "../repositories/channel.repository";
import messageRepository from "../repositories/message.repository";
import { isUserMemberOfWorkspace } from "./workspace.service";

const messageService = {
  async getMessages(
    channelId: string,
    page: number,
    limit: number,
    userId: string
  ) {
    // check if channel exists
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      channelId
    );
    if (!channel) {
      throw new Error("Channel not found");
    }
    // check if user is member of channel
    const isMember = isUserMemberOfWorkspace(channel.workspaceId, userId);
    if (!isMember) {
      throw new Error("You are not allowed to access this channel");
    }

    const messages = await messageRepository.getPaginatedMessages(
      channelId,
      page,
      limit
    );
    return messages;
  },
};

export default messageService;
