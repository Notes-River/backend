const { Errors } = require('./Error');
const upload = require('express-fileupload');
const { appController } = require('./Routes/app.controller');
const { UserController } = require('./Routes/user/user.controller');
const { notesController } = require('./Routes/notes/notes.controller');
module.exports = (app) => {
    app.use(upload());
    app.use('/', appController);
    app.use('/auth', UserController);
    app.use('/notes', notesController);

    //For Default 404 error
    app.use((req, res, next) => {
        Errors.Error404(req, res)
    })
}
