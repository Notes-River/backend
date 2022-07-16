const { NotesModel } = require("../Routes/notes/models/notes.model")

const checkRequiredFields = (fields) => {

    return (req, res, next) => {

        const errorFields = []
        const requiredFields = Object.keys(req.body)

        fields.forEach(f => {
            if (!requiredFields.includes(f)) {
                errorFields.push(f);
            }
        })

        if (errorFields.length > 0) {
            return res.status(400).send(errorFields.join(', ') + "fields are required");
        }
        next()

    }
}
const checkNotRequiredFields = (fields) => {

    return (req, res, next) => {

        const errorFields = []
        const requiredFields = Object.keys(req.body)

        fields.forEach(f => {
            if (requiredFields.includes(f)) {
                errorFields.push(f);
            }
        })

        if (errorFields.length > 0) {
            return res.status(400).send(errorFields.join(', ') + " you can\'t add these fields");
        }
        next()

    }
}
const checkRequiredHeaders = (headers) => {
    return (req, res, next) => {
        const errorFields = []
        const requiredFields = Object.keys(req.headers)

        headers.forEach(f => {
            if (!requiredFields.includes(f)) {
                errorFields.push(f);
            }
        })

        if (errorFields.length > 0) {
            return res.status(400).send(errorFields.join(', ') + " fields are required in headers");
        }
        next()


    }
}

const checkRequiredQueries = (queries) => {
    return (req, res, next) => {
        const errorFields = []
        const requiredFields = Object.keys(req.query)

        queries.forEach(f => {
            if (!requiredFields.includes(f)) {
                errorFields.push(f);
            }
        })

        if (errorFields.length > 0) {
            return res.status(400).send(errorFields.join(', ') + " fields are required in queries");
        }
        next()
    }

}
const checkUserVerified = () => {
    return async (req, res, next) => {
        if (req.user.status == true) next();
        else res.status(400).send({ message: "Please verify your email first" });
    }
}

const checkUserNotVerified = () => {
    return async (req, res, next) => {
        if (req.user.status == false) next();
        else res.status(400).send({ message: "Account already verified login please" });
    }
}

const checkUserOwnReadList = () => {
    return async (req, res, next) => {
        if (req.user.readList.includes(req.body.id)) {
            next();
        } else return res.status(400).send({ message: 'You are not own this readlist' });
    }
}

const checkuserJoinedReadList = () => {
    return async (req, res, next) => {
        if (req.user.joined.includes(req.body.readlist_id)) {
            req.joined = true;
            req.readlist_id = req.body.readlist_id;
            next();
        } else { req.joined = false; req.readlist_id = req.body.readlist_id; next(); }
    }
}

const checkownNotes = () => {
    return async (req, res, next) => {
        try {

            let notes = await NotesModel.findById(req.body.notes_id);
            if (req.user.readList.includes(notes.readList)) {
                req.own_notes = true;
                req.notes = notes;
                next();
            } else {
                req.own_notes = false;
                req.notes = notes;
                next();
            }
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
}
module.exports = { checkRequiredFields, checkRequiredHeaders, checkRequiredQueries, checkUserVerified, checkUserNotVerified, checkUserOwnReadList, checkNotRequiredFields, checkuserJoinedReadList, checkownNotes }