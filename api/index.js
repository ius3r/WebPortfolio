import config from "../config/config.js";
import app from "../server/express.js";
import mongoose from "mongoose";

// Initialize MongoDB connection only if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(config.mongoUri, {
      // Modern MongoDB connection options are handled automatically
    })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });

  mongoose.connection.on("error", (err) => {
    console.error(`Database connection error: ${err}`);
  });
}

// Export the Express app as a serverless function
export default app;
