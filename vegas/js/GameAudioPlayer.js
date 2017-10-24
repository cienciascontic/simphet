// Copyright 2002-2013, University of Colorado Boulder

/**
 * Audio player for the various sounds that are commonly used in PhET games.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var dingSound = require( 'audio!VEGAS/ding' );
  var boingSound = require( 'audio!VEGAS/boing' );
  var trumpetSound = require( 'audio!VEGAS/trumpet' );
  var cheerSound = require( 'audio!VEGAS/cheer' );

  // constants
  var CORRECT_ANSWER = new Sound( dingSound );
  var WRONG_ANSWER = new Sound( boingSound );
  var IMPERFECT_SCORE = new Sound( trumpetSound );
  var PERFECT_SCORE = new Sound( cheerSound );

  /**
   * @param soundEnabledProperty
   * @constructor
   */
  function GameAudioPlayer( soundEnabledProperty ) {
    this.soundEnabledProperty = soundEnabledProperty;
  }

  return inherit( Object, GameAudioPlayer, {

    correctAnswer: function() {
      if ( this.soundEnabledProperty.value ) {
        CORRECT_ANSWER.play();
      }
    },

    wrongAnswer: function() {
      if ( this.soundEnabledProperty.value ) {
        WRONG_ANSWER.play();
      }
    },

    gameOverZeroScore: function() {
      if ( this.soundEnabledProperty.value ) {
        WRONG_ANSWER.play();
      }
    },

    gameOverImperfectScore: function() {
      if ( this.soundEnabledProperty.value ) {
        IMPERFECT_SCORE.play();
      }
    },

    gameOverPerfectScore: function() {
      if ( this.soundEnabledProperty.value ) {
        PERFECT_SCORE.play();
      }
    }
  } );
} );