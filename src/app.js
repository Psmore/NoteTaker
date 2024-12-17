import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import helmet from "helmet";

const app = express();
const __dirname = path.resolve();


app.use(compression());
app.use(helmet());
app.use(express.json({ limit: "32kb"}));
app.use(express.urlencoded({ extended: true, limit: "32kb"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

/* importing routes */
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/notes.route.js";

/* setting routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/note", noteRoutes);

export { app };
