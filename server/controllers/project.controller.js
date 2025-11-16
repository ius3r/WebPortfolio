import Project from "../models/project.model.js";
import errorHandler from "./error.controller.js";

// Minimal validator: only title required now
const requireFields = (data) => {
  if (!data.title || typeof data.title !== "string") return "Title is required";
  return null;
};

const create = async (req, res) => {
  try {
    const validationError = requireFields(req.body || {});
    if (validationError) return res.status(400).json({ error: validationError });
    const doc = new Project({
      title: req.body.title,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email, // optional
      completion: req.body.completion,
      description: req.body.description,
      summary: req.body.summary,
      details: req.body.details,
      images: Array.isArray(req.body.images) ? req.body.images : [],
    });
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      return res.status(409).json({ error: errorHandler.getErrorMessage(err) });
    }
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (_req, res) => {
  try {
    const docs = await Project.find();
    return res.json(docs);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to fetch projects" });
  }
};

const projectByID = async (req, res, next, id) => {
  try {
    const doc = await Project.findById(id);
    if (!doc) return res.status(404).json({ error: "Project not found" });
    req.project = doc;
    return next();
  } catch (_err) {
    return res.status(400).json({ error: "Invalid project id" });
  }
};

const read = (req, res) => res.json(req.project);

const update = async (req, res) => {
  try {
    if (req.body.title !== undefined) req.project.title = req.body.title;
    if (req.body.firstname !== undefined) req.project.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) req.project.lastname = req.body.lastname;
    if (req.body.email !== undefined) {
      if (req.body.email && !/.+@.+\..+/.test(req.body.email)) return res.status(400).json({ error: "A valid email is required" });
      req.project.email = req.body.email;
    }
    if (req.body.completion !== undefined) req.project.completion = req.body.completion;
    if (req.body.description !== undefined) req.project.description = req.body.description;
    if (req.body.summary !== undefined) req.project.summary = req.body.summary;
    if (req.body.details !== undefined) req.project.details = req.body.details;
    if (req.body.images !== undefined && Array.isArray(req.body.images)) req.project.images = req.body.images;
    const saved = await req.project.save();
    return res.json(saved);
  } catch (err) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      return res.status(409).json({ error: errorHandler.getErrorMessage(err) });
    }
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    await req.project.deleteOne();
    return res.json({ message: "Project removed" });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove project" });
  }
};

const removeAll = async (_req, res) => {
  try {
    const result = await Project.deleteMany({});
    return res.json({ message: "All projects removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove projects" });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };
