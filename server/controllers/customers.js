var mongoose = require('mongoose');
var Customer = require('../models/customer');
var State = require('../models/state');
var Orders = require('../models/order');

module.exports = (function (){

    return {

        showStates: function (req, res){
            State.find({}, function (error, states){
                if(error){
                    res.writeHead(500);
                    res.end(error);
                } else {
                    res.json(states);
                }

            });
        },

        addCustomer: function (req, res){
           State.find({_id: req.body.stateId}, function (error, state){
                if(error){
                    res.writeHead(500);
                    res.end(error);
                } else {
                    var stateInfo = {'id': state[0]._id, 'abbreviation': state[0].abbreviation, 'name': state[0].name};
                    var customer = new Customer ({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        address: req.body.address,
                        city: req.body.city,
                        stateId: req.body.stateId,
                        state: stateInfo,
                        zipcode: req.body.zipcode,
                        gender: req.body.gender,
                        id: 1
                    });
    
                    customer.save(function (error, result){
                        if(error){
                            res.status(500).send(error.message);
                        } else {
                            res.json(result);
                        }
                    });
                }
           });
        },

        updateCustomer: function (req, res){
            State.find( {_id:req.body.state.id}, function (error, state){
                if(error){
                    res.writeHead(500);
                    res.end(error);
                } else {
                    var stateInfo = {'id': state[0]._id, 'abbreviation': state[0].abbreviation, 'name': state[0].name};
                    Customer.update({_id: req.body._id}, {$set: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        address: req.body.address,
                        city: req.body.city,
                        stateId: req.body.stateId,
                        state: stateInfo,
                        zipcode: req.body.zipcode,
                        gender: req.body.gender,
                    }}, function (error, result){
                        if(error){
                            res.status(500).send(error.message);
                        } else {
                            res.json({status: true});
                        }
                    });
                }
            });
        },

        customersSummary: function (req, res){
            var top = req.query.$top; //10
            var skip = req.query.$skip; // 0

            Customer.count(function (error, count){
                
                Customer.find({}).skip(skip).limit(top).exec(function (error, summary){
                    res.setHeader('X-InlineCount', count);
                    if(error){
                        res.writeHead(500);
                        res.json(error);
                    } else {
                        res.json(summary);
                    }
                });
            });
        },

        login: function (req, res){
            res.json({status: true});
        },

        logout: function (req, res){
            res.json({status: false});
        },

        deleteCustomer: function (req, res){
            Customer.remove({_id : req.params.id}, function (error, result){
                if(error){
                    res.status(500).send(error.message);
                } else {
                    res.json({status: true});
                }
            });
        },

        getCustomer: function (req, res){
            console.log(req.params.id);
            Customer.findOne({_id: req.params.id}, function (error, result){
                if(error){
                    res.status(500).send(error.message);
                } else {
                    res.json(result);
                }
            });
        },


       addOrder: function (req, res){
            Customer.update({_id: req.body.customer._id}, {$push: {orders: req.body.order}}, function (error, result){
                if(error){
                    res.status(500).send(error.message);
                } else {
                    Customer.findOne({_id: req.body.customer._id}, function (error, result){
                        if(error){
                            console.log(error);
                        } else {
                            res.json(result);
                        }
                    });
                }
            });
       },

       checkUnique: function (req, res){
            var id = req.params.id,
          property = req.query.property,
             value = req.query.value;

            Customer.findOne({email: value}).select('email').exec(function (error, customer){
                if(error){
                    res.status(500).send(error.message);
                } else {
                    var status = (customer) ? false : true;
                    res.json({customer: customer, status: status});
                }
            });

       }
    
    };


}());



