import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    heading: { type: String, required: true },
    noteData: { type: String, required: true },
    tags: [{ type: String, required: true }],
    owner: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);

export default Note;