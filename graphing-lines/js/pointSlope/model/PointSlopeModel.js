// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Point-Slope' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var LineFormsModel = require( 'GRAPHING_LINES/common/model/LineFormsModel' );
  var PointSlopeParameterRange = require( 'GRAPHING_LINES/pointslope/model/PointSlopeParameterRange' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Line} interactiveLine
   * @param {PointSlopeParameterRange} parameterRange optional
   * @constructor
   */
  function PointSlopeModel( interactiveLine, parameterRange ) {

    interactiveLine = interactiveLine || Line.createPointSlope( 1, 2, 3, 4, GLColors.INTERACTIVE_LINE );
    parameterRange = parameterRange || new PointSlopeParameterRange();

    var thisModel = this;

    LineFormsModel.call( thisModel, interactiveLine );

    // ranges
    thisModel.x1RangeProperty = new Property( thisModel.graph.xRange );
    thisModel.y1RangeProperty = new Property( thisModel.graph.yRange );
    thisModel.riseRangeProperty = new Property( thisModel.graph.yRange );
    thisModel.runRangeProperty = new Property( thisModel.graph.xRange );

    // Dynamically adjust ranges so that variables are constrained to the bounds of the graph.
    thisModel.interactiveLineProperty.link( function( line ) {
      thisModel.x1RangeProperty.set( parameterRange.x1( line, thisModel.graph ) );
      thisModel.y1RangeProperty.set( parameterRange.y1( line, thisModel.graph ) );
      thisModel.riseRangeProperty.set( parameterRange.rise( line, thisModel.graph ) );
      thisModel.runRangeProperty.set( parameterRange.run( line, thisModel.graph ) );
    } );
  }

  return inherit( LineFormsModel, PointSlopeModel );
} );