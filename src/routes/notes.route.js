import { Router } from "express";
import { createNote, deleteNote, editNote, listAllNotes } from "../controllers/notes.controller.js";
import { varifyJWT } from "../utils/auth.utils.js";
const router = Router();

router.post("/create", varifyJWT, createNote);
router.get("/listAll", varifyJWT, listAllNotes);
router.delete("/delete", varifyJWT, deleteNote);
router.patch("/edit", varifyJWT, editNote);

export default router;