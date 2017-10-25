// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  //strings
  var pattern_0value_1units = require( 'string!PH_SCALE/pattern.0value.1units' );
  var units_litersString = require( 'string!PH_SCALE/units.liters' );

  // constants
  var RIM_OFFSET = 20;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
  var MAJOR_TICK_LENGTH = 30;
  var MINOR_TICK_LENGTH = 15;
  var TICK_LABEL_X_SPACING = 8;
  var MAJOR_TICK_LABELS = [ '\u00bd', '1' ]; // 1/2, 1
  var MAJOR_TICK_FONT = new PhetFont( 24 );

  /**
   * Constructor
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    // outline of the beaker, starting from upper left
    var beakerWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    var beakerHeight = modelViewTransform.modelToViewDeltaY( beaker.size.height );
    var outlineShape = new Shape()
      .moveTo( -(beakerWidth / 2 ) - RIM_OFFSET, -beakerHeight - RIM_OFFSET )
      .lineTo( -(beakerWidth / 2), -beakerHeight )
      .lineTo( -(beakerWidth / 2), 0 )
      .lineTo( beakerWidth / 2, 0 )
      .lineTo( beakerWidth / 2, -beakerHeight )
      .lineTo( (beakerWidth / 2) + RIM_OFFSET, -beakerHeight - RIM_OFFSET );
    thisNode.addChild( new Path( outlineShape,
      {
        stroke: 'black',
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
      } ) );

    // horizontal tick marks on left and right edges, labels on right ticks, from bottom up
    var ticksParent = new Node();
    thisNode.addChild( ticksParent );
    var numberOfTicks = Math.round( beaker.volume / MINOR_TICK_SPACING );
    var deltaY = beakerHeight / numberOfTicks;
    var beakerLeft = -beakerWidth / 2;
    var beakerRight = beakerWidth / 2;
    for ( var i = 1; i <= numberOfTicks; i++ ) {

      var isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      var tickLength = ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      var y = -( i * deltaY );

      // left tick
      ticksParent.addChild( new Path(
        new Shape().moveTo( beakerLeft, y ).lineTo( beakerLeft + tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // right tick
      ticksParent.addChild( new Path(
        new Shape().moveTo( beakerRight, y ).lineTo( beakerRight - tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // label on right 'major' tick
      if ( isMajorTick ) {
        var labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_LABELS.length ) {
          var label = StringUtils.format( pattern_0value_1units, MAJOR_TICK_LABELS[labelIndex], units_litersString );
          ticksParent.addChild( new Text( label, {
            font: MAJOR_TICK_FONT,
            fill: 'black',
            right: beakerRight - tickLength - TICK_LABEL_X_SPACING,
            centerY: y
          } ) );
        }
      }
    }

    thisNode.translation = modelViewTransform.modelToViewPosition( beaker.location );
  }

  return inherit( Node, BeakerNode );
} );
