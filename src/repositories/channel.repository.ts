import Channel, { ChannelAttrs } from "../models/channel.model";
import crudRepository from "./crud.repository";

const channelRepository = {
  ...crudRepository<ChannelAttrs>(Channel),
  async getByName(name: string) {
    const channel = await Channel.findOne({ name });
    return channel;
  },
};

export default channelRepository;
