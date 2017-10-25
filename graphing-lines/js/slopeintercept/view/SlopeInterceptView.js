// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Slope-Intercept' screen.
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
  var SlopeInterceptEquationNode = require( 'GRAPHING_LINES/slopeintercept/view/SlopeInterceptEquationNode' );
  var SlopeInterceptGraphNode = require( 'GRAPHING_LINES/slopeintercept/view/SlopeInterceptGraphNode' );

  /**
   * @param {SlopeInterceptModel} model
   * @constructor
   */
  function SlopeInterceptView( model ) {

    var viewProperties = new LineFormsViewProperties();

    LineFormsView.call( this, model, viewProperties,

      // graph
      new SlopeInterceptGraphNode( model, viewProperties ),

      // graph controls
      new GraphControls(
        viewProperties.linesVisibleProperty,
        viewProperties.slopeToolVisibleProperty,
        model.standardLines ),

      // equation controls
      new EquationControls(
        SlopeInterceptEquationNode.createGeneralFormNode(),
        model.interactiveLineProperty,
        model.savedLines,
        viewProperties.interactiveEquationVisibleProperty,
        viewProperties.linesVisibleProperty,
        new SlopeInterceptEquationNode( model.interactiveLineProperty, {
          riseRangeProperty: model.riseRangeProperty,
          runRangeProperty: model.runRangeProperty,
          yInterceptRangeProperty: model.y1RangeProperty
        } )
      )
    );
  }

  return inherit( LineFormsView, SlopeInterceptView );
} );