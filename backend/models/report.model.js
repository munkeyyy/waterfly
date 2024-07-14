import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema(
  {
    supplies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "supply",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("report",ReportSchema)
