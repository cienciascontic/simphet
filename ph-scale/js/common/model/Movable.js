// Copyright 2002-2013, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds optional, undefined if not provided
   * @constructor
   */
  function Movable( location, dragBounds ) {
    this.locationProperty = new Property( location );
    this.dragBounds = dragBounds;
  }

  return inherit( Object, Movable, {
    reset: function() {
      this.locationProperty.reset();
    }
  } );
} );
