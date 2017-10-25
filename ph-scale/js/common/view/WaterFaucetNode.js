// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function WaterFaucetNode( faucet, modelViewTransform ) {

    Node.call( this );

    var scale = 0.6;

    var horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    var faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 20,
      tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
      tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL
    } );
    faucetNode.translation = modelViewTransform.modelToViewPosition( faucet.location );
    faucetNode.setScaleMagnitude( -scale, scale ); // reflect horizontally
    this.addChild( faucetNode );

    // decorate the faucet with the name of the water
    var labelNode = new Text( Water.name, { font: new PhetFont( 28 ) } );
    this.addChild( labelNode );
    labelNode.right = faucetNode.left + 190;
    labelNode.bottom = faucetNode.centerY - 40;
  }

  return inherit( Node, WaterFaucetNode );
} );
