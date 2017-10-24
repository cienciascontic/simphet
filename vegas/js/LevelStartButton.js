// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button for initiating game levels and for depicting the progress made on each level.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Node} icon Scenery node that appears on the button, scaled to fit
   * @param {number} numStars Number of stars to show in the progress indicator at the bottom of the button
   * @param {function} fireFunction Called when the button fires
   * @param {Property<number>} scoreProperty
   * @param {number} perfectScore
   * @param {Object} options
   * @constructor
   */
  function LevelStartButton( icon, numStars, fireFunction, scoreProperty, perfectScore, options ) {

    options = _.extend( {
      buttonWidth: 150,
      buttonHeight: 150,
      backgroundColor: 'rgb( 242, 255, 204 )',
      highlightedBackgroundColor: 'rgb( 250, 255, 230 )',
      cornerRadius: 10,
      // shadow
      shadowColor: 'black',
      shadowOffset: 3,
      // icon
      iconMinXMargin: 10,
      iconMinYMargin: 10,
      // progress indicator (stars)
      progressIndicatorPercentage: 0.2, // percentage of the button height occupied by the progress indicator, (0,0.5]
      progressIndicatorMinXMargin: 10,
      progressIndicatorMinYMargin: 5,
      // best time (optional)
      bestTimeProperty: null, // null if no best time || {Property<Number>} best time in seconds
      bestTimeVisibleProperty: null, // null || Property<Boolean>} controls visibility of best time
      bestTimeFill: 'black',
      bestTimeFont: new PhetFont( 24 ),
      bestTimeYSpacing: 10  // vertical space between drop shadow and best time
    }, options );

    assert && assert( options.progressIndicatorPercentage > 0 && options.progressIndicatorPercentage <= 0.5, 'progressIndicatorPercentage value out of range' );

    Node.call( this ); //TODO this should be a subtype of a 'button with shadow' sun component

    // Drop shadow
    var shadowNode = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius, {
        fill: options.shadowColor,
        top: options.shadowOffset,
        left: options.shadowOffset
      }
    );
    this.addChild( shadowNode );

    // Button foreground, which is the parent node for everything else that is on the button.
    var buttonForegroundNode = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: options.backgroundColor
    } );
    this.addChild( buttonForegroundNode );

    // We'll attach input listener to this node. Attaching to the button causes problems, because the button moves. See #26.
    var transparentRectangleNode = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius,
      { cursor: 'pointer' } );
    this.addChild( transparentRectangleNode );

    // Icon, scaled to fit.
    var iconYSpace = ( 1 - options.progressIndicatorPercentage ) * options.buttonHeight; // vertical space available for icon
    var iconScaleFactor = Math.min(
        ( options.buttonWidth - 2 * options.iconMinYMargin ) / icon.width,
        ( iconYSpace - 2 * options.iconMinXMargin ) / icon.height );
    icon.scale( iconScaleFactor );
    icon.centerX = buttonForegroundNode.centerX;
    icon.centerY = buttonForegroundNode.top + ( iconYSpace / 2 );
    icon.pickable = false;
    buttonForegroundNode.addChild( icon );

    // Progress indicator (stars), scaled to fit
    var progressIndicatorYSpace = options.buttonHeight - iconYSpace; // vertical space available for progress indicator
    var progressIndicatorBackground = new Rectangle( 0, 0, options.buttonWidth, progressIndicatorYSpace, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: false,
      bottom: options.buttonHeight
    } );
    var progressIndicator = new ProgressIndicator( numStars, scoreProperty, perfectScore, {
      pickable: false,
      starDiameter: options.buttonWidth / ( numStars + 1 )
    } );
    progressIndicator.scale( Math.min(
        ( progressIndicatorBackground.width - 2 * options.progressIndicatorMinXMargin ) / progressIndicator.width,
        ( progressIndicatorBackground.height - 2 * options.progressIndicatorMinYMargin ) / progressIndicator.height ) );
    progressIndicator.center = progressIndicatorBackground.center;
    buttonForegroundNode.addChild( progressIndicatorBackground );
    buttonForegroundNode.addChild( progressIndicator );

    // Best time (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeProperty ) {
      var bestTimeNode = new Text( '', { font: options.bestTimeFont, fill: options.bestTimeFill } );
      this.addChild( bestTimeNode );
      options.bestTimeProperty.link( function( bestTime ) {
        bestTimeNode.text = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        bestTimeNode.centerX = buttonForegroundNode.centerX;
        bestTimeNode.top = shadowNode.bottom + options.bestTimeYSpacing;
      } );
      if ( options.bestTimeVisibleProperty ) {
        options.bestTimeVisibleProperty.linkAttribute( bestTimeNode, 'visible' );
      }
    }

    //TODO This behavior was copied from sun.PushButtonDeprecated, because sun.RectangularPushButton doesn't support the look/behavior of this button.
    // Button listener
    var update = function( state ) {
      if ( state === 'up' ) {
        buttonForegroundNode.fill = options.backgroundColor;
        buttonForegroundNode.top = 0;
        buttonForegroundNode.left = 0;
      }
      else if ( state === 'over' ) {
        buttonForegroundNode.fill = options.highlightedBackgroundColor;
      }
      else if ( state === 'down' ) {
        buttonForegroundNode.fill = options.highlightedBackgroundColor;
        buttonForegroundNode.top = options.shadowOffset;
        buttonForegroundNode.left = options.shadowOffset;
      }
      else {
        throw new Error( 'unsupported state: ' + state );
      }
    };
    transparentRectangleNode.addInputListener( new ButtonListener( {
      up: function() { update( 'up' ); },
      over: function() { update( 'over' ); },
      down: function() { update( 'down' ); },
      out: function() { update( 'up' ); }, // 'out' state looks the same as 'up'
      fire: fireFunction
    } ) );

    // Update for initial state
    update( 'up' );

    // Pass options to parent class
    this.mutate( options );
  }

  return inherit( Node, LevelStartButton );
} );