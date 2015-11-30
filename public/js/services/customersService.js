(function (){

    angular.module('customersApp')
        .factory('customersService', ['$http', '$q', function ($http, $q){
            // var serviceBase = '/api/dataservice/';
            var factory  = {};

            factory.findCustomer = function (id){
                return $http.get('/customers/' + id).then(function (results){
                        var customer = results.data;
                        getCustomerOrderTotal(customer);
                        return customer;
                    }, function (error){
                        return error;
                    });
            };

            factory.getCustomersSummary = function (pageIndex, pageSize){
                return getPagedResource('/customers_summary/', pageIndex, pageSize);
            };

            //get all states from the user database
            factory.getStates = function (){
                return $http.get('/all_states').then(function (results){
                    return results.data;
                });
            };

            //return the promise right away because this is a new customer
            factory.newCustomer = function (){
                return $q.when({_id: 0});
            };

            factory.addCustomer = function (customer){
                return $http.post('/new_customer', customer).then(function (results){
                    return results.data;
                });
            };

            factory.updateCustomer = function (customer){
                return $http.post('/update_customer', customer).then(function (status){
                    return status.data;
                });
            };

            //get the user when the edit page loads if customer id > 0
            factory.getCustomer = function (id){
                return $http.get('/customerid/:id', {id: id}).then(function (results){
                    return results.data;
                });
            };

            factory.deleteCustomer = function (id){
                return $http.post('/deleteCustomer/' + id).success(function (results){
                    return results;
                }).error(function (error){
                    return error;
                });
            };

            factory.addOrder = function (order, customer){
                return $http.post('/add_order', {order: order, customer: customer}).then(function (results){
                    return results.data;
                });
            };

            factory.checkUniqueValue = function (id, property, value){
                if(!id) id = 0;
                return $http.get('/uniqueValue/' + id + '?property=' + property + '&value=' + escape(value)).then(function (result){
                    return result.data;
                });
            };

            function getPagedResource(baseResource, pageIndex, pageSize){
                var resource = baseResource;
                resource += arguments.length === 3 ? buildPageUri(pageIndex, pageSize) : '';
                return $http.get(resource).then(function (response){
                    var customers = response.data;
                    // extendCustomers(customers);
                    customerTotal(customers);
                    return {
                        totalRecords: parseInt(response.headers('X-InlineCount')),
                        results: customers
                    };
                });
            }

            function getCustomerOrderTotal (customer) {
                if(!customer.orders){
                    return;
                }

                for(var i = 0; i < customer.orders.length; i++){
                    var order = customer.orders[i];
                    order.ordersTotal = order.price * order.quantity;
                }

                customer.ordersTotal = ordersTotal(customer);
            }

            function customerTotal (customer){
                var total = 0.00;

                for(var i = 0; i < customer.length; i++){
                    var current = customer[i];
    
                        for(var j = 0; j < current.orders.length; j++){
                            var order = current.orders[j];
                            total += order.total;
                            current.totalCost = total;
                        }
                }
            }

            function extendCustomers (customers){
                for(var i = 0; i < customers.length; i++){
                    var current = customers[i];
            
                    if(!current.orders){
                        continue;
                    }

                    for(var j = 0; j < current.orders.length; j++){
                        var order = current.orders[j];
                        order.orderTotal = order.price * order.quantity;
                    }

                    current.ordersTotal = ordersTotal(current);
                }
            }

            function buildPageUri (pageIndex, pageSize){
                var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
                return uri;
            }

            function ordersTotal (customer){
               var total = 0;
               var orders = customer.orders;

               for (var i = 0; i < orders.length; i++){
                    total += orders[i].ordersTotal;
               }

               return total;
            }


            return factory;
        }]);
}());