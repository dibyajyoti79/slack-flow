import { model, Schema } from "mongoose";

export interface ChannelAttrs {
  name: string;
}

const channelSchema = new Schema<ChannelAttrs>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
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
