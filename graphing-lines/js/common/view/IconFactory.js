// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory for creating icons that appear in control panels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DimensionalArrowNode = require( 'GRAPHING_LINES/common/view/DimensionalArrowNode' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var Graph = require( 'GRAPHING_LINES/common/model/Graph' );
  var GraphNode = require( 'GRAPHING_LINES/common/view/GraphNode' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/Manipulator' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var scenery = { Line: require( 'SCENERY/nodes/Line' ) }; // scenery.Line, workaround for name collision with graphing-lines.Line
  var Screen = require( 'JOIST/Screen' );
  var Shape = require( 'KITE/Shape' );
  var SlopeToolNode = require( 'GRAPHING_LINES/common/view/SlopeToolNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SCREEN_ICON_BASE_SIZE = new Dimension2( 548, 373 );
  var ARROW_OPTIONS = { doubleHead: true, stroke: 'black', lineWidth: 18, headWidth: 30, headHeight: 30 };
  var DIMENSIONAL_ARROW_OPTIONS = { stroke: GLColors.SLOPE_TOOL_DIMENSIONAL_LINES, lineWidth: 18, arrowTipSize: new Dimension2( 55, 45 ), delimitersVisible: false, lineCap: 'round', lineJoin: 'round' };
  var MANIPULATOR_RADIUS = 40;

  /**
   * Creates a screen icon, all of which have the same rectangular background.
   * This was factored out because at various times one or more screen icons were created programmatically.
   *
   * @param {Node} contentNode the node to be placed on a background
   * @param {Object} [options]
   * @returns {Node}
   */
  var createScreenIcon = function( contentNode, options ) {

    options = _.extend( {
      size: Screen.HOME_SCREEN_ICON_SIZE,
      xScaleFactor: 0.85,
      yScaleFactor: 0.85
    }, options );

    var background = new Rectangle( 0, 0, options.size.width, options.size.height, { fill: GLColors.CONTROL_PANEL_BACKGROUND } );

    contentNode.setScaleMagnitude( Math.min( options.xScaleFactor * background.width / contentNode.width, options.yScaleFactor * background.height / contentNode.height ) );
    contentNode.center = background.center;

    return new Node( { children: [ background, contentNode ], pickable: false } );
  };

  return {

     // Creates the icon for the 'Slope' screen. Positions and sizes are 'eye balled'.
    createSlopeScreenIcon: function() {
      var lineNode = new ArrowNode( 0.25 * SCREEN_ICON_BASE_SIZE.width, SCREEN_ICON_BASE_SIZE.height, 0.75 * SCREEN_ICON_BASE_SIZE.width, 0, ARROW_OPTIONS );
      var riseNode = new DimensionalArrowNode( 0, 0.65 * SCREEN_ICON_BASE_SIZE.height, 0, 0, DIMENSIONAL_ARROW_OPTIONS );
      var runNode = new DimensionalArrowNode( 0, 0, 0.36 * SCREEN_ICON_BASE_SIZE.width, 0, DIMENSIONAL_ARROW_OPTIONS );
      var contentNode = new Node( { children: [ lineNode, riseNode, runNode ] } );
      riseNode.centerX = lineNode.left + 10;
      riseNode.bottom = lineNode.bottom - ( 0.2 * lineNode.height );
      runNode.left = riseNode.centerX;
      runNode.centerY = riseNode.top - 5;
      return createScreenIcon( contentNode, { xScaleFactor: 1, yScaleFactor: 1 } );
    },

    // Creates the icon for the 'Slope-Intercept' screen. Positions and sizes are 'eye balled'.
    createSlopeInterceptScreenIcon: function() {
      var lineNode = new ArrowNode( 0.1 * SCREEN_ICON_BASE_SIZE.width, SCREEN_ICON_BASE_SIZE.height, 0.9 * SCREEN_ICON_BASE_SIZE.width, 0, ARROW_OPTIONS );
      var axisNode = new scenery.Line( 0, -0.05 * SCREEN_ICON_BASE_SIZE.height, 0, 1.05 * SCREEN_ICON_BASE_SIZE.height, { stroke: 'rgb(134,134,134)', lineWidth: 10 } );
      var riseNode = new DimensionalArrowNode( 0, 0.5 * SCREEN_ICON_BASE_SIZE.height, 0, 0, DIMENSIONAL_ARROW_OPTIONS );
      var runNode = new DimensionalArrowNode( 0, 0, 0.45 * SCREEN_ICON_BASE_SIZE.width, 0, DIMENSIONAL_ARROW_OPTIONS );
      var interceptNode = new Manipulator( MANIPULATOR_RADIUS, GLColors.INTERCEPT );
      var contentNode = new Node( { children: [ axisNode, lineNode, riseNode, runNode, interceptNode ] } );
      axisNode.centerX = 0.35 * SCREEN_ICON_BASE_SIZE.width;
      riseNode.centerX = axisNode.left - 60;
      riseNode.bottom = lineNode.bottom - ( 0.3 * lineNode.height );
      runNode.left = riseNode.centerX;
      runNode.centerY = riseNode.top - 5;
      interceptNode.centerX = 0.35 * SCREEN_ICON_BASE_SIZE.width;
      interceptNode.centerY = 0.68 * SCREEN_ICON_BASE_SIZE.height;
      return createScreenIcon( contentNode, { xScaleFactor: 1, yScaleFactor: 1 } );
    },

    // Creates the icon for the 'Point-Slope' screen. Positions and sizes are 'eye balled'.
    createPointSlopeScreenIcon: function() {
      var lineNode = new ArrowNode( 0, 0.75 * SCREEN_ICON_BASE_SIZE.height, SCREEN_ICON_BASE_SIZE.width, 0.25 * SCREEN_ICON_BASE_SIZE.height, ARROW_OPTIONS );
      var riseNode = new DimensionalArrowNode( 0, 0.37 * SCREEN_ICON_BASE_SIZE.height, 0, 0, DIMENSIONAL_ARROW_OPTIONS );
      var runNode = new DimensionalArrowNode( 0, 0, 0.54 * SCREEN_ICON_BASE_SIZE.width, 0, DIMENSIONAL_ARROW_OPTIONS );
      var pointNode = new Manipulator( MANIPULATOR_RADIUS, GLColors.INTERCEPT, { pickable: false } );
      var slopeNode = new Manipulator( MANIPULATOR_RADIUS, GLColors.SLOPE, { pickable: false } );
      var contentNode = new Node( { children: [ lineNode, riseNode, runNode, pointNode, slopeNode ] } );
      riseNode.centerX = 0.2 * SCREEN_ICON_BASE_SIZE.width;
      riseNode.bottom = lineNode.bottom - ( 0.4 * lineNode.height );
      runNode.left = riseNode.centerX;
      runNode.centerY = riseNode.top - 5;
      pointNode.centerX = 0.32 * SCREEN_ICON_BASE_SIZE.width;
      pointNode.centerY = 0.58 * SCREEN_ICON_BASE_SIZE.height;
      slopeNode.centerX = 0.75 * SCREEN_ICON_BASE_SIZE.width;
      slopeNode.centerY = 0.36 * SCREEN_ICON_BASE_SIZE.height;
      return createScreenIcon( contentNode, { xScaleFactor: 1, yScaleFactor: 1 } );
    },

    // Creates the icon for the 'Line Game' screen
    createGameScreenIcon: function() {
      var faceNode = new FaceWithPointsNode( {
        faceDiameter: 75,
        pointsFont: new GLFont( { size: 24, weight: 'bold' } ),
        pointsAlignment: 'rightCenter',
        points: 2
      } );
      return createScreenIcon( faceNode, { xScaleFactor: 0.65 } );
    },

    // Creates an icon for the slope-tool feature
    createSlopeToolIcon: function( width ) {

      var parentNode = new Node();

      // slope tool
      var slopeToolNode = new SlopeToolNode( new Property( Line.createSlopeIntercept( 1, 2, 0 ) ),
        ModelViewTransform2.createOffsetXYScaleMapping( Vector2.ZERO, 26, -26 ) );
      parentNode.addChild( slopeToolNode );

      // dashed line where the line would be, tweaked visually
      var lineNode = new Path( Shape.lineSegment( slopeToolNode.left + ( 0.4 * slopeToolNode.width ), slopeToolNode.bottom,
          slopeToolNode.right, slopeToolNode.top + ( 0.5 * slopeToolNode.height ) ),
        { lineWidth: 1,
          lineDash: [ 6, 6 ],
          stroke: 'black'
        } );
      parentNode.addChild( lineNode );

      parentNode.scale( width / parentNode.width );
      return parentNode;
    },

    // Creates an icon that shows a line on a graph.
    createGraphIcon: function( width, color, x1, y1, x2, y2 ) {
      var axisRange = new Range( -3, 3 );
      var graph = new Graph( axisRange, axisRange );
      var modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( new Vector2( 0, 0 ), 15, -15 );
      var graphNode = new GraphNode( graph, modelViewTransform );
      var p1 = modelViewTransform.modelToViewXY( x1, y1 );
      var p2 = modelViewTransform.modelToViewXY( x2, y2 );
      graphNode.addChild( new Path( Shape.lineSegment( p1.x, p1.y, p2.x, p2.y ), {
        stroke: color, lineWidth: 5
      } ) );
      graphNode.scale( width / graphNode.width );
      return graphNode;
    }
  };
} );