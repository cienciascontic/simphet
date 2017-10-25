// Copyright 2002-2014, University of Colorado Boulder

/**
 * Methods for computing ranges of line parameters for slope-intercept form,
 * so that slope and intercept are within the visible range of the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PointSlopeParameterRange = require( 'GRAPHING_LINES/pointslope/model/PointSlopeParameterRange' );
  var Range = require( 'DOT/Range' );

  function SlopeInterceptParameterRange() {
    PointSlopeParameterRange.call( this );
  }

  return inherit( PointSlopeParameterRange, SlopeInterceptParameterRange, {
    // @override Ranges are identical to point-slope, except that x1 is fixed at 0 for slope-intercept.
    x1: function() {
      return new Range( 0, 0 );
    }
  } );
} );