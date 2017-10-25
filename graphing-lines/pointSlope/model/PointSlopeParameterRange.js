// Copyright 2002-2014, University of Colorado Boulder

/**
 * Methods for computing ranges of line parameters for point-slope form,
 * so that point and slope are within the visible range of the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  function PointSlopeParameterRange() {}

  return inherit( Object, PointSlopeParameterRange, {

    // Range for the x component of the point (x1,y1)
    x1: function( line, graph ) {
      var min = Math.max( graph.xRange.min, graph.xRange.min - line.run );
      var max = Math.min( graph.xRange.max, graph.xRange.max - line.run );
      return new Range( min, max );
    },

    // Range for the y component of the point (x1,y1)
    y1: function( line, graph ) {
      var min = Math.max( graph.yRange.min, graph.yRange.min - line.rise );
      var max = Math.min( graph.yRange.max, graph.yRange.max - line.rise );
      return new Range( min, max );
    },

    // Range for the vertical component of the slope
    rise: function( line, graph ) {
      var min = graph.yRange.min - line.y1;
      var max = graph.yRange.max - line.y1;
      return new Range( min, max );
    },

    // Range for the horizontal component of the slope
    run: function( line, graph ) {
      var min = graph.xRange.min - line.x1;
      var max = graph.xRange.max - line.x1;
      return new Range( min, max );
    }
  } );
} );