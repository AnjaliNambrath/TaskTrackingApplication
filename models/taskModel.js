const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    EmployeeID: {
      type: Number,
      trim: true,
      required: true,
    },
    taskID: {
      type: Number,
      trim: true,
    },
    taskName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    End_Date: {
      type: String,
      trim: true,
    },
    New_Notification: {
      type: Boolean,
    },
    Decline_Notification: {
      type: Boolean,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  // {
  //   versionKey: false,
  // },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Task", taskSchema);
