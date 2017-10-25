// Copyright 2002-2014, University of Colorado Boulder

/**
 * Possible fill types in fraction games.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function() {
  'use strict';

  return Object.freeze( {
    SEQUENTIAL: 'sequential', // fills in order (left to right, etc)
    MIXED: 'mixed', // when number of shapes > 1, first shape will be completely filled and the 2nd shape will be random
    RANDOM: 'random' // when number of shapes > 1, all shapes will be randomized
  } );
} );
