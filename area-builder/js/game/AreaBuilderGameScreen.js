// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the
 * contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var QuizGameModel = require( 'AREA_BUILDER/game/model/QuizGameModel' );
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var AreaBuilderChallengeFactory = require( 'AREA_BUILDER/game/model/AreaBuilderChallengeFactory' );
  var AreaBuilderGameView = require( 'AREA_BUILDER/game/view/AreaBuilderGameView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var gameString = require( 'string!AREA_BUILDER/game' );

  // images
  var gameIcon = require( 'image!AREA_BUILDER/game-icon.png' );

  // constants
  var BACKGROUND_COLOR = 'rgb( 225, 255, 255 )';

  function AreaBuilderGameScreen() {

    Screen.call( this,
      gameString,
      new Image( gameIcon ),
      function() { return new QuizGameModel( AreaBuilderChallengeFactory, new AreaBuilderGameModel() ); },
      function( model ) { return new AreaBuilderGameView( model ); },
      { backgroundColor: BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, AreaBuilderGameScreen );
} );