// Copyright 2002-2013, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function GradientBackgroundNode( x, y, width, height, color1, color2, y1, y2 ) {
    var centerX = x + width / 2;
    var gradient = new LinearGradient( centerX, y1, centerX, y2 );
    gradient.addColorStop( 0, color1 );
    gradient.addColorStop( 1, color2 );
    Rectangle.call( this, x, y, width, height, 0, 0, { fill: gradient } );
  }

  return inherit( Rectangle, GradientBackgroundNode );
} );