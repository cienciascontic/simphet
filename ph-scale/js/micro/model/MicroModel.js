// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Micro' screen.
 * This is essentially the 'Macro' model with a different user-interface on it.
 * The 'Macro' model also has a pHMeter model element, which we'll simply ignore.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MacroModel = require( 'PH_SCALE/macro/model/MacroModel' );

  function MicroModel() {

    MacroModel.call( this );

    // adjust the drag bounds of the dropper to account for different user-interface constraints
    var yDropper = this.dropper.locationProperty.get().y;
    this.dropper.dragBounds = new Bounds2( this.beaker.left + 120, yDropper, this.beaker.right - 170, yDropper );
  }

  return inherit( MacroModel, MicroModel );
} );
