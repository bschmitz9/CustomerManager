(function (){

    angular.module('customersApp')
        .service('modalService', ['$uibModal', function ($uibModal){

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '../partials/modal.html'
            };


            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'Delete',
                headerText: 'Proceed',
                bodyText: "Do you want to delete this user?"
            };

            this.showModal = function (customModalDefaults, customModalOptions){
               if(!customModalDefaults){
                    customModalDefaults = {};
               }
               customModalDefaults.backdrop = 'static';
               return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions){
                var tempModalDefaults = {};
                var tempModalOptions = {};

                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if(!tempModalDefaults.controller){
                    tempModalDefaults.controller = function ($scope, $uibModalInstance){
                            $scope.modalOptions = tempModalOptions;
                            $scope.modalOptions.ok = function (result){
                                 $uibModalInstance.close('ok');
                            };
                            $scope.modalOptions.close = function (result){
                                $uibModalInstance.close('cancel');
                            };
                    };

                    tempModalDefaults.controller.$inject = ['$scope', '$uibModalInstance'];
                }
                return $uibModal.open(tempModalDefaults).result;
            };
        }]);

}());