// Copyright 2002-2014, University of Colorado Boulder

/**
 * States during the 'play' phase of a game, mutually exclusive. (See GamePhase.)
 * For lack of better names, the state names correspond to the main action that
 * the user can take in that state.  For example. the FIRST_CHECK state is where the user
 * has their first opportunity to press the 'Check' button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    FIRST_CHECK: 'FIRST_CHECK',
    TRY_AGAIN: 'TRY_AGAIN',
    SECOND_CHECK: 'SECOND_CHECK',
    SHOW_ANSWER: 'SHOW_ANSWER',
    NEXT: 'NEXT',
    NONE: 'NONE' // use this value when game is not in the 'play' phase
  } );
} );

