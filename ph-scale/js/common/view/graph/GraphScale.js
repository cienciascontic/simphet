// Copyright 2002-2013, University of Colorado Boulder

/**
 * Type of graph (log or linear).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    LOGARITHMIC: 'logarithmic',
    LINEAR: 'linear'
  } );
} );