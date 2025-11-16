import mongoose from "mongoose";

// Project schema (minimally modified to support portfolio data)
const ProjectSchema = new mongoose.Schema({
	title: { type: String, trim: true, required: 'Title is required' },
	// Legacy fields retained (can be deprecated later)
	firstname: { type: String, trim: true },
	lastname: { type: String, trim: true },
	// Email no longer required; kept optional to avoid migration complexity
	email: {
		type: String,
		trim: true,
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
	},
	completion: { type: Date },
	description: { type: String, trim: true },
	// New portfolio fields
	summary: { type: String, trim: true },
	details: { type: String, trim: true },
	images: [{ type: String, trim: true }],
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);

