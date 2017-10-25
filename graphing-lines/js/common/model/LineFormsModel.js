// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for the 'Slope', 'Slope-Intercept' and 'Point-Slope' models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var GLConstants = require( 'GRAPHING_LINES/common/GLConstants' );
  var Graph = require( 'GRAPHING_LINES/common/model/Graph' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PointTool = require( 'GRAPHING_LINES/common/model/PointTool' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var GRID_VIEW_UNITS = 530; // max dimension (width or height) of the grid in view coordinates
  var ORIGIN_OFFSET = new Vector2( 315, 330 ); // offset of the graph's origin in view coordinates

  /**
   * @param {Line} interactiveLine
   * @constructor
   */
  function LineFormsModel( interactiveLine ) {

    var thisModel = this;
    PropertySet.call( thisModel, { interactiveLine: interactiveLine } );

    // radius of the manipulators
    thisModel.manipulatorRadius = GLConstants.MANIPULATOR_RADIUS;

    // graph
    thisModel.graph = new Graph( GLConstants.X_AXIS_RANGE, GLConstants.Y_AXIS_RANGE );

    // model-view transform, created in the model because it's dependent on graph axes ranges
    var modelViewTransformScale = GRID_VIEW_UNITS / Math.max( thisModel.graph.xRange.getLength(), thisModel.graph.yRange.getLength() ); // view units / model units
    thisModel.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( ORIGIN_OFFSET, modelViewTransformScale, -modelViewTransformScale ); // y is inverted

    // static lines
    thisModel.savedLines = new ObservableArray();
    thisModel.standardLines = new ObservableArray();

    // Update the lines seen by the graph.
    Property.multilink( [ thisModel.interactiveLineProperty, thisModel.savedLines.lengthProperty, thisModel.standardLines.lengthProperty ],
      function() {
        thisModel.graph.lines.clear();
        // add lines in the order that they would be rendered
        thisModel.graph.lines.add( thisModel.interactiveLine );
        thisModel.savedLines.forEach( function( line ) {
          thisModel.graph.lines.add( line );
        } );
        thisModel.standardLines.forEach( function( line ) {
          thisModel.graph.lines.add( line );
        } );
      }
    );

    // point tools, drag bounds determined by 'eye balling' so that the point tool nodes remain on screen.
    thisModel.pointTool1 = new PointTool( new Vector2( -5, -10.5 ), 'up', thisModel.graph.lines,
      new Bounds2( thisModel.graph.xRange.min - 1, thisModel.graph.yRange.min - 1, thisModel.graph.xRange.max + 3, thisModel.graph.yRange.max + 3 ) );
    thisModel.pointTool2 = new PointTool( new Vector2( 3, -13 ), 'down', thisModel.graph.lines,
      new Bounds2( thisModel.graph.xRange.min - 1, thisModel.graph.yRange.min - 3, thisModel.graph.xRange.max + 3, thisModel.graph.yRange.max + 1 ) );
  }

  return inherit( PropertySet, LineFormsModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.savedLines.clear();
      this.standardLines.clear();
      this.pointTool1.reset();
      this.pointTool2.reset();
    }
  } );
} );