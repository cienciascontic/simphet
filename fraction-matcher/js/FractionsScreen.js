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
  var Constants = require( 'FRACTION_MATCHER/model/Constants' );
  var IntroHomeScreenIcon = require( 'FRACTION_MATCHER/view/IntroHomeScreenIcon' );
  var IntroNavigationBarIcon = require( 'FRACTION_MATCHER/view/IntroNavigationBarIcon' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var fractionsTitleString = require( 'string!FRACTION_MATCHER/fractionsTitle' );

  function FractionsScreen() {
    Screen.call( this, fractionsTitleString, new IntroHomeScreenIcon(),
      function() { return new FractionMatcherModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height, fractionsTitleString, new Constants(), false ); },
      function( model ) { return new FractionMatcherView( model ); },
      {navigationBarIcon: new IntroNavigationBarIcon()}
    );
  }

  return inherit( Screen, FractionsScreen );
} );