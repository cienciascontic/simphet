// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomScreen = require( 'PH_SCALE/custom/CustomScreen' );
  var MacroScreen = require( 'PH_SCALE/macro/MacroScreen' );
  var MicroScreen = require( 'PH_SCALE/micro/MicroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!PH_SCALE/ph-scale.name' );

  var screens = [ new MacroScreen(), new MicroScreen(), new CustomScreen() ];

  var simOptions = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter',
      softwareDevelopment: 'Chris Malley',
      team: 'Julia Chamberlain, Trish Loeblein, Emily B. Moore, Ariel Paul, Katherine Perkins',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Conversion of this simulation to HTML5 was funded in part by the Royal Society of Chemistry.'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    // add dev-specific options here
    simOptions = _.extend( {
      showHomeScreen: false,
      screenIndex: 2
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, screens, simOptions );
    sim.start();
  } );
} );