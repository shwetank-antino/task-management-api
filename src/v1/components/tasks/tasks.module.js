import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      required: true,
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default Task = mongoose.model("Task", TaskSchema);
