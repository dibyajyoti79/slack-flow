import { Server, Socket } from "socket.io";
import { ApiResponse } from "../utils/api-response";
import {
  NEW_MESSAGE_EVENT,
  NEW_DIRECT_MESSAGE_EVENT,
} from "../utils/event-constant";
import messageService from "../services/message.service";
import directMessageService from "../services/directMessage.service";
import {
  createMessageSchema,
  directMessageSchema,
  validateSocketData,
} from "../validators/socket.validator";
import { getDMRoomId, socketService } from "../services/socket.service";

type AckCallback = (response: ApiResponse) => void;

export const messageSocketHandler = (io: Server, socket: Socket) => {
  // Channel messages
  socket.on(NEW_MESSAGE_EVENT, (data: unknown, cb?: AckCallback) =>
    createMessageHandler(io, socket, data, cb)
  );

  // Direct messages
  socket.on(NEW_DIRECT_MESSAGE_EVENT, (data: unknown, cb?: AckCallback) =>
    createDirectMessageHandler(io, socket, data, cb)
  );
};

async function createMessageHandler(
  io: Server,
  socket: Socket,
  data: unknown,
  cb?: AckCallback
) {
  const validation = validateSocketData(createMessageSchema, data);
  if (!validation.success) {
    cb?.(new ApiResponse(validation.error, null));
    return;
  }

  try {
    const user = socket.user;
    if (!user) {
      cb?.(new ApiResponse("Unauthorized", null));
      return;
    }

    const messageData = {
      ...validation.data,
      senderId: user.id,
    };

    const response = await messageService.createMessage(messageData);

    // Broadcast to all users in the channel
    io.to(validation.data.channelId).emit(NEW_MESSAGE_EVENT, response);

    cb?.(new ApiResponse("Message created", response));
  } catch (error: any) {
    cb?.(new ApiResponse(error.message || "Failed to create message", null));
  }
}

async function createDirectMessageHandler(
  io: Server,
  socket: Socket,
  data: unknown,
  cb?: AckCallback
) {
  const validation = validateSocketData(directMessageSchema, data);
  if (!validation.success) {
    cb?.(new ApiResponse(validation.error, null));
    return;
  }

  try {
    const user = socket.user;
    if (!user) {
      cb?.(new ApiResponse("Unauthorized", null));
      return;
    }

    const messageData = {
      ...validation.data,
      senderId: user.id,
    };

    const response = await directMessageService.createDirectMessage(
      messageData
    );

    // Get or create DM room and emit
    const dmRoom = getDMRoomId(user.id, validation.data.receiverId);

    // Auto-join both users to DM room if not already (for new conversations)
    socketService.joinDMRoom(socket, user.id, validation.data.receiverId);

    // Broadcast to DM room
    io.to(dmRoom).emit(NEW_DIRECT_MESSAGE_EVENT, response);

    cb?.(new ApiResponse("Direct message sent", response));
  } catch (error: any) {
    cb?.(
      new ApiResponse(error.message || "Failed to send direct message", null)
    );
  }
}
