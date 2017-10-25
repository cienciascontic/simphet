// Copyright 2002-2013, University of Colorado Boulder

/**
 * Type for game problems where the user is presented with a set of particle
 * counts for an atom and must determine the total charge and enter it in an
 * interactive element symbol.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var BAAGameProblem = require( 'BUILD_AN_ATOM/game/model/BAAGameProblem' );
  var CountsToSymbolProblemView = require( 'BUILD_AN_ATOM/game/view/CountsToSymbolProblemView' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Main constructor function.
   *
   * @constructor
   */
  function CountsToSymbolProblem( buildAnAtomGameModel, answerAtom, configurableProtonCount, configurableMassNumber, configurableCharge ) {
    BAAGameProblem.call( this, buildAnAtomGameModel, answerAtom );
    this.configurableProtonCount = configurableProtonCount;
    this.configurableMassNumber = configurableMassNumber;
    this.configurableCharge = configurableCharge;
  }

  // Inherit from base class and define the methods for this object.
  return inherit( BAAGameProblem, CountsToSymbolProblem, {

    // Create the view needed to visual represent this problem.
    createView: function( layoutBounds ) {
      return new CountsToSymbolProblemView( this, layoutBounds );
    }
  } );
} );
