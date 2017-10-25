// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of a problem where the user is presented with a
 * schematic representation of an atom (which looks much like the atoms
 * constructed on the 1st tab) and has to adjust some or all portions of an
 * interactive chemical symbol to match.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var NumberAtom = require( 'BUILD_AN_ATOM/common/model/NumberAtom' );
  var InteractiveSymbolNode = require( 'BUILD_AN_ATOM/game/view/InteractiveSymbolNode' );
  var NonInteractiveSchematicAtomNode = require( 'BUILD_AN_ATOM/game/view/NonInteractiveSchematicAtomNode' );
  var ProblemView = require( 'BUILD_AN_ATOM/game/view/ProblemView' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Main constructor function.
   *
   * @constructor
   */
  function SchematicToSymbolProblemView( toSymbolProblem, layoutBounds ) {

    // Interactive Symbol (must be defined before the call to the super constructor).
    this.interactiveSymbol = new InteractiveSymbolNode( toSymbolProblem.answerAtom,
      {
        interactiveProtonCount: toSymbolProblem.configurableProtonCount,
        interactiveMassNumber: toSymbolProblem.configurableMassNumber,
        interactiveCharge: toSymbolProblem.configurableCharge
      } );

    ProblemView.call( this, toSymbolProblem, layoutBounds ); // Call super constructor.

    // Add the interactive symbol.
    this.interactiveSymbol.scale( 0.75 );
    this.interactiveAnswerNode.addChild( this.interactiveSymbol );

    // Create the model-view transform used by the schematic atom.
    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( layoutBounds.width * 0.275, layoutBounds.height * 0.45 ),
      0.8 );

    // Add the schematic representation of the atom.
    var schematicAtomNode = new NonInteractiveSchematicAtomNode( toSymbolProblem.answerAtom, mvt );
    this.problemPresentationNode.addChild( schematicAtomNode );

    // Layout
    schematicAtomNode.centerX = layoutBounds.width * 0.3;
    schematicAtomNode.centerY = layoutBounds.height * 0.4;
    this.interactiveSymbol.centerX = layoutBounds.width * 0.75;
    this.interactiveSymbol.centerY = layoutBounds.height * 0.45;
  }

  // Inherit from ProblemView.
  return inherit( ProblemView, SchematicToSymbolProblemView,
    {
      checkAnswer: function() {
        var userSubmittedAtom = new NumberAtom(
          {
            protonCount: this.interactiveSymbol.protonCount.value,
            neutronCount: this.interactiveSymbol.massNumber.value - this.interactiveSymbol.protonCount.value,
            electronCount: this.interactiveSymbol.protonCount.value - this.interactiveSymbol.charge.value
          } );
        this.problem.checkAnswer( userSubmittedAtom );
      },

      displayCorrectAnswer: function() {
        this.interactiveSymbol.protonCount.value = this.problem.answerAtom.protonCount;
        this.interactiveSymbol.massNumber.value = this.problem.answerAtom.massNumber;
        this.interactiveSymbol.charge.value = this.problem.answerAtom.charge;
      }
    }
  );
} );
