var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema ({
    product : {type : String, required: true, trim: true},
    price : { type : Number },
    quantity : { type : Number}
});

module.exports = mongoose.model('Orders', orderSchema);