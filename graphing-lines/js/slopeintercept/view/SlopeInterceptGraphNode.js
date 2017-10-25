// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph that provides direct manipulation of a line in slope-intercept form.
 * Adds manipulators for slope and intercept to the base class functionality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LineFormsGraphNode = require( 'GRAPHING_LINES/common/view/LineFormsGraphNode' );
  var SlopeInterceptEquationNode = require( 'GRAPHING_LINES/slopeintercept/view/SlopeInterceptEquationNode' );
  var SlopeManipulator = require( 'GRAPHING_LINES/common/view/manipulator/SlopeManipulator' );
  var YInterceptManipulator = require( 'GRAPHING_LINES/common/view/manipulator/YInterceptManipulator' );

  /**
   * @param {SlopeInterceptModel} model
   * @param {LineFormsViewProperties} viewProperties
   * @constructor
   */
  function SlopeInterceptGraphNode( model, viewProperties ) {

    var thisNode = this;
    LineFormsGraphNode.call( thisNode, model, viewProperties, SlopeInterceptEquationNode );

    var manipulatorRadius = model.modelViewTransform.modelToViewDeltaX( model.manipulatorRadius );

    // slope manipulator
    var slopeManipulator = new SlopeManipulator(
      manipulatorRadius, model.interactiveLineProperty, model.riseRangeProperty, model.runRangeProperty, model.modelViewTransform );

    // intercept manipulator
    var yInterceptManipulator = new YInterceptManipulator(
      manipulatorRadius, model.interactiveLineProperty, model.y1RangeProperty, model.modelViewTransform );

    // rendering order
    thisNode.addChild( slopeManipulator );
    thisNode.addChild( yInterceptManipulator );

    // visibility of manipulators
    viewProperties.linesVisibleProperty.link( function( linesVisible ) {
      slopeManipulator.visible = yInterceptManipulator.visible = linesVisible;
    } );
  }

  return inherit( LineFormsGraphNode, SlopeInterceptGraphNode );
} );