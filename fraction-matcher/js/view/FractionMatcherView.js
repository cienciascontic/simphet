// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Matching Game' screen.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var LevelsContainerNode = require( 'FRACTION_MATCHER/view/LevelsContainerNode' );
  var SoundToggleButton = require( 'SCENERY_PHET/SoundToggleButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/TimerToggleButton' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var LevelSelectButtonsAndTitleNode = require( 'FRACTION_MATCHER/view/LevelSelectButtonsAndTitleNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Sound = require( 'VIBE/Sound' );

  function MatchingGameView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var levelsContainerNode = new LevelsContainerNode( model, this.layoutBounds );
    levelsContainerNode.visible = false;
    levelsContainerNode.x = model.width;

    var levelSelectButtonsAndTitleNode = new LevelSelectButtonsAndTitleNode( model ).mutate( {
      centerX: model.width / 2,
      y: 20
    } );
    var levelSelectionScreen = new Node( {
      children: [
        levelSelectButtonsAndTitleNode,
        new ResetAllButton( {
          listener: function() {
            model.reset();
          },
          x: model.width - 40,
          y: model.height - 40
        } ),
        new HBox( {
          children: [
            new TimerToggleButton( model.isTimerProperty ),
            new SoundToggleButton( Sound.audioEnabledProperty )
          ],
          spacing: 10,
          x: 20,
          bottom: model.height - 20} )
      ]} );

    this.addChild( levelsContainerNode );
    this.addChild( levelSelectionScreen );

    var startGameButtonsTween = new TWEEN.Tween( levelSelectionScreen ).easing( TWEEN.Easing.Cubic.InOut ).onComplete( function() {
      levelSelectionScreen.visible = (levelSelectionScreen.x === 0);
    } );

    var fromLevelNumber; //level from which we return to main screen. keep this to remove corresponding Node from the scene graph
    var levelsTween = new TWEEN.Tween( levelsContainerNode ).easing( TWEEN.Easing.Cubic.InOut ).onComplete( function() {
      levelsContainerNode.visible = (levelsContainerNode.x === 0);

      //remove LevelNode from scene graph to keep it simple and fast
      if ( fromLevelNumber && fromLevelNumber !== model.currentLevel ) {
        var parentNode = levelsContainerNode.levelNodes[fromLevelNumber - 1].getParent();
        if ( parentNode ) {
          levelsContainerNode.levelNodes[fromLevelNumber - 1].getParent().removeChild( levelsContainerNode.levelNodes[fromLevelNumber - 1] );
        }
      }
    } );

    var animateToLevels = function() {
      startGameButtonsTween.stop().to( {x: -model.width}, model.ANIMATION_TIME ).start();

      levelsContainerNode.visible = true;
      levelsTween.stop().to( {x: 0}, model.ANIMATION_TIME ).start();

    };

    var animateFromLevels = function() {
      levelsTween.stop().to( {x: model.width}, model.ANIMATION_TIME ).start();

      levelSelectionScreen.visible = true;
      startGameButtonsTween.stop().to( {x: 0}, model.ANIMATION_TIME ).start();
    };


    model.currentLevelProperty.lazyLink( function( newLevel, oldLevel ) {
      if ( newLevel > 0 ) {
        animateToLevels();
      }
      else {
        fromLevelNumber = oldLevel;
        animateFromLevels();
      }
    } );

  }

  return inherit( ScreenView, MatchingGameView );
} );
