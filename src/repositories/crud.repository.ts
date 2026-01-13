import mongoose from "mongoose";

export default function crudRepository<T, TAttrs = T>(
  model: mongoose.Model<T>
) {
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
      const doc = await model.findById(id);
      return doc;
    },
    async update(id: string, data: Partial<T>) {
      const doc = await model.findByIdAndUpdate(id, data, { new: true });
      return doc;
    },
    async delete(id: string) {
      const doc = await model.findByIdAndDelete(id);
      return doc;
    },
  };
}
