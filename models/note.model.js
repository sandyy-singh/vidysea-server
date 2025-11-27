import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title : {
      type: String,
      required: [true, "title is required"],

    },

    description: {
      type: String,
      required: [true, "description is required"],
    },


    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true
    },
  },
  {
    timestamps: true,
  }
);



const Note = mongoose.model("Note", noteSchema);
export default Note;
