(function() {

    var ipermindDirectives = angular.module('ipermindDirectives', []);

    ipermindDirectives.directive("spinnerLoader", function() {
        return {
            restrict: 'E',
            templateUrl: 'app/scripts/views/partials/spinner-loader.html',
            replace: true
        };
    });
    
    ipermindDirectives.directive("layoutFooter", function() {
        return {
            restrict: 'E',
            templateUrl: 'app/scripts/views/partials/layout-footer.html',
            replace: true
        };
    });
    
    ipermindDirectives.directive("layoutHeader", function() {
        return {
            restrict: 'E',
            templateUrl: 'app/scripts/views/partials/layout-header.html',
            replace: true
        };
    });
    
    
    
    



})();