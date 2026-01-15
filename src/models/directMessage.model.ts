import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface DirectMessageAttrs {
  body: string;
  image?: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  read: boolean;
}

export type DirectMessageDoc = HydratedDocument<DirectMessageAttrs>;

const directMessageSchema = new Schema<DirectMessageAttrs>(
  {
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    image: {
      type: String,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, record: Record<string, any>) => {
        record.id = record._id.toString();
        delete record._id;
        delete record.__v;
        return record;
      },
    },
  }
);

// Index for efficient DM queries between two users
directMessageSchema.index({ senderId: 1, receiverId: 1, workspaceId: 1 });

const DirectMessage = model<DirectMessageAttrs>(
  "DirectMessage",
  directMessageSchema
);

export default DirectMessage;
