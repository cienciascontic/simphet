// Copyright 2002-2014, University of Colorado Boulder

/**
 *  A solution of pure water, contains no solute.
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

  function WaterSolution() {
    AqueousSolution.call( this,
      SolutionType.WATER, 0, 0,
      [
        // molecules found in this solution
        { key: 'H2O', concentrationFunctionName: 'getH2OConcentration' },
        { key: 'H3O', concentrationFunctionName: 'getH3OConcentration' },
        { key: 'OH', concentrationFunctionName: 'getOHConcentration' }
      ] );
  }

  return inherit( AqueousSolution, WaterSolution, {

    //@override
    getSoluteConcentration: function() {
      return 0;
    },

    //@override
    getProductConcentration: function() {
      return 0;
    },

    //@override [H3O] = sqrt(Kw)
    getH3OConcentration: function() {
      return Math.sqrt( ABSConstants.WATER_EQUILIBRIUM_CONSTANT ); // Kw = [H30] * [OH-]
    },

    //@override [OH] = [H3O]
    getOHConcentration: function() {
      return this.getH3OConcentration();
    },

    //@override [H2O] = W
    getH2OConcentration: function() {
      return ABSConstants.WATER_CONCENTRATION;
    },

    //@override @protected Should never be setting the strength of water.
    isValidStrength: function() { return false; }
  } );
} );
