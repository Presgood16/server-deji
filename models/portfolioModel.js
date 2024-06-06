import mongoose from "mongoose";
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pictures: [
    {
      type: String,
      required: true,
    },
  ],
}, {
  timestamps: true,
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
// Create the Portfolio model