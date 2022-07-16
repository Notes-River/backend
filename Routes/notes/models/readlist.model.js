const mongoose = require('mongoose');

const readListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    logo: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NotesModel"
        }
    ],
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    join:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
}, {
    timestamps: true
});

const ReadList = mongoose.model('ReadList', readListSchema);

module.exports = {
    ReadList
}