import mongoose from "mongoose";
const Schema = mongoose.Schema;

const portraitSchema = new Schema({
  pictures: [
    {
      type: String,
      required: true,
    },
  ],
}, {
  timestamps: true,
});

const Portrait = mongoose.model("Portrait", portraitSchema);

export default Portrait;
