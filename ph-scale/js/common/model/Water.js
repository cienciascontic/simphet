// Copyright 2002-2014, University of Colorado Boulder

/**
 * Water, the solvent in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );

  // strings
  var waterString = require( 'string!PH_SCALE/choice.water' );

  return Object.freeze( {
    name: waterString,
    pH: 7,
    color: PHScaleColors.WATER
  } );
} );
