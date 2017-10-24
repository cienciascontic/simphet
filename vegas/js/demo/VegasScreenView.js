// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var Property = require( 'AXON/Property' );
  var HSlider = require( 'SUN/HSlider' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );

  function VegasScreenView() {
    var vegasScreenView = this;
    ScreenView.call( this, { renderer: 'svg' } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    var scoreProperty = new Property( 1 );

    this.addChild( new ProgressIndicator( 4, scoreProperty, 1, { left: 20, top: 20, scale: 2 } ) );
    this.addChild( new HSlider( scoreProperty, {min: 0, max: 1} ).mutate( {left: 20, top: 80} ) );

    //Show a sample LevelCompletedNode that cycles through score values when you press "continue"
    var score = 0;
    var addLevelCompletedNode = function() {
      var maxScore = 12;
      var levelCompletedNode = new LevelCompletedNode( 7, score, maxScore, 4, true, 77, 74, true, function() {
        console.log( 'continue' );
        score++;
        if ( score > maxScore ) {
          score = 0;
        }
        levelCompletedNode.detach();
        addLevelCompletedNode();
      }, {
        right: vegasScreenView.layoutBounds.right - 10,
        top: vegasScreenView.layoutBounds.top + 10
      } );
      vegasScreenView.addChild( levelCompletedNode );
    };

    addLevelCompletedNode();
  }

  return inherit( ScreenView, VegasScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );