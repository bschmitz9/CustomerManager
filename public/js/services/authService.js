(function (){

    angular.module('customersApp')
        .factory('authService', ['$http', '$rootScope', function ($http, $rootScope){
            var factory = {
                loginPath: '/login',
                user:  {
                    isAuthenticated: false,
                    roles: null
                }
            };

            factory.login = function (email, password){
               return $http.post('/login', {email: email, password: password}).then(function (results){
                    var loggedIn = results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
            };

            factory.logout = function (){
                return $http.post('/logout').then(function (results){
                    var loggedIn = results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
            };

            factory.redirectToLogin = function (){
               $rootScope.$broadcast('redirectToLogin', null);
            };

            function changeAuth (status){
                factory.user.isAuthenticated = status;
                $rootScope.$broadcast('loginStatusChanged', status);
            }

            return factory;
        }]);

}());