import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
	title: { type: String, trim: true },
	firstname: { type: String, trim: true },
	lastname: { type: String, trim: true },
	email: { type: String, trim: true },
	completion: { type: Date },
	description: { type: String, trim: true },
});

export default mongoose.model("Project", ProjectSchema);

