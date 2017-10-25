// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Fraction Matcher sim.
 *
 * @author Anton Ulyanov, Andrew Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Sim = require( 'JOIST/Sim' );
  var FractionsScreen = require( 'FRACTION_MATCHER/FractionsScreen' );
  var MixedNumbersScreen = require( 'FRACTION_MATCHER/MixedNumbersScreen' );

  // strings
  var simTitleString = require( 'string!FRACTION_MATCHER/fraction-matcher.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Ariel Paul',
      softwareDevelopment: 'Sam Reid',
      designTeam: 'Karina Hensberry, Patricia Loeblein, Kathy Perkins, Mike Dubson, Noah Podolefsky',
      thanks: '\u2022 Thanks to Mobile Learner Labs for working with the PhET development team to convert this\nsimulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitleString, [
      new FractionsScreen(),
      new MixedNumbersScreen()
    ], simOptions ).start();
  } );
} );