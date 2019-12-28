var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    role: {
        type: Schema.ObjectId,
        ref: 'Roles',
        required: true,
    },
    registered_tournaments: [{
        type: Schema.ObjectId,
        ref: 'Tournaments',
    }],
    sid: String,
});

UserSchema.virtual('url').get(function () {
    return '/users/' + this._id;
});

module.exports = mongoose.model('Users', UserSchema);