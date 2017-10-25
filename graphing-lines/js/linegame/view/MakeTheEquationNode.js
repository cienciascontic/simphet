// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for 'Make the Equation' challenges.
 * User manipulates an equation on the right, graph is displayed on the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeNode = require( 'GRAPHING_LINES/linegame/view/ChallengeNode' );
  var ChallengeGraphNode = require( 'GRAPHING_LINES/linegame/view/ChallengeGraphNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationBoxNode = require( 'GRAPHING_LINES/linegame/view/EquationBoxNode' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var GLConstants = require( 'GRAPHING_LINES/common/GLConstants' );
  var GLQueryParameters = require( 'GRAPHING_LINES/common/GLQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineGameConstants = require( 'GRAPHING_LINES/linegame/LineGameConstants' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var PlayState = require( 'GRAPHING_LINES/linegame/model/PlayState' );
  var PointSlopeEquationNode = require( 'GRAPHING_LINES/pointslope/view/PointSlopeEquationNode' );
  var Property = require( 'AXON/Property' );
  var SlopeInterceptEquationNode = require( 'GRAPHING_LINES/slopeintercept/view/SlopeInterceptEquationNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var aCorrectEquationString = require( 'string!GRAPHING_LINES/aCorrectEquation' );
  var yourEquationString = require( 'string!GRAPHING_LINES/yourEquation' );

  /**
   * @param {GraphTheLine} challenge
   * @param {LineGameModel} model
   * @param {Dimension2} challengeSize
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function MakeTheEquationNode( challenge, model, challengeSize, audioPlayer ) {

    var thisNode = this;
    ChallengeNode.call( thisNode, challenge, model, challengeSize, audioPlayer );

    var boxSize = new Dimension2( 0.4 * challengeSize.width, 0.3 * challengeSize.height );

    // title, possibly scaled for i18n
    var titleNode = new Text( challenge.title, { font: LineGameConstants.TITLE_FONT, fill: LineGameConstants.TITLE_COLOR } );
    if ( titleNode.width > boxSize.width ) {
      titleNode.scale = boxSize.width / titleNode.width;
    }

    // Answer
    var answerBoxNode =
      new EquationBoxNode( aCorrectEquationString, challenge.answer.color, boxSize,
        ChallengeNode.createEquationNode( challenge.equationForm, new Property( challenge.answer ), LineGameConstants.STATIC_EQUATION_FONT_SIZE ) );
    answerBoxNode.visible = false;

    // Guess
    var guessBoxNode =
      new EquationBoxNode( yourEquationString, challenge.guess.color, boxSize,
        createInteractiveEquationNode( challenge.equationForm, challenge.manipulationMode, challenge.guessProperty, challenge.graph,
          GLConstants.INTERACTIVE_EQUATION_FONT_SIZE, challenge.guess.color ) );

    // Graph
    var graphNode = new ChallengeGraphNode( challenge, { answerVisible: true } );

    // rendering order
    thisNode.subtypeParent.addChild( titleNode );
    thisNode.subtypeParent.addChild( graphNode );
    thisNode.subtypeParent.addChild( answerBoxNode );
    thisNode.subtypeParent.addChild( guessBoxNode );

    // layout
    {
      // graphNode is positioned automatically based on modelViewTransform's origin offset.

      // left align the title and boxes
      guessBoxNode.centerX = challenge.modelViewTransform.modelToViewX( challenge.graph.xRange.min ) / 2; // centered in space to left of graph
      answerBoxNode.left = guessBoxNode.left;
      titleNode.left = guessBoxNode.left;

      // stack title and boxes vertically, title top-aligned with graph's grid
      var ySpacing = 30;
      titleNode.top = challenge.modelViewTransform.modelToViewY( challenge.graph.yRange.max );
      guessBoxNode.top = titleNode.bottom + ySpacing;
      answerBoxNode.top = guessBoxNode.bottom + ySpacing;

      // face centered below boxes, bottom-aligned with buttons
      thisNode.faceNode.centerX = guessBoxNode.centerX;
      thisNode.faceNode.bottom = thisNode.buttonsParent.bottom;
    }

    // To reduce brain damage during development, show the answer equation in translucent gray.
    if ( GLQueryParameters.DEV ) {
      var devAnswerNode = ChallengeNode.createEquationNode( challenge.equationForm, new Property( challenge.answer ), 14 /* fontSize */ );
      devAnswerNode.left = answerBoxNode.left + 30;
      devAnswerNode.centerY = answerBoxNode.centerY;
      thisNode.addChild( devAnswerNode );
      devAnswerNode.moveToBack();
    }

    // Update visibility of the correct/incorrect icons.
    var updateIcons = function() {
      answerBoxNode.setCorrectIconVisible( model.playState === PlayState.NEXT );
      guessBoxNode.setCorrectIconVisible( model.playState === PlayState.NEXT && challenge.isCorrect() );
      guessBoxNode.setIncorrectIconVisible( model.playState === PlayState.NEXT && !challenge.isCorrect() );
    };

    // sync with guess
    challenge.guessProperty.link( updateIcons.bind( thisNode ) );

    // sync with game state
    model.playStateProperty.link( function( playState ) {

      // states in which the equation is interactive
      guessBoxNode.pickable = ( playState === PlayState.FIRST_CHECK || playState === PlayState.SECOND_CHECK || ( playState === PlayState.NEXT && !challenge.isCorrect() ) );

      // Graph the guess line at the end of the challenge.
      graphNode.setGuessVisible( playState === PlayState.NEXT );

      // show stuff when the user got the challenge wrong
      if ( playState === PlayState.NEXT && !challenge.isCorrect() ) {
        answerBoxNode.setVisible( true );
        graphNode.setAnswerPointVisible( true );
        graphNode.setGuessPointVisible( true );
        graphNode.setSlopeToolVisible( true );
      }

      // visibility of correct/incorrect icons
      updateIcons();
    } );
  }

  /**
   * Creates an interactive equation.
   * @param {EquationForm} equationForm
   * @param {ManipulationMode} manipulationMode
   * @param {Property<Line>} lineProperty
   * @param {Graph} graph
   * @param {Number} fontSize
   * @param {Color|String} staticColor
   */
  var createInteractiveEquationNode = function( equationForm, manipulationMode, lineProperty, graph, fontSize, staticColor ) {
    var interactivePoint, interactiveSlope, interactiveIntercept;
    if ( equationForm === EquationForm.SLOPE_INTERCEPT ) {
      interactiveSlope = ( manipulationMode === ManipulationMode.SLOPE ) || ( manipulationMode === ManipulationMode.SLOPE_INTERCEPT );
      interactiveIntercept = ( manipulationMode === ManipulationMode.INTERCEPT ) || ( manipulationMode === ManipulationMode.SLOPE_INTERCEPT );
      return new SlopeInterceptEquationNode( lineProperty, {
        interactiveSlope: interactiveSlope,
        interactiveIntercept: interactiveIntercept,
        riseRangeProperty: new Property( graph.yRange ),
        runRangeProperty: new Property( graph.xRange ),
        yInterceptRangeProperty: new Property( graph.yRange ),
        fontSize: fontSize,
        staticColor: staticColor } );
    }
    else if ( equationForm === EquationForm.POINT_SLOPE ) {
      interactivePoint = ( manipulationMode === ManipulationMode.POINT ) || ( manipulationMode === ManipulationMode.POINT_SLOPE );
      interactiveSlope = ( manipulationMode === ManipulationMode.SLOPE ) || ( manipulationMode === ManipulationMode.POINT_SLOPE );
      return new PointSlopeEquationNode( lineProperty, {
        interactivePoint: interactivePoint,
        interactiveSlope: interactiveSlope,
        x1RangeProperty: new Property( graph.xRange ),
        y1RangeProperty: new Property( graph.yRange ),
        riseRangeProperty: new Property( graph.yRange ),
        runRangeProperty: new Property( graph.xRange ),
        fontSize: fontSize,
        staticColor: staticColor } );
    }
    else {
      throw new Error( 'unsupported equation form: ' + equationForm );
    }
  };

  return inherit( ChallengeNode, MakeTheEquationNode );
} );