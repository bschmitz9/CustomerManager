(function (){

     angular.module('customersApp')
        .controller('CustomerEditController', ['$scope', '$location', '$routeParams', '$timeout', '$window', 'customersService', 'localStorageService', 'authService', 'modalService',
            function ($scope, $location, $routeParams, $timeout, $window, customersService, localStorageService, authService, modalService){

                var vm = this;
                var customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0;
                var onRouteChangeOff,
                    timer;
    
                vm.customer = [];
                vm.states = [];
                vm.title = (customerId !== 0) ? 'Edit' : 'Add';
                vm.buttonText = (customerId !== 0) ? 'Update' : 'Add';
                vm.addCustomer = false;
                vm.updateStatus = false;
                vm.errorMessage = '';

                //save/add or update the customer depending on the customer id number
                vm.saveCustomer = function (){
                    if($scope.vm.editForm.$valid){
                        if(vm.customer._id === 0){
                            onRouteChangeOff(); //Stop listening for location changes
                            customersService.addCustomer(vm.customer).then(function (customer){
                                vm.customer.id = customer.id;
                                vm.customer.record = customer._id;
                                addedSuccess();
                            }, processError);
                        } else {
                            onRouteChangeOff(); //Stop listening for location changes
                            customersService.updateCustomer(vm.customer).then(updateSuccess, processError);
                        }
                    }
                };

                //delete a customer, show a modal to confirm deletion of the user
                vm.deleteCustomer = function (){
                    if(!authService.user.isAuthenticated){
                        $location.path(authService.loginPath);
                        return;
                    }
                    
                    var modalOptions = {
                        actionButtonText: "Delete",
                        cancelButtonText: "Cancel",
                        headerText: "Delete " + vm.customer.firstName + " " + vm.customer.lastName + "?",
                        bodyText: "Press Delete to remove this customer."
                    };

                    modalService.showModal({}, modalOptions).then(function (result){
                        if(result === 'ok'){
                            onRouteChangeOff(); //Stop listening for location changes
                            customersService.deleteCustomer(vm.customer._id).then(function (customer){
                                $window.alert('Customer:' + vm.customer.firstName + " " + vm.customer.lastName + " was deleted!");
                                $location.path('/customers');
                            }, function (error){
                                $window.alert('There was an error: ' + error.message);
                            });
                        }
                    });
                };

                init();

                // find the customer that was sent to the edit page
                //if the id is 0 it is a new customer, and we find that person
                //otherwise we just call the newCustomer() and set the data to that result
                function init (){
                    getStates().then(function (){
                        if(customerId !== 0){
                            var user = localStorageService.get('id');
                            customersService.findCustomer(user).then(function (customer){
                                vm.customer = customer;
                                vm.title = 'Edit';
                                vm.buttonText = 'Update';
                             }, processError);
                        } else {
                            customersService.newCustomer().then(function(customer){
                                vm.customer = customer;
                            });
                        }
                    
                    });

                    //warn user if he or she is leaving page and did not save changes
                    //$on returns a deregistration function that can be called to remove the listener
                    onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
                   
                   }


                function getStates (){
                    return customersService.getStates().then(function (states){
                        vm.states = states;
                    }, processError);
                }

                function routeChange (event, newUrl, oldUrl){
                    //Navigate to newUrl if the form isn't dirty
                    if(!vm.editForm || !vm.editForm.$dirty) return;

                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ignore Changes',
                        headerText: 'Unsaved Changes',
                        bodyText: 'You have unsaved changes. Leave the page?'
                    };

                    modalService.showModal({}, modalOptions).then(function (result){
                        console.log(result);
                        if(result === 'ok'){
                            onRouteChangeOff(); //Stop listening for location changes
                            $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                            }
                        });

                     //prevent navigation by default since we'll handle it
                     //once the user selects a dialog option
                        event.preventDefault();
                        return;
                 }

                 //show a success message when a new user is added to the database
                function addedSuccess (){
                    $scope.vm.editForm.$dirty = false;
                    vm.addCustomer = true;
                    vm.addMessage = "Customer Added";
                    vm.title = 'Edit';
                    vm.buttonText = 'Update';
                    startTimer();
                }


                //show an updated success when a user has been successfully updated
                function updateSuccess (){
                    // $scope.editForm.$dirty = false;
                    vm.updateStatus = true;
                    vm.updateMessage = "Customer Updated";
                    vm.title = 'Edit';
                    vm.buttonText = 'Update';
                    startTimer();
                }

                //there was an error in the save or update
                function processError (error){
                    vm.errorMessage = error.message;
                    startTimer();
                }

                //start the $timeout to show a message to the user
                function startTimer (){
                    timer = $timeout(function (){
                        $timeout.cancel(timer);
                        vm.addCustomer = false;
                        vm.updateStatus = false;
                        vm.errorMessage = '';
                        vm.addMessage = '';
                        vm.updateMessage = '';
                    }, 3000);
                }

        }]);



}());