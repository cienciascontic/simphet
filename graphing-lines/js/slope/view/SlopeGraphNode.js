// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph that provides direct manipulation of a line in point-slope form.
 * Adds manipulators for (x1,y1) and (x2,y2) to the base class functionality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LineFormsGraphNode = require( 'GRAPHING_LINES/common/view/LineFormsGraphNode' );
  var SlopeEquationNode = require( 'GRAPHING_LINES/slope/view/SlopeEquationNode' );
  var X1Y1Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/X1Y1Manipulator' );
  var X2Y2Manipulator = require( 'GRAPHING_LINES/common/view/manipulator/X2Y2Manipulator' );

  /**
   * @param {SlopeModel} model
   * @param {LineFormsViewProperties} viewProperties
   * @constructor
   */
  function SlopeGraphNode( model, viewProperties ) {

    var thisNode = this;
    LineFormsGraphNode.call( thisNode, model, viewProperties, SlopeEquationNode );

    var manipulatorRadius = model.modelViewTransform.modelToViewDeltaX( model.manipulatorRadius );

    // (x1,y1) point manipulator
    var x1y1Manipulator = new X1Y1Manipulator(
      manipulatorRadius, model.interactiveLineProperty, model.x1RangeProperty, model.y1RangeProperty, model.modelViewTransform, false /* constantSlope */ );

    // (x2,y2) point manipulator
    var x2y2Manipulator = new X2Y2Manipulator(
      manipulatorRadius, model.interactiveLineProperty, model.x2RangeProperty, model.y2RangeProperty, model.modelViewTransform );

    // rendering order
    thisNode.addChild( x1y1Manipulator );
    thisNode.addChild( x2y2Manipulator );

    // visibility of manipulators
    viewProperties.linesVisibleProperty.link( function( linesVisible ) {
      x1y1Manipulator.visible = x2y2Manipulator.visible = linesVisible;
    } );
  }

  return inherit( LineFormsGraphNode, SlopeGraphNode );
} );