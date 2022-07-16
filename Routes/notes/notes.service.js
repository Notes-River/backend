const { NotesModel } = require("./models/notes.model");
const { ReadList } = require("./models/readlist.model");
const { isValidObjectId } = require('mongoose');
const fs = require('fs');

const { stat } = require('node:fs/promises');

class NotesService {
    async fetchAllReadList(req, res) {
        try {
            const readlists = await ReadList.find({}).populate({ path: 'user', select: 'name username _id' });
            res.status(200).send({ readlists, length: readlists.length });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
    async fetchAllReadListofUser(req, res) {
        try {
            const readlists = await ReadList.find({ user: req.params.id }).populate({ path: 'user', select: 'name username _id' });
            res.status(200).send({ readlists, length: readlists.length });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async getReadlistwithAuth(req, res) {
        try {
            const readlists = await req.user.populate('readList').execPopulate();
            res.status(200).send({ readlist: readlists.readList });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async createReadList(req, res) {
        req.body.user = req.user._id;
        if (req.body.tags != undefined)
            req.body.tags = JSON.parse(req.body.tags)
        console.log(req.body)
        try {
            let path = Date.now() + req.user._id + 'logo';
            if (req.files) {
                if (req.files.logo) {
                    let p = req.files.logo.name.split('.');
                    path = path + req.files.logo.name;
                    req.files.logo.mv('logo/' + path);
                    req.body.logo = 'logo/' + path;
                }
            }
            let readlist = await ReadList.create(req.body);
            req.user.readList.push(readlist._id);
            await req.user.save();
            res.status(201).send({ message: 'readlist created', readlist });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async deleteReadList(req, res) {
        try {
            const readlist = await ReadList.findByIdAndDelete(req.body.id);
            if (readlist.logo) {
                await fs.unlinkSync(readlist.logo);
            }
            if (readlist.notes.length != 0) {
                let notes = await NotesModel.find({ readList: readlist._id });
                await NotesModel.deleteMany({
                    _id: {
                        $in: readlist.notes
                    }
                });
            }
            res.status(200).send(readlist);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    async updateReadList(req, res) {
        try {
            const readlist = await ReadList.findByIdAndUpdate(req.body.id, req.body);
            res.status(200).send({ message: 'Updated', readlist })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async joinReadList(req, res) {
        try {
            if (req.joined || req.user.readList.includes(req.readlist_id)) return res.status(400).send({ message: 'Aleady a member of readlist.' });
            else {
                req.user.joined.push(req.readlist_id);
                let readlist = await ReadList.findById(req.readlist_id);
                readlist.join.push(req.user._id);
                await req.user.save();
                await readlist.save();
                res.status(200).send({ message: 'Now you are a member of readlist', readlist });
            }
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async leaveReadList(req, res) {
        try {
            if (req.joined) {
                req.user.joined.pop(req.readlist_id);
                let readlist = await ReadList.findById(req.readlist_id);
                readlist.join.pop(req.user._id);

                await req.user.save();
                await readlist.save();
                return res.status(200).send({ message: 'You are no longer member of this readlist', readlist, user: req.user });
            } else res.status(400).send({ message: 'You are not a member of readlist' });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
    async uploadNotes(req, res) {
        try {
            if (req.body.tags != undefined) {
                req.body.tags = JSON.parse(req.body.tags);
            }
            req.body.readList = req.body.id;
            let readlist = await ReadList.findById(req.body.readList);

            if (!fs.existsSync('files/' + readlist._id + '/')) {
                fs.mkdirSync('files/' + readlist._id + '/', { recursive: true });
            }

            if (req.files) {
                if (req.files.notes.length == undefined) {

                    let time = Date.now();
                    req.files.notes.mv('files/' + readlist._id + '/' + time + req.files.notes.name);
                    let notes = await NotesModel.create(req.body);
                    readlist.notes.push(notes._id);
                    notes.filePath.push('files/' + readlist._id + '/' + time + req.files.notes.name);
                    await readlist.save();
                    await notes.save();

                    return res.status(200).send({ message: 'Notes uploaded', notes, readlist });
                } else {
                    let p = [];
                    req.files.notes.forEach((e) => {
                        let time = Date.now();
                        let path = 'files/' + readlist._id + '/' + time + e.name;
                        e.mv(path);
                        p.push(path);
                    });
                    let notes = await NotesModel.create(req.body);
                    notes.filePath = p;
                    readlist.notes.push(notes._id);
                    await notes.save();
                    await readlist.save();

                    return res.status(200).send({ message: 'Multiple files', readlist, notes, });
                }
            } else return res.status(400).send({ message: 'Please select pdf files' });
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    async deleteNotes(req, res) {
        try {
            console.log(req.notes)
            if (req.own_notes == false) return res.status(404).send({ message: 'You are not creater of this notes' });
            else {
                let readlist = await ReadList.findById(req.notes.readList);
                readlist.notes.pop(req.notes._id);
                req.notes.filePath.forEach((e) => {
                    fs.unlinkSync(e);
                });
                await NotesModel.findByIdAndDelete(req.notes._id);
                await readlist.save();
                res.status(200).send({ readlist, message: 'Notes deleted' });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error.message });
        }
    }

    async fetchAllNotes(req, res) {
        try {
            let user = req.user;
            let ids = user.readList;
            ids.concat(user.joined);
            console.log(ids);
            let notes = await NotesModel.find({ "readList": { "$in": ids } }).populate({ path: 'readList' });

            res.status(200).send(notes);
        } catch (error) {
            res.staus(500).send({ message: error.message });
        }
    }

    async likeNotes(req, res) {
        try {
            let { notesid } = req.body;
            let notes = await NotesModel.findById(notesid);
            if (!notes) return res.status(404).send({ message: "Notes not found" })
            if (notes.likedBy.includes(req.user._id)) {
                notes.likedBy.pop(req.user._id);
                await notes.save();
            } else {
                if (notes.dislikedBy.includes(req.user._id)) {
                    notes.dislikedBy.pop(req.user._id);
                }
                notes.likedBy.push(req.user._id);
                await notes.save();
            }
            res.status(200).send({ likedBy: notes.likedBy, dislikedBy: notes.dislikedBy });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    async dislikeNotes(req, res) {
        try {
            let { notesid } = req.body;
            let notes = await NotesModel.findById(notesid);
            if (!notes) return res.status(404).send({ message: "Notes not found" });

            if (notes.dislikedBy.includes(req.user._id)) {
                notes.dislikedBy.pop(req.user._id);
            } else {
                if (notes.likedBy.includes(req.user._id)) {
                    notes.likedBy.pop(req.user._id);

                }
                notes.dislikedBy.push(req.user._id);

            }

            await notes.save();

            res.status(200).send({ likedBy: notes.likedBy, dislikedBy: notes.dislikedBy });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    async addToFave(req, res) {
        try {
            let { notesid } = req.body;

            if (!isValidObjectId(notesid)) return res.status(404).send({ message: 'Invalid notes id' });
            let notes = await NotesModel.findById(notesid);
            if (!notes) return res.status(404).send({ message: "Notes not found" });

            if (req.user.favNotes.includes(notesid)) {
                req.user.favNotes.pop(notesid);
            } else {
                req.user.favNotes.push(notesid);
            }

            await req.user.save();

            await req.user.execPopulate({
                path: 'favNotes',
                populate: {
                    path: 'readList'
                }
            })
            console.log(req.user.favNotes);
            res.status(200).send(req.user.favNotes);
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async getFavNotes(req, res) {
        try {
            await req.user.execPopulate({
                path: 'favNotes',
                populate: {
                    path: 'readList'
                }
            });
            res.status(200).send({ notes: req.user.favNotes });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async sendFiles(req, res) {
        try {
            let { notesid } = req.body;
            let notes = await NotesModel.findById(notesid);
            if (!notes) return res.status(404).send({ message: "File not found" });
            if (notes.filePath.length == 0) return res.status(404).send({ message: "Files not found" });
            res.download(notes.filePath[0]);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }


    async downloadNotes(req, res) {
        try {
            let { path } = req.query;
            if (!path) return res.status(404).send({ message: 'path not found in query' });
            if ((await stat(path))) {
                return res.download(path);
            } else return res.status(500).send({ message: 'FILE DOSE nOT EXIST' });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
}

const notesService = new NotesService();

module.exports = {
    notesService
}
