/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



//CONTROLLER TEST
describe('IpermindController', function() {

    var stateFactory, countdownFactory, $controller, StartGameState, PlayingGameState, EndGameState, starsFactory, Arrow, sequenceFactory, _seq_empty, _arrow, _arrow_empty;

    beforeEach(module('ipermindControllers', function($provide) {
        $provide.value('StateFactory', stateFactory);
        $provide.value('COUNTDOWN', countdownFactory);
        $provide.value('Stars', starsFactory);
        $provide.value('Arrow', Arrow);
        $provide.value('Sequence', sequenceFactory);
        $provide.value('_SEQ_EMPTY', _seq_empty);
        $provide.value('_ARROW', _arrow);
        $provide.value('_ARROW_EMPTY', _arrow_empty);
        $provide.value('StartGameState', StartGameState);
        $provide.value('PlayingGameState', PlayingGameState);
        $provide.value('EndGameState', EndGameState);
    }));

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    it('should show the secret sequence', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.showSecretSequence();
        expect($scope.debug).toEqual(true);
    });

    it('should hide the secret sequence', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.hideSecretSequence();
        expect($scope.debug).toEqual(false);
    });

    it('should start the counter', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.startCounter(countdownFactory);
        expect($scope.time_elapsed).not.toBe(0);
    });

    it('should contains the : char', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.startCounter(countdownFactory);
        setTimeout(function() {
            expect($scope.time_elapsed_view).toContain(":");
        }, 1000);
    });

    it('should increase the level ', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.increaseLevel();
        expect($scope.game_level).toBeGreaterThan(0);
    });

    it('should restart the counter', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        $scope.restartCounter();
        expect($scope.time_elapsed).not.toBe(0);
    });

    it('should restart the counter', function() {
        var $scope = {};
        var controller = $controller('IpermindController', {$scope: $scope});
        var matrix = new Array("e", "b", "b", "b");
        $scope.setResults(matrix);
        expect($scope.result_matrix[2]).toBe("b");
    });


});

