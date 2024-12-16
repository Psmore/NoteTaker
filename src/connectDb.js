import mongoose from "mongoose";
//import dotenv from "dotenv";
//dotenv.config({
//    path: "./.env"
//});

const connectDb = async function() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
        console.log(`Database connected to Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Database connection Error", error.message); 
    }
}

export { connectDb };