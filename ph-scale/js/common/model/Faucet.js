// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {number} pipeMinX x-coordinate of where the pipe starts
   * @param {Object} [options]
   * @constructor
   */
  function Faucet( location, pipeMinX, options ) {

    options = _.extend( {
      spoutWidth: 45, // pixels
      maxFlowRate: 0.25, // L/sec
      flowRate: 0,
      enabled: true
    }, options );

    var thisFaucet = this;

    thisFaucet.location = location;
    thisFaucet.pipeMinX = pipeMinX;
    thisFaucet.spoutWidth = options.spoutWidth;
    thisFaucet.maxFlowRate = options.maxFlowRate;
    thisFaucet.flowRateProperty = new Property( options.flowRate );
    thisFaucet.enabledProperty = new Property( options.enabled );

    // when disabled, turn off the faucet.
    thisFaucet.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisFaucet.flowRateProperty.set( 0 );
      }
    } );
  }

  return inherit( Object, Faucet, {
    reset: function() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );

