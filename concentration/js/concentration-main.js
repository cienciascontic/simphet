// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Concentration' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConcentrationScreen = require( 'BEERS_LAW_LAB/concentration/ConcentrationScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!BEERS_LAW_LAB/tab.concentration' );

  var simOptions = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley',
      designTeam: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins',
      thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new ConcentrationScreen() ], simOptions );
    sim.start();
  } );
} );
