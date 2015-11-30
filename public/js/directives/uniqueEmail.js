(function (){

    angular.module('customersApp')
        .directive('uniqueEmail', ['$q', 'dataService', function ($q, dataService){

            return {
                restrict: "A",
                require: 'ngModel',
                scope: {
                     uniqueEmailKey : '=',
                     uniqueEmailProperty : '@'
                },
                link: function (scope, element, attrs, ngModel){
                    ngModel.$asyncValidators.unique = function (modelValue, viewValue){
                            var deffered = $q.defer();
                            currentValue = modelValue || viewValue,
                            id = scope.uniqueEmailKey._id;
                            property = scope.uniqueEmailProperty;
    
                            //if there is a customer and a property value
                            if(id && property){
                                dataService.checkUniqueValue(id, property, currentValue).then(function (data){
                                    var uniqueEmail = data.status;
                                    var customer = data.customer;
                                    //if the status comes back as unique and the database query and 
                                    //the current customer are the same then resolve
                                    if(uniqueEmail || customer._id === id){
                                        deffered.resolve(); //the email is unique and this is the same user
                                    } else {
                                        deffered.reject(); // the email is not unique, and different user - added to $errors
                                    }
                                });

                            return deffered.promise;

                        } else {
                            console.log('hey');
                            return $q.when(true);
                        }
                };
            }
        };

        

        }]);
}());