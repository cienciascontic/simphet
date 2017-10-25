// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 * Additional constants for the 'Line Game' screen are in LineGameConstants.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Range = require( 'DOT/Range' );

  return {
    SCREEN_VIEW_OPTIONS: { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },
    X_AXIS_RANGE: new Range( -10, 10 ),
    Y_AXIS_RANGE: new Range( -10, 10 ),
    INTERACTIVE_EQUATION_FONT_SIZE: 34,
    PICKER_TOUCH_AREA_EXPAND_X: 30,
    MANIPULATOR_RADIUS: 0.425,
    SCREEN_X_MARGIN: 40,
    SCREEN_Y_MARGIN: 20,
    RESET_ALL_BUTTON_SCALE: 1.32
  };
} );
