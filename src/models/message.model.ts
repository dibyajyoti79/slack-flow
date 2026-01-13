import { model, Schema, Types } from "mongoose";

export interface MessageAttrs {
  body: string;
  image?: string;
  channelId: Types.ObjectId;
  senderId: Types.ObjectId;
  workspaceId: Types.ObjectId;
}

const messageSchema = new Schema<MessageAttrs>(
  {
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    image: {
      type: String,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: [true, "Channel is required"],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace is required"],
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

const Message = model<MessageAttrs>("Message", messageSchema);

export default Message;
