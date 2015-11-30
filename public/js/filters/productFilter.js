(function (){

    angular.module('customersApp')
        .filter('productFilter', function (){

            function filterOrders(customer, filterText){
                
                if(customer.order){
                    for (var i = 0; i < customer.order.length; i++){
                        if(customer.order[i].product.toLowerCase().indexOf(filterText) > -1){
                            return true;
                        }
                    }
                }
                return false;
            }


            return function (customers, filterText){

                if(!filterText || !customers){
                    return customers;
                }

                var matches = [];
                filterText = filterText.toLowerCase();

                for(var i = 0; i < customers.length; i++){
                    var current = customers[i];
                    if(current.firstName.toLowerCase().indexOf(filterText) > -1 ||
                        current.lastName.toLowerCase().indexOf(filterText) > -1 ||
                        filterOrders(current, filterText)){

                            matches.push(current);
                    }
                }
                return matches;
            };
        });
}());