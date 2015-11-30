(function (){
    angular.module('customersApp')
        .directive('menuHighlighter', ['$location', function ($location){
            return {
                restrict: 'A',
                scope: {
                    highlighterClassname: '@'
                },
                link: function (scope, element){

                    function setActive (){
                        var path = $location.path();
                        var className = scope.highlighterClassname || 'active';

                        if (path){
                            angular.forEach(element.find('li'), function (li){
                                var anchor = li.querySelector('a');
                                var href = (anchor && anchor.href) ? anchor.href : anchor.getAttribute('href').replace('#', '');
                                var trimmed = href.substr(href.indexOf('#') + 1, href.length);
                                var basePath = path.substr(0, trimmed.length);
                                if(trimmed === basePath){
                                    angular.element(li).addClass(className);
                                } else {
                                    angular.element(li).removeClass(className);
                                }
                            });
                        }
                    }

                    setActive();

                    //monitors and runs the setActive function for each route change
                    scope.$on('$locationChangeSuccess', setActive);
                }
            };
        }]);
}());