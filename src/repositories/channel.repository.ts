import Channel, { ChannelAttrs } from "../models/channel.model";
import { WorkspaceAttrs } from "../models/workspace.model";
import crudRepository from "./crud.repository";

const channelRepository = {
  ...crudRepository<ChannelAttrs>(Channel),
  async getByName(name: string) {
    const channel = await Channel.findOne({ name });
    return channel;
  },
  async getChannelWithWorkspaceDetails(channelId: string) {
    const channel = await Channel.findById(channelId).populate<{
      workspaceId: WorkspaceAttrs;
    }>("workspaceId");

    return channel;
  },
};

export default channelRepository;
