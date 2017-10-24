// Copyright 2002-2013, University of Colorado Boulder

/**
 * Range for a color, with interpolation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Color} min
   * @param {Color} max
   * @constructor
   */
  function ColorRange( min, max ) {
    this.min = min;
    this.max = max;
  }

  return inherit( Object, ColorRange, {

    /**
     * Performs a linear interpolation between min and max colors in RGBA colorspace.
     *
     * @param {Number} distance 0-1 (0=min, 1=max)
     * @return {Color}
     */
    interpolateLinear: function( distance ) {
      assert && assert( distance >= 0 && distance <= 1 );
      return Color.interpolateRBGA( this.min, this.max, distance );
    }
  } );
} );