import Channel, { ChannelAttrs } from "../models/channel.model";
import crudRepository from "./crud.repository";

const channelRepository = {
  ...crudRepository<ChannelAttrs>(Channel),
};

export default channelRepository;
