(function (){

    angular.module('customersApp')
        .service('orderModal', ['$uibModal', function ($uibModal){

        var modalDefaults = {
            keyboard: true,
            backdrop: true,
            modalFade: true,
            templateUrl: '../partials/ordersModal.html'
        };

        var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'Delete',
                headerText: 'Proceed',
                bodyText: "Do you want to delete this user?"
        };

        this.showModal = function (customModalDefaults, customModalText){
             if(!customModalDefaults){
               customModalDefaults = {};
            }

            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalText);
        };

        this.show = function (customModalDefaults, customModalText){
            var tempModalDefaults = {};
            var tempModalOptions = {};

            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
            angular.extend(tempModalOptions, modalOptions, customModalText);

            if(!tempModalDefaults.controller){
                tempModalDefaults.controller = function ($scope, $uibModalInstance){
                    $scope.order = {};
                    $scope.order.total = 0.00;

                    var price = {
                        pen: 4,
                        pencil: 3,
                        paper: 2
                    };

                    $scope.calculateTotal = function (){
                        var product1 = $scope.order.product[0];
                        var product2 = $scope.order.product[1];
                        var product3 = $scope.order.product[2];

                        if(product1 === 'pen'){
                           $scope.order.total += price.pen * $scope.order.quantity;
                         }
                        
                        if (product1 === 'pencil' || product2 === 'pencil'){
                            $scope.order.total += price.pencil * $scope.order.quantity;
                        }
                        
                        if (product1 === 'paper' || product2 === 'paper' || product3 === 'paper') {
                            $scope.order.total += price.paper * $scope.order.quantity;
                        }
                    };

                    $scope.modalText = tempModalOptions;
                    $scope.modalText.ok = function (result){
                        $uibModalInstance.close(result);
                    };
                     $scope.modalText.close = function (result){
                        $uibModalInstance.close('cancel');
                    };
                };

                tempModalDefaults.controller.$inject = ['$scope', '$uibModalInstance'];
            }

            return $uibModal.open(tempModalDefaults).result;
        };



    }]);


}());