(function (){

     angular.module('customersApp')
        .controller('NavbarController', ['$scope', '$location', 'config', 'authService', function ($scope, $location, config, authService){
                var vm = this;
                var appTitle = 'Customer Management';

                vm.isCollapsed = false;
                vm.appTitle = (config.useBreeze) ? appTitle + Breeze : appTitle;

                //this would highlight the selected paths but we have a directive on there instead
                // vm.highlight = function (path){
                //     return $location.path().substr(0, path.length) === path;
                // };

                //this gets called when the user clicks the login or logout link
                vm.loginOrOut = function (){
                    setLoginLogoutText();
                    var isAuthenticated = authService.user.isAuthenticated;
                    //if the user isAuthenticated then logout
                    if(isAuthenticated){
                        authService.logout().then(function (){
                            $location.path('/');
                            return;
                        });
                    }

                    redirectToLogin();
                };

                //listen for the redirect to login being emitted by the autheServiec factory, 
                //this is called from the $routeChangeStart event in app.js
                $scope.$on('redirectToLogin', function (){
                    redirectToLogin();
                });

                //listen for the user to login or logout, from the authService, and then set the text
                //to login or logout based on that
                $scope.$on('loginStatusChanged', function (){
                    setLoginLogoutText();
                });

                //redirect to login if the route is secure and the user is not logged in at that time
                function redirectToLogin (){
                   var path = '/login';
                   $location.replace();
                   $location.path(path);
                }

                //called above when the user clicks login or logout and when the user loginStatus changes
                //its also called right when the page loads based on the status of user authentication
                function setLoginLogoutText (){
                    vm.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
                }

                setLoginLogoutText();
        }]);
}());