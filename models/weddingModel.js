import mongoose from "mongoose";
const Schema = mongoose.Schema;

const weddingSchema = new Schema({
  pictures: [
    {
      type: String,
      required: true,
    },
  ],
}, {
  timestamps: true,
});

const Wedding = mongoose.model("Wedding", weddingSchema);

export default Wedding;
