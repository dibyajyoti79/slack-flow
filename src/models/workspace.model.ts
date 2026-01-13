import { model, Schema, Types } from "mongoose";

export interface WorkspaceAttrs {
  name: string;
  description?: string;
  members: {
    memberId: Types.ObjectId;
    role: "admin" | "member";
  }[];
  joinCode: string;
  channels: Types.ObjectId[];
}

const workspaceSchema = new Schema<WorkspaceAttrs>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        memberId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Member is required"],
        },
        role: {
          type: String,
          required: [true, "Role is required"],
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    joinCode: {
      type: String,
      required: [true, "Join code is required"],
      unique: true,
    },
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Channel",
        required: [true, "Channel is required"],
      },
    ],
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

const Workspace = model<WorkspaceAttrs>("Workspace", workspaceSchema);

export default Workspace;
