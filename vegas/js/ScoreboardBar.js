// Copyright 2002-2014, University of Colorado Boulder

/**
 * A horizontal scoreboard 'bar'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var startOverString = require( 'string!VEGAS/startOver' );
  var pattern_0level = require( 'string!VEGAS/label.level' );
  var pattern_0score = require( 'string!VEGAS/label.score' );
  var pattern_0challenge_1max = require( 'string!VEGAS/pattern.0challenge.1max' );

  /**
   * @param {Number} screenWidth
   * @param {Property<Number>} challengeIndexProperty which challenge is the user current playing? (index starts at 0, displayed starting at 1)
   * @param {Property<Number>} challengesPerGameProperty how many challenges are in the current game
   * @param {Property<Number>} levelProperty
   * @param {Property<Number>} scoreProperty
   * @param {Property<Number>} elapsedTimeProperty elapsed time in seconds
   * @param {Property<Number>} timerEnabledProperty is the timer enabled?
   * @param {Function} startOverCallback
   * @param {Object} options
   * @constructor
   */
  function ScoreboardBar( screenWidth, challengeIndexProperty, challengesPerGameProperty, levelProperty, scoreProperty, elapsedTimeProperty, timerEnabledProperty, startOverCallback, options ) {

    var thisNode = this;

    options = _.extend( {
      // things that can be hidden
      levelVisible: true,
      challengeNumberVisible: true,
      // all text
      font: new PhetFont( 20 ),
      textFill: 'white',
      // 'Start Over' button
      startOverButtonText: startOverString,
      startOverButtonTextFill: 'black',
      startOverButtonBaseColor: new Color( 229, 243, 255 ),
      startOverButtonXMargin: 10,
      startOverButtonYMargin: 5,
      // Timer
      clockIconRadius: 15,
      // Background
      xSpacing: 50,
      leftMargin: 20,
      rightMargin: 20,
      yMargin: 10,
      backgroundFill: 'rgb( 49, 117, 202 )',
      backgroundStroke: null,
      backgroundLineWidth: 1
    }, options );

    var textOptions = { fill: options.textFill, font: options.font };

    // Level
    var levelNode = new Text( '', textOptions );
    levelProperty.link( function( level ) {
      levelNode.text = StringUtils.format( pattern_0level, level + 1 );
    } );

    // Challenge number
    var challengeNumberNode = new Text( '', textOptions );
    var updateChallengeString = function() {
      challengeNumberNode.text = StringUtils.format( pattern_0challenge_1max, challengeIndexProperty.get() + 1, challengesPerGameProperty.get() );
    };
    challengeIndexProperty.link( updateChallengeString );
    challengesPerGameProperty.link( updateChallengeString );

    // Score
    var scoreNode = new Text( '', textOptions );
    scoreProperty.link( function( score ) {
      scoreNode.text = StringUtils.format( pattern_0score, score );
    } );

    // Timer, always takes up space even when hidden.
    var timerNode = new Node( { pickable: false } );
    var clockIcon = new SimpleClockIcon( options.clockIconRadius );
    var timeValue = new Text( '', textOptions );
    timerNode.addChild( clockIcon );
    timerNode.addChild( timeValue );
    timeValue.left = clockIcon.right + 8;
    timeValue.centerY = clockIcon.centerY;
    elapsedTimeProperty.link( function( elapsedTime ) {
      timeValue.text = GameTimer.formatTime( elapsedTime );
    } );
    timerEnabledProperty.link( function( timerEnabled ) {
      timerNode.visible = timerEnabled;
    } );

    // All of the stuff that's grouped together at the left end of the scoreboard
    var leftParentNode = new Node();
    var nodes = [ levelNode, challengeNumberNode, scoreNode, timerNode ];
    if ( !options.levelVisible ) { nodes.splice( nodes.indexOf( levelNode ), 1 ); }
    if ( !options.challengeNumberVisible ) { nodes.splice( nodes.indexOf( challengeNumberNode ), 1 ); }
    for ( var i = 0; i < nodes.length; i++ ) {
      leftParentNode.addChild( nodes[i] );
      if ( i > 0 ) {
        nodes[i].left = nodes[i - 1].right + options.xSpacing;
        nodes[i].centerY = nodes[i - 1].centerY;
      }
    }

    // Start Over button
    var startOverButton = new TextPushButton( options.startOverButtonText, {
      listener: startOverCallback,
      font: options.font,
      textFill: options.startOverButtonTextFill,
      baseColor: options.startOverButtonBaseColor,
      xMargin: options.startOverButtonXMargin,
      yMargin: options.startOverButtonYMargin
    } );

    // background
    var backgroundHeight = Math.max( leftParentNode.height, startOverButton.height ) + ( 2 * options.yMargin );
    var backgroundNode = new Rectangle( 0, 0, 4 * screenWidth, backgroundHeight,
      { fill: options.backgroundFill, stroke: options.backgroundStroke, lineWidth: options.backgroundLineWidth } );

    // layout
    leftParentNode.centerY = startOverButton.centerY = backgroundNode.centerY; // vertically aligned
    leftParentNode.left = backgroundNode.centerX - ( screenWidth / 2 ) + options.leftMargin; // left end
    startOverButton.right = backgroundNode.centerX + ( screenWidth / 2 ) - options.rightMargin; // right end

    options.children = [ backgroundNode, leftParentNode, startOverButton ];
    Node.call( thisNode, options );
  }

  return inherit( Node, ScoreboardBar );
} );