import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";
import { asyncHandler } from "./asyncHandler.js";
import User from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();
export const varifyJWT = asyncHandler( async function (req, _, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid accessToken");
        }

        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token");
    }
});