// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Custom' screen.
 * <p>
 * NOTE:
 * This view currently consists of a subset of the nodes in the 'Micro' screen.
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
  var GraphNode = require( 'PH_SCALE/common/view/graph/GraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  /**
   * @param {CustomModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function CustomView( model, modelViewTransform ) {

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
      isInteractive: true,
      logScaleHeight: 565
    } );

    // pH meter
    var pHMeterTop = 15;
    var pHMeterNode = new PHMeterNode( model.solution, modelViewTransform.modelToViewY( model.beaker.location.y ) - pHMeterTop, viewProperties.pHMeterExpandedProperty,
      { attachProbe: 'right', isInteractive: true } );

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
      solutionNode,
      pHMeterNode,
      ratioNode,
      beakerNode,
      moleculeCountNode,
      volumeIndicatorNode,
      beakerControls,
      graphNode,
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // Layout of nodes that don't have a location specified in the model
    pHMeterNode.left = beakerNode.left;
    pHMeterNode.top = pHMeterTop;
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 10;
    graphNode.right = beakerNode.left - 70;
    graphNode.top = pHMeterNode.top;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, CustomView );
} );
