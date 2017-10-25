// Copyright 2002-2014, University of Colorado Boulder

/**
 * Used to specify the form of the equations in Game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    SLOPE_INTERCEPT: 'SLOPE_INTERCEPT', /* y = mx + b */
    POINT_SLOPE: 'POINT_SLOPE' /* (y2 - y1) = m(x2 - x1) */
  } );
} );