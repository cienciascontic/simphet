// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Point Slope' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var IconFactory = require( 'GRAPHING_LINES/common/view/IconFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PointSlopeModel = require( 'GRAPHING_LINES/pointSlope/model/PointSlopeModel' );
  var PointSlopeView = require( 'GRAPHING_LINES/pointSlope/view/PointSlopeView' );
  var Screen = require( 'JOIST/SCREEN' );

  // strings
  var title = require( 'string!GRAPHING_LINES/tab.pointSlope' );

  function PointSlopeScreen() {
    Screen.call( this, title,
      IconFactory.createPointSlopeScreenIcon(),
      function() { return new PointSlopeModel(); },
      function( model ) { return new PointSlopeView( model ); },
      { backgroundColor: GLColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, PointSlopeScreen );
} );