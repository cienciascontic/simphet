// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Acid-Base Solutions' sim.
 *
 * @author Andrew Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MySolutionScreen = require( 'ACID_BASE_SOLUTIONS/mysolution/MySolutionScreen' );
  var IntroductionScreen = require( 'ACID_BASE_SOLUTIONS/introduction/IntroductionScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitleString = require( 'string!ACID_BASE_SOLUTIONS/acid-base-solutions.name' );

  var screens = [
    new IntroductionScreen(),
    new MySolutionScreen()
  ];

  var simOptions = {
    credits: {
      leadDesign: 'Kelly Lancaster',
      softwareDevelopment: 'Chris Malley',
      designTeam: 'Bryce Gruneich, Patricia Loeblein, Emily B. Moore,\nRobert Parson, Kathy Perkins',
      thanks: '\u2022 La conversión de esta simulación a HTML5 fue financiada en parte por la Royal Society of Chemistry.\n' +
        '\u2022 Gracias a Mobile Learner Labs por trabajar con el equipo de desarrollo de PhET para convertir esta\nsimulación a HTML5.\n' +
        '\u2022 Traducción al español por Cristián Rizzi Iribarren y Héctor Mallma Alvarado'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      showHomeScreen: false,
      screenIndex: 1
    }, simOptions );
  }

  SimLauncher.launch( function() {
    new Sim( simTitleString, screens, simOptions ).start();
  } );
} );