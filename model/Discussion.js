const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    postedBy: {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {type: String}
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    tags: [
        {
            type: String
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {type: String},
            postedAt: {
                type: Date,
                default: Date.now
            },
            comment: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model("Discussion",discussionSchema);