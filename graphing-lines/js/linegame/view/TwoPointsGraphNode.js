// Copyright 2002-2014, University of Colorado Boulder

/**
 * Challenge graph with manipulators for 2 points, (x1,y1) and (x2,y2), of the guess line.
 * The answer line is initially hidden.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeGraphNode = require( 'GRAPHING_LINES/linegame/view/ChallengeGraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineGameConstants = require( 'GRAPHING_LINES/linegame/LineGameConstants' );
  var Property = require( 'AXON/Property' );
  var X1Y1Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/X1Y1Manipulator' );
  var X2Y2Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/X2Y2Manipulator' );

  /**
   * @param {PlaceThePoints} challenge
   * @constructor
   */
  function TwoPointsGraphNode( challenge ) {

    var thisNode = this;
    ChallengeGraphNode.call( thisNode, challenge );

    thisNode.setGuessVisible( true );

    var manipulatorRadius = challenge.modelViewTransform.modelToViewDeltaX( LineGameConstants.MANIPULATOR_RADIUS );

    var x1y1Manipulator = new X1Y1Manipulator( manipulatorRadius, challenge.guessProperty,
      new Property( challenge.graph.xRange ), new Property( challenge.graph.yRange ), challenge.modelViewTransform, false /* constantSlope */ );

    var x2y2Manipulator = new X2Y2Manipulator( manipulatorRadius, challenge.guessProperty,
      new Property( challenge.graph.xRange ), new Property( challenge.graph.yRange ), challenge.modelViewTransform );

    // Rendering order
    thisNode.addChild( x1y1Manipulator );
    thisNode.addChild( x2y2Manipulator );

    // Sync with the guess
    challenge.guessProperty.link( function( line ) {
      // move the manipulators
      x1y1Manipulator.translation = challenge.modelViewTransform.modelToViewXY( line.x1, line.y1 );
      x2y2Manipulator.translation = challenge.modelViewTransform.modelToViewXY( line.x2, line.y2 );
    } );
  }

  return inherit( ChallengeGraphNode, TwoPointsGraphNode );
} );

