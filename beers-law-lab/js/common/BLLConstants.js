// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );

  return {
    SCREEN_VIEW_OPTIONS: { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1100, 700 ) }
  };
} );
