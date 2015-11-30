(function (){

    angular.module('customersApp')
        .controller('LoginController', ['$scope',  '$routeParams', '$location', 'authService', function ($scope, $routeParams, $location, authService){

            var vm = this;
            vm.email = null;
            vm.password = null;
            vm.errorMessage = null;

            vm.login = function (){
                authService.login(vm.email, vm.password).then(function (status){

                      if(!status){
                        vm.errorMessage = "Unable to Login";
                        return;
                      }

                      //routeParams.redirect holds the route the user was trying to go to initially
                      // if(status && $routeParams && $routeParams.redirect){
                      //      var path = '/' + routeParams.redirect;
                      // }

                      $location.path('/customers');
                });
            };
        }]);

}());