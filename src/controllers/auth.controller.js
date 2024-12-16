import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { options } from "../utils/option.js";

const generateToken = async function(userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch(error) {
        throw ApiError(500, "Something went wrong while generating Access");
    }
}

export const registerUser = asyncHandler(async(req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        throw new ApiError(401, "All fields must required");
    }
    if([email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field must non-empty");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }]});
    if(existedUser) {
        throw new ApiError(409, "User already exists !");
    }

    const user = await User.create({
        username: username?.toLowerCase(),
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -posts");
    if(!createdUser) {
        throw new ApiError(500, "Server side error while creating User!");
    }

    const { accessToken } = await generateToken(createdUser._id);

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            "status": 200,
            "data": createdUser,
            "message": "User Created Successfully"
        })



});

export const loginUser = asyncHandler( async(req, res) => {
    const { email, password } = req.body;
    if([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field must non-empty !");
    }
    if(!email && !password) {
        throw new ApiError(401, "All fields are required !")
    }

    const user = await User.findOne({ email: email });
    if(!user) {
        throw new ApiError(409, `User with email ${email} doesn't exists !`);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect !")
    }

    const { accessToken } = await generateToken(user._id);
    const authUser = await User.findById(user._id).select("-password -posts");

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            "status": 200,
            "data": authUser,
            "message": "User Logged In Successfully !"
        });
});

export const logoutUser = asyncHandler( async(req, res) => {
    const {userId} = req.body;
    if(!userId) {
        throw new ApiError(404, "User id is required !");
    }

    const user = await User.findById(userId);
    if(!userId) {
        throw new ApiError(409, "User not found");
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .json({
            "status": 200,
            "message": "User Logged out Successfully"
        });
});

export const changeUserPassword = asyncHandler( async(req, res) => {
    const { oldPassword, newPasword } = req.body;
    if(!oldPassword || !newPasword) {
        throw new ApiError(401, "All fields are required !");
    }

    const user = await User.findById(req.user?._id);
    if(!user) {
        throw new ApiError(409, "User not found or user doesn't exists !");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect !");
    }

    user.password = newPasword;
    user.save({ validateBeforeSave: false});

    res.status(200).json({
        "status": 200,
        "message": "Password changed Successfully !"
    });

});

export const deleteUser = asyncHandler( async(req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if(!deleteUser) {
        throw new ApiError(409, "User not found or User already Deleted");
    }

    res.status(200).json({ "status": 200, "message": "User deleted Successfully !"});
})