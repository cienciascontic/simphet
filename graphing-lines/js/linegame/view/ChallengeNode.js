// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type view for all challenges.
 * Provides the view components that are common to all challenges.
 * <p/>
 * Subtypes are responsible for:
 * <li>
 * <ul>providing the nodes for graph and equations</ul>
 * <ul>positioning faceNode</ul>
 * </li>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var GLQueryParameters = require( 'GRAPHING_LINES/common/GLQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineGameConstants = require( 'GRAPHING_LINES/linegame/LineGameConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'GRAPHING_LINES/linegame/model/PlayState' );
  var PointSlopeEquationNode = require( 'GRAPHING_LINES/pointslope/view/PointSlopeEquationNode' );
  var PointToolNode = require( 'GRAPHING_LINES/common/view/PointToolNode' );
  var Property = require( 'AXON/Property' );
  var SlopeInterceptEquationNode = require( 'GRAPHING_LINES/slopeintercept/view/SlopeInterceptEquationNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  /**
   * Constructor
   * @param {Challenge} challenge the challenge
   * @param {LineGameModel} model the game model
   * @param {Dimension2} challengeSize dimensions of the view rectangle that is available for rendering the challenge
   * @param {GameAudioPlayer} audioPlayer the audio player, for providing audio feedback during game play
   */
  function ChallengeNode( challenge, model, challengeSize, audioPlayer ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.subtypeParent = new Node(); // @protected subtypes should add children to this node, to preserve rendering order

    // @protected smiley/frowning face
    thisNode.faceNode = new FaceWithPointsNode( {
      faceDiameter: LineGameConstants.FACE_DIAMETER,
      faceOpacity: 1,
      pointsAlignment: 'rightCenter'
    } );

    // buttons
    var buttonOptions = {
      font: LineGameConstants.BUTTON_FONT,
      baseColor: LineGameConstants.BUTTON_COLOR,
      xMargin: 20,
      yMargin: 5,
      centerX: 0 // center aligned
    };
    var checkButton = new TextPushButton( checkString, buttonOptions );
    var tryAgainButton = new TextPushButton( tryAgainString, buttonOptions );
    var showAnswerButton = new TextPushButton( showAnswerString, buttonOptions );
    var nextButton = new TextPushButton( nextString, buttonOptions );
    thisNode.buttonsParent = new Node( { children: [ checkButton, tryAgainButton, showAnswerButton, nextButton ] } ); // @protected

    // point tools
    var linesVisibleProperty = new Property( true );
    var pointToolNode1 = new PointToolNode( challenge.pointTool1, challenge.modelViewTransform, challenge.graph, linesVisibleProperty, { scale: LineGameConstants.POINT_TOOL_SCALE } );
    var pointToolNode2 = new PointToolNode( challenge.pointTool2, challenge.modelViewTransform, challenge.graph, linesVisibleProperty, { scale: LineGameConstants.POINT_TOOL_SCALE } );

    // Point tools moveToFront when dragged, so we give them a common parent to preserve rendering order of the reset of the scenegraph.
    var pointToolParent = new Node();
    pointToolParent.addChild( pointToolNode1 );
    pointToolParent.addChild( pointToolNode2 );

    // rendering order
    thisNode.addChild( thisNode.subtypeParent );
    thisNode.addChild( thisNode.buttonsParent );
    thisNode.addChild( pointToolParent );
    thisNode.addChild( thisNode.faceNode );

    // buttons at center-bottom
    thisNode.buttonsParent.centerX = challenge.modelViewTransform.modelToViewX( challenge.graph.xRange.min ); // centered on left edge of graph
    thisNode.buttonsParent.bottom = challengeSize.height - 20;

    // 'Check' button
    checkButton.addListener( function() {
      if ( challenge.isCorrect() ) {
        thisNode.faceNode.smile();
        audioPlayer.correctAnswer();
        var points = model.computePoints( model.playState === PlayState.FIRST_CHECK ? 1 : 2 /* number of attempts */ );
        model.score = model.score + points;
        thisNode.faceNode.setPoints( points );
        model.playState = PlayState.NEXT;
      }
      else {
        thisNode.faceNode.frown();
        thisNode.faceNode.setPoints( 0 );
        audioPlayer.wrongAnswer();
        if ( model.playState === PlayState.FIRST_CHECK ) {
          model.playState = PlayState.TRY_AGAIN;
        }
        else {
          model.playState = PlayState.SHOW_ANSWER;
        }
      }
    } );

    // 'Try Again' button
    tryAgainButton.addListener( function() {
      model.playState = PlayState.SECOND_CHECK;
    } );

    // 'Show Answer' button
    showAnswerButton.addListener( function() {
      model.playState = PlayState.NEXT;
    } );

    // 'Next' button
    nextButton.addListener( function() {
      model.playState = PlayState.FIRST_CHECK;
    } );

    // play-state changes
    model.playStateProperty.link( function( state ) {

      // visibility of face
      thisNode.faceNode.visible = ( state === PlayState.TRY_AGAIN ||
                                    state === PlayState.SHOW_ANSWER ||
                                    ( state === PlayState.NEXT && challenge.isCorrect() ) );

      // visibility of buttons
      checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK );
      tryAgainButton.visible = ( state === PlayState.TRY_AGAIN );
      showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER );
      nextButton.visible = ( state === PlayState.NEXT );
    } );

    // dev-mode options
    if ( GLQueryParameters.DEV ) {

      // description at leftTop
      var descriptionNode = new Text( this.constructor.name + ': ' + challenge.description, { font: new GLFont( 16 ), fill: 'black' } );
      descriptionNode.left = 10;
      descriptionNode.top = 10;
      thisNode.addChild( descriptionNode );

      // developer buttons (no i18n) to right of main buttons
      var devButtonOptions = { font: new GLFont( 12 ), baseColor: Color.WHITE, centerX: 0 };
      var skipButton = new TextPushButton( 'dev: Skip',
        _.extend( { listener: model.skipCurrentChallenge.bind( model ) }, devButtonOptions ) ); // skips the current challenge.
      var replayButton = new TextPushButton( 'dev: Replay',
        _.extend( { listener: model.replayCurrentChallenge.bind( model ) }, devButtonOptions ) ); // replays the current challenge.
      var devButtonsParent = new Node( { children: [ skipButton, replayButton ] } );
      devButtonsParent.left = thisNode.buttonsParent.right + 15;
      devButtonsParent.centerY = thisNode.buttonsParent.centerY;
      thisNode.addChild( devButtonsParent );
      model.playStateProperty.link( function( state ) {
        replayButton.visible = ( state === PlayState.NEXT );
        skipButton.visible = !replayButton.visible;
      } );
    }
  }

  /**
   * Creates a non-interactive equation, used to label the specified line.
   * @param {EquationForm} equationForm
   * @param {Property<Line>} lineProperty
   * @param {Font} font
   */
  ChallengeNode.createEquationNode = function( equationForm, lineProperty, fontSize ) {
    if ( equationForm === EquationForm.SLOPE_INTERCEPT ) {
      return SlopeInterceptEquationNode.createDynamicLabel( lineProperty, fontSize );
    }
    else if ( equationForm === EquationForm.POINT_SLOPE ) {
      return new PointSlopeEquationNode.createDynamicLabel( lineProperty, fontSize );
    }
    else {
      throw new Error( 'unsupported equation form: ' + equationForm );
    }
  };

  return inherit( Node, ChallengeNode );
} );