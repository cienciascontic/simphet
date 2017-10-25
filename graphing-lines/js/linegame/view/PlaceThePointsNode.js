// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for 'Place the Points' challenges.
 * This is a specialization of the 'Graph the Line' view.
 * User manipulates 3 arbitrary points, equations are displayed on the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GraphTheLineNode = require( 'GRAPHING_LINES/linegame/view/GraphTheLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayState = require( 'GRAPHING_LINES/linegame/model/PlayState' );
  var ThreePointsGraphNode = require( 'GRAPHING_LINES/linegame/view/ThreePointsGraphNode' );

  /**
   * @param {GraphTheLine} challenge
   * @param {LineGameModel} model
   * @param {Dimension2} challengeSize
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function PlaceThePointsNode( challenge, model, challengeSize, audioPlayer ) {

    var thisNode = this;
    GraphTheLineNode.call( thisNode, challenge, model, challengeSize, audioPlayer );

    model.playStateProperty.link( function( state ) {

      // show user's line only in states where there guess is wrong.
      thisNode.graphNode.setGuessVisible( !challenge.isCorrect() && ( state === PlayState.TRY_AGAIN || state === PlayState.NEXT ) );

      /*
       * Plot (x1,y1) when for answer when user got the challenge wrong.
       * Do not plot (x1,y1) for guess because none of the 3 points corresponds to (x1,y1).
       */
      thisNode.graphNode.setAnswerPointVisible( state === PlayState.NEXT && !challenge.isCorrect() );
      thisNode.graphNode.setGuessPointVisible( false );
    } );
  }

  return inherit( GraphTheLineNode, PlaceThePointsNode, {

    /**
     * Creates the graph portion of the view.
     * @override
     * @param {Challenge} challenge
     * @returns {ChallengeGraphNode}
     */
    createGraphNode: function( challenge ) {
      return new ThreePointsGraphNode( challenge );
    }
  } );
} );