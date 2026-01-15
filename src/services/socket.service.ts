import { Socket } from "socket.io";
import workspaceRepository from "../repositories/workspace.repository";
import directMessageRepository from "../repositories/directMessage.repository";
import logger from "../config/logger.config";

// Helper to generate consistent DM room IDs
export function getDMRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("-dm-");
}

export const socketService = {
  /**
   * Auto-join user to all their channels and DM rooms on connection
   * This enables receiving messages from all conversations
   */
  async autoJoinUserRooms(socket: Socket, userId: string) {
    try {
      // 1. Get all workspaces user is member of
      const workspaces = await workspaceRepository.getAllWorkspacesByMemberId(
        userId
      );

      // 2. Join all channels from all workspaces
      for (const workspace of workspaces) {
        for (const channelId of workspace.channels) {
          socket.join(channelId.toString());
        }
        logger.debug(
          `User ${userId} joined ${workspace.channels.length} channels from workspace ${workspace.name}`
        );
      }

      // 3. Get all DM partners and join those rooms
      const dmPartners = await directMessageRepository.getDMPartners(userId);
      for (const partnerId of dmPartners) {
        const dmRoom = getDMRoomId(userId, partnerId);
        socket.join(dmRoom);
      }
      logger.debug(`User ${userId} joined ${dmPartners.length} DM rooms`);

      logger.info(`User ${userId} auto-joined all rooms`);
    } catch (error) {
      logger.error(`Failed to auto-join rooms for user ${userId}`, error);
    }
  },

  /**
   * Join a specific channel room (called when user is added to new channel)
   */
  joinChannel(socket: Socket, channelId: string) {
    socket.join(channelId);
  },

  /**
   * Join a DM room (called when starting new DM conversation)
   */
  joinDMRoom(socket: Socket, userId: string, recipientId: string) {
    const dmRoom = getDMRoomId(userId, recipientId);
    socket.join(dmRoom);
    return dmRoom;
  },
};
