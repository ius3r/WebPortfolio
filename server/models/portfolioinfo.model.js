import mongoose from "mongoose";

const PortfolioInfoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    headline: { type: String, trim: true },
    bio: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("PortfolioInfo", PortfolioInfoSchema);
