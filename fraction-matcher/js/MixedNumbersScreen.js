// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Fraction Matcher sim.
 *
 * @author Anton Ulyanov, Andrew Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Screen = require( 'JOIST/Screen' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var FractionMatcherModel = require( 'FRACTION_MATCHER/model/FractionMatcherModel' );
  var FractionMatcherView = require( 'FRACTION_MATCHER/view/FractionMatcherView' );
  var MixedNumbersConstants = require( 'FRACTION_MATCHER/model/MixedNumbersConstants' );
  var MixedNumbersHomeScreenIcon = require( 'FRACTION_MATCHER/view/MixedNumbersHomeScreenIcon' );
  var MixedNumbersNavigationBarIcon = require( 'FRACTION_MATCHER/view/MixedNumbersNavigationBarIcon' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var mixedNumbersTitleString = require( 'string!FRACTION_MATCHER/mixedNumbersTitle' );

  function MixedNumbersScreen() {
    Screen.call( this, mixedNumbersTitleString, new MixedNumbersHomeScreenIcon(),
      function() { return new FractionMatcherModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height, mixedNumbersTitleString, new MixedNumbersConstants(), true ); },
      function( model ) { return new FractionMatcherView( model ); },
      {
        navigationBarIcon: new MixedNumbersNavigationBarIcon()
      } );
  }

  return inherit( Screen, MixedNumbersScreen );
} );