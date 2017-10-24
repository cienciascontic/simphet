// Copyright 2002-2013, University of Colorado Boulder

/**
 * When a level is completed, this node shows how you did.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var keepTryingString = require( 'string!VEGAS/keepTrying' );
  var goodString = require( 'string!VEGAS/good' );
  var greatString = require( 'string!VEGAS/great' );
  var excellentString = require( 'string!VEGAS/excellent' );
  var scoreOutOfString = require( 'string!VEGAS/label.score.max' );
  var timeString = require( 'string!VEGAS/label.time' );
  var yourNewBestString = require( 'string!VEGAS/yourNewBest' );
  var pattern0YourBestString = require( 'string!VEGAS/pattern.0yourBest' );
  var continueString = require( 'string!VEGAS/continue' );
  var levelString = require( 'string!VEGAS/label.level' );

  /**
   * @param {number} level starting from zero, 1 added to this when displayed
   * @param {number} score
   * @param {number} perfectScore
   * @param {number} numStars
   * @param {boolean} timerEnabled
   * @param {number} elapsedTime (in seconds)
   * @param {number} bestTimeAtThisLevel (in seconds), null indicates no best time
   * @param {boolean} isNewBestTime
   * @param {function} continueFunction Function to call when the user presses the 'Continue' button.
   * @param {Object} options
   * @constructor
   */
  function LevelCompletedNode( level, score, perfectScore, numStars, timerEnabled, elapsedTime, bestTimeAtThisLevel, isNewBestTime, continueFunction, options ) {

    options = _.extend( {
      levelVisible: true, // display the level number?
      fill: new Color( 180, 205, 255 ),
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 35,
      xMargin: 20,
      yMargin: 20,
      ySpacing: 30,
      titleFont: new PhetFont( { size: 28, weight: 'bold' } ),
      infoFont: new PhetFont( { size: 22, weight: 'bold' } ),
      buttonFont: new PhetFont( 26 ),
      buttonFill: new Color( 255, 255, 0 ),
      starDiameter: 62
    }, options );

    // nodes to be added to the panel
    var children = [];

    // Title, which changes based on how the user did.
    var proportionCorrect = score / perfectScore;
    var titleText = keepTryingString;
    if ( proportionCorrect > 0.95 ) {
      titleText = excellentString;
    }
    else if ( proportionCorrect > 0.75 ) {
      titleText = greatString;
    }
    else if ( proportionCorrect >= 0.5 ) {
      titleText = goodString;
    }
    var title = new Text( titleText, {font: options.titleFont} );
    children.push( title );

    // Progress indicator
    children.push( new ProgressIndicator( numStars, new Property( score ), perfectScore, {
      starInnerRadius: options.starDiameter / 4,
      starOuterRadius: options.starDiameter / 2
    } ) );

    // Level (optional)
    if ( options.levelVisible ) {
      children.push( new Text( StringUtils.format( levelString, level + 1 ), { font: options.infoFont } ) );
    }

    // Score
    children.push( new Text( StringUtils.format( scoreOutOfString, score, perfectScore ), { font: options.infoFont } ) );

    // Time (optional)
    if ( timerEnabled ) {
      var time = new MultiLineText( StringUtils.format( timeString, GameTimer.formatTime( elapsedTime ) ), { font: options.infoFont, align: 'center' } );
      if ( isNewBestTime ) {
        time.text += '\n' + yourNewBestString;
      }
      else if ( bestTimeAtThisLevel !== null ) {
        time.text += '\n' + StringUtils.format( pattern0YourBestString, GameTimer.formatTime( bestTimeAtThisLevel ) );
      }
      children.push( time );
    }

    // Continue button
    children.push( new TextPushButton( continueString, {
      listener: continueFunction,
      font: options.buttonFont,
      baseColor: options.buttonFill,
      xMargin: 10,
      yMargin: 5
    } ) );

    // Panel
    Panel.call( this, new VBox( { children: children, spacing: options.ySpacing } ), options );
  }

  // Inherit from Node.
  return inherit( Panel, LevelCompletedNode );
} );