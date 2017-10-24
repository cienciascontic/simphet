// Copyright 2002-2014, University of Colorado Boulder

/**
 * Defines a simple grid with horizontal and vertical lines, and no enclosing
 * lines on the outer edges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Bounds2} bounds
   * @param {Number} spacing
   * @param {Object} [options]
   * @constructor
   */
  function Grid( bounds, spacing, options ) {
    var gridShape = new Shape();

    // Add the vertical lines
    for ( var i = bounds.minX + spacing; i < bounds.minX + bounds.width; i += spacing ) {
      gridShape.moveTo( i, bounds.minY );
      gridShape.lineTo( i, bounds.minY + bounds.height );
    }

    // Add the horizontal lines
    for ( i = bounds.minY + spacing; i < bounds.minY + bounds.height; i += spacing ) {
      gridShape.moveTo( bounds.minX, i );
      gridShape.lineTo( bounds.minX + bounds.width, i );
    }

    Path.call( this, gridShape, options );
  }

  return inherit( Path, Grid );
} );