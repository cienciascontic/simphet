// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var VegasScreenView = require( 'VEGAS/demo/VegasScreenView' );
  var RewardNodeScreenView = require( 'VEGAS/demo/RewardNodeScreenView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // Strings
  var simTitle = 'vegas';

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    // Create and start the sim
    //Create and start the sim
    new Sim( simTitle, [
      new Screen( 'Vegas', new Rectangle( 0, 0, 548, 373, {fill: 'yellow'} ),
        function() {return {};},
        function( model ) {return new VegasScreenView();},
        { backgroundColor: '#fff' }
      ),
      new Screen( 'Rewards', new Rectangle( 0, 0, 548, 373, {fill: 'blue'} ),
        function() {return {};},
        function( model ) {return new RewardNodeScreenView();},
        { backgroundColor: '#fff' }
      )
    ], simOptions ).start();
  } );
} );