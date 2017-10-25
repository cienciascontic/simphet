// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor
   * @param {Vector2} location bottom center
   * @param {Dimension2} size
   * @param {Object} [options]
   * @constructor
   */
  function Beaker( location, size, options ) {

    options = _.extend( {
      volume: 1.2 // L
    }, options );

    this.location = location;
    this.size = size;
    this.volume = options.volume;

    // convenience properties
    this.left = location.x - ( size.width / 2 );
    this.right = location.x + ( size.width / 2 );
    this.bounds = new Bounds2( this.left, location.y - size.height, this.right, location.y );
  }

  return inherit( Object, Beaker, {
    reset: function() { /* currently nothing to reset */ }
  } );
} );