// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroPHMeterNode = require( 'PH_SCALE/macro/view/MacroPHMeterNode' );
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NeutralIndicator = require( 'PH_SCALE/macro/view/NeutralIndicator' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  /**
   * @param {MacroModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function MacroView( model, modelViewTransform ) {

    var thisView = this;
    ScreenView.call( thisView, PHScaleConstants.SCREEN_VIEW_OPTIONS );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, modelViewTransform );
    var solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, modelViewTransform );

    // neutral indicator that appears in the bottom of the beaker
    var neutralIndicator = new NeutralIndicator( model.solution );

    // dropper
    var DROPPER_SCALE = 0.85;
    var dropperNode = new DropperNode( model.dropper, modelViewTransform );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * dropperNode.getTipWidth(), modelViewTransform );

    // faucets
    var waterFaucetNode = new WaterFaucetNode( model.waterFaucet, modelViewTransform );
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform );
    var WATER_FLUID_HEIGHT = model.beaker.location.y - model.waterFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), WATER_FLUID_HEIGHT, modelViewTransform );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // pH meter
    var pHMeterNode = new MacroPHMeterNode( model.pHMeter, model.solution, model.dropper,
      solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, modelViewTransform );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: function() {
        model.reset();
      }
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      // nodes are rendered in this order
      waterFluidNode,
      waterFaucetNode,
      drainFluidNode,
      drainFaucetNode,
      dropperFluidNode,
      dropperNode,
      solutionNode,
      beakerNode,
      neutralIndicator,
      volumeIndicatorNode,
      soluteComboBox,
      resetAllButton,
      pHMeterNode, // next to last so that probe doesn't get lost behind anything
      soluteListParent // last, so that combo box list is on top
    ] } );
    thisView.addChild( rootNode );

    // Layout of nodes that don't have a location specified in the model
    soluteComboBox.left = modelViewTransform.modelToViewX( model.beaker.left ) - 20; // anchor on left so it grows to the right during i18n
    soluteComboBox.top = this.layoutBounds.top + 15;
    neutralIndicator.centerX = beakerNode.centerX;
    neutralIndicator.bottom = beakerNode.bottom - 30;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, MacroView );
} );
