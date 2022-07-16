const AppController = require('./Routes/app.controller');
const UserController = require('./Routes/user/user.controller');
const NotesController = require('./Routes/notes/notes.controller');


module.exports = [
    {
        path: '/user',
        control: UserController
    }, {
        path: '/notes',
        control: NotesController
    },
    {
        path: '/',
        control: AppController
    },
]