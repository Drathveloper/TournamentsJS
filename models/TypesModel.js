var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var TypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type_id: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Types', TypeSchema);