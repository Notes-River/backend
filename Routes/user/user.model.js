const mongoose = require('mongoose');
const lodash = require('lodash');
const jwt = require('jsonwebtoken');
const bcryptJs = require('bcryptjs');
const access = 'iamjack56';
const secret = 'blackcoder56';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,

    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    status: {
        type: Boolean,
        default: false,
    },
    readList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadList",
    }],
    joined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadList"
    }],
    favNotes: [{
        type: mongoose.Types.ObjectId,
        ref: "NotesModel"
    }]
}, {
    timestamps: true
});

UserSchema.methods.toJSON = function () {
    let User = this;
    let UserObj = User.toObject();
    return lodash.pick(UserObj, ['_id', 'name', 'username', 'img', 'email', 'number', 'status', 'readList', 'joined','favNotes']);
}

UserSchema.methods.genUserToken = function () {
    let User = this;
    let token = jwt.sign({ _id: User._id.toHexString(), access }, secret).toString();
    User.tokens = User.tokens.concat([{
        access,
        token
    }]);
    return User.save().then(() => {
        return token;
    });
}

UserSchema.statics.findUserByToken = function (token) {
    let User = this;
    let decode;
    try {
        decode = jwt.verify(token, secret);
    } catch (error) {
        return Promise.reject();
    }
    return User.find({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': access
    });
}


UserSchema.pre('save', function (next) {
    let User = this;
    if (User.isModified('password')) {
        bcryptJs.genSalt(7, (err, salt) => {
            bcryptJs.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
