// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that can be used to represent the sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var GradientBackgroundNode = require( 'SCENERY_PHET/GradientBackgroundNode' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @param x
   * @param y
   * @param width
   * @param height
   * @param gradientEndHeight
   * @param options
   * @constructor
   */
  function SkyNode( x, y, width, height, gradientEndHeight, options ) {
    options = _.extend(
      {
        topColor: new Color( 1, 172, 228 ),
        bottomColor: new Color( 208, 236, 251 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.bottomColor, options.topColor, gradientEndHeight, y );
  }

  return inherit( GradientBackgroundNode, SkyNode );
} );

