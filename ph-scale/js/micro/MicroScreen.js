// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroModel = require( 'PH_SCALE/micro/model/MicroModel' );
  var MicroView = require( 'PH_SCALE/micro/view/MicroView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/micro' );

  // images
  var homeIcon = require( 'image!PH_SCALE/Micro-home-icon.png' );
  var navbarIcon = require( 'image!PH_SCALE/Micro-navbar-icon.png' );

  function MicroScreen() {
    Screen.call( this,
      screenTitle,
      new Image( homeIcon ),
      function() { return new MicroModel(); },
      function( model ) { return new MicroView( model, ModelViewTransform2.createIdentity() ); },
      {
        backgroundColor: PHScaleColors.SCREEN_BACKGROUND,
        navigationBarIcon: new Image( navbarIcon )
      }
    );
  }

  return inherit( Screen, MicroScreen );
} );