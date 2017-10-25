// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Slope' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var LineFormsModel = require( 'GRAPHING_LINES/common/model/LineFormsModel' );
  var Property = require( 'AXON/Property' );

  function SlopeModel() {

    LineFormsModel.call( this, new Line( 1, 2, 3, 4, GLColors.INTERACTIVE_LINE ) );

    // ranges
    this.x1RangeProperty = new Property( this.graph.xRange );
    this.y1RangeProperty = new Property( this.graph.yRange );
    this.x2RangeProperty = new Property( this.graph.xRange );
    this.y2RangeProperty = new Property( this.graph.yRange );

    //NOTE: Unlike slope-intercept and point-slope, ranges do not need to be dynamically adjusted, because the points are free ranging.
  }

  return inherit( LineFormsModel, SlopeModel );
} );