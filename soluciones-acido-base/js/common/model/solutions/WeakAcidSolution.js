// Copyright 2002-2014, University of Colorado Boulder

/**
 *  An aqueous solution whose solute is a weak acid.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSConstants = require( 'ACID_BASE_SOLUTIONS/common/ABSConstants' );
  var AqueousSolution = require( 'ACID_BASE_SOLUTIONS/common/model/solutions/AqueousSolution' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SolutionType = require( 'ACID_BASE_SOLUTIONS/common/enum/SolutionType' );

  function WeakAcidSolution() {
    AqueousSolution.call( this,
      SolutionType.WEAK_ACID, ABSConstants.WEAK_STRENGTH_RANGE.defaultValue, ABSConstants.CONCENTRATION_RANGE.defaultValue,
      [
        // molecules found in this solution
        { key: 'HA', concentrationFunctionName: 'getSoluteConcentration' },
        { key: 'H2O', concentrationFunctionName: 'getH2OConcentration' },
        { key: 'A', concentrationFunctionName: 'getProductConcentration' },
        { key: 'H3O', concentrationFunctionName: 'getH3OConcentration' }
      ] );
  }

  return inherit( AqueousSolution, WeakAcidSolution, {

    //@override [HA] = c - [H3O+]
    getSoluteConcentration: function() {
      return ( this.getConcentration() - this.getH3OConcentration() );
    },

    //@override [A-] = [H3O+]
    getProductConcentration: function() {
      return this.getH3OConcentration();
    },

    //@override [H3O+] = ( -Ka + sqrt( Ka*Ka + 4*Ka*c ) ) / 2
    getH3OConcentration: function() {
      var Ka = this.getStrength();
      var c = this.getConcentration();
      return ( -Ka + Math.sqrt( ( Ka * Ka ) + ( 4 * Ka * c ) ) ) / 2;
    },

    //@override [OH-] = Kw / [H3O+]
    getOHConcentration: function() {
      return ABSConstants.WATER_EQUILIBRIUM_CONSTANT / this.getH3OConcentration();
    },

    //@override [H2O] = W - [A-]
    getH2OConcentration: function() {
      return ( ABSConstants.WATER_CONCENTRATION - this.getProductConcentration() );
    },

    //@override @protected Is strength in the weak range?
    isValidStrength: function( strength ) {
      return ABSConstants.WEAK_STRENGTH_RANGE.contains( strength );
    }
  } );
} );
