// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scoreboard for a game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
  function ScoreboardPanel( challengeIndexProperty, challengesPerGameProperty, levelProperty, scoreProperty, elapsedTimeProperty, timerEnabledProperty, startOverCallback, options ) {

    var thisNode = this;

    options = _.extend( {
      // things that can be hidden
      levelVisible: true,
      challengeNumberVisible: true,
      // all text
      font: new PhetFont( 20 ),
      // "Start Over" button
      startOverButtonText: startOverString,
      startOverButtonBaseColor: new Color( 229, 243, 255 ),
      startOverButtonXMargin: 10,
      startOverButtonYMargin: 5,
      // Timer
      clockIconRadius: 15,
      // Panel
      minWidth: 0,
      xSpacing: 40,
      xMargin: 20,
      yMargin: 10,
      fill: 'rgb( 180, 205, 255 )',
      stroke: 'black',
      lineWidth: 1
    }, options );

    // Level
    var levelNode = new Text( '', { font: options.font, pickable: false } );
    levelProperty.link( function( level ) {
      levelNode.text = StringUtils.format( pattern_0level, level + 1 );
    } );

    // Challenge number
    var challengeNumberNode = new Text( '', { font: options.font, pickable: false } );
    challengeIndexProperty.link( function( challengeIndex ) {
      challengeNumberNode.text = StringUtils.format( pattern_0challenge_1max, challengeIndex + 1, challengesPerGameProperty.get() );
    } );

    // Score
    var scoreNode = new Text( '', { font: options.font, pickable: false } );
    scoreProperty.link( function( score ) {
      scoreNode.text = StringUtils.format( pattern_0score, score );
    } );

    // Timer, always takes up space even when hidden.
    var timerNode = new Node( { pickable: false } );
    var clockIcon = new SimpleClockIcon( options.clockIconRadius );
    var timeValue = new Text( '', { font: options.font } );
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

    // Start Over button
    var startOverButton = new TextPushButton( options.startOverButtonText, {
      listener: startOverCallback,
      font: options.font,
      baseColor: options.startOverButtonBaseColor,
      xMargin: options.startOverButtonXMargin,
      yMargin: options.startOverButtonYMargin
    } );

    // Content for the panel, one row.
    var subContent = new Node();
    var nodes = [ levelNode, challengeNumberNode, scoreNode, timerNode, startOverButton ];
    if ( !options.levelVisible ) { nodes.splice( nodes.indexOf( levelNode ), 1 ); }
    if ( !options.challengeNumberVisible ) { nodes.splice( nodes.indexOf( challengeNumberNode ), 1 ); }
    for ( var i = 0; i < nodes.length; i++ ) {
      subContent.addChild( nodes[i] );
      if ( i > 0 ) {
        nodes[i].left = nodes[i - 1].right + options.xSpacing;
        nodes[i].centerY = nodes[i - 1].centerY;
      }
    }

    //TODO sun.Panel should support this, instead of having to do it here
    // ensure a minimum width, horizontally center the content.
    var content = subContent;
    if ( subContent.width < options.minWidth ) {
      content = new Node();
      var strut = new Line( 0, 0, options.minWidth, 0, { pickable: false } ); // horizontal strut
      content.addChild( strut );
      content.addChild( subContent );
      subContent.centerX = strut.centerX;
    }

    Panel.call( thisNode, content, options );
  }

  return inherit( Panel, ScoreboardPanel );
} );