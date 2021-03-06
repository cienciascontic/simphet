// Copyright 2002-2014, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * @param {Number|*} options font size or font options
   * @constructor
   */
  function GLFont( options ) {

    // convenience for specifying font size only, e.g. new GLFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = _.extend( {
      family: 'Arial'
    }, options );

    PhetFont.call( this, options );
  }

  return inherit( PhetFont, GLFont );
} );
