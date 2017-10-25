// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Micro' screen.
 * <p>
 * NOTE:
 * This view currently consists of a superset of the nodes in the 'Custom' screen.
 * But some of the common nodes are configured differently, and the screen has different layering and layout requirements.
 * So I choose to duplicate some code rather than attempt a refactor that would result in an implementation that
 * was more difficult to understand and maintain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerControls = require( 'PH_SCALE/common/view/BeakerControls' );
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var GraphNode = require( 'PH_SCALE/common/view/graph/GraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  var Water = require( 'PH_SCALE/common/model/Water' );
  var WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );

  /**
   * @param {MicroModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function MicroView( model, modelViewTransform ) {

    var thisView = this;
    ScreenView.call( thisView, PHScaleConstants.SCREEN_VIEW_OPTIONS );

    // view-specific properties
    var viewProperties = new PropertySet( {
      ratioVisible: false,
      moleculeCountVisible: false,
      pHMeterExpanded: true,
      graphExpanded: true
    } );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, modelViewTransform );
    var solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, modelViewTransform );

    // dropper
    var DROPPER_SCALE = 0.85;
    var dropperNode = new DropperNode( model.dropper, modelViewTransform );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * dropperNode.getTipWidth(), modelViewTransform );

    // faucets
    var waterFaucetNode = new WaterFaucetNode( model.waterFaucet, modelViewTransform );
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.waterFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), SOLVENT_FLUID_HEIGHT, modelViewTransform );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.beaker, model.solution, modelViewTransform, { visible: viewProperties.ratioVisibleProperty.get() } );
    viewProperties.ratioVisibleProperty.linkAttribute( ratioNode, 'visible' );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    viewProperties.moleculeCountVisibleProperty.linkAttribute( moleculeCountNode, 'visible' );

    // beaker controls
    var beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty );

    // graph
    var graphNode = new GraphNode( model.solution, viewProperties.graphExpandedProperty, {
      hasLinearFeature: true,
      logScaleHeight: 485,
      linearScaleHeight: 440
    } );

    // pH meter
    var pHMeterTop = 15;
    var pHMeterNode = new PHMeterNode( model.solution, modelViewTransform.modelToViewY( model.beaker.location.y ) - pHMeterTop, viewProperties.pHMeterExpandedProperty,
      { attachProbe: 'right' } );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: function() {
        model.reset();
        viewProperties.reset();
        graphNode.reset();
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
      pHMeterNode,
      ratioNode,
      beakerNode,
      moleculeCountNode,
      volumeIndicatorNode,
      beakerControls,
      graphNode,
      resetAllButton,
      soluteComboBox,
      soluteListParent // last, so that combo box list is on top
    ] } );
    thisView.addChild( rootNode );

    // Layout of nodes that don't have a location specified in the model
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 10;
    pHMeterNode.left = modelViewTransform.modelToViewX( model.beaker.left ) - ( 0.4 * pHMeterNode.width );
    pHMeterNode.top = pHMeterTop;
    graphNode.right = drainFaucetNode.left - 40;
    graphNode.top = pHMeterNode.top;
    soluteComboBox.left = pHMeterNode.right + 35;
    soluteComboBox.top = this.layoutBounds.top + pHMeterTop;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, MicroView );
} );
