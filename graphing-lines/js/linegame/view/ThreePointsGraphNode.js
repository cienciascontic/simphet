// Copyright 2002-2014, University of Colorado Boulder

/**
 * Challenge graph with manipulators for 3 arbitrary points, which may or may not form a guess line.
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
  var PointManipulator = require( 'GRAPHING_LINES/common/view/manipulator/PointManipulator' );

  /**
   * @param {PlaceThePoints} challenge
   * @constructor
   */
  function ThreePointsGraphNode( challenge ) {

    var thisNode = this;
    ChallengeGraphNode.call( thisNode, challenge, { slopeToolEnabled: false } );

    // manipulators
    var manipulatorRadius = challenge.modelViewTransform.modelToViewDeltaX( LineGameConstants.MANIPULATOR_RADIUS );
    var p1Manipulator = new PointManipulator( manipulatorRadius,
      challenge.p1Property, [ challenge.p2Property, challenge.p3Property ], challenge.graph.xRange, challenge.graph.yRange, challenge.modelViewTransform );
    var p2Manipulator = new PointManipulator( manipulatorRadius,
      challenge.p2Property, [ challenge.p1Property, challenge.p3Property ], challenge.graph.xRange, challenge.graph.yRange, challenge.modelViewTransform );
    var p3Manipulator = new PointManipulator( manipulatorRadius,
      challenge.p3Property, [ challenge.p1Property, challenge.p2Property ], challenge.graph.xRange, challenge.graph.yRange, challenge.modelViewTransform );

    // rendering order
    thisNode.addChild( p1Manipulator );
    thisNode.addChild( p2Manipulator );
    thisNode.addChild( p3Manipulator );

    // Move the manipulators to match points
    challenge.multilink( [ 'p1', 'p2', 'p3' ],
      function( p1, p2, p3 ) {
        p1Manipulator.translation = challenge.modelViewTransform.modelToViewPosition( p1 );
        p2Manipulator.translation = challenge.modelViewTransform.modelToViewPosition( p2 );
        p3Manipulator.translation = challenge.modelViewTransform.modelToViewPosition( p3 );
      } );
  }

  return inherit( ChallengeGraphNode, ThreePointsGraphNode );
} );

