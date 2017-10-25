// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale: Basics' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroScreen = require( 'PH_SCALE/macro/MacroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!PH_SCALE_BASICS/ph-scale-basics.name' );

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
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new MacroScreen( { autoFillVolume: 0 } ) ], simOptions );
    sim.start();
  } );
} );