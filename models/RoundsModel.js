var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoundSchema = new Schema({
    tournament_id : {
        type: Schema.ObjectId,
        ref: 'Tournaments',
    },
    round_number : {
        type: Number,
        required : true,
    },
});

RoundSchema.virtual('url').get(function () {
    return '/rounds/' + this._id;
});

module.exports = mongoose.model('Rounds', RoundSchema);