// Copyright 2002-2013, University of Colorado Boulder

/**
 * An invisible line used for creating horizontal space when laying out panels.
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );

  function HStrut( width ) {
    Line.call( this, 0, 0, width, 0 );
  }

  return inherit( Line, HStrut );
} );