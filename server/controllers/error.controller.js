import dbErrorHandler from "../helpers/dbErrorHandler.js";

function handleError(_req, res, err) {
  const message = dbErrorHandler.getErrorMessage(err);
  return res.status(400).json({ error: message });
}

function getErrorMessage(err) {
  return dbErrorHandler.getErrorMessage(err);
}

export default { handleError, getErrorMessage };
