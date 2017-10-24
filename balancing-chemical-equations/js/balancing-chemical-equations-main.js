// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroductionScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/IntroductionScreen' );
  var GameScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/game/GameScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancing-chemical-equations.name' );

  var screens = [new IntroductionScreen(), new GameScreen()];

  var simOptions = {
    credits: {
      leadDesign: 'Kelly Lancaster (Java), Yuen-ying Carpenter (HTML5)',
      softwareDevelopment: 'Chris Malley',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore,\nRobert Parson, Ariel Paul, Kathy Perkins',
      thanks: '\u2022 Conversion of this simulation to HTML5 was funded in part by\nthe American Association of Chemistry Teachers (AACT).\n' +
              '\u2022 Thanks to Mobile Learner Labs for working with the PhET\ndevelopment team to convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    new Sim( simTitleString, screens, simOptions ).start();
  } );
} );