// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Slope' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var EquationControls = require( 'GRAPHING_LINES/common/view/EquationControls' );
  var GraphControls = require( 'GRAPHING_LINES/common/view/GraphControls' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineFormsView = require( 'GRAPHING_LINES/common/view/LineFormsView' );
  var LineFormsViewProperties = require( 'GRAPHING_LINES/common/view/LineFormsViewProperties' );
  var SlopeEquationNode = require( 'GRAPHING_LINES/slope/view/SlopeEquationNode' );
  var SlopeGraphNode = require( 'GRAPHING_LINES/slope/view/SlopeGraphNode' );

  /**
   * @param {SlopeModel} model
   * @constructor
   */
  function SlopeView( model ) {

    var viewProperties = new LineFormsViewProperties();

    LineFormsView.call( this, model, viewProperties,

      // graph
      new SlopeGraphNode( model, viewProperties ),

      // graph controls
      new GraphControls(
        viewProperties.linesVisibleProperty,
        viewProperties.slopeToolVisibleProperty,
        model.standardLines,
        { includeStandardLines: false } ),

      // equation controls
      new EquationControls(
        SlopeEquationNode.createGeneralFormNode(),
        model.interactiveLineProperty,
        model.savedLines,
        viewProperties.interactiveEquationVisibleProperty,
        viewProperties.linesVisibleProperty,
        new SlopeEquationNode( model.interactiveLineProperty, {
          x1RangeProperty: model.x1RangeProperty,
          y1RangeProperty: model.y1RangeProperty
        } )
      )
    );
  }

  return inherit( LineFormsView, SlopeView );
} );