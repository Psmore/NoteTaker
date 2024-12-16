import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Note" }],
}, { timestamps: true });

/* password get's hashed before saving in the database */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* checking password */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

/* generating access token */
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("User", userSchema);

export default User;