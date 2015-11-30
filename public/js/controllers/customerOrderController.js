(function (){

    angular.module('customersApp')
        .controller('CustomerOrderController', ['$scope', '$window', '$location', '$timeout', 'localStorageService', 'customersService', 'authService', 'orderModal',
                function ($scope, $window, $location, $timeout, localStorageService, customersService, authService, orderModal){
            var vm = this;
            vm.orderAdded = false;
            vm.orderFailed = false;

            //get the customer by ID and set the local Storage to the customer id, this will take that
            //customer to the edit page
            vm.getCustomerId = function (customer){
                localStorageService.set('id', customer._id);
                var edit = customer._id;
                $location.path('/customeredit/edit');
            };

            //have the customer add an order from the button option, this pops up a modal
            vm.addOrder = function (customer) {
                if(!authService.user.isAuthenticated){
                    $location.path(authService.loginPath);
                    return;
                }

                var modalText = {
                  closeButtonText: "Cancel",
                  actionButtonText: "Submit Order",
                  headerText: "Place an order",
                  bodyText: "Please complete the following fields"
                };

                orderModal.showModal({}, modalText).then(function (result){
                    if(result.total){
                        customersService.addOrder(result, customer).then(function (customer){
                               vm.customer = customer;
                               $scope.$broadcast('customer', customer);
                               orderSuccess();
                        }, function (error){
                                orderFailed();
                        });
                    }
                });
            };

            init();

            //find the customer when the page loads based on the local storage value passed
             function init (){
                var user = localStorageService.get('id');
                customersService.findCustomer(user).then(function (customer){
                    vm.customer = customer;
                    $scope.$broadcast('customer', customer);
                }, function (error){
                    $window.alert('Sorry, an error occured: ' + error.message);
                });
             }

             //show a successful order message
             function orderSuccess (){
                vm.orderAdded = true;
                vm.buttonText = "Order Completed, thank you for your business!";
                startTimer();
             }

             //show an order failed message
             function orderFailed (){
                vm.orderFailed = true;
                vm.buttonText = "There was an error";
                startTimer();
             }

             //start the time for the success or error message to dissappear
             function startTimer (){
                    var timer = $timeout(function (){
                        $timeout.cancel(timer);
                        vm.orderAdded = false;
                        vm.orderFailed = false;
                        vm.buttonText = '';
                    }, 3000);
             }


        }]);
}());