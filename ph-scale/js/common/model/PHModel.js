// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is the core model of pH Scale. All fundamental computations are encapsulated here.
 * Throughout this model, a null pH value means 'no value'.
 * This is the case when the solution volume is zero (beaker is empty).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Util = require( 'DOT/Util' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23; // number of molecules in one mole of solution

  function PHModel() {}

  /**
   * General algorithm for pH.
   *
   * @param {number} solutePH
   * @param {number} soluteVolume liters
   * @param {number} waterVolume liters
   * @return {number|null} pH, null if total volume is zero
   */
  PHModel.computePH = function( solutePH, soluteVolume, waterVolume ) {
    var pH;
    var totalVolume = soluteVolume + waterVolume;
    if ( totalVolume === 0 ) {
      pH = null;
    }
    else if ( solutePH < 7 ) {
      pH = -Util.log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -Water.pH ) * waterVolume ) / totalVolume );
    }
    else {
      pH = 14 + Util.log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, Water.pH - 14 ) * waterVolume ) / totalVolume );
    }
    return pH;
  };

  /**
   * Compute pH from H3O+ concentration.
   *
   * @param {number} concentration
   * @returns {number} pH, null if concentration is zero
   */
  PHModel.concentrationH3OToPH = function( concentration ) {
    return ( concentration === 0 ) ? null : -Util.log10( concentration );
  };

  /**
   * Compute pH from OH- concentration.
   *
   * @param {number} concentration
   * @returns {number} pH, null if concentration is zero
   */
  PHModel.concentrationOHToPH = function( concentration ) {
    return ( concentration === 0 ) ? null : 14 - PHModel.concentrationH3OToPH( concentration );
  };

  /**
   * Compute pH from moles of H3O+.
   *
   * @param {number} moles
   * @param {number} volume volume of the solution in liters
   * @returns {number} pH, null if moles or volume is zero
   */
  PHModel.molesH3OToPH = function( moles, volume ) {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationH3OToPH( moles / volume );
  };

  /**
   * Compute pH from moles of OH-.
   *
   * @param {number} moles
   * @param {number} volume volume of the solution in liters
   * @returns {number} pH, null if moles or volume is zero
   */
  PHModel.molesOHToPH = function( moles, volume ) {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationOHToPH( moles / volume );
  };

  /**
   * Computes concentration of H3O+ from pH.
   *
   * @param {number} pH null mean 'no value'
   * @returns {number} concentration in moles/L
   */
  PHModel.pHToConcentrationH3O = function( pH ) {
    return ( pH === null ) ? 0 : Math.pow( 10, -pH );
  };

  /**
   * Computes concentration of OH- from pH.
   *
   * @param {number} pH null means 'no value'
   * @returns {number} concentration in moles/L
   */
  PHModel.pHToConcentrationOH = function( pH ) {
    return ( pH === null ) ? 0 : PHModel.pHToConcentrationH3O( 14 - pH );
  };

  /**
   * Computes the number of molecules in solution.
   *
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   */
  PHModel.computeMolecules = function( concentration, volume ) {
    return concentration * volume * AVOGADROS_NUMBER;
  };

  /**
   * Computes moles in solution.
   *
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   */
  PHModel.computeMoles = function( concentration, volume ) {
    return concentration * volume;
  };

  return PHModel;
} );