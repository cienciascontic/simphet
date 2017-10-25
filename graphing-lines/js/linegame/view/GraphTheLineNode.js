// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for 'Graph the Line' challenges.
 * User manipulates a graphed line on the right, equations are displayed on the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeNode = require( 'GRAPHING_LINES/linegame/view/ChallengeNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationBoxNode = require( 'GRAPHING_LINES/linegame/view/EquationBoxNode' );
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var LineGameConstants = require( 'GRAPHING_LINES/linegame/LineGameConstants' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'GRAPHING_LINES/linegame/model/PlayState' );
  var PointSlopeGraphNode = require( 'GRAPHING_LINES/linegame/view/PointSlopeGraphNode' );
  var Property = require( 'AXON/Property' );
  var SlopeInterceptGraphNode = require( 'GRAPHING_LINES/linegame/view/SlopeInterceptGraphNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TwoPointsGraphNode = require( 'GRAPHING_LINES/linegame/view/TwoPointsGraphNode' );

  // strings
  var lineToGraphString = require( 'string!GRAPHING_LINES/lineToGraph' );
  var notALineString = require( 'string!GRAPHING_LINES/notALine' );
  var yourLineString = require( 'string!GRAPHING_LINES/yourLine' );

  /**
   * @param {GraphTheLine} challenge
   * @param {LineGameModel} model
   * @param {Dimension2} challengeSize
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function GraphTheLineNode( challenge, model, challengeSize, audioPlayer ) {

    var thisNode = this;
    ChallengeNode.call( thisNode, challenge, model, challengeSize, audioPlayer );

    var boxSize = new Dimension2( 0.4 * challengeSize.width, 0.22 * challengeSize.height );

    // title, possibly scaled for i18n
    var titleNode = new Text( challenge.title, { font: LineGameConstants.TITLE_FONT, fill: LineGameConstants.TITLE_COLOR } );
    if ( titleNode.width > boxSize.width ) {
      titleNode.scale = boxSize.width / titleNode.width;
    }

    // Answer
    var answerBoxNode = new EquationBoxNode( lineToGraphString, challenge.answer.color, boxSize,
      ChallengeNode.createEquationNode( challenge.equationForm, new Property( challenge.answer ), LineGameConstants.STATIC_EQUATION_FONT_SIZE ) );

    // Guess equation
    var guessLineProperty = new Property( Line.Y_EQUALS_X_LINE ); // start with any non-null line
    thisNode.equationNode = ChallengeNode.createEquationNode( challenge.equationForm, guessLineProperty, LineGameConstants.STATIC_EQUATION_FONT_SIZE );

    // 'Not A Line', for situations where 3-points do not define a line
    thisNode.notALineNode = new Text( notALineString, { font: new GLFont( { size: 24, weight: 'bold' } ), fill: 'black' } );

    // Guess
    thisNode.guessBoxNode = new EquationBoxNode( yourLineString, LineGameConstants.GUESS_COLOR, boxSize,
      new Node( { children: [ thisNode.equationNode, thisNode.notALineNode ] } ) );

    // Graph
    thisNode.graphNode = this.createGraphNode( challenge );
    thisNode.graphNode.setGuessPointVisible( challenge.manipulationMode === ManipulationMode.SLOPE ); // plot the point if we're only manipulating slope

    // rendering order
    thisNode.subtypeParent.addChild( titleNode );
    thisNode.subtypeParent.addChild( thisNode.graphNode );
    thisNode.subtypeParent.addChild( answerBoxNode );
    thisNode.subtypeParent.addChild( thisNode.guessBoxNode );

    // layout
    {
      // graphNode is positioned automatically based on modelViewTransform's origin offset.

      // left align the title and boxes
      answerBoxNode.centerX = challenge.modelViewTransform.modelToViewX( challenge.graph.xRange.min ) / 2; // centered in space to left of graph
      thisNode.guessBoxNode.left = answerBoxNode.left;
      titleNode.left = answerBoxNode.left;

      // stack title and boxes vertically, title top-aligned with graph's grid
      var ySpacing = 30;
      titleNode.top = challenge.modelViewTransform.modelToViewY( challenge.graph.yRange.max );
      answerBoxNode.top = titleNode.bottom + ySpacing;
      thisNode.guessBoxNode.top = answerBoxNode.bottom + ySpacing;

      // face centered below boxes, bottom-aligned with buttons
      thisNode.faceNode.centerX = answerBoxNode.centerX;
      thisNode.faceNode.bottom = thisNode.buttonsParent.bottom;
    }

    // Update visibility of the correct/incorrect icons.
    var updateIcons = function() {
      answerBoxNode.setCorrectIconVisible( model.playState === PlayState.NEXT );
      thisNode.guessBoxNode.setCorrectIconVisible( model.playState === PlayState.NEXT && challenge.isCorrect() );
      thisNode.guessBoxNode.setIncorrectIconVisible( model.playState === PlayState.NEXT && !challenge.isCorrect() );
    };

    // sync with guess
    challenge.guessProperty.link( function( line ) {

      // line is null if ManipulationMode.THREE_POINTS and points don't make a line
      if ( line ) {
        guessLineProperty.set( line ); // updates equationNode
      }
      thisNode.equationNode.visible = !!line; // cast to boolean
      thisNode.notALineNode.visible = !thisNode.equationNode.visible;

      // visibility of correct/incorrect icons
      updateIcons();
    } );

    // sync with game state
    model.playStateProperty.link( function( playState ) {

      // states in which the graph is interactive
      thisNode.graphNode.pickable = ( playState === PlayState.FIRST_CHECK || playState === PlayState.SECOND_CHECK || ( playState === PlayState.NEXT && !challenge.isCorrect() ) );

      // Graph the answer line at the end of the challenge.
      thisNode.graphNode.setAnswerVisible( playState === PlayState.NEXT );

      thisNode.guessBoxNode.visible = ( model.playState === PlayState.NEXT );

      // show stuff when the user got the challenge wrong
      if ( playState === PlayState.NEXT && !challenge.isCorrect() ) {
        thisNode.graphNode.setAnswerPointVisible( true );
        thisNode.graphNode.setGuessPointVisible( true );
        thisNode.graphNode.setSlopeToolVisible( true );
      }

      // visibility of correct/incorrect icons
      updateIcons();
    } );
  }

  return inherit( ChallengeNode, GraphTheLineNode, {

    /**
     * Creates the graph portion of the view.
     * @param {Challenge} challenge
     * @returns {ChallengeGraphNode}
     */
    createGraphNode: function( challenge ) {
      if ( challenge.manipulationMode === ManipulationMode.POINT || challenge.manipulationMode === ManipulationMode.SLOPE || challenge.manipulationMode === ManipulationMode.POINT_SLOPE ) {
        return new PointSlopeGraphNode( challenge );
      }
      else if ( challenge.manipulationMode === ManipulationMode.INTERCEPT || challenge.manipulationMode === ManipulationMode.SLOPE_INTERCEPT ) {
        assert && assert( challenge.answer.getYIntercept().isInteger() );
        return new SlopeInterceptGraphNode( challenge );
      }
      else if ( challenge.manipulationMode === ManipulationMode.TWO_POINTS ) {
        return new TwoPointsGraphNode( challenge );
      }
      else {
        throw new Error( 'unsupported manipulationMode: ' + challenge.manipulationMode );
      }
    }
  } );
} );