//  Copyright 2002-2014, University of Colorado Boulder

/**
 * IntroNavigationBarIcon - for navbar and homepage icons
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShapeNode = require( 'FRACTION_MATCHER/shapes/ShapeNode' );
  var Constants = require( 'FRACTION_MATCHER/model/Constants' );

  /**
   * @constructor
   */
  function IntroNavigationBarIcon() {
    Rectangle.call( this, 0, 0, 548, 373, {fill: 'black'} );

    var shapeNode = ShapeNode.create( {
      x: 0,
      y: 0,
      type: 'PIES',
      numerator: 1,
      denominator: 2,
      value: 0.5,
      fill: new Constants().COLORS.LIGHT_BLUE,
      width: 180,
      height: 180
    } );

    this.addChild( shapeNode.mutate( {scale: 1.6, center: this.center} ) );
  }

  return inherit( Rectangle, IntroNavigationBarIcon );
} );