// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main file for the Build an Atom simulation.
 */
define( function( require ) {
  'use strict';

  // Imports
  var BuildAnAtomModel = require( 'BUILD_AN_ATOM/common/model/BuildAnAtomModel' );
  var BuildAnAtomView = require( 'buildanatom/view/BuildAnAtomView' );
  var BAAGameModel = require( 'BUILD_AN_ATOM/game/model/BAAGameModel' );
  var BAAGameView = require( 'BUILD_AN_ATOM/game/view/BAAGameView' );
  var SymbolView = require( 'BUILD_AN_ATOM/symbol/view/SymbolView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // Strings
  var simTitle = require( 'string!BUILD_AN_ATOM/build-an-atom.name' );
  var atomModuleString = require( 'string!BUILD_AN_ATOM/title.atomModule' );
  var symbolModuleString = require( 'string!BUILD_AN_ATOM/title.symbolModule' );
  var gameModuleString = require( 'string!BUILD_AN_ATOM/title.gameModule' );
  var atomIcon = require( 'image!BUILD_AN_ATOM/baa_atom_icon.png' );
  var atomIconSmall = require( 'image!BUILD_AN_ATOM/baa_atom_icon_small.png' );
  var elementIcon = require( 'image!BUILD_AN_ATOM/baa_element_icon.png' );
  var elementIconSmall = require( 'image!BUILD_AN_ATOM/baa_element_icon_small.png' );
  var gameIcon = require( 'image!BUILD_AN_ATOM/game_icon.png' );
  var gameIconSmall = require( 'image!BUILD_AN_ATOM/game_icon_small.png' );

  var simOptions = {
    credits: {
      leadDesign: 'Kelly Lancaster',
      softwareDevelopment: 'John Blanco, Sam Reid',
      designTeam: 'Jack Barbera, Suzanne Brahmia, Julia Chamberlain, Yuen-ying Carpenter,\n' +
                  'Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, Kathy Perkins, Sharon Siman-Tov',
      interviews: 'Emily B. Moore, Kelly Lancaster, Ariel Paul',
      thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
    }
  };

  SimLauncher.launch( function() {

    // Create and start the sim
    new Sim( simTitle, [
      new Screen( atomModuleString, new Image( atomIcon ),
        function() { return new BuildAnAtomModel(); },
        function( model ) { return new BuildAnAtomView( model ); },
        { navigationBarIcon: new Image( atomIconSmall )}
      ),
      new Screen( symbolModuleString, new Image( elementIcon ),
        function() { return new BuildAnAtomModel(); },
        function( model ) { return new SymbolView( model ); },
        {
          backgroundColor: 'rgb( 242, 255, 204 )', /* Light yellow-green */
          navigationBarIcon: new Image( elementIconSmall )
        }
      ),
      new Screen( gameModuleString, new Image( gameIcon ),
        function() { return new BAAGameModel(); },
        function( model ) { return new BAAGameView( model ); },
        { backgroundColor: 'rgb( 255, 254, 223 )',
          navigationBarIcon: new Image( gameIconSmall )
        }
      )
    ], simOptions ).start();
  } );
} );
