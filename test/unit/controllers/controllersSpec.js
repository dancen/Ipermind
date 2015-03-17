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



// FACTORY TEST
describe('Sequence Factory', function() {

   beforeEach(angular.mock.module('ipermindFactories'));

    it('should increase the sequence', function() {
        angular.mock.inject(function(Sequence) {
            var seq_step = [];
            var seq_step_incr = Sequence.increaseSequence(seq_step, "king");
            expect(seq_step_incr[0]).toBeDefined();
        });

    });
    
    it('should return a sequence string', function() {
        angular.mock.inject(function(Sequence) {
            var sequence = ["king","queen","pawn","pawn"];
            var sequence_str = Sequence.setSequenceStr(sequence);
            expect(sequence_str).toBe("king|queen|pawn|pawn");
        });

    });
    
    it('should return a sequence string', function() {
        angular.mock.inject(function(Sequence) {
            var sequence_step_view = ["king","queen","pawn","pawn"];
            var sequence_reset = Sequence.resetSequence(sequence_step_view,"empty");
            expect(sequence_reset[2]).toBe("empty");
        });

    });


});


// FACTORY TEST
describe('Stars Factory', function() {

   beforeEach(angular.mock.module('ipermindFactories'));

    it('should contains the 2 value', function() {
        angular.mock.inject(function(Stars) {
            var seq_stars = Stars.init().getStars();
            expect(seq_stars[1]).toBe("2");
        });

    });
    
    it('should empty the array', function() {
        angular.mock.inject(function(Stars) {
            var stars = Stars;
            stars.init().getStars();
            stars.resetStars();
            expect(stars.stars[1]).toBe(undefined);
        });

    });
    
    


});


// FACTORY TEST
describe('StateFactory', function() {

   var _KING,_QUEEN,_ROOK,_BISHOP,_KNIGHT,_PAWN;
      
   beforeEach(module('ipermindFactories', function($provide) {
        $provide.value('_KING', _KING);
        $provide.value('_QUEEN', _QUEEN);
        $provide.value('_ROOK', _ROOK);
        $provide.value('_BISHOP', _BISHOP);
        $provide.value('_KNIGHT', _KNIGHT);
        $provide.value('_PAWN', _PAWN);
    }));

  it('should contains the 2 value', function() {
        angular.mock.inject(function(EasyGame) {
            var seq = EasyGame.createSequence();
            expect(seq.length).toBe(4);
        });

    });
    
    
    it('should contains the 2 value', function() {
        angular.mock.inject(function(MediumGame) {
            var seq = MediumGame.createSequence();
            expect(seq.length).toBe(4);
        });

    });
    
    it('should contains the 2 value', function() {
        angular.mock.inject(function(DifficultGame) {
            var seq = DifficultGame.createSequence();
            expect(seq.length).toBe(4);
        });

    });

});



// FACTORY TEST
describe('Check Factory', function() {

   var _EMPTY,_BLACK,_WHITE,_PARSED;
      
   beforeEach(module('ipermindFactories', function($provide) {
        $provide.value('_EMPTY', _EMPTY);
        $provide.value('_BLACK', _BLACK);
        $provide.value('_WHITE', _WHITE);
        $provide.value('_PARSED', _PARSED);
    }));

  it('should return true', function() {
        angular.mock.inject(function(Checker) {
            var sequence = ["king","queen","queen","king"];
            var secret_sequence = ["king,queen,queen,king"];
            var checker = new Checker();
            checker.setPlayerSequence(sequence);
            checker.setComputerSequence(secret_sequence);
            checker.init().parseSequence();
            expect(checker.isWinner()).toBe(true);
        });

    });
    
});


