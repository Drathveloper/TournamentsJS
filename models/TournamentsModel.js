var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TournamentSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    tournament_date : {
        type: Date,
        required: true,
    },
    players : [{
        type: Schema.ObjectId,
        ref: 'Users',
    }],
    tournament_type : {
        type: Schema.ObjectId,
        ref: 'Types',
        required: true,
    },
    standings : [{
        type: String,
    }],
    tournament_cap : {
        type : Number,
        min: 1,
        required: true,
    },
    tournament_organizer : {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true,
    }
});

TournamentSchema.virtual('url').get(function () {
    return '/tournaments/' + this._id;
});

module.exports = mongoose.model('Tournaments', TournamentSchema);