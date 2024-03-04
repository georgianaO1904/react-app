const mongoose = require("mongoose");


const sectionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    lectures: [
      {
        name: { type: String, required: true },
        link: {
          type: String,
          default: "https://meet.google.com/",
          required: true,
        },
        isStreamed: { type: Boolean, default: false },
        streamedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const courseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users", //relation betwen the course and the teacher
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://i.imgur.com/ouOr3VY.jpg",
    },
    description: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    content: [sectionSchema],
    numStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
