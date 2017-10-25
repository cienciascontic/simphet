// Copyright 2002-2013, University of Colorado Boulder

/**
 * Base type for views of problems where the user is asked to identify the
 * element on the periodic table and then choose whether it is an ion or a
 * neutral atom.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberAtom = require( 'BUILD_AN_ATOM/common/model/NumberAtom' );
  var PeriodicTableNode = require( 'BUILD_AN_ATOM/common/view/PeriodicTableNode' );
  var ProblemView = require( 'BUILD_AN_ATOM/game/view/ProblemView' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Strings
  var findTheElementString = require( 'string!BUILD_AN_ATOM/game.findTheElement' );
  var ionString = require( 'string!BUILD_AN_ATOM/game.ion' );
  var neutralAtomString = require( 'string!BUILD_AN_ATOM/game.neutralAtom' );
  var isItString = require( 'string!BUILD_AN_ATOM/game.isIt' );

  // Constants
  var TITLE_FONT = new PhetFont( 30 );
  var INSET = 10;

  /**
   * Main constructor function.
   *
   * @constructor
   */
  function CountsToElementProblemView( countsToElementProblem, layoutBounds ) {
    ProblemView.call( this, countsToElementProblem, layoutBounds ); // Call super constructor.
    var thisNode = this;

    // Problem title
    var problemTitle = new Text( findTheElementString, { font: TITLE_FONT } );
    this.problemPresentationNode.addChild( problemTitle );

    // Periodic table
    this.periodicTable = new PeriodicTableNode( this.periodicTableAtom, 100 );
    this.periodicTable.scale( 0.85 );
    this.interactiveAnswerNode.addChild( this.periodicTable );

    // Neutral atom versus ion question.
    var neutralVersusIonPrompt = new Text( isItString, { font: new PhetFont( 24 )} );
    var neutralAtomButton = new AquaRadioButton( this.neutralOrIon, 'neutral', new Text( neutralAtomString, {font: new PhetFont( 18 )} ), { radius: 8 } );
    var ionButton = new AquaRadioButton( this.neutralOrIon, 'ion', new Text( ionString, {font: new PhetFont( 18 )} ), { radius: 8 } );
    var neutralAtomVersusIonQuestion = new Node();
    neutralAtomVersusIonQuestion.addChild( neutralVersusIonPrompt );
    neutralAtomButton.left = neutralVersusIonPrompt.right + 10;
    neutralAtomButton.centerY = neutralVersusIonPrompt.centerY;
    neutralAtomVersusIonQuestion.addChild( neutralAtomButton );
    ionButton.left = neutralAtomVersusIonQuestion.right + 10;
    ionButton.centerY = neutralVersusIonPrompt.centerY;
    neutralAtomVersusIonQuestion.addChild( ionButton );
    this.interactiveAnswerNode.addChild( neutralAtomVersusIonQuestion );

    this.periodicTableAtom.protonCountProperty.link( function( protonCount ) {
      // Once the user has selected an element, make the ion question visible.
      neutralAtomVersusIonQuestion.visible = protonCount > 0;
    } );

    // Don't enable the "check answer" button until the user has answered the
    // "neutral vs. ion" question.
    this.neutralOrIon.link( function( neutralOrIon ) {
      thisNode.checkAnswerButton.enabled = neutralOrIon !== 'noSelection';
      thisNode.checkAnswerButton.pickable = neutralOrIon !== 'noSelection';
    } );

    //--------------------------- Layout -------------------------------------

    this.periodicTable.right = layoutBounds.width - INSET;
    this.periodicTable.centerY = layoutBounds.height / 2;

    var maxTitleWidth = this.periodicTable.width * 0.9;
    if ( problemTitle.width > maxTitleWidth ) {
      problemTitle.scale( maxTitleWidth / problemTitle.width );
    }
    problemTitle.centerX = this.periodicTable.centerX;
    problemTitle.bottom = this.periodicTable.top - 30; // Offset empirically determined.

    neutralAtomVersusIonQuestion.centerX = this.periodicTable.centerX;
    neutralAtomVersusIonQuestion.top = this.periodicTable.bottom + 20;

    this.setButtonCenter( this.periodicTable.centerX, neutralAtomVersusIonQuestion.bottom + 40 );
  }

  // Inherit from ProblemView.
  return inherit( ProblemView,
    CountsToElementProblemView,
    {
      periodicTableAtom: new NumberAtom(),
      neutralOrIon: new Property( 'noSelection' ),
      checkAnswer: function() {
        var submittedAtom = new NumberAtom(
          {
            protonCount: this.periodicTableAtom.protonCount,
            neutronCount: this.problem.answerAtom.neutronCount,
            electronCount: this.problem.answerAtom.electronCount
          } );
        this.problem.checkAnswer( submittedAtom, this.neutralOrIon.value );
      },
      clearAnswer: function() {
        this.periodicTableAtom.protonCount = 0;
        this.periodicTableAtom.neutronCount = 0;
        this.periodicTableAtom.electronCount = 0;
        this.neutralOrIon.reset();
      },
      displayCorrectAnswer: function() {
        this.periodicTableAtom.protonCount = this.problem.answerAtom.protonCount;
        this.periodicTableAtom.neutronCount = this.problem.answerAtom.neutronCount;
        this.periodicTableAtom.electronCount = this.problem.answerAtom.electronCount;
        this.neutralOrIon.value = this.problem.answerAtom.charge === 0 ? 'neutral' : 'ion';
      }
    } );
} );
