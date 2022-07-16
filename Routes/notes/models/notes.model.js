const mongoose = require('mongoose');


const notesSchema = new mongoose.Schema({
    readList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadList"
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: "N/A",
    },
    tags: [
        {
            type: String,
        }
    ],
    filePath: [
        {
            type: String,
            required: true,
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
}, {
    timestamps: true,
});

const NotesModel = mongoose.model('NotesModel', notesSchema);

module.exports = {
    NotesModel,
}

// parent_id folder_id folder_name
// null         123     root
// 123          345     home

// folder_id  content