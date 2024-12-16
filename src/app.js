import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import compression from "compression";

const app = express();
const __dirname = path.resolve();

/* use cors if you want deploy your frontend on different origin */
//app.use(cors({
//    origin: "http://localhost:5173",
//    credentials: true
//}));

app.use(compression());
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
