(function (){

    angular.module('customersApp')
        .factory('dataService', ['config', 'customersService',
            function (config, customersService){

                return customersService;

        }]);

}());