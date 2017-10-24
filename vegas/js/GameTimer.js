// Copyright 2002-2013, University of Colorado Boulder

/**
 * Game timer, keeps track of the elapsed time in the game using "wall clock" time.
 * The frame rate of this clock is sufficient for displaying a game timer in "seconds",
 * but not for driving smooth animation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Timer = require( 'JOIST/Timer' );

  // strings
  var pattern_0hours_1minutes_2seconds = require( 'string!VEGAS/pattern.0hours.1minutes.2seconds' );
  var pattern_0minutes_1seconds = require( 'string!VEGAS/pattern.0minutes.1seconds' );

  function GameTimer() {
    PropertySet.call( this, {
      elapsedTime: 0, // seconds since the timer was started
      isRunning: false
    } );
    this._intervalId = null; // private
  }

  /**
   * Formats a value representing seconds into H:MM:SS (localized).
   * @param {Number} time in seconds
   * @returns {string}
   */
  GameTimer.formatTime = function( time ) {

    var hours = Math.floor( time / 3600 );
    var minutes = Math.floor( (time - (hours * 3600)) / 60 );
    var seconds = Math.floor( time - (hours * 3600) - (minutes * 60) );

    var minutesString = ( minutes > 9 || hours === 0 ) ? minutes : ( '0' + minutes );
    var secondsString = ( seconds > 9 ) ? seconds : ( '0' + seconds );

    if ( hours > 0 ) {
      return StringUtils.format( pattern_0hours_1minutes_2seconds, hours, minutesString, secondsString );
    }
    else {
      return StringUtils.format( pattern_0minutes_1seconds, minutesString, secondsString );
    }
  };

  return inherit( PropertySet, GameTimer, {

    // Starts the timer. This is a no-op if the timer is already running.
    start: function() {
      if ( !this.isRunning ) {
        var thisTimer = this;
        thisTimer.elapsedTime = 0;
        thisTimer._intervalId = Timer.setInterval( function() {
          //TODO will this be accurate, or should we compute elapsed time and potentially skip some time values?
          thisTimer.elapsedTime += 1;
        }, 1000 ); // fire once per second
        thisTimer.isRunning = true;
      }
    },

    // Stops the timer. This is a no-op if the timer is already stopped.
    stop: function() {
      if ( this.isRunning ) {
        Timer.clearInterval( this._intervalId );
        this._intervalId = null;
        this.isRunning = false;
      }
    },

    // Convenience function for restarting the timer.
    restart: function() {
      this.stop();
      this.start();
    }
  } );
} );