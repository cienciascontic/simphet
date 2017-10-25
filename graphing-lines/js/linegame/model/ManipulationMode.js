// Copyright 2002-2014, University of Colorado Boulder

/**
 * Manipulation modes, for use in configuring Game challenges.
 * These indicate which properties of a line the user is able to change.
 * For 'Graph the Line' challenges, this specifies what manipulators are provided on the graph.
 * For 'Make the Equation' challenges, this specifies which parts of the equation are interactive pickers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    SLOPE: 'SLOPE',
    INTERCEPT: 'INTERCEPT',
    SLOPE_INTERCEPT: 'SLOPE_INTERCEPT',
    POINT: 'POINT',
    POINT_SLOPE: 'POINT_SLOPE',
    TWO_POINTS: 'TWO_POINTS', /* 2 points that define a line: (x1,y1) and (x2,y2) */
    THREE_POINTS: 'THREE_POINTS'   /* 3 arbitrary points that may or may not form a line: p1, p2, p3 */
  } );
} );

