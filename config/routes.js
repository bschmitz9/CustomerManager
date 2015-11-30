var customers = require('../server/controllers/customers.js');

module.exports = function (app){
    //load all states to the add/edit form upon page load
    app.get('/all_states', function (req, res){
        customers.showStates(req, res);
    });

    //get the id of a particular customer
    app.get('/customers/:id', function (req, res){
        customers.getCustomer(req, res);
    });

    //get the summary of the customers upon page load
    app.get('/customers_summary', function (req, res){
        customers.customersSummary(req, res);
    });

    //login
    app.post('/login', function (req, res){
        customers.login(req, res);
    });

    //logout
    app.post('/logout', function (req, res){
        customers.logout(req, res);
    });

    //add a new customer
    app.post('/new_customer', function (req, res){
        customers.addCustomer(req, res);
    });

    //update the customer via the edit form
    app.post('/update_customer', function (req,res){
        customers.updateCustomer(req, res);
    });

    //delete customer based on id send in the url params
    app.post('/deleteCustomer/:id', function (req, res){
        customers.deleteCustomer(req, res);
    });

    //add a new order
    app.post('/add_order', function (req, res){
        customers.addOrder(req, res);
    });

    //check to see if the updated email is unique
    app.get('/uniqueValue/:id', function (req, res){
        customers.checkUnique(req, res);
    });


};