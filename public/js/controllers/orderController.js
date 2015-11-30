(function (){

    angular.module('customersApp')
        .controller('OrderController', ['$filter', '$window', '$location', 'customersService', 'localStorageService', function ($filter, $window, $location, customersService, localStorageService){

            var vm = this;
            vm.customers = [];
            vm.filteredCustomers;
            vm.filteredCount;

            vm.totalRecords = 0;
            vm.pageSize = 10;
            vm.currentPage = 1;

            //called when the user enters into the search field and that input changes
            vm.searchTextChanged = function(){
                filteredCustomers(vm.searchText);
            };

            //get and set the customer id so we can pass the customer between pages
            vm.getCustomerId = function (customer){
                localStorageService.set('id', customer._id);
                var edit = customer._id;
                $location.path('/customeredit/edit');
            };

            //filter customers based on matching name or order
            function filteredCustomers (filteredText){
                vm.filteredCustomers = $filter('productFilter')(vm.customers, filteredText);
                console.log(vm.filteredCustomers);
                vm.filteredCount = vm.filteredCustomers.length;
            }

            init();

            //called upon page load
            function init  (){
                getCustomersSummary();
            }

            //get all customers summary
            function getCustomersSummary (){
                customersService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
                    .then(function (data){
                        vm.customers = data.results;
                        vm.totalRecords = data.totalRecords;
                        filteredCustomers('');
                }, function (error){
                    $window.alert("Sorry a database error occured: " + error.data.message);
                });
            }


        }]);
}());