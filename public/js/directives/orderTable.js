(function (){

    angular.module('customersApp')
        .directive('orderTable', function (){
            return {
                templateUrl: '../templates/ordersTable.html',
                scope: {
                    customer: '='
                },
                transclude: true,
                controller: ['$scope', function ($scope){
                    var vm = this;
                    vm.orderBy = 'product';
                    vm.reverse = false;
                    vm.ordersTotal = 0.00;


                    vm.setOrder = function (orderBy){
                        if(orderBy === vm.orderBy){
                            vm.reverse = !vm.reverse;
                        }
                        vm.orderBy = orderBy;
                    };

                    init();

                    function init(){
                        if($scope.vm.customer){
                            vm.customer = $scope.vm.customer;
                            orderTotal($scope.vm.customer);
                        } else {
                            $scope.$on('customer', function (event, customer){
                                vm.customer = customer;
                                orderTotal(customer);
                            });
                        }
                    }

                    function orderTotal (customer){
                        var total = 0.00;

                        for(var i = 0; i < customer.orders.length; i++){
                            var current = customer.orders[i];
                            total += current.total;
                        }

                        vm.ordersTotal = total;
                    }


                }],
                controllerAs: 'vm',
                bindToController: true
            };
        });
}());