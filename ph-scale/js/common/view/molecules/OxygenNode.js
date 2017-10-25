// Copyright 2002-2013, University of Colorado Boulder

/**
 * Oxygen atom.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  function OxygenNode() {
    ShadedSphereNode.call( this, 30, {
      mainColor: PHScaleColors.OXYGEN,
      highlightColor: new Color( 255, 255, 255 )
    } );
  }

  return inherit( ShadedSphereNode, OxygenNode );
} );
