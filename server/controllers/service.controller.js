import Service from '../models/service.model.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
  try {
    const doc = new Service(req.body);
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (_req, res) => {
  try {
    const docs = await Service.find();
    return res.json(docs);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const serviceByID = async (req, res, next, id) => {
  try {
    const doc = await Service.findById(id);
    if (!doc) return res.status(404).json({ error: 'Service not found' });
    req.service = doc;
    return next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const read = (req, res) => res.json(req.service);

const update = async (req, res) => {
  try {
    ['title','description','icon','color'].forEach(f => { if (req.body[f] !== undefined) req.service[f] = req.body[f]; });
    if (req.body.checklist !== undefined) req.service.checklist = req.body.checklist;
    const saved = await req.service.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    await req.service.deleteOne();
    return res.json({ message: 'Service removed' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeAll = async (_req, res) => {
  try {
    const result = await Service.deleteMany({});
    return res.json({ message: 'All services removed', deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, serviceByID, read, update, remove, removeAll };
