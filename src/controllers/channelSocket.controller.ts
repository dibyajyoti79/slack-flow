import { Server, Socket } from "socket.io";
import { ApiResponse } from "../utils/api-response";
import { JOIN_CHANNEL_EVENT } from "../utils/event-constant";

type AckCallback<T> = (response: ApiResponse) => void;

type ChannelAttrs = {
  channelId: string;
};

export const channelSocketHandler = (io: Server, socket: Socket) => {
  socket.on(JOIN_CHANNEL_EVENT, (data: ChannelAttrs, cb?: AckCallback<any>) =>
    joinChannelHandler(io, socket, data, cb)
  );
};

async function joinChannelHandler(
  io: Server,
  socket: Socket,
  data: ChannelAttrs,
  cb?: (response: ApiResponse) => void
) {
  try {
    const roomId = data.channelId;
    socket.join(roomId);
    if (typeof cb === "function") {
      cb(new ApiResponse("Successfully joined channel", roomId));
    }
  } catch (error: any) {
    if (typeof cb === "function") {
      cb(new ApiResponse(error.message || "Failed to join channel", null));
    }
  }
}

//============================= REFERENCE

// send only to sender
// socket.emit("message", data);

// OR send to everyone
// io.emit("message", data);

// OR send to everyone except sender
// socket.broadcast.emit("message", data);
