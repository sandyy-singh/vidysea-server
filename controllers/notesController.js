import Note from '../models/note.model.js';

// CREATE
export const createNote=  async (req, res, next) => {

 
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const note = await Note.create({ title, description, user: req.user._id  });

    res.status(201).json({
      success: true,
      message: "note added successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};




export const getNotes = async (req, res, next) => {
  try {

    const notes = req.user.role === 'admin'
      ? await Note.find().sort({ createdAt: -1 })
      : await Note.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (notes.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: req.user.role === 'admin'
          ? "No notes found. Please add a note first."
          : "You have no notes yet.",
      });
    }

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};






// UPDATE
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "note not found" });
    }
    if (req.user.role !== 'admin' && note.user.toString() !== req.user._id.toString()) {
 
      return res.status(403).json({ message: 'you are not authorized person' });
    }
 

    const { title, description } = req.body;

    note.title = title || note.title;
    note.description = description || note.description;
    
    const updatedNote= await note.save();

    res.status(200).json({
      success: true,
      message: "note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteNote = async (req, res, next) => {

  try {

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "note not found" });
    }

    if (req.user.role !== 'admin' && note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'you are not authorized person' });
    }
    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};