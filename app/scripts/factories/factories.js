
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

            function StateFactory() {};

            StateFactory.prototype.createNewGame = function() {
                return new StartGameState();
            };

            StateFactory.prototype.createPlayingGame = function() {
                return new PlayingGameState();
            };

            StateFactory.prototype.createEndGame = function() {
                return new EndGameState();
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

            function StartGameState() {
                var game_model;
            }
            ;

            StartGameState.prototype.noGame = function(level,start_time) {
                var model = GameModel;
                var secret_sequence = Generator.getSecretSequence(level);
                model.setSecretSequence(secret_sequence);
                model.setTime(start_time);
                this.game_model = model;
            };

            StartGameState.prototype.newGame = function() {
                var model = GameModel;
                this.game_model = model;
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

            function PlayingGameState() {};


            PlayingGameState.prototype.checkGame = function(time_elapsed,sequence_str) {

                var model = GameModel;
                model.setTime(time_elapsed);
                model.setSequence(sequence_str);

                var checker = new Checker();
                checker.setPlayerSequence(model.getSequence());
                var comp_seq = model.getSecretSequence();
                checker.setComputerSequence(comp_seq);
                checker.init().parseSequence();

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

            function EndGameState() {};

            EndGameState.prototype.winnerGame = function(time,secret_sequence) {
                var model = GameModel;
                model.setTime(time);
                model.setSecretSequence(secret_sequence);
                return model;
            };

            EndGameState.prototype.loserGame = function(secret_sequence) {
                var model = GameModel;
                model.setSecretSequence(secret_sequence);
                return model;
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

            function GameModel() {
                var secret_sequence;
                var model_sequence;
                var isWinner;
                var time_elapsed;
                var errors;
                var points;                
            }
            ;

            GameModel.prototype.calculatePoints = function(points, time_elapsed) {
                this.points = points + (time_elapsed * 100);
                return this.points;
            };
            
            GameModel.prototype.decreasePoints = function(points) {
                this.points = points - (points / 2);
                return this.points;
            };

            GameModel.prototype.getPoints = function() {
                return this.points;
            };

            GameModel.prototype.setSecretSequence = function(secret_sequence) {
                this.secret_sequence = secret_sequence;
            };

            GameModel.prototype.getSecretSequence = function() {
                return this.secret_sequence;
            };

            GameModel.prototype.setTime = function(time_elapsed) {
                this.time_elapsed = time_elapsed;
            };

            GameModel.prototype.getTime = function() {
                return this.time_elapsed;
            };

            GameModel.prototype.setErrors = function(errors) {
                this.errors = errors;
            };

            GameModel.prototype.getErrors = function() {
                return this.errors;
            };

            GameModel.prototype.setSequence = function(user_sequence) {
                this.model_sequence = user_sequence;
            };

            GameModel.prototype.getSequence = function() {
                return this.model_sequence;
            };

            GameModel.prototype.isWinner = function() {
                return this.isWinner;
            };
            
            GameModel.prototype.isLoser = function() {
                return this.isLoser;
            };

            GameModel.prototype.setWinner = function(isWinner) {
                this.isWinner = isWinner;
            };

            GameModel.prototype.getTimeElapsed = function() {
                return this.time_elapsed;
            };

            GameModel.prototype.isRecord = function() {
                return this.isWinner;
            };

            GameModel.prototype.getRecords = function() {
                var recordManager = new RecordManager();
                return recordManager.getRecords();
            };

            GameModel.prototype.saveRecord = function() {
                var recordManager = new RecordManager();
                recordManager.persist();
            };

            return new GameModel;

        }]);





   /**
     * Generator(scope) 
     * manage the generation of sequences
     *
     * @param StrategyManager
     * @return object 
     */



    ipermindFactories.factory('Generator', ["StrategyManager", function(StrategyManager) {

            function Generator() {
                var secret_sequence;
            }
            ;

            Generator.prototype.getSecretSequence = function(level) {
                this.secret_sequence = StrategyManager.getStrategy(level);
                return this.secret_sequence; 
            };

            return new Generator;

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

            function RecordManager() {
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

            function StrategyManager() {
                var strategic_sequence;
            }
            ;

            StrategyManager.prototype.getStrategy = function(level) {

                this.strategic_sequence = new Array();

                if (LEVEL_EASY == level) {
                    this.strategic_sequence = EasyGame.createSequence();
                }
                else if (LEVEL_MEDIUM == level) {
                    this.strategic_sequence = MediumGame.createSequence();
                }
                else if (LEVEL_DIFFICULT == level) {
                    this.strategic_sequence = DifficultGame.createSequence();
                }
                else {
                    this.strategic_sequence = DifficultGame.createSequence();
                }
                return this.strategic_sequence;

            };

            return new StrategyManager;

        }]);




/**
     * EasyGame(scope) 
     * manage the EasyGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('EasyGame', ["_KING", "_QUEEN", function(_KING, _QUEEN) {

            function EasyGame() {
                var secret_sequence;
                var sseq;
                var sp;
                var unit;
            }
            ;

            EasyGame.prototype.createSequence = function() {

                this.secret_sequence = this.getSequence();
                return this.secret_sequence;
            };

            EasyGame.prototype.getUnit = function() {
                this.sseq = Math.floor((Math.random() * 99) + 1);
                this.sp = "";
                if (this.sseq >= 0 && this.sseq < 50) {
                    this.sp = _KING;
                }
                if (this.sseq >= 50 && this.sseq < 100) {
                    this.sp = _QUEEN;
                }               
                return this.sp;
            };

            EasyGame.prototype.getSequence = function() {
                this.secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    this.unit = this.getUnit();
                    this.secret_sequence.push(this.unit);
                }
                return this.secret_sequence;
            };

            return new EasyGame;

        }]);


/**
     * MediumGame(scope) 
     * manage the MediumGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('MediumGame', ["_KING", "_QUEEN", "_ROOK", "_BISHOP", function(_KING, _QUEEN, _ROOK, _BISHOP) {

            function MediumGame() {
                var secret_sequence;
                var sseq;
                var sp;
                var unit;
            }
            ;

            MediumGame.prototype.createSequence = function() {

                this.secret_sequence = this.getSequence();
                return this.secret_sequence;
            };

            MediumGame.prototype.getUnit = function() {
                this.sseq = Math.floor((Math.random() * 99) + 1);
                this.sp = "";
                if (this.sseq >= 0 && this.sseq < 25) {
                    this.sp = _KING;
                }
                if (this.sseq >= 25 && this.sseq < 50) {
                    this.sp = _QUEEN;
                }
                if (this.sseq >= 50 && this.sseq < 75) {
                    this.sp = _ROOK;
                }
                if (this.sseq >= 75 && this.sseq < 100) {
                    this.sp = _BISHOP;
                }               
                return this.sp;
            };

            MediumGame.prototype.getSequence = function() {
                this.secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    this.unit = this.getUnit();
                    this.secret_sequence.push(this.unit);
                }
                return this.secret_sequence;
            };

            return new MediumGame;

        }]);

/**
     * DifficultGame(scope) 
     * manage the DifficultGame strategy of the application
     *
     * @param _RED, _BLUE, _GOLD, _GREEN
     * @return object 
     */

    ipermindFactories.factory('DifficultGame', ["_KING", "_QUEEN", "_ROOK", "_BISHOP", "_KNIGHT", "_PAWN", function(_KING, _QUEEN, _ROOK, _BISHOP, _KNIGHT, _PAWN) {

            function DifficultGame() {
                var secret_sequence;
                var sseq;
                var sp;
                var unit;
            }
            ;

            DifficultGame.prototype.createSequence = function() {
                this.secret_sequence = this.getSequence();
                return this.secret_sequence;
            };

            DifficultGame.prototype.getUnit = function() {
                this.sseq = Math.floor((Math.random() * 99) + 1);
                this.sp = "";
                if (this.sseq >= 0 && this.sseq < 15) {
                    this.sp = _KING;
                }
                if (this.sseq >= 15 && this.sseq < 30) {
                    this.sp = _QUEEN;
                }
                if (this.sseq >= 30 && this.sseq < 45) {
                    this.sp = _ROOK;
                }
                if (this.sseq >= 45 && this.sseq < 60) {
                    this.sp = _BISHOP;
                }
                if (this.sseq >= 60 && this.sseq < 75) {
                    this.sp = _KNIGHT;
                }
                if (this.sseq >= 75 && this.sseq < 100) {
                    this.sp = _PAWN;
                }
                return this.sp;
            };

            DifficultGame.prototype.getSequence = function() {
                this.secret_sequence = new Array();
                for ($i = 0; $i < 4; $i++) {
                    this.unit = this.getUnit();
                    this.secret_sequence.push(this.unit);
                }
                return this.secret_sequence;

            };

            return new DifficultGame;

        }]);



    /**
     * Checker(scope) 
     * check the validity of the user sequence
     *
     * @param _EMPTY, _BLACK, _WHITE, _PARSED
     * @return object 
     */
    
    
    ipermindFactories.factory('Checker', ["_EMPTY", "_BLACK", "_WHITE", "_PARSED", function(_EMPTY, _BLACK, _WHITE, _PARSED) {

            function Checker() {

                var result_matrix;
                var user_sequence;
                var computer_sequence;

            }
            ;       
            
            Checker.prototype.init = function() {
                this.result_matrix = new Array(_EMPTY, _EMPTY, _EMPTY, _EMPTY);
                return this;
            };           

            Checker.prototype.setPlayerSequence = function(user_sequence) {
                this.user_sequence = user_sequence;
            };

            Checker.prototype.setComputerSequence = function(secret_sequence) {
                this.computer_sequence = secret_sequence;
            };


            Checker.prototype.parseSequence = function() {

                var usarray = this.user_sequence.toString().split("|");
                var csarray = this.computer_sequence.toString().split(",");
                var player_sequence_clone = usarray;


                // PARSE RIGHT COLOR IN RIGHT PLACE
                for (var i = 0; i < usarray.length; i++) {
                    if (usarray[i] == csarray[i]) {
                        this.result_matrix[i] = _BLACK;
                        player_sequence_clone[i] = _PARSED;
                    } else {
                        this.result_matrix[i] = _EMPTY;
                    }
                }



                // PARSE RIGHT COLOR IN WRONG PLACE
                for (var i = 0; i < player_sequence_clone.length; i++) {
                    for (var y = 0; y < csarray.length; y++) {
                        if (this.result_matrix[y] == _EMPTY) {
                            if (player_sequence_clone[i] == csarray[y]) {
                                this.result_matrix[y] = _WHITE;
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
                return this.result_matrix;
            };

            Checker.prototype.mixErrors = function() {
                this.result_matrix = this.shuffle(this.result_matrix);
            };

            Checker.prototype.isWinner = function() {

                var isWinner = true;

                for (var i = 0; i < this.result_matrix.length; i++) {

                    if (this.result_matrix[i] != _BLACK) {
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
        
        
         function Stars() {
                var stars;
            }
            ;
        
            Stars.prototype.init = function() {
                 this.stars = new Array();
                 return this;
            };

            Stars.prototype.getStars = function() {
                if (this.stars[0] == "1") {
                    this.resetStars();
                }
                var star = "2";
                for (var i = 0; i < 5; i++) {
                    this.stars.push(star);
                }
                return this.stars;
            },

            Stars.prototype.updateStars = function() {
                var star = "1";
                for (var i = 5; i > -1; i--) {
                    if (this.stars[i] == "2") {
                        this.stars[i] = "1";
                        break;
                    }
                }
            };

            Stars.prototype.resetStars = function() {
                while (this.stars.length > 0) {
                    this.stars.pop();
                }
            };
            
       return new Stars;

 });
 
 
 ipermindFactories.factory('Sequence', function() {
     
     
     function Sequence() {};
             
             
            
            /**
             * increaseSequence(step) 
             * set the element in the cell sequence
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.increaseSequence = function(sequence,step) {
               
                    sequence.push(step);
                    return sequence;
                    

            };
            
            
            
             /**
             * setSequenceStep(elem) 
             * set the element in the cell sequence
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.setSequenceStr = function(sequence) {
                
               return sequence[0] + "|" + sequence[1] + "|" + sequence[2] + "|" + sequence[3];
               

            };
            
            
            
            /**
             * resetSequence(elem) 
             * reset to empty cells
             *
             * @param string 
             * @return void 
             */

            Sequence.prototype.resetSequence = function(sequence_step_view,elem) {                
             
                for(var y=0; y<4; y++){                     
                         sequence_step_view[y]=elem;                   
                }
                
                return sequence_step_view;

            };

     
     
     
     return new Sequence;
     

 });
 
 
 
  ipermindFactories.factory('Arrow', ["_ARROW","_ARROW_EMPTY", function(_ARROW,_ARROW_EMPTY) {
      
      
      function Arrow() {};
      
      
 
  /**
             * moveArrow(i) 
             * move the arrow indicator forward
             *
             * @param integer 
             * @return void 
             */

            Arrow.prototype.moveArrow = function(arrow_step,i) {                
                
                for(var y=0; y<4; y++){
                     if(y==i){
                         arrow_step[y]=_ARROW;
                     } else {
                         arrow_step[y]=_ARROW_EMPTY;
                     }
                }
                
                return arrow_step;

            };

      return new Arrow;
     

 }]);
 
 
  
 


})();