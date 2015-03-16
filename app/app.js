/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {


    // MAIN MODULE CREATION
    var ipermind = angular.module('ipermind', [
        'ipermindControllers',
        'ipermindFactories',
        'ipermindDirectives',
        'ipermindServices'])
            .constant('_KING', "king")
            .constant('_QUEEN', "queen")
            .constant('_ROOK', "rook")
            .constant('_BISHOP', "bishop")
            .constant('_KNIGHT', "knight")
            .constant('_PAWN', "pawn")
            .constant('_EMPTY', "e")
            .constant('_BLACK', "b")
            .constant('_WHITE', "w")
            .constant('_PARSED', "p")
            .constant('LEVEL_EASY', 1)
            .constant('LEVEL_MEDIUM', 2)
            .constant('LEVEL_DIFFICULT', 3)
            .constant('COUNTDOWN', 120)
            .constant('_ARROW', "arrow")
            .constant('_ARROW_EMPTY', "arrow_empty")
            .constant('_SEQ_EMPTY', "empty")
            .constant('RESPONSE_SUCCESS', "success");






})();