import channelRepository from "../repositories/channel.repository";
import { BadRequestError, UnauthorizedError } from "../utils/api-error";
import { isUserMemberOfWorkspace } from "./workspace.service";

export const channelService = {
  async getChannelById(channelId: string, userId: string) {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      channelId
    );
    if (!channel) {
      throw new BadRequestError("Channel not found");
    }

    const isMember = isUserMemberOfWorkspace(channel.workspaceId, userId);
    if (!isMember) {
      throw new UnauthorizedError("You are not allowed to access this channel");
    }
    return channel;
  },
};
