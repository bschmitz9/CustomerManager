var mongoose = require('mongoose');
var OrderSchema = require('./order');

var customerSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    firstName: {type : String, required: true, trim: true},
    lastName: {type : String, required: true, trim: true},
    email: {type : String, required: true, trim: true},
    city:  {type : String, required: true, trim: true},
    stateId: {type : String, required: true},
    state: {
        id: { type: String },
        abbreviation: { type: String, required: true, trim: true },
        name:  {type: String, required: true, trim: true}
    },
    zipcode: {type : Number, required: true},
    gender: {type: String},
    orderCount: {type: Number},
    orders: []
});

module.exports = mongoose.model("Customer", customerSchema);

