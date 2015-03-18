
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
    var danieleControllers = angular.module('danieleControllers', []);

    danieleControllers.controller("IpermindController", ["$scope", "StateFactory", "$timeout", "COUNTDOWN", "Stars", "Arrow", "Sequence", "_SEQ_EMPTY", "_ARROW", "_ARROW_EMPTY", "RecordService", function($scope, StateFactory, $timeout, COUNTDOWN, Stars, Arrow, Sequence, _SEQ_EMPTY, _ARROW, _ARROW_EMPTY, RecordService) {


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
            $scope.sequence_step = [_SEQ_EMPTY, _SEQ_EMPTY, _SEQ_EMPTY, _SEQ_EMPTY];
            $scope.sequence_step_view = [_SEQ_EMPTY, _SEQ_EMPTY, _SEQ_EMPTY, _SEQ_EMPTY];
            $scope.arrow_step = [_ARROW_EMPTY, _ARROW_EMPTY, _ARROW_EMPTY, _ARROW_EMPTY];
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
            $scope.records;
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

                if ($scope.sequence_current == 0) {
                    $scope.sequence_step_view = Sequence.resetSequence($scope.sequence_step_view, _SEQ_EMPTY);
                    $scope.clearResults();
                }

                $scope.sequence_step_view[$scope.sequence_current] = elem;
                $scope.arrow_step = Arrow.moveArrow($scope.arrow_step, $scope.sequence_current);
                $scope.sequence = Sequence.increaseSequence($scope.sequence, elem);
                $scope.sequence_str = Sequence.setSequenceStr($scope.sequence);
                $scope.sequence_current++;

                if ($scope.sequence_current == 4) {

                    $scope.check();
                    $scope.sequence = [];
                    $scope.sequence_str = "";
                    Stars.updateStars();
                    $scope.sequence_current = 0;
                    $scope.arrow_step = Arrow.moveArrow($scope.arrow_step, 0);

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
                var model = state.checkGame($scope.time_elapsed, $scope.sequence_str);

                if (model.isWinner == true) {
                    $scope.time = model.getTime();
                    $scope.isWinner = true;
                    $scope.isWinnerLabel = true;
                    $scope.showPanel = false;
                    $scope.isLoserLabel = false;
                    $scope.winner();
                    $timeout.cancel(timeoutcounter);
                    $scope.setResults(model.getErrors());
                    $scope.points = model.calculatePoints($scope.points, $scope.time_elapsed);
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
                var model = state.noGame($scope.game_level, $scope.time_elapsed);
                $scope.secret_sequence = model.getSecretSequence();
                $scope.isWinnerLabel = false;
                $scope.isLoserLabel = false;
                $scope.showPanel = true;
                $scope.stars = Stars.init().getStars();
                $scope.clearResults();
                $scope.restartCounter();
                $scope.isStarted = true;
                $scope.hideSecretSequence();
                $scope.sequence_step_view = Sequence.resetSequence($scope.sequence_step_view, _SEQ_EMPTY);
                if ($scope.isWinner == true) {
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
                var stateFactory = new StateFactory();
                var state = stateFactory.createEndGame();
                var model = state.winnerGame($scope.time, $scope.secret_sequence);
            };


            /**
             * loser() 
             * action controller for loser 
             *
             * @param  
             * @return void 
             */

            $scope.loser = function() {
                var stateFactory = new StateFactory();
                var state = stateFactory.createEndGame();
                var model = state.loserGame($scope.secret_sequence);
                $scope.points = model.decreasePoints($scope.points);
            };



            /**
             * tryAgain() 
             * action controller to start a new Game
             *
             * @param  
             * @return void 
             */


            $scope.tryAgain = function() {
                var stateFactory = new StateFactory();
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


            /**
             * showRecords() 
             * show records
             *
             * @param  
             * @return void 
             */

            $scope.showRecords = function() {
                var call = RecordService.getRecords();
                call.success(function(data) {
                    $scope.records = data;
                }).error(function(data) {
                    $scope.records = null;
                });
            };





        }]);





    danieleControllers.controller("CalculatorController", ["$scope", function($scope) {


            /**
             * controller initial variables
             *
             * @return void 
             */

            $scope.operation = "";
            $scope.inMemoryPlus = false;
            $scope.inMemoryMinus = false;
            $scope.memory_value = "";
            $scope.memory_symbol = "";


            /**
             * mrcOn(val) 
             * execute the operation in memory
             *
             * @param  string
             * @return void 
             */

            $scope.mrcOn = function(val) {
                if($scope.inMemoryPlus){
                    $scope.operation = $scope.operation+$scope.memory_value;
                    $scope.clearMemory();
                }
                if($scope.inMemoryMinus){
                    $scope.operation = $scope.operation-$scope.memory_value;
                    $scope.clearMemory();
                }
            };
            
            
            /**
             * mplus(val) 
             * store in memory a plus operation in order to evaluate later
             *
             * @param  string
             * @return void 
             */
            $scope.mplus = function(val) {
                $scope.inMemoryPlus = true;
                $scope.inMemoryMinus = false;
                $scope.memory_value = $scope.operation;
                $scope.memory_symbol = val;
                $scope.cancel();
            };
            
            
            /**
             * mminus(val) 
             * store in memory a minus operation in order to evaluate later
             *
             * @param  string
             * @return void 
             */
            $scope.mminus = function(val) {
                $scope.inMemoryMinus = true;
                $scope.inMemoryPlus = false;
                $scope.memory_value = $scope.operation;
                $scope.memory_symbol = val;
                $scope.cancel();
            };
            
            
            /**
             * clearMemory() 
             * clear all data in memory
             *
             * @param  
             * @return void 
             */
            $scope.clearMemory = function() {
                $scope.memory_value = "";
                $scope.memory_symbol = "";                
                $scope.inMemoryMinus = false;
                $scope.inMemoryPlus = false;
            };
            
            
            
            /**
             * addOperand(val) 
             * set a operand in display (+,-,*,/)
             *
             * @param char
             * @return void 
             */
            $scope.addOperand = function(val) {
                $scope.operation += val;
            };


            /**
             * addNumber(val) 
             * set a integer in display
             * 
             * @param  integer
             * @return void 
             */
            $scope.addNumber = function(val) {
                $scope.operation += val;
            };


            /**
             * addDecimal(val) 
             * set the decimal point in display
             *
             * @param  char
             * @return void 
             */
            $scope.addDecimal = function(val) {
                $scope.operation += val;
            };
            
            
            /**
             * cancel() 
             * clear display
             *
             * @param  
             * @return void 
             */
            $scope.cancel = function() {
                $scope.operation = "";
            };
            
            
            /**
             * calculate() 
             * evaluate the operation
             *
             * @param  
             * @return void 
             */
            $scope.calculate = function() {

                try
                {
                    $scope.operation = $scope.$eval($scope.operation);
                }
                catch (e)
                {
                    $scope.operation = 'Error';
                }
                
            };



        }]);



})();