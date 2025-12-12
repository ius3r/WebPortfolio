import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/project.routes.js";
import educationRoutes from "./routes/education.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import portfolioInfoRoutes from "./routes/portfolioinfo.routes.js";

const app = express();

// Core middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());

// CORS BEFORE routes, allow credentials for dev client
const whitelist = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server and tools
    const allowed = whitelist.filter(Boolean).includes(origin);
    callback(allowed ? null : new Error("Not allowed by CORS"), allowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

// API Routes after CORS
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", contactRoutes);
app.use("/", projectRoutes);
app.use("/", educationRoutes);
app.use("/", serviceRoutes);
app.use("/", portfolioInfoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});
    
export default app;
