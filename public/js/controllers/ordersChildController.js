(function (){

    angular.module('customersApp')
        .controller('orderChildController', ['$scope', function ($scope){
            var vm = this;
            vm.orderBy = 'product';
            vm.reverse = false;
            vm.ordersTotal = 0.00;
            vm.customers;
            //this controller is not currently used at this time, the orderTable directive is being
            //used instead
            vm.setOrder = function (orderBy){
                if(orderBy === vm.orderBy){
                    vm.reverse = !vm.reverse;
                }
                vm.orderBy = orderBy;
            };

            init();

            function init(){
                if($scope.customer){
                    vm.customer = $scope.customer;
                    orderTotal($scope.customer);
                } else {
                    $scope.$on('customer', function (event, customer){
                        vm.customer = customer;
                        ordersTotal(customer);
                    });
                }
            }

            function orderTotal (customer){
                var total = 0.00;

                for(var i = 0; i < customer.orders.length; i++){
                    var current = customer.orders[i];
                    total += current.orderTotal;
                }

                vm.ordersTotal = total;
            }

            


        }]);
}());