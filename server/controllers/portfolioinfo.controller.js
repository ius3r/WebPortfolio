import PortfolioInfo from "../models/portfolioinfo.model.js";
import errorHandler from "./error.controller.js";

// Return the single portfolio info document (first one), or 404 if none
const getSingle = async (_req, res) => {
  try {
    const doc = await PortfolioInfo.findOne();
    if (!doc) return res.status(404).json({ error: "Portfolio info not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Admin: create a new portfolio info document
const create = async (req, res) => {
  try {
    const doc = new PortfolioInfo(req.body || {});
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Admin: upsert the single portfolio info (create if none exists)
const upsert = async (req, res) => {
  try {
    const update = req.body || {};
    const saved = await PortfolioInfo.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Admin: get by id
const read = async (req, res) => {
  try {
    const doc = await PortfolioInfo.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Portfolio info not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Admin: update by id
const update = async (req, res) => {
  try {
    const saved = await PortfolioInfo.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
    if (!saved) return res.status(404).json({ error: "Portfolio info not found" });
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Admin: delete by id
const remove = async (req, res) => {
  try {
    const doc = await PortfolioInfo.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Portfolio info not found" });
    await doc.deleteOne();
    return res.json({ message: "Portfolio info removed" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { getSingle, create, upsert, read, update, remove };
