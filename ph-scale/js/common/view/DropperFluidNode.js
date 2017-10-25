// Copyright 2002-2013, University of Colorado Boulder

/**
 * Fluid (stock solution) coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {number} tipWidth
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DropperFluidNode( dropper, beaker, tipWidth, modelViewTransform ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and location
    var updateShapeAndLocation = function() {
      // path
      if ( dropper.flowRateProperty.get() > 0 ) {
        thisNode.setRect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.locationProperty.get().y );
      }
      else {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's location
      thisNode.translation = modelViewTransform.modelToViewPosition( dropper.locationProperty.get() );
    };
    dropper.locationProperty.link( updateShapeAndLocation );
    dropper.flowRateProperty.link( updateShapeAndLocation );

    // set color to match solute
    dropper.soluteProperty.link( function( solute ) {
      thisNode.fill = solute.stockColor;
      thisNode.stroke = solute.stockColor.darkerColor();
    } );

    // hide this node when the dropper is invisible
    dropper.visibleProperty.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  return inherit( Rectangle, DropperFluidNode );
} );