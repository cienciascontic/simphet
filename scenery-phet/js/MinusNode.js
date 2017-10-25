// Copyright 2002-2013, University of Colorado Boulder

/**
 * Minus sign, created using scenery.Rectangle because scenery.Text("-") looks awful
 * on Windows and cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ){
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Dimension2} size
   * @param options
   * @constructor
   */
  function MinusNode( options ) {

    options = _.extend( {
      size: new Dimension2( 20, 5 ),
      fill: 'black'
    }, options );

    assert && assert( options.size.width >= options.size.height );

    Rectangle.call( this, 0, 0, options.size.width, options.size.height, options );
  }

  return inherit( Rectangle, MinusNode );
});