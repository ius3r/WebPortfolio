import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
	firstname: { type: String, trim: true },
	lastname: { type: String, trim: true },
	email: { type: String, trim: true },
});

export default mongoose.model("Contact", ContactSchema);

