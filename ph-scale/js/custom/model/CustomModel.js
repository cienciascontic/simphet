// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Custom' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Vector2 = require( 'DOT/Vector2' );

  function CustomModel() {

    var thisModel = this;

    // Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    thisModel.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

    // Solution in the beaker
    thisModel.solution = new Solution( new Property( Solute.createCustom( 7 ) ), 0.5, 0, thisModel.beaker.volume );
  }

  return inherit( Object, CustomModel, {

    reset: function() {
      this.beaker.reset();
      this.solution.reset();
    }
  } );
} );
