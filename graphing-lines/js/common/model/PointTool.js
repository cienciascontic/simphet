// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of the point tool. Highlights when it is placed on one of the lines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Vector2} location initial location of the tool
   * @param {String} orientation direction that the tip points, either 'up' or 'down'
   * @param {ObservableArray<Line>} lines Lines that the tool might intersect, provided in the order that they would be rendered
   * @param {Bounds2} dragBounds tool can be dragged within these bounds
   * @constructor
   */
  function PointTool( location, orientation, lines, dragBounds ) {

    assert && assert( orientation === 'up' || orientation === 'down' );

    var thisTool = this;
    PropertySet.call( thisTool, {
      location: location,
      onLine: null // line that the tool is on, null if it's not on a line
    } );

    thisTool.orientation = orientation;
    thisTool.dragBounds = dragBounds;

    // Update when the point tool moves or the lines change.
    Property.multilink( [ thisTool.locationProperty, lines.lengthProperty ],
      function() {
        var line;
        // Lines are in rendering order, reverse iterate so we get the one that's on top.
        for ( var i = lines.length - 1; i >= 0; i-- ) {
          line = lines.get( i );
          if ( thisTool.isOnLine( line ) ) {
            thisTool.onLine = line;
            return;
          }
        }
        thisTool.onLine = null;
      }
    );
  }

  return inherit( PropertySet, PointTool, {

    /**
     * Determines if the point tool is on the specified line.
     * @param {Line} line
     * @returns {boolean}
     */
    isOnLine: function( line ) {
      return ( line.run === 0 && this.location.x === line.x1 ) || // slope is undefined, tool is on the line
             ( this.location.y === line.solveY( this.location.x ) ); // tool is on the line
    }
  } );
} );

