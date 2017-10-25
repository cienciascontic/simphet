// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Line Game' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var IconFactory = require( 'GRAPHING_LINES/common/view/IconFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineGameModel = require( 'GRAPHING_LINES/linegame/model/LineGameModel' );
  var LineGameView = require( 'GRAPHING_LINES/linegame/view/LineGameView' );
  var Screen = require( 'JOIST/SCREEN' );

  // strings
  var title = require( 'string!GRAPHING_LINES/tab.lineGame' );

  function GameScreen() {
    Screen.call( this, title, IconFactory.createGameScreenIcon(),
      function() { return new LineGameModel(); },
      function( model ) { return new LineGameView( model ); },
      { backgroundColor: GLColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, GameScreen );
} );