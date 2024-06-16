const express = require("express");
const Notes = require("../../models/notes_model");
const authenticationToken = require("../../utilities");

const router = express.Router();


router.post("/add", authenticationToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res.json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Notes({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    res.json({
      error: false,
      message: "Note saved successfully",
      data: note,
    });
  } catch (error) {
    res.status(401).json({ error: true, message: "internal server error" });
    console.log(error);
  }
});

router.put("/edit/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if ((!title, !content, !tags)) {
    return res
      .status(400)
      .json({ error: true, message: "No Changes provided" });
  }

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    res.json({
      error: false,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    res.status(401).json({ error: true, message: "internal server error" });
    console.log(error);
  }
});

router.get("/get", authenticationToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Notes.find({ userId: user._id });
    res.json({ error: false, notes: notes });
  } catch (error) {
    res.status(401).json({ error: true, message: "internal server error" });
    console.log(error);
  }
});

router.delete("/delete/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    await Notes.deleteOne({ _id: noteId, userId: user._id });

    res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "internal server error" });
    console.log(error);
  }
});

router.put("/pin/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (!isPinned) {
      return res
        .status(404)
        .json({ error: true, message: "no changes provided" });
    }

    if (isPinned) note.isPinned = isPinned;

    await note.save();

    res.json({ error: false, message: "Note pinned successfully", data: note });
  } catch (error) {
    res.status(500).json({ error: true, message: "internal server error" });
    console.log(error);
  }
});

router.get("/search", authenticationToken, async (req, res) => {
  const { searchQuery } = req.query;
  const { user } = req.user;

  if(!searchQuery) {
    return res.status(400).json({ error: true, message: "search query is required" });
  }

  try {
    const matchingNotes = await Notes.find({ userId: user._id, $or: [{ title: { $regex: new RegExp(searchQuery, "i") } }, { content: { $regex: new RegExp(searchQuery, "i") } }] });
    
    return res.json({ error: false, notes: matchingNotes, message: "matching notes found" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "internal server error" });
  }

});


module.exports = router;
