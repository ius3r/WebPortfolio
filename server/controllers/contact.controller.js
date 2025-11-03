import Contact from "../models/contact.model.js";

// Simple validators
const requireEmail = (data) => {
  if (!data.email || typeof data.email !== "string" || !/.+@.+\..+/.test(data.email)) {
    return "A valid email is required";
  }
  return null;
};

const create = async (req, res) => {
  try {
    const validationError = requireEmail(req.body || {});
    if (validationError) return res.status(400).json({ error: validationError });

    const doc = new Contact({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to create contact" });
  }
};

const list = async (req, res) => {
  try {
    const docs = await Contact.find();
    return res.json(docs);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to fetch contacts" });
  }
};

const contactByID = async (req, res, next, id) => {
  try {
    const doc = await Contact.findById(id);
    if (!doc) return res.status(404).json({ error: "Contact not found" });
    req.contact = doc;
    return next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid contact id" });
  }
};

const read = (req, res) => {
  return res.json(req.contact);
};

const update = async (req, res) => {
  try {
    if (req.body.email !== undefined) {
      const validationError = requireEmail({ email: req.body.email });
      if (validationError) return res.status(400).json({ error: validationError });
      req.contact.email = req.body.email;
    }
    if (req.body.firstname !== undefined) req.contact.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) req.contact.lastname = req.body.lastname;
    const saved = await req.contact.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to update contact" });
  }
};

const remove = async (req, res) => {
  try {
    await req.contact.deleteOne();
    return res.json({ message: "Contact removed" });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove contact" });
  }
};

const removeAll = async (_req, res) => {
  try {
    const result = await Contact.deleteMany({});
    return res.json({ message: "All contacts removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Failed to remove contacts" });
  }
};

export default { create, list, contactByID, read, update, remove, removeAll };
