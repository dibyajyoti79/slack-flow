import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface ChannelAttrs {
  name: string;
  workspaceId: Types.ObjectId;
}
export type ChannelDoc = HydratedDocument<ChannelAttrs>;
const channelSchema = new Schema<ChannelAttrs>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
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

const Channel = model<ChannelAttrs>("Channel", channelSchema);

export default Channel;
