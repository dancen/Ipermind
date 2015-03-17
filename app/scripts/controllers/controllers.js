
/**
 * Description of controllers.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function() {



    /**
     * main controller 
     * manage angular variables in the view index.html
     *
     * @return object 
     */
    var ipermindControllers = angular.module('ipermindControllers', []);

    ipermindControllers.controller("IpermindController", ["$scope", "StateFactory", "$timeout", "COUNTDOWN", "Stars", "Arrow", "Sequence","_SEQ_EMPTY","_ARROW","_ARROW_EMPTY", function($scope, StateFactory, $timeout, COUNTDOWN, Stars, Arrow, Sequence,_SEQ_EMPTY,_ARROW,_ARROW_EMPTY) {


            /**
             * controller initial variables
             *
             * @return void 
             */

            $scope.debug = false; // DEBUG TRUE SHOW THE SECRET SEQUENCE ON THE PAGE
            $scope.game_level = 1;
            $scope.game_model = null;
            $scope.game_state = null;
            $scope.isWinner = false;
            $scope.player = null;
            $scope.sequence_step = [_SEQ_EMPTY,_SEQ_EMPTY,_SEQ_EMPTY,_SEQ_EMPTY];
            $scope.sequence_step_view = [_SEQ_EMPTY,_SEQ_EMPTY,_SEQ_EMPTY,_SEQ_EMPTY];
            $scope.arrow_step = [_ARROW_EMPTY,_ARROW_EMPTY,_ARROW_EMPTY,_ARROW_EMPTY];
            $scope.sequence = new Array();
            $scope.sequence_current = 0;
            $scope.time_elapsed = 0;
            $scope.sequence_str = null;
            $scope.isWinner = false;
            $scope.isLoser = false;
            $scope.stars = new Array();
            $scope.errors;
            $scope.showPanel = true;
            $scope.isWinnerLabel = false;
            $scope.isLoserLabel = false;
            $scope.points = 0;
            $scope.showPoints = false;
            $scope.isStarted = false;
            $scope.result_matrix = [];
            $scope.time_elapsed_view;
            $scope.secret_sequence;
            var timeoutcounter;


            /**
             * showSecretSequence() , hideSecretSequence() 
             * show - hide the computer secret sequence
             *
             * @param  
             * @return void 
             */


             $scope.showSecretSequence = function() {
                 $scope.debug = true;
             };
             
             $scope.hideSecretSequence = function() {
                 $scope.debug = false;
             };



            /**
             * startCounter(time) 
             * init the time countdown
             *
             * @param integer 
             * @return void 
             */

            $scope.startCounter = function(time) {
                var lab = 'tzcd';
                $scope.displayTZCountDown(time, lab);
            };


            /**
             * displayTZCountDown(countdown,tzcd) 
             * execute the countdown and show in the html
             *
             * @param integer 
             * @param string 
             * @return void 
             */

            $scope.displayTZCountDown = function(countdown, tzcd) {

                if ((countdown < 0) || ($scope.stars[0] == "1")) {
                    $scope.isWinner = false;
                    $scope.isWinnerLabel = false;
                    $scope.showPanel = false;
                    $scope.isLoserLabel = true;
                    $scope.isLoser = true;
                    $scope.loser();
                    Stars.resetStars();

                } else {
                    var secs = countdown % 60;
                    var secsint = secs;
                    if (secs < 10) {
                        secs = '0' + secs;
                    }
                    var countdown1 = (countdown - secs) / 60;
                    var mins = countdown1 % 60;
                    var minsint = mins;
                    if (mins < 10) {
                        mins = '0' + mins;
                    }
                    countdown1 = (countdown1 - mins) / 60;
                    var timeseconds = (minsint * 60) + secsint;
                    $scope.time_elapsed_view = mins + ':' + secs;
                    $scope.time_elapsed = timeseconds;
                    timeoutcounter = $timeout(function() {
                        $scope.displayTZCountDown((countdown - 1), tzcd);
                    }, 999);
                }
            };


            /**
             * setSequenceStep(elem) 
             * set the element in the cell sequence
             *
             * @param string 
             * @return void 
             */

            $scope.setSequenceStep = function(elem) {
                
                if($scope.sequence_current == 0){
                    $scope.sequence_step_view = Sequence.resetSequence($scope.sequence_step_view,_SEQ_EMPTY);                    
                    $scope.clearResults();
                }
                 
                $scope.sequence_step_view[$scope.sequence_current]=elem;
                $scope.arrow_step = Arrow.moveArrow($scope.arrow_step, $scope.sequence_current);                
                $scope.sequence = Sequence.increaseSequence($scope.sequence,elem);
                $scope.sequence_str = Sequence.setSequenceStr($scope.sequence);
                $scope.sequence_current++;
                
                if ($scope.sequence_current == 4) {
                    
                    $scope.check();
                    $scope.sequence = [];
                    $scope.sequence_str = "";
                    Stars.updateStars();
                    $scope.sequence_current=0;                    
                    Arrow.moveArrow(0);
                    
                } 

            };


           

           

            /**
             * check() 
             * check the sequence when the slot is complete
             *
             * @param  
             * @return void 
             */

            $scope.check = function() {

                var stateFactory = new StateFactory();
                var state = stateFactory.createPlayingGame();
                var model = state.checkGame($scope.time_elapsed,$scope.sequence_str);

                if (model.isWinner == true) {
                    $scope.time = model.getTime();
                    $scope.isWinner = true;
                    $scope.isWinnerLabel = true;
                    $scope.showPanel = false;
                    $scope.isLoserLabel = false;
                    $scope.winner();
                    $timeout.cancel(timeoutcounter);
                    $scope.setResults(model.getErrors());
                    model.calculatePoints($scope.time_elapsed);
                    Stars.resetStars();
                } else {
                                    
                    $scope.isWinner = false;
                    $scope.isLoser = true;
                    $scope.setResults(model.getErrors());  
                    $scope.tryAgain();
                }
            };



            /**
             * increaseLevel() 
             * increase the game level
             *
             * @param  
             * @return void 
             */

            $scope.increaseLevel = function() {
                if ($scope.game_level !== false) {
                    $scope.game_level = $scope.game_level + 1;
                } else {
                    $scope.game_level = 0;
                }
            };



            /**
             * init() 
             * initialize the game
             *
             * @param  
             * @return void 
             */

            $scope.init = function() {
                var stateFactory = new StateFactory();
                var state = stateFactory.createNewGame();
                var model = state.noGame($scope.game_level,$scope.time_elapsed);
                $scope.isWinnerLabel = false;
                $scope.isLoserLabel = false;
                $scope.showPanel = true;
//                var starsFactory = new Stars($scope);
//                starsFactory.getStars();
                $scope.stars = Stars.init().getStars();
                $scope.clearResults();
                $scope.restartCounter();
                $scope.isStarted = true;                
                $scope.hideSecretSequence();
                $scope.sequence_step_view = Sequence.resetSequence($scope.sequence_step_view,_SEQ_EMPTY); 
                if($scope.isWinner == true){
                    $scope.increaseLevel();
                }
            };

            /**
             * stopCounter() 
             * stop the counter
             *
             * @param  
             * @return void 
             */

            $scope.stopCounter = function() {
                
                //TODO
                
            };


            /**
             * restartCounter() 
             * restart the counter when start a new Game
             *
             * @param  
             * @return void 
             */

            $scope.restartCounter = function() {
                clearTimeout(timeoutcounter);
                $scope.startCounter(COUNTDOWN);
            };


            /**
             * winner() 
             * action controller for winner 
             *
             * @param  
             * @return void 
             */

            $scope.winner = function() {
                var stateFactory = new StateFactory($scope);
                var state = stateFactory.createEndGame();
                var model = state.winnerGame($scope.time,$scope.secret_sequence);
                if (model.isRecord()) {
                    model.getRecords();
                    model.saveRecord();
                } else {
                    model.getRecords();
                }
            };


            /**
             * loser() 
             * action controller for loser 
             *
             * @param  
             * @return void 
             */

            $scope.loser = function() {
                var stateFactory = new StateFactory($scope);
                var state = stateFactory.createEndGame();
                var model = state.loserGame($scope.secret_sequence);
                model.decreasePoints();
            };



            /**
             * tryAgain() 
             * action controller to start a new Game
             *
             * @param  
             * @return void 
             */


            $scope.tryAgain = function() {                
                var stateFactory = new StateFactory($scope);
                var state = stateFactory.createNewGame();
                var model = state.newGame();
            };



            /**
             * setResults(matrix) 
             * set and show the results slot
             *
             * @param  
             * @return void 
             */

            $scope.setResults = function(matrix) {

                var i = 0;
                do {
                    $scope.result_matrix[i] = matrix[i];
                    i++;
                } while (matrix[i] != null);

            };

            $scope.clearResults = function() {

                var i = 0;
                do {
                    $scope.result_matrix[i] = "e";
                    i++;
                } while (i < 5);

            };


            /**
             * saveAction() 
             * save game
             *
             * @param  
             * @return void 
             */


            $scope.saveAction = function() {

                //TODO

            };



            /**
             * infoAction() 
             * show credits
             *
             * @param  
             * @return void 
             */

            $scope.infoAction = function() {

                //TODO
            };


            


        }]);
    
   


})();