// Copyright 2002-2013, University of Colorado Boulder

/**
 * Timer so that other modules can run timing related code through the simulation's requestAnimationFrame.
 * Note: this is not specific to the running screen, it is global across all screens.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var cleanArray = require( 'PHET_CORE/cleanArray' );

  var listeners = [];
  var listenersDefensiveCopy = []; // separated out to prevent garbage collection issues
  return {

    //Trigger a step event, called by Sim.js in the animation loop
    step: function( dt ) {
      var length = listeners.length;
      var i;

      // to safely allow listeners to remove themselves while being called (as is explicitly done in setTimeout), we make a copy of the array.
      // we don't use slice(), since that would cause garbage collection issues.
      for ( i = 0; i < length; i++ ) {
        listenersDefensiveCopy[i] = listeners[i];
      }
      for ( i = 0; i < length; i++ ) {
        listenersDefensiveCopy[i]( dt );
      }
      cleanArray( listenersDefensiveCopy );
    },

    //Add a listener to be called back once after the specified time (in milliseconds)
    setTimeout: function( listener, timeout ) {
      var elapsed = 0;
      var timer = this;
      var callback = function( dt ) {
        elapsed += dt;

        //Convert seconds to ms and see if item has timed out
        if ( elapsed * 1000 >= timeout ) {
          listener();
          timer.removeStepListener( callback );
        }
      };
      this.addStepListener( callback );

      //Return the callback so it can be removed with removeStepListener
      return callback;
    },

    //Clear a scheduled timeout
    clearTimeout: function( timeoutID ) { this.removeStepListener( timeoutID ); },

    //Add a listener to be called at specified intervals (in milliseconds)
    setInterval: function( listener, interval ) {
      var elapsed = 0;
      var callback = function( dt ) {
        elapsed += dt;

        //Convert seconds to ms and see if item has timed out
        while ( elapsed * 1000 >= interval && listeners.indexOf( callback ) !== -1 ) {
          listener();
          elapsed = elapsed - interval / 1000.0; //Save the leftover time so it won't accumulate
        }
      };
      this.addStepListener( callback );

      //Return the callback so it can be removed with removeStepListener
      return callback;
    },

    //Clear a scheduled interval
    clearInterval: function( intervalID ) { this.removeStepListener( intervalID ); },

    //Add a listener to be called back on every animationFrame with a dt value
    addStepListener: function( listener ) { listeners.push( listener ); },

    //Remove a step listener from being called back
    removeStepListener: function( listener ) {
      var index = listeners.indexOf( listener );
      assert && assert( index !== -1, 'An attempt was made to remove a non-existent step listener' );
      if ( index !== -1 ) {
        listeners.splice( index, 1 );
      }
    }
  };
} );
