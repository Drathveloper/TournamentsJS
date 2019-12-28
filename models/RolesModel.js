var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var RoleSchema = Schema({
    role_id : {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Roles', RoleSchema);