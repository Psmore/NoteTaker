import Note from "../models/note.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNote = asyncHandler(async (req, res) => {
    const { heading, noteData, tags } = req.body;
    if (!heading && !noteData && !tags) {
        throw new ApiError(401, "All fields are required");
    }


    const note = await Note.create({
        heading,
        noteData,
        tags,
        owner: req.user?._id
    });

    const createdNote = await Note.findById(note._id);
    if (!createdNote) {
        throw new ApiError(500, "Error while create note");

    }

    res.status(200)
        .json({
            "status": 200,
            "data": createdNote,
            "message": "Note created SuccessFully"
        });

});

export const listAllNotes = asyncHandler(async (req, res) => {
    const AllNotes = await Note.find({ owner: req.user?._id });
    if (!AllNotes) {
        throw new ApiError(409, "Error while Listing notes");
    }

    res.status(200).json({
        "status": 200,
        "data": AllNotes,
        "message": "All notes Fetched Successfully"
    });
});

export const deleteNote = asyncHandler(async (req, res) => {
    try {
        const { noteId } = req.body;
        if (!noteId) {
            throw new ApiError(401, "Notes Id is required !");
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deleteNote) {
            throw new new ApiError(409, "Note not found or Already deleted !");
        }

        res.status(200).json({ "status": 200, "message": "Note deleted Successfully" });
    } catch (error) {
        console.error(error.message);
    }
});

export const editNote = asyncHandler(async (req, res) => {

    const { heading, noteData, tags, noteId } = req.body;
    if (!heading || !noteData || !tags || !noteId) {
        throw new ApiError(401, "All fields are required !");
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new ApiError(400, "Invalid note ID format.");
    }

    const note = await Note.findById(noteId);
    if (!note) {
        throw new ApiError(409, "Note not found or does not exists !");
    }

    const editedNote = await Note.findByIdAndUpdate(
        note._id,
        {
            $set: {
                heading,
                noteData,
                tags
            }
        },
        {
            new: true
        }
    );

    const newNote = await Note.findById(note._id);

    res.status(200).json({
        "status": 200,
        "data": newNote,
        "message": "Note edited Successfully"
    });

});