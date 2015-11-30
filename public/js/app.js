(function (){
    angular.module('customersApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule'])
        .config(function ($routeProvider){
            $routeProvider
                .when('/customers', {
                    controller: 'CustomersController',
                    templateUrl: 'views/customers/customers.html',
                    controllerAs: 'vm'
                })
                .when('/customerorder/:customerId', {
                    controller: 'CustomerOrderController',
                    templateUrl: 'views/customers/customerOrders.html',
                    controllerAs: 'vm'
                })
                .when('/customeredit/:customerId', {
                    controller: 'CustomerEditController',
                    templateUrl: 'views/customers/customerEdit.html',
                    controllerAs: 'vm',
                    secure: true
                })
                .when('/orders', {
                    controller: 'OrderController',
                    templateUrl: 'views/orders/orders.html',
                    controllerAs: 'vm'
                })
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: 'views/customers/login.html',
                    controllerAs: 'vm'
                })
                .when('/login/:redirect*?', {
                    controller: 'LoginController',
                    templateUrl: 'views/customers/login.html',
                    controllerAs: 'vm'
                })
                .otherwise({ redirectTo: '/customers' });
        })



        //client side security
        .run(['$rootScope', '$location', 'authService', function ($rootScope, $location, authService){
            $rootScope.$on('$routeChangeStart', function (event, next, current){
                if(next && next.$$route && next.$$route.secure){
                        if(!authService.user.isAuthenticated){
                            $rootScope.$evalAsync(function (){
                                authService.redirectToLogin();
                            });
                        }
                    }
            });
        }]);

}());