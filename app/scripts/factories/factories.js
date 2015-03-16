
/**
 * Description of factories.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */



(function() {


    /**
     * module factory 
     * manage angular variables in the view index.html
     *
     * @return object 
     */

    var ipermindFactories = angular.module('ipermindFactories', []);




    /**
     * StateFactory(scope) 
     * manage the application states
     *
     * @param StartGameState, PlayingGameState, EndGameState
     * @return object 
     */


    ipermindFactories.factory('StateFactory', ["StartGameState", "PlayingGameState", "EndGameState", function(StartGameState, PlayingGameState, EndGameState) {

            function StateFactory(scope) {
                $scope = scope;

            }
            ;

            StateFactory.prototype.createNewGame = function() {
                return new StartGameState($scope);
            };

            StateFactory.prototype.createPlayingGame = function() {
                return new PlayingGameState($scope);
            };

            StateFactory.prototype.createEndGame = function() {
                return new EndGameState($scope);
            };

            return StateFactory;


        }]);




    /**
     * StartGameState(scope) 
     * manage the start state of the application
     *
     * @param GameModel, Generator
     * @return object 
     */


    ipermindFactories.factory('StartGameState', ["GameModel", "Generator", function(GameModel, Generator) {

            function StartGameState(scope) {
                $scope = scope;
                $scope.game_model = null;
            }
            ;

            StartGameState.prototype.noGame = function(level) {
                var model = new GameModel($scope);
                var generator = new Generator($scope);
                var secret_sequence = generator.getSecretSequence(level);
                model.setSecretSequence(secret_sequence);
                model.setTime($scope.start_time);
                $scope.game_model = model;
            };

            StartGameState.prototype.newGame = function(level) {
                var model = new GameModel($scope);
                $scope.game_model = model;
            };

            return StartGameState;

        }]);


    /**
     * PlayingGameState(scope) 
     * manage the playing state of the application
     *
     * @param GameModel, Checker
     * @return object 
     */


    ipermindFactories.factory('PlayingGameState', ["GameModel", "Checker", function(GameModel, Checker) {

            function PlayingGameState(scope) {
                $scope = scope;
            }
            ;


            PlayingGameState.prototype.checkGame = function() {

                var model = new GameModel($scope);
                model.setTime($scope.time_elapsed);
                model.setSequence($scope.sequence_str);


                var checker = new Checker($scope);
                checker.setPlayerSequence(model.getSequence());
                var comp_seq = $scope.secret_sequence;
                checker.setComputerSequence(comp_seq);
                checker.parseSequence();

                model.setErrors(checker.getErrors());
                model.setWinner(checker.isWinner());

                return model;


            };

            return PlayingGameState;

        }]);



    /**
     * EndGameState(scope) 
     * manage the end state of the application
     *
     * @param GameModel
     * @return object 
     */


    ipermindFactories.factory('EndGameState', ["GameModel", function(GameModel) {

            function EndGameState(scope) {
                $scope = scope;
            }
            ;

            EndGameState.prototype.winnerGame = function() {
                $scope.game_model = new GameModel($scope);
                $scope.game_model.setTime($scope.time);
                $scope.game_model.setSecretSequence($scope.secret_sequence);
                return $scope.game_model;
            };

            EndGameState.prototype.loserGame = function() {
                $scope.game_model = new GameModel($scope);
                $scope.game_model.setSecretSequence($scope.secret_sequence);
                return $scope.game_model;
            };

            return EndGameState;

        }]);





    /**
     * GameModel(scope) 
     * the main object manager
     *
     * @param RecordManager
     * @return object 
     */


    ipermindFactories.factory('GameModel', ["RecordManager", function(RecordManager) {

            function GameModel(scope) {
                $scope = scope;
                $scope.secret_sequence;
                $scope.model_sequence;
                $scope.isWinner;
                $scope.time_elapsed;
                $scope.errors;
                $scope.points;
            }
            ;

            GameModel.prototype.calculatePoints = function(time_elapsed) {
                $scope.points = $scope.points + (time_elapsed * 100);
            };
            
            GameModel.prototype.decreasePoints = function() {
                $scope.points = $scope.points - ($scope.points / 2);
            };

            GameModel.prototype.getPoints = function() {
                return $scope.points;
            };

            GameModel.prototype.setSecretSequence = function(secret_sequence) {
                $scope.secret_sequence = secret_sequence;
            };

            GameModel.prototype.getSecretSequence = function() {
                return $scope.secret_sequence;
            };

            GameModel.prototype.setTime = function(time_elapsed) {
                $scope.time_elapsed = time_elapsed;
            };

            GameModel.prototype.getTime = function() {
                return $scope.time_elapsed;
            };

            GameModel.prototype.setErrors = function(errors) {
                $scope.errors = errors;
            };

            GameModel.prototype.getErrors = function() {
                return $scope.errors;
            };

            GameModel.prototype.setSequence = function(user_sequence) {
                $scope.model_sequence = user_sequence;
            };

            GameModel.prototype.getSequence = function() {
                return $scope.model_sequence;
            };

            GameModel.prototype.isWinner = function() {
                return $scope.isWinner;
            };
            
            GameModel.prototype.isLoser = function() {
                return $scope.isLoser;
            };

            GameModel.prototype.setWinner = function(isWinner) {
                $scope.isWinner = isWinner;
            };

            GameModel.prototype.getTimeElapsed = function() {
                return $scope.time_elapsed;
            };

            GameModel.prototype.isRecord = function() {
                return $scope.isWinner;
            };

            GameModel.prototype.getRecords = function() {
                var recordManager = new RecordManager($scope);
                return recordManager.getRecords();
            };

            GameModel.prototype.saveRecord = function() {
                var recordManager = new RecordManager($scope);
                recordManager.persist();
            };

            return GameModel;

        }]);





   /**
     * Generator(scope) 
     * manage the generation of sequences
     *
     * @param StrategyManager
     * @return object 
     */



    ipermindFactories.factory('Generator', ["StrategyManager", function(StrategyManager) {

            function Generator(scope) {
                $scope = scope;
                $scope.generator;
            }
            ;

            Generator.prototype.getSecretSequence = function(level) {
                var strategy_manager = new StrategyManager($scope);
                $scope.secret_sequence = strategy_manager.getStrategy(level);
                return $scope.secret_sequence;
            };


            return Generator;

        }]);



   /**
     * RecordManager(scope) 
     * manage the saving and persist of data to the server (NEED REFACTORING)
     * the factory should call services from services.js module (TODO)
     * 
     * @param $http
     * @return object 
     */


    ipermindFactories.factory('RecordManager', ["$http", function($http) {

            function RecordManager(scope) {
                $scope = scope;
//                $scope.player;
//                $scope.timegame;
//                $scope.entity_manager;
//                $scope.computer_sequence;
            }
            ;

            RecordManager.prototype.getRecords = function() {
//                return $http({
//                    type: 'GET',
//                    url: 'http://localhost/ipermind/...',
//                    data: null,
//                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//                });
            };


            RecordManager.prototype.persist = function() {
//                return $http({
//                    type: 'POST',
//                    url: 'http://localhost/ipermind/...',
//                    data: 'setScore=' + this.calculateScore() + '&setTimeGame=' + this.timeDataTrasform() + '&setCreatedAt=' + new DateTime(),
//                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//                });
            };


            return RecordManager;

        }]);




/**
     * StrategyManager(scope) 
     * manage the strategies of the application
     *
     * @param EasyGame, MediumGame, DifficultGame, LEVEL_EASY, LEVEL_MEDIUM, LEVEL_DIFFICULT
     * @return object 
     */



    ipermindFactories.factory('StrategyManager', ["EasyGame", "MediumGame", "DifficultGame", "LEVEL_EASY", "LEVEL_MEDIUM", "LEVEL_DIFFICULT", function(EasyGame, MediumGame, DifficultGame, LEVEL_EASY, LEVEL_MEDIUM, LEVEL_DIFFICULT) {

            function StrategyManager(scope) {
                $scope = scope;
            }
            ;

            StrategyManager.prototype.getStrategy = function(level) {

                var strategic_sequence = new Array();

                if (LEVEL_EASY == level) {
                    var game = new EasyGame($scope);
                    strategic_sequence = game.createSequence();
                }
                else if (LEVEL_MEDIUM == level) {
                    var game = new MediumGame($scope);
                    strategic_sequence = game.createSequence();
                }
                else if (LEVEL_DIFFICULT == level) {

                    var game = new DifficultGame($scope);
                    strategic_sequence = game.createSequence();
                }
                else {
                    var game = new DifficultGame($scope);
                    strategic_sequence = game.createSequence();
                }
                return strategic_sequence;

            };

            return StrategyManager;

        }]);




/**
     * EasyGame(scope) 
     * manage the EasyGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('EasyGame', ["_KING", "_QUEEN", function(_KING, _QUEEN) {

            function EasyGame(scope) {
                $scope = scope;
            }
            ;

            EasyGame.prototype.createSequence = function() {

                var secret_sequence = this.getSequence();
                return secret_sequence;
            };

            EasyGame.prototype.getUnit = function() {
                var sseq = Math.floor((Math.random() * 99) + 1);
                var sp = "";
                if (sseq >= 0 && sseq < 50) {
                    sp = _KING;
                }
                if (sseq >= 50 && sseq < 100) {
                    sp = _QUEEN;
                }               
                return sp;
            };

            EasyGame.prototype.getSequence = function() {
                var secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    var unit = this.getUnit();
                    secret_sequence.push(unit);
                }
                return secret_sequence;
            };

            return EasyGame;

        }]);


/**
     * MediumGame(scope) 
     * manage the MediumGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('MediumGame', ["_KING", "_QUEEN", "_ROOK", "_BISHOP", function(_KING, _QUEEN, _ROOK, _BISHOP) {

            function MediumGame(scope) {
                $scope = scope;
            }
            ;

            MediumGame.prototype.createSequence = function() {

                var secret_sequence = this.getSequence();
                return secret_sequence;
            };

            MediumGame.prototype.getUnit = function() {
                var sseq = Math.floor((Math.random() * 99) + 1);
                var sp = "";
                if (sseq >= 0 && sseq < 25) {
                    sp = _KING;
                }
                if (sseq >= 25 && sseq < 50) {
                    sp = _QUEEN;
                }
                if (sseq >= 50 && sseq < 75) {
                    sp = _ROOK;
                }
                if (sseq >= 75 && sseq < 100) {
                    sp = _BISHOP;
                }               
                return sp;
            };

            MediumGame.prototype.getSequence = function() {
                var secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    var unit = this.getUnit();
                    secret_sequence.push(unit);
                }
                return secret_sequence;
            };

            return MediumGame;

        }]);

/**
     * DifficultGame(scope) 
     * manage the DifficultGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('DifficultGame', ["_KING", "_QUEEN", "_ROOK", "_BISHOP", "_KNIGHT", "_PAWN", function(_KING, _QUEEN, _ROOK, _BISHOP, _KNIGHT, _PAWN) {

            function DifficultGame(scope) {
                $scope = scope;
            }
            ;

            DifficultGame.prototype.createSequence = function() {
                var secret_sequence = this.getSequence();
                return secret_sequence;
            };

            DifficultGame.prototype.getUnit = function() {
                var sseq = Math.floor((Math.random() * 99) + 1);
                var sp = "";
                if (sseq >= 0 && sseq < 15) {
                    sp = _KING;
                }
                if (sseq >= 15 && sseq < 30) {
                    sp = _QUEEN;
                }
                if (sseq >= 30 && sseq < 45) {
                    sp = _ROOK;
                }
                if (sseq >= 45 && sseq < 60) {
                    sp = _BISHOP;
                }
                if (sseq >= 60 && sseq < 75) {
                    sp = _KNIGHT;
                }
                if (sseq >= 75 && sseq < 100) {
                    sp = _PAWN;
                }
                return sp;
            };

            DifficultGame.prototype.getSequence = function() {
                var secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    var unit = this.getUnit();
                    secret_sequence.push(unit);
                }
                return secret_sequence;

            };

            return DifficultGame;

        }]);



    /**
     * Checker(scope) 
     * check the validity of the user sequence
     *
     * @param _EMPTY, _BLACK, _WHITE, _PARSED
     * @return object 
     */

    ipermindFactories.factory('Checker', ["_EMPTY", "_BLACK", "_WHITE", "_PARSED", function(_EMPTY, _BLACK, _WHITE, _PARSED) {

            function Checker(scope) {

                $scope = scope;
                $scope.result_matrix = new Array(_EMPTY, _EMPTY, _EMPTY, _EMPTY);
                $scope.user_sequence;
                $scope.computer_sequence;

            }
            ;

            Checker.prototype.setPlayerSequence = function(user_sequence) {
                $scope.user_sequence = user_sequence;
            };

            Checker.prototype.setComputerSequence = function(secret_sequence) {
                $scope.computer_sequence = secret_sequence;
            };


            Checker.prototype.parseSequence = function() {


                var usarray = $scope.user_sequence.toString().split("|");
                var csarray = $scope.computer_sequence.toString().split(",");
                var player_sequence_clone = usarray;



                // PARSE RIGHT COLOR IN RIGHT PLACE

                for (var i = 0; i < usarray.length; i++) {
                    if (usarray[i] == csarray[i]) {
                        $scope.result_matrix[i] = _BLACK;
                        player_sequence_clone[i] = _PARSED;
                    } else {
                        $scope.result_matrix[i] = _EMPTY;
                    }
                }



                // PARSE RIGHT COLOR IN WRONG PLACE

                for (var i = 0; i < player_sequence_clone.length; i++) {
                    for (var y = 0; y < csarray.length; y++) {
                        if ($scope.result_matrix[y] == _EMPTY) {
                            if (player_sequence_clone[i] == csarray[y]) {
                                $scope.result_matrix[y] = _WHITE;
                                player_sequence_clone[i] = _PARSED;
                            }
                        }
                    }
                }


            };

            Checker.prototype.shuffle = function(array) {
                var i = array.length;
                while (--i) {
                    var j = Math.floor(Math.random() * (i + 1))
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }

                return array; // for convenience, in case we want a reference to the array
            };

            Checker.prototype.getErrors = function() {
                this.mixErrors();
                return $scope.result_matrix;
            };

            Checker.prototype.mixErrors = function() {
                $scope.result_matrix = this.shuffle($scope.result_matrix);
            };

            Checker.prototype.isWinner = function() {

                var isWinner = true;

                for (var i = 0; i < $scope.result_matrix.length; i++) {

                    if ($scope.result_matrix[i] != _BLACK) {
                        isWinner = false;
                        break;
                    }
                }

                return isWinner;
            };


            return Checker;

        }]);
    
    
    ipermindFactories.factory('Stars', function() {
        
        
          /**
             * getStars() , updateStars() , resetStars()
             * show attempts - 5 attempts allowed
             *
             * @param  
             * @return void 
             */
        
        
         function Stars(scope) {

                $scope = scope;
            }
            ;
        

            Stars.prototype.getStars = function() {
                if ($scope.stars[0] == "1") {
                    $scope.resetStars();
                }
                var star = "2";
                for (var i = 0; i < 5; i++) {
                    $scope.stars.push(star);
                }
            },

            Stars.prototype.updateStars = function() {
                var star = "1";
                for (var i = 5; i > -1; i--) {
                    if ($scope.stars[i] == "2") {
                        $scope.stars[i] = "1";
                        break;
                    }
                }
            };

            Stars.prototype.resetStars = function() {
                while ($scope.stars.length > 0) {
                    $scope.stars.pop();
                }
            };
            
       return new Stars;

 });
 
 
 ipermindFactories.factory('Sequence', function() {
     
     
     function Sequence(scope) {

                $scope = scope;
            }
            ;
             
            
            
            /**
             * increaseSequence(step) 
             * set the element in the cell sequence
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.increaseSequence = function(step) {
               
                    $scope.sequence.push(step);
                    

            };
            
            
            
             /**
             * setSequenceStep(elem) 
             * set the element in the cell sequence
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.setSequenceStr = function() {
                
               $scope.sequence_str = $scope.sequence[0] + "|" + $scope.sequence[1] + "|" + $scope.sequence[2] + "|" + $scope.sequence[3];
               

            };
            
            
            
            /**
             * resetSequence(elem) 
             * reset to empty cells
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.resetSequence = function(elem) {                
             
                for(var y=0; y<4; y++){                     
                         $scope.sequence_step_view[y]=elem;                   
                }

            };

     
     
     
     return new Sequence;
     

 });
 
 
 
  ipermindFactories.factory('Arrow', ["_ARROW","_ARROW_EMPTY", function(_ARROW,_ARROW_EMPTY) {
      
      
      function Arrow(scope) {

                $scope = scope;
            }
            ;
      
      
 
  /**
             * moveArrow(i) 
             * move the arrow indicator forward
             *
             * @param integer 
             * @return void 
             */

            Arrow.prototype.moveArrow = function(i) {                
                
                for(var y=0; y<4; y++){
                     if(y==i){
                         $scope.arrow_step[y]=_ARROW;
                     } else {
                         $scope.arrow_step[y]=_ARROW_EMPTY;
                     }
                }

            };

      return new Arrow;
     

 }]);
 
  
  
 


})();