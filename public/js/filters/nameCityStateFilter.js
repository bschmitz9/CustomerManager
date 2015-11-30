(function (){

    angular.module('customersApp')
        .filter('nameCityStateFilter', function (){

            return function (customers, filterValue){
                
                if(!filterValue || !customers){
                    return customers;
                }

                var matches = [];
                filterValue = filterValue.toLowerCase();

                for(var i = 0; i < customers.length; i++){
                    var current = customers[i];
                    if(current.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                        current.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                        current.city.toLowerCase().indexOf(filterValue) > -1 ||
                        current.state.name.toLowerCase().indexOf(filterValue) > -1) {

                        matches.push(current);
                    }

                }

                return matches;

            };


        });


}());