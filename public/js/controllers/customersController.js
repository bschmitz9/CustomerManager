(function (){

    angular.module('customersApp')
        .controller('CustomersController', ['$location', '$window', '$filter', '$timeout', 'customersService', 'authService', 'modalService', 'localStorageService',
            function ($location, $window, $filter, $timeout, customersService, authService, modalService, localStorageService){

                var vm = this;

                vm.customers = [];
                vm.filteredCustomers = [];
                vm.filteredCount = 0;
                vm.orderby = 'lastname',
                vm.reverse = false,
                vm.searchText = null,
                vm.cardAnimationClass = '.card-animation';

                //paging
                vm.totalRecords = 0;
                vm.pageSize = 10;
                vm.currentPage = 1;

                //change the display mode based on the displayMode passed into the changeDisplayMode function below
                vm.displayModeEnum = {
                    Card: 0,
                    List: 1
                };

                //called upon page load
                function init (){
                    getCustomersSummary();
                }

                init();

                //this is used when the user clicks on the order links for each particular user
                vm.getCustomerOrder = function (customer){
                    localStorageService.set('id', customer._id);
                    var order = customer._id;
                    $location.path('/customerorder/order');
                };

                //get and set the customer id
                vm.getCustomerId = function (customer){
                    localStorageService.set('id', customer._id);
                    var edit = customer._id;
                    $location.path('/customeredit/edit');
                };

                //this changes the display mode when the user clicks on a view,
                //loads card view by default
                vm.changeDisplayMode = function (displayMode){
                    switch(displayMode){
                        case vm.displayModeEnum.Card:
                            vm.listDisplayModeEnabled = false;
                            break;

                        case vm.displayModeEnum.List:
                            vm.listDisplayModeEnabled = true;
                            break;
                    }

                };

                //this will be called when the pagination is displated
                vm.pageChanged = function (page){
                    vm.currentPage = page;
                    getCustomersSummary();
                };

                //pass the url to this function and change the page to the customer edit
                vm.navigate = function (url){
                    $location.path(url);
                };

                //grab the searchText changed when the search has changed
                vm.searchTextChanged = function (){
                    filteredCustomers(vm.searchText);
                };

                //allow the user to set the order when the view is in list mode
                vm.setOrder = function (orderby){
                    if(orderby === vm.orderby){
                        vm.reverse = !vm.reverse;
                    }
                    vm.orderby = orderby;
                };

                vm.deleteCustomer = function (id){
                    if(!authService.user.isAuthenticated){
                        $location.path(authService.loginPath);
                        return;
                    }

                    var customer = getCustomerById(id);
                    var customerName = customer.firstName +  " " + customer.lastName;
                
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Customer',
                        headerText: "Delete " + " " + customerName + "?",
                        bodyText: "Are you sure you want to delete this customer?"
                    };

                    modalService.showModal({}, modalOptions).then(function (result){
                        if(result === 'ok'){
                            customersService.deleteCustomer(id).then(function (result){
                                for (var i = 0; i < vm.customers.length; i++){
                                    var current = vm.customers[i];
                                    if(current._id === id){
                                        vm.customers.splice(i, 1);
                                        break;
                                    }
                                }
                                filteredCustomers(vm.searchText);
                            }, function (error){
                                $window.alert("There was an error: " + error.data);
                            });
                        }
                    });
                };

                //get customer by id for the delete modal to display user name
                function getCustomerById (id){
                    for(var i = 0; i < vm.customers.length; i++){
                        var current = vm.customers[i];
                        if(current._id === id){
                            return current;
                        }
                    }
                    return null;
                }

                //filter customers based on what the user types in the search field
                function filteredCustomers (filterText){
                    vm.filteredCustomers = $filter("nameCityStateFilter")(vm.customers, filterText);
                    // console.log(vm.filteredCustomers);
                    vm.filteredCount = vm.filteredCustomers.length;
                }

                //get the first 10 customers upon page load
                function getCustomersSummary (){
                    customersService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
                        .then(function (data){
                            vm.totalRecords = data.totalRecords;
                            vm.customers = data.results;
                            filteredCustomers('');
                        }, function (error){
                            $window.alert('Sorry, an error occured ' + error.data.message);
                        });
                }

        }]);


}());