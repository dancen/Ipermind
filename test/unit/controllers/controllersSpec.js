/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



// HEADER CONTROLLER TEST
describe('IpermindController', function() {

    var stateFactory, countdownFactory, $controller, starsFactory, arrowFactory, sequenceFactory, _seq_empty, _arrow, _arrow_empty;

    beforeEach(module('ipermindControllers', function($provide) {
        $provide.value('StateFactory', stateFactory);
        $provide.value('COUNTDOWN', countdownFactory);
        $provide.value('Stars', starsFactory);
        $provide.value('Arrow', arrowFactory);
        $provide.value('Sequence', sequenceFactory);
        $provide.value('_SEQ_EMPTY', _seq_empty);
        $provide.value('_ARROW', _arrow);
        $provide.value('_ARROW_EMPTY', _arrow_empty);
    }));

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    it('should call the save function', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.showSecretSequence();
        expect($scope.debug).toEqual(true);
    });


});
