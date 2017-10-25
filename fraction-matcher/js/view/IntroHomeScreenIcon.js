//  Copyright 2002-2014, University of Colorado Boulder

/**
 * IntroHomeScreenIcon - for navbar and homepage icons
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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NumericShape = require( 'FRACTION_MATCHER/shapes/NumericShape' );

  /**
   * @constructor
   */
  function IntroHomeScreenIcon() {
    Rectangle.call( this, 0, 0, 548, 373, {fill: '#e7e9cc'} );

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

    var shapeNode2 = new NumericShape( {
      x: 0,
      y: 0,
      type: 'NUMERIC',
      numerator: 1,
      denominator: 2,
      scaleFactor: 1,
      value: 0.5,
      toSimplify: true,
      width: 180,
      height: 180
    } ).mutate( {scale: 2.8} );

    this.addChild( new HBox( {
      spacing: 20,
      children: [
        shapeNode,
        new Text( '=', {fill: 'black', font: new PhetFont( 160 )} ),
        shapeNode2
      ],
      center: this.center
    } ) );
  }

  return inherit( Rectangle, IntroHomeScreenIcon );
} );