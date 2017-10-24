// Copyright 2002-2013, University of Colorado Boulder

/**
 * Ruler model, to take advantage of location reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );

  /**
   * @param {Number} length cm
   * @param {Number} insets cm, the horizontal insets at the ends of the ruler
   * @param {Number} height cm
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @constructor
   */
  function Ruler( length, insets, height, location, dragBounds ) {

    Movable.call( this, location, dragBounds );

    this.length = length;
    this.insets = insets;
    this.height = height;
  }

  return inherit( Movable, Ruler );
} );