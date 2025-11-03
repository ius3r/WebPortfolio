import Education from "../models/education.model.js";

const requireFields = (data) => {
  if (!data.title || typeof data.title !== "string") return "Title is required";
  if (!data.email || typeof data.email !== "string" || !/.+@.+\..+/.test(data.email)) return "A valid email is required";
  return null;
};

const create = async (req, res) => {
  try {
    const validationError = requireFields(req.body || {});
    if (validationError) return res.status(400).json({ error: validationError });
    const doc = new Education({
      title: req.body.title,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      completion: req.body.completion,
      description: req.body.description,
    });
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to create qualification" });
  }
};

const list = async (_req, res) => {
  try {
    const docs = await Education.find();
    return res.json(docs);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to fetch qualifications" });
  }
};

const educationByID = async (req, res, next, id) => {
  try {
    const doc = await Education.findById(id);
    if (!doc) return res.status(404).json({ error: "Qualification not found" });
    req.education = doc;
    return next();
  } catch (_err) {
    return res.status(400).json({ error: "Invalid qualification id" });
  }
};

const read = (req, res) => res.json(req.education);

const update = async (req, res) => {
  try {
    if (req.body.title !== undefined) req.education.title = req.body.title;
    if (req.body.firstname !== undefined) req.education.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) req.education.lastname = req.body.lastname;
    if (req.body.email !== undefined) {
      if (!/.+@.+\..+/.test(req.body.email)) return res.status(400).json({ error: "A valid email is required" });
      req.education.email = req.body.email;
    }
    if (req.body.completion !== undefined) req.education.completion = req.body.completion;
    if (req.body.description !== undefined) req.education.description = req.body.description;
    const saved = await req.education.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to update qualification" });
  }
};

const remove = async (req, res) => {
  try {
    await req.education.deleteOne();
    return res.json({ message: "Qualification removed" });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove qualification" });
  }
};

const removeAll = async (_req, res) => {
  try {
    const result = await Education.deleteMany({});
    return res.json({ message: "All qualifications removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove qualifications" });
  }
};

export default { create, list, educationByID, read, update, remove, removeAll };
