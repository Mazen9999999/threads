import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    likedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        required: true,
    },
    likedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;