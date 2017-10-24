// Copyright 2002-2013, University of Colorado Boulder

/*
 * The hole of a bucket
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * @param bucket Model of a bucket.
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  var BucketHole = function BucketHole( bucket, modelViewTransform ) {
    Node.call( this );

    var scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    var transformedShape = bucket.holeShape.transformed( scaleMatrix );
    var gradientPaint = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    gradientPaint.addColorStop( 0, 'black' );
    gradientPaint.addColorStop( 1, '#c0c0c0' );

    this.addChild( new Path( transformedShape, {
      fill: gradientPaint,
      stroke: '#777',
      lineWidth: 1
    } ) );

    // Set initial position.
    this.translation = modelViewTransform.modelToViewPosition( bucket.position );
  };

  inherit( Node, BucketHole );

  return BucketHole;
} );
