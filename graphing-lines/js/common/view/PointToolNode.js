// Copyright 2002-2014, University of Colorado Boulder

/**
 * Tool that displays the (x,y) coordinates of a grid-point on the graph.
 * Origin is at the tip of the tool (bottom center.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var pointUnknownString = require( 'string!GRAPHING_LINES/point.unknown' );
  var pointXYString = require( 'string!GRAPHING_LINES/point.xy' );

  // images
  var bodyImage = require( 'image!GRAPHING_LINES/point_tool_body.png' );
  var tipImage = require( 'image!GRAPHING_LINES/point_tool_tip.png' );

  // constants
  var NUMBER_OF_DECIMAL_PLACES = 0;
  var VALUE_WINDOW_CENTER_X = 44; // center of the value window relative to the left edge of point_tool_body.png

  /**
   * Drag handler for the pointer tool.
   * @param {PointTool} pointTool
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Graph} graph
   * @constructor
   */
  function PointToolDragHandler( pointTool, modelViewTransform, graph ) {

    var startOffset; // where the drag started, relative to the tool's origin, in parent view coordinates

    var constrainBounds = function( point, bounds ) {
      if ( !bounds || bounds.containsPoint( point ) ) {
        return point;
      }
      else {
        return new Vector2( Util.clamp( point.x, bounds.minX, bounds.maxX ), Util.clamp( point.y, bounds.minY, bounds.maxY ) );
      }
    };

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      // note where the drag started
      start: function( event ) {
        // Note the mouse-click offset when dragging starts.
        var location = modelViewTransform.modelToViewPosition( pointTool.location );
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
        // Move the tool that we're dragging to the foreground.
        event.currentTarget.moveToFront();
      },

      drag: function( event ) {
        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var location = modelViewTransform.viewToModelPosition( parentPoint );
        location = constrainBounds( location, pointTool.dragBounds );
        if ( graph.contains( location ) ) {
          // snap to the graph's grid
          location = new Vector2( Util.toFixedNumber( location.x, 0 ), Util.toFixedNumber( location.y, 0 ) );
        }
        pointTool.location = location;
      }
    } );
  }

  inherit( SimpleDragHandler, PointToolDragHandler );

  /**
   * @param {PointTool} pointTool
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Graph} graph
   * @param {Property<Boolean>} linesVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function PointToolNode( pointTool, modelViewTransform, graph, linesVisibleProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      backgroundNormalColor: 'white',
      foregroundNormalColor: 'black',
      foregroundHighlightColor: 'white'
    }, options );

    var thisNode = this;

    thisNode.bodyNode = new Image( bodyImage ); // @private body of the tool

    /*
     * @private
     * Pointy tip, separate from the body and not pickable.
     * Because picking bounds are rectangular, making the tip pickable made it difficult
     * to pick a line manipulator when the tip and manipulator were on the same grid point.
     * Making the tip non-pickable was determined to be an acceptable and 'natural feeling' solution.
     */
    thisNode.tipNode = new Image( tipImage, { pickable: false } );

    // @private background behind the displayed value, shows through a transparent hole in the display area portion of the body image
    var BACKGROUND_MARGIN = 5;
    thisNode.backgroundNode = new Rectangle( 0, 0,
        thisNode.bodyNode.width - ( 2 * BACKGROUND_MARGIN ), thisNode.bodyNode.height - ( 2 * BACKGROUND_MARGIN ),
      { pickable: false } );

    // displayed value
    thisNode.valueNode = new Text( '?', { font: new GLFont( { size: 15, weight: 'bold' } ), pickable: false } );

    // orientation
    if ( pointTool.orientation === 'down' ) {
      thisNode.tipNode.centerX = 0;
      thisNode.tipNode.bottom = 0;
      thisNode.bodyNode.left = thisNode.tipNode.left - ( 0.1 * thisNode.bodyNode.width );
      thisNode.bodyNode.bottom = thisNode.tipNode.top;
      thisNode.backgroundNode.centerX = thisNode.bodyNode.centerX;
      thisNode.backgroundNode.top = thisNode.bodyNode.top + BACKGROUND_MARGIN;
      thisNode.valueNode.centerY = thisNode.backgroundNode.centerY;
    }
    else if ( pointTool.orientation === 'up' ) {
      thisNode.tipNode.setScaleMagnitude( 1, -1 ); // reflect around x-axis, so that lighting will be correct
      thisNode.tipNode.centerX = 0;
      thisNode.tipNode.top = 0;
      thisNode.bodyNode.left = thisNode.tipNode.left - ( 0.1 * thisNode.bodyNode.width );
      thisNode.bodyNode.top = thisNode.tipNode.bottom;
      thisNode.backgroundNode.centerX = thisNode.bodyNode.centerX;
      thisNode.backgroundNode.top = thisNode.bodyNode.top + BACKGROUND_MARGIN;
      thisNode.valueNode.centerY = thisNode.backgroundNode.centerY;
    }
    else {
      throw new Error( 'unsupported point tool orientation: ' + pointTool.orientation );
    }

    options.children = [
      this.backgroundNode,
      this.bodyNode,
      this.tipNode,
      this.valueNode
    ];
    Node.call( thisNode, options );

    // initial state
    this.setCoordinatesVector2( pointTool.location );
    this.setBackground( options.backgroundNormalColor );

    // location and display
    Property.multilink( [ pointTool.locationProperty, pointTool.onLineProperty, linesVisibleProperty ],
      function() {

        // move to location
        var location = pointTool.location;
        thisNode.translation = modelViewTransform.modelToViewPosition( location );

        // display value and highlighting
        if ( graph.contains( location ) ) {
          thisNode.setCoordinatesVector2( location );
          if ( linesVisibleProperty.get() ) {
            // use the line's color to highlight
            thisNode.setForeground( !pointTool.onLine ? options.foregroundNormalColor : options.foregroundHighlightColor );
            thisNode.setBackground( !pointTool.onLine ? options.backgroundNormalColor : pointTool.onLine.color );
          }
          else {
            thisNode.setForeground( options.foregroundNormalColor );
            thisNode.setBackground( options.backgroundNormalColor );
          }
        }
        else {
          thisNode.setCoordinatesString( pointUnknownString );
          thisNode.setForeground( options.foregroundNormalColor );
          thisNode.setBackground( options.backgroundNormalColor );
        }
      } );

    // interactivity
    thisNode.addInputListener( new PointToolDragHandler( pointTool, modelViewTransform, graph ) );
  }

  return inherit( Node, PointToolNode, {

    // @private Sets the displayed value to a point
    setCoordinatesVector2: function( p ) {
      this.setCoordinatesString( StringUtils.format( pointXYString, Util.toFixed( p.x, NUMBER_OF_DECIMAL_PLACES ), Util.toFixed( p.y, NUMBER_OF_DECIMAL_PLACES ) ) );
    },

    // @private Sets the displayed value to an arbitrary string
    setCoordinatesString: function( s ) {
      this.valueNode.text = s;
      this.valueNode.centerX = this.bodyNode.left + VALUE_WINDOW_CENTER_X;  // centered
    },

    // @private Sets the foreground, the color of the displayed value
    setForeground: function( color ) {
      this.valueNode.fill = color;
    },

    // @private Sets the background, the color of the display area behind the value
    setBackground: function( color ) {
      this.backgroundNode.fill = color;
    }
  } );
} );