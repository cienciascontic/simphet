// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Line Game' screen. Responsibilities include:
 * <ul>
 * <li>creation of challenges (delegated to factory)</li>
 * <li>management of game state</li>
 * <li>management of game results</li>
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory1 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory1' );
  var ChallengeFactory2 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory2' );
  var ChallengeFactory3 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory3' );
  var ChallengeFactory4 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory4' );
  var ChallengeFactory5 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory5' );
  var ChallengeFactory6 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory6' );
  var ChallengeFactoryHardCoded = require( 'GRAPHING_LINES/linegame/model/ChallengeFactoryHardCoded' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var GamePhase = require( 'GRAPHING_LINES/linegame/model/GamePhase' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var GLConstants = require( 'GRAPHING_LINES/common/GLConstants' );
  var GraphTheLine = require( 'GRAPHING_LINES/linegame/model/GraphTheLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var PlayState = require( 'GRAPHING_LINES/linegame/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var USE_HARD_CODED_CHALLENGES = window.phetcommon.getQueryParameter( 'hardcoded' ); // for debugging
  var DUMMY_CHALLENGE = new GraphTheLine( '', Line.createSlopeIntercept( 1, 1, 1 ),
    EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE, GLConstants.X_AXIS_RANGE, GLConstants.Y_AXIS_RANGE );

  // a challenge factory for each level
  var factories = [
    new ChallengeFactory1(),
    new ChallengeFactory2(),
    new ChallengeFactory3(),
    new ChallengeFactory4(),
    new ChallengeFactory5(),
    new ChallengeFactory6()
  ];

  /**
   * Property used for the game phase.
   * It has a 'hook' function that is called before the value is changed.
   * This is useful for setting the various state parameters of the game before
   * notifying observes that the game phase has changed.
   * @param {GamePhase} value
   * @param {function} hook function with one parameter of type {GamePhase}
   * @constructor
   */
  function GamePhaseProperty( value, hook ) {
    this.hook = hook;
    Property.call( this, value );
  }

  inherit( Property, GamePhaseProperty, {
    /** @override */
    set: function( value ) {
      this.hook( value );
      Property.prototype.set.call( this, value );
    }
  } );

  function LineGameModel() {

    var thisModel = this;

    PropertySet.call( thisModel, {
      level: 0,
      soundEnabled: true,
      timerEnabled: false,
      score: 0, // how many points the user has earned for the current game
      challenge: DUMMY_CHALLENGE,
      challengeIndex: 0,
      challengesPerGame: 0,
      playState: PlayState.NONE
    } );

    thisModel.challenges = []; // Array<Challenge>
    thisModel.timer = new GameTimer();
    thisModel.numberOfLevels = factories.length;
    thisModel.maxPointsPerChallenge = 2;
    thisModel.bestScoreProperties = []; // best scores for each level, array of Property<Number>
    thisModel.bestTimeProperties = []; // best times for each level, in ms, array of Property<Number>
    thisModel.isNewBestTime = false; // is the time for the most-recently-completed game a new best time?
    for ( var level = 0; level < thisModel.numberOfLevels; level++ ) {
      thisModel.bestScoreProperties.push( new Property( 0 ) );
      thisModel.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    thisModel.gamePhaseProperty = new GamePhaseProperty( GamePhase.SETTINGS,
      /*
       * This function will be called prior to setting the property value.
       * Updates fields so that they are accurate before property listeners are notified.
       */
      function( gamePhase ) {
        if ( gamePhase === GamePhase.SETTINGS ) {
          thisModel.playState = PlayState.NONE;
          thisModel.timer.stop();
        }
        else if ( gamePhase === GamePhase.PLAY ) {
          thisModel.initChallenges();
          thisModel.playState = PlayState.FIRST_CHECK;
          thisModel.score = 0;
          thisModel.timer.start();
        }
        else if ( gamePhase === GamePhase.RESULTS ) {
          thisModel.playState = PlayState.NONE;
          thisModel.timer.stop();
          thisModel.updateBestTime();
        }
        else {
          throw new Error( 'unsupported game phase: ' + gamePhase );
        }
      } );

    thisModel.initChallenges();

    // Do this after initChallenges, because this will fire immediately and needs to have an initial set of challenges.
    thisModel.playStateProperty.link( function( playState ) {
      if ( playState === PlayState.FIRST_CHECK ) {
        if ( thisModel.challengeIndex === thisModel.challenges.length - 1 ) {
          // game has been completed
          thisModel.gamePhaseProperty.set( GamePhase.RESULTS );
          if ( thisModel.score > thisModel.bestScoreProperties[ thisModel.level ].get() ) {
            thisModel.bestScoreProperties[ thisModel.level ].set( thisModel.score );
          }
        }
        else {
          // next challenge
          thisModel.challengeIndex = thisModel.challengeIndex + 1;
          thisModel.challenge = thisModel.challenges[thisModel.challengeIndex];
        }
      }
      else if ( playState === PlayState.NEXT ) {
        thisModel.challenge.setAnswerVisible( true );
      }
    } );
  }

  return inherit( PropertySet, LineGameModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.gamePhaseProperty.reset();
      this.resetBestScores();
      this.initChallenges(); // takes care of challengeProperty, challengeIndexProperty, challengesPerGameProperty
    },

    // resets the best score to zero for every level
    resetBestScores: function() {
      this.bestScoreProperties.forEach( function( property ) {
        property.set( 0 );
      } );
    },

    isPerfectScore: function() {
      return this.score === this.getPerfectScore();
    },

    // Gets the number of points in a perfect score (ie, correct answers for all challenges on the first try)
    getPerfectScore: function() {
      return this.challenges.length * this.computePoints( 1 );
    },

    // Compute points to be awarded for a correct answer.
    computePoints: function( attempts ) {
      return Math.max( 0, this.maxPointsPerChallenge - attempts + 1 );
    },

    /**
     * Skips the current challenge.
     * This is a developer feature.
     * Score and best times are meaningless after using this.
     */
    skipCurrentChallenge: function() {
      this.playState = PlayState.NEXT;
      this.playState = PlayState.FIRST_CHECK;
    },

    /**
     * Replays the current challenge.
     * This is a developer feature.
     * Score and best times are meaningless after using this.
     */
    replayCurrentChallenge: function() {
      this.challenge.reset();
      this.challengeIndex = this.challengeIndex - 1;
      this.challenge = DUMMY_CHALLENGE; // force an update
      this.playState = PlayState.FIRST_CHECK;
    },

    // Updates the best time for the current level, at the end of a timed game with a perfect score.
    updateBestTime: function() {
      assert && assert( !this.timer.isRunning );
      if ( this.timerEnabled && this.isPerfectScore() ) {
        var level = this.level;
        var time = this.timer.elapsedTime;
        this.isNewBestTime = false;
        if ( !this.bestTimeProperties[ level ].get() ) {
          // there was no previous time for this level
          this.bestTimeProperties[ level ].set( time );
        }
        else if ( time < this.bestTimeProperties[ level ].get() ) {
          // we have a new best time for this level
          this.bestTimeProperties[ level ].set( time );
          this.isNewBestTime = true;
        }
      }
    },

    // initializes a new set of challenges for the current level
    initChallenges: function() {
      this.challengeIndex = -1;
      var level = this.level;
      if ( USE_HARD_CODED_CHALLENGES ) {
        this.challenges = ChallengeFactoryHardCoded.createChallenges( level, GLConstants.X_AXIS_RANGE, GLConstants.Y_AXIS_RANGE );
      }
      else {
        assert && assert( level >= 0 && level < factories.length );
        this.challenges = factories[level].createChallenges( GLConstants.X_AXIS_RANGE, GLConstants.Y_AXIS_RANGE );
      }
      this.challengesPerGame = this.challenges.length;
    }
  } );
} );