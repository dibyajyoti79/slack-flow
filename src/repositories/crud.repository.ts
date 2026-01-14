import mongoose, { Types } from "mongoose";
import { BadRequestError } from "../utils/api-error";

export default function crudRepository<T, TAttrs = T>(
  model: mongoose.Model<T>
) {
  const isValidId = (id: string | Types.ObjectId) => {
    if (typeof id === "string") {
      return Types.ObjectId.isValid(id);
    }
    return id instanceof Types.ObjectId;
  };
  return {
    async create(data: TAttrs) {
      const doc = await model.create(data);
      return doc;
    },
    async getAll() {
      const docs = await model.find();
      return docs;
    },
    async getById(id: string) {
      if (!isValidId(id)) {
        throw new BadRequestError("Invalid id");
      }
      const doc = await model.findById(id);
      return doc;
    },
    async update(id: string, data: Partial<T>) {
      if (!isValidId(id)) {
        throw new BadRequestError("Invalid id");
      }
      const doc = await model.findByIdAndUpdate(id, data, { new: true });
      return doc;
    },
    async delete(id: string) {
      if (!isValidId(id)) {
        throw new BadRequestError("Invalid id");
      }
      const doc = await model.findByIdAndDelete(id);
      return doc;
    },
    async deleteMany(ids: string[] | Types.ObjectId[]) {
      const docs = await model.deleteMany({ _id: { $in: ids } });
      return docs;
    },
  };
}
