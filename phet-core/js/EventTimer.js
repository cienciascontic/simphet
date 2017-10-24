// Copyright 2002-2014, University of Colorado Boulder

/**
 * Abstraction for timed-event series that helps with variable frame-rates. Useful for things that need to happen at a
 * specific rate real-time regardless of the frame-rate.
 *
 * An EventTimer is created with a specific event "model" that determines when events occur, and a callback that will
 * be triggered for each event (with its time elapsed since it should have occurred).
 *
 * To run the EventTimer, call step( realTimeElapsed ), and it will call your callback for every event that would have
 * occurred over that time-frame (possibly zero).
 *
 * For example, create a timer with a constant rate that it will fire events every 1 time units:
 *
 * var timer = new core.EventTimer( new core.EventTimer.ConstantEventModel( 1 ), function( timeElapsed ) {
 *   console.log( 'event with timeElapsed: ' + timeElapsed );
 * } );
 *
 * Stepping once for 1.5 time units will fire once (0.5 seconds since the "end" of the step), and will be 0.5 seconds
 * from the next step:
 *
 * timer.step( 1.5 );
 * > event with timeElapsed: 0.5
 *
 * Stepping for a longer time will result in more events:
 *
 * timer.step( 6 );
 * > event with timeElapsed: 5.5
 * > event with timeElapsed: 4.5
 * > event with timeElapsed: 3.5
 * > event with timeElapsed: 2.5
 * > event with timeElapsed: 1.5
 * > event with timeElapsed: 0.5
 *
 * A step with zero time will trigger no events:
 *
 * timer.step( 0 );
 *
 * The timer will fire an event once it reaches the exact point in time:
 *
 * timer.step( 1.5 );
 * > event with timeElapsed: 1
 * > event with timeElapsed: 0
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var core = require( 'PHET_CORE/core' );
  var inherit = require( 'PHET_CORE/inherit' );

  /*
   * Create an event timer with a specific model (determines the time between events), and a callback to be called
   * for events.
   *
   * @param {Object with getPeriodBeforeNextEvent(): Number} eventModel: getPeriodBeforeNextEvent() will be called at
   *    the start and after every event to determine the time required to pass by before the next event occurs.
   * @param {Function} eventCallback( timeElapsed ): Will be called for every event. The timeElapsed passed in as the
   *    only argument denotes the time elapsed since the event would have occurred. E.g. if we step for 5 seconds and
   *    our event would have occurred 1 second into that step, the timeElapsed will be 4 seconds, since after the end
   *    of the 5 seconds the event would have happened 4 seconds ago.
   */
  core.EventTimer = function EventTimer( eventModel, eventCallback ) {
    assert && assert( typeof eventCallback === 'function', 'EventTimer requires a callback' );

    this.eventModel = eventModel;
    this.eventCallback = eventCallback;

    this.timeBeforeNextEvent = this.eventModel.getPeriodBeforeNextEvent();
  };

  inherit( Object, core.EventTimer, {
    step: function( dt ) {
      while ( dt >= this.timeBeforeNextEvent ) {
        dt -= this.timeBeforeNextEvent;
        this.timeBeforeNextEvent = this.eventModel.getPeriodBeforeNextEvent();

        // how much time has elapsed since this event began
        this.eventCallback( dt );
      }

      // use up the remaining DT
      this.timeBeforeNextEvent -= dt;
    }
  } );

  /*
   * Event model that will fire events at a constant rate. An event will occur every 1/rate time units.
   * @param {Number} rate
   */
  core.EventTimer.ConstantEventModel = inherit( Object, function ConstantEventRate( rate ) {
    assert && assert( typeof rate === 'number',
      'The rate should be a number' );
    assert && assert( rate > 0,
      'We need to have a strictly positive rate in order to prevent infinite loops.' );

    this.rate = rate;
  }, {
    getPeriodBeforeNextEvent: function() {
      return 1 / this.rate;
    }
  } );

  /*
   * Event model that will fire events averaging a certain rate, but with the time between events being uniformly
   * random.
   * The pseudoRandomNumberSource, when called, should generate uniformly distributed random numbers in the range [0,1).
   * @param {Number} rate
   * @param {Function} pseudoRandomNumberSource() : Number
   */
  core.EventTimer.UniformEventModel = inherit( Object, function UniformEventModel( rate, pseudoRandomNumberSource ) {
    assert && assert( typeof rate === 'number',
      'The rate should be a number' );
    assert && assert( typeof pseudoRandomNumberSource === 'function',
      'The pseudo-random number source should be a function' );
    assert && assert( rate > 0,
      'We need to have a strictly positive rate in order to prevent infinite loops.' );

    this.rate = rate;
    this.pseudoRandomNumberSource = pseudoRandomNumberSource;
  }, {
    getPeriodBeforeNextEvent: function() {
      var uniformRandomNumber = this.pseudoRandomNumberSource();
      assert && assert( typeof uniformRandomNumber === 'number' &&
                        uniformRandomNumber >= 0 && uniformRandomNumber < 1,
        'Our uniform random number is outside of its expected range with a value of ' + uniformRandomNumber );

      // sample the exponential distribution
      return uniformRandomNumber * 2 / this.rate;
    }
  } );

  /*
   * Event model that will fire events corresponding to a Poisson process with the specified rate.
   * The pseudoRandomNumberSource, when called, should generate uniformly distributed random numbers in the range [0,1).
   * @param {Number} rate
   * @param {Function} pseudoRandomNumberSource() : Number
   */
  core.EventTimer.PoissonEventModel = inherit( Object, function PoissonEventModel( rate, pseudoRandomNumberSource ) {
    assert && assert( typeof rate === 'number',
      'The time between events should be a number' );
    assert && assert( typeof pseudoRandomNumberSource === 'function',
      'The pseudo-random number source should be a function' );
    assert && assert( rate > 0,
      'We need to have a strictly positive poisson rate in order to prevent infinite loops.' );

    this.rate = rate;
    this.pseudoRandomNumberSource = pseudoRandomNumberSource;
  }, {
    getPeriodBeforeNextEvent: function() {
      // A poisson process can be described as having an independent exponential distribution for the time between
      // consecutive events.
      // see http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates and
      // http://en.wikipedia.org/wiki/Poisson_process

      var uniformRandomNumber = this.pseudoRandomNumberSource();
      assert && assert( typeof uniformRandomNumber === 'number' &&
                        uniformRandomNumber >= 0 && uniformRandomNumber < 1,
        'Our uniform random number is outside of its expected range with a value of ' + uniformRandomNumber );

      // sample the exponential distribution
      return -Math.log( uniformRandomNumber ) / this.rate;
    }
  } );

  return core.EventTimer;
} );