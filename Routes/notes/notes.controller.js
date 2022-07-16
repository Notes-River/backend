const { isUserAuthenticated } = require('../../MiddleWares/isUserAuthenticated');
const { checkRequiredHeaders, checkRequiredFields, checkUserVerified, checkUserOwnReadList, checkNotRequiredFields, checkuserJoinedReadList, checkownNotes } = require('../../MiddleWares/MiddleWares');
const { notesService } = require('./notes.service');

const notesController = require('express').Router();

// Readlist....
notesController.get('/download-notes', isUserAuthenticated, notesService.downloadNotes);
notesController.get('/read-list/all', notesService.fetchAllReadList);
notesController.get('/read-list/user/:id', notesService.fetchAllReadListofUser);

notesController.get('/read-list/auth/user',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    notesService.getReadlistwithAuth
);

notesController.post('/read-list/create',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkUserVerified(),
    checkRequiredFields([
        'title',
    ]),
    checkNotRequiredFields(['notes', 'likedBy', 'dislikedBy']),
    notesService.createReadList
);

//TODO: need to find logic of delete files
notesController.delete('/read-list/delete',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkUserVerified(),
    checkRequiredFields(['id']),
    checkUserOwnReadList(),
    notesService.deleteReadList
);

notesController.patch('/read-list/update',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkUserVerified(),
    checkUserOwnReadList(),
    checkNotRequiredFields(['likedBy', 'dislikedBy', 'notes', 'user']),
    checkRequiredFields(['id']),
    checkUserOwnReadList(),
    notesService.updateReadList
);
notesController.patch('/read-list/join/request',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkUserVerified(),
    checkRequiredFields(['readlist_id']),
    checkuserJoinedReadList(),
    notesService.joinReadList
);

notesController.patch('/read-list/leave/request',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkUserVerified(),
    checkRequiredFields(['readlist_id']),
    checkuserJoinedReadList(),
    notesService.leaveReadList,
);


//Notes...
notesController.post('/create',
    checkRequiredHeaders(['x-user']),
    checkRequiredFields(['id', 'title', 'desc']),
    checkNotRequiredFields(['filePath', 'likedBy', 'dislikedBy']),
    isUserAuthenticated,
    checkUserOwnReadList(),
    notesService.uploadNotes
);

// notesController.patch('/update'),
notesController.delete('/delete',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkRequiredFields(['notes_id']),
    checkownNotes(),
    notesService.deleteNotes
);

//fetch notes related to user from joined readlist and own readlist
notesController.get('/related',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    notesService.fetchAllNotes,
)

//Like notes
notesController.post('/like',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkRequiredFields(['notesid']),
    notesService.likeNotes,
)

notesController.post('/dislike',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkRequiredFields(['notesid']),
    notesService.dislikeNotes,
)

notesController.post('/fav',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    checkRequiredFields(['notesid']),
    notesService.addToFave,
)

notesController.get('/fav',
    checkRequiredHeaders(['x-user']),
    isUserAuthenticated,
    notesService.getFavNotes,
)

notesController.get('/files',
    checkRequiredHeaders(['x-user']),
    checkRequiredFields(["notesid"]),
    isUserAuthenticated,
    notesService.sendFiles,
)



module.exports = { notesController }