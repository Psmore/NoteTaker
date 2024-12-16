import dotenv from "dotenv";
import { app } from "./src/app.js";
import { connectDb } from "./src/connectDb.js";

dotenv.config({
    path: "./.env"
});

try {
    await connectDb().then(() => {
        app.listen(process.env.PORT);
        console.log("Server is running at ", process.env.PORT);
    });
} catch (error) {
    console.error(error.message);
}
