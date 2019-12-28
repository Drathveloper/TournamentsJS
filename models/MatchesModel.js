var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    round_id : {
        type: Schema.ObjectId,
        ref: 'Rounds',
        required: true,
    },
    player1_id : {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
    player2_id : {
        type: Schema.ObjectId,
        ref: 'Users',
    },
    table_number : {
        type: Number,
        required: true,
    },
    outcome : {
        type: Schema.ObjectId,
        ref: 'Users',
    },
});

MatchSchema.virtual('url').get(function () {
    return '/match/' + this._id;
});

module.exports = mongoose.model('Matches', MatchSchema);