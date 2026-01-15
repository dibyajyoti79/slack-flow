import { Server, Socket } from "socket.io";
import { TYPING_EVENT } from "../utils/event-constant";
import {
  typingSchema,
  validateSocketData,
} from "../validators/socket.validator";
import { getDMRoomId } from "../services/socket.service";

export const channelSocketHandler = (io: Server, socket: Socket) => {
  socket.on(TYPING_EVENT, (data: unknown) => typingHandler(socket, data));
};

function typingHandler(socket: Socket, data: unknown) {
  const validation = validateSocketData(typingSchema, data);
  if (!validation.success) return;

  const { channelId, recipientId, isTyping } = validation.data;
  const user = socket.user;

  if (!user) return;

  const payload = {
    userId: user.id,
    isTyping,
  };

  if (channelId) {
    // Broadcast to channel (except sender)
    socket.to(channelId).emit(TYPING_EVENT, payload);
  } else if (recipientId) {
    // Send to specific user's DM room
    const dmRoom = getDMRoomId(user.id, recipientId);
    socket.to(dmRoom).emit(TYPING_EVENT, payload);
  }
}
