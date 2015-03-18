/**
 * Description of services.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function() {


// MODULE TO MANAGE CONTROLLERS
    var ipermindServices = angular.module('ipermindServices', []);



    ipermindServices.service("RecordService", ["$http", function($http) {

            var service = this;
            service.getRecords = function() {
                return $http({
                    method: 'GET',
                    url: './app/scripts/resources/data/records.json',
                    data: null,
                    headers: {'Content-Type': 'application/json'}
                });
            };

        }]);


})();