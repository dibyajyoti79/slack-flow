import { Server, Socket } from "socket.io";
import { ApiResponse } from "../utils/api-response";
import { NEW_MESSAGE_EVENT } from "../utils/event-constant";
import messageService from "../services/message.service";

type AckCallback<T> = (response: ApiResponse) => void;

export type CreateMessageDto = {
  body: string;
  image?: string;
  channelId: string;
  senderId: string;
  workspaceId: string;
};

export const messageSocketHandler = (io: Server, socket: Socket) => {
  socket.on(
    NEW_MESSAGE_EVENT,
    (data: CreateMessageDto, cb?: AckCallback<any>) =>
      createMessageHandler(io, socket, data, cb)
  );
};

async function createMessageHandler(
  io: Server,
  socket: Socket,
  data: CreateMessageDto,
  cb?: (response: ApiResponse) => void
) {
  try {
    const response = await messageService.createMessage(data);
    // socket.broadcast.emit(NEW_MESSAGE_EVENT, data);
    io.to(data.channelId).emit(NEW_MESSAGE_EVENT, data);
    if (typeof cb === "function") {
      cb(new ApiResponse("Message created", response));
    }
  } catch (error: any) {
    if (typeof cb === "function") {
      cb(new ApiResponse(error.message || "Failed to create message", null));
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
