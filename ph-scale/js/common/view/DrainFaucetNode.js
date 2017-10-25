// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DrainFaucetNode( faucet, modelViewTransform ) {

    var scale = 0.6;

    var horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 5,
      tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
      tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL
    } );
    this.translation = modelViewTransform.modelToViewPosition( faucet.location );
    this.setScaleMagnitude( -scale, scale ); // reflect horizontally
  }

  return inherit( FaucetNode, DrainFaucetNode );
} );