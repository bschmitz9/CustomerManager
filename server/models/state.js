var mongoose = require('mongoose');

var stateSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    abbreviation: {type: String, required: true, trim: true }
});

module.exports = mongoose.model('State', stateSchema);