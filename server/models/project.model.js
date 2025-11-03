import mongoose from "mongoose";

// Define the Education schema
const ProjectSchema = new mongoose.Schema({
	title: { type: String, trim: true, required: 'Title is required' },
	firstname: { type: String, trim: true, required: 'Firstname is required' },
	lastname: { type: String, trim: true, required: 'Lastname is required'	 },
	email: {
		type: String,
		trim: true,
		unique: 'Email already exists',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		required: 'Email is required'
	},
	completion: { type: Date },
	description: { type: String, trim: true, required: 'Description is required' },
});

export default mongoose.model("Project", ProjectSchema);

