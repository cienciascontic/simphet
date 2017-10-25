// Copyright 2002-2014, University of Colorado Boulder

/**
 * Manipulator for changing a line's (x2,y2) point.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/Manipulator' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Drag handler for (x2,y2) manipulator.
   * @param {Property<Line>} lineProperty
   * @param {Property<Range>} x2RangeProperty
   * @param {Property<Range>} y2RangeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function X2Y2DragHandler( lineProperty, x2RangeProperty, y2RangeProperty, modelViewTransform ) {

    var startOffset; // where the drag started, relative to (x2,y2), in parent view coordinates

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      // note where the drag started
      start: function( event ) {
        var line = lineProperty.get();
        var location = modelViewTransform.modelToViewXY( line.x2, line.y2 );
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
      },

      drag: function( event ) {

        var line = lineProperty.get();
        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var location = modelViewTransform.viewToModelPosition( parentPoint );

        // constrain to range, snap to grid
        var x2 = Math.round( Util.clamp( location.x, x2RangeProperty.get().min, x2RangeProperty.get().max ) );
        var y2 = Math.round( Util.clamp( location.y, y2RangeProperty.get().min, y2RangeProperty.get().max ) );

        if ( x2 !== line.x1 || y2 !== line.y1 ) {
          // Don't allow points to be the same, this would result in slope=0/0 (undefined line.)
          // Keep (x1,y1) constant, change (x2,y2) and slope.
          lineProperty.set( new Line( line.x1, line.y1, x2, y2, line.color ) );
        }
      }
    } );
  }

  inherit( SimpleDragHandler, X2Y2DragHandler );

  /**
   * @param {Number} radius
   * @param {Property<Line>} lineProperty
   * @param {Property<Range>} x2RangeProperty
   * @param {Property<Range>} y2RangeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function X2Y2Manipulator( radius, lineProperty, x2RangeProperty, y2RangeProperty, modelViewTransform ) {

    var thisNode = this;
    Manipulator.call( thisNode, radius, GLColors.POINT_X2_Y2, { haloAlpha: GLColors.HALO_ALPHA.x2y2 } );

    // move the manipulator to match the line's (x2,y2) point
    lineProperty.link( function( line ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( new Vector2( line.x2, line.y2 ) );
    } );

    thisNode.addInputListener( new X2Y2DragHandler( lineProperty, x2RangeProperty, y2RangeProperty, modelViewTransform ) );
  }

  return inherit( Manipulator, X2Y2Manipulator );
} );
