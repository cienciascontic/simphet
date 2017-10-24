// Copyright 2002-2014, University of Colorado Boulder

/**
 * A term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );

  /**
   * @param {number} balancedCoefficient balanced coefficient for molecule
   * @param {Molecule} molecule
   * @param {Object} [options]
   * @constructor
   */
  function EquationTerm( balancedCoefficient, molecule, options ) {

    options = _.extend( {
      initialCoefficient: 0 // initial value of the coefficient
    }, options );

    // If we're inspecting all game challenges, fill in the correct answer to make our job easier.
    if ( BCEQueryParameters.PLAY_ALL ) {
      options.initialCoefficient = balancedCoefficient;
    }

    this.molecule = molecule;
    this.balancedCoefficient = balancedCoefficient;

    PropertySet.call( this, {
      userCoefficient: options.initialCoefficient
    } );
  }

  return inherit( PropertySet, EquationTerm );
} );