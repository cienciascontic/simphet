// Copyright 2002-2013, University of Colorado Boulder

/**
 * The indicator that points to a value on a graph's vertical scale.
 * Origin is at the indicator's pointer, and the pointer can be attached to any corner of the indicator (see options.pointerLocation).
 * Interactive indicators are decorated with a double-headed arrow, indicating the direction of dragging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var H2ONode = require( 'PH_SCALE/common/view/molecules/H2ONode' );
  var H3ONode = require( 'PH_SCALE/common/view/molecules/H3ONode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHNode = require( 'PH_SCALE/common/view/molecules/OHNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // constants
  var POINTER_WIDTH_PERCENTAGE = 0.15; // used to compute width of the pointy part of the indicator
  var POINTER_HEIGHT_PERCENTAGE = 0.5; // used to compute height of the pointy part of the indicator

  /**
   * @param {Property.<number>} valueProperty
   * @param {Node} moleculeNode
   * @param {Node} formulaNode
   * @param {Object} [options]
   * @constructor
   */
  function GraphIndicator( valueProperty, moleculeNode, formulaNode, options ) {

    options = _.extend( {
      scale: 0.75, // specified by design team
      pointerLocation: 'topRight', // values: topLeft, topRight, bottomLeft, bottomRight
      backgroundFill: 'white',
      backgroundWidth: 160,
      backgroundHeight: 80,
      backgroundCornerRadius: 10,
      backgroundStroke: 'black',
      backgroundLineWidth: 2,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 8,
      ySpacing: 4,
      mantissaDecimalPlaces: 1,
      exponent: null, // use this to request a specific exponent, otherwise the exponent is computed
      isInteractive: false,
      arrowFill: 'rgb(0,200,0)',
      arrowXSpacing: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // Transform shapes to support various orientations of pointer.
    var shapeMatrix;
    if ( options.pointerLocation === 'topRight' ) {
      shapeMatrix = Matrix3.identity(); // background shape will be drawn with pointer at top-right
    }
    else if ( options.pointerLocation === 'topLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, 1 );
    }
    else if ( options.pointerLocation === 'bottomRight' ) {
      shapeMatrix = Matrix3.scaling( 1, -1 );
    }
    else if ( options.pointerLocation === 'bottomLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, -1 );
    }
    else {
      throw new Error( 'unsupported options.pointerLocation: ' + options.pointerLocation );
    }

    // Background with the pointer at top-right. Proceed clockwise from the tip of the pointer.
    var backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth, ( POINTER_HEIGHT_PERCENTAGE * options.backgroundHeight ) - options.backgroundCornerRadius )
      .arc( ( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth ) - options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, 0, Math.PI / 2, false )
      .lineTo( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.backgroundWidth, options.backgroundCornerRadius )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI, 1.5 * Math.PI, false )
      .close()
      .transformed( shapeMatrix );
    var backgroundNode = new Path( backgroundShape, {
      lineWidth: options.backgroundLineWidth,
      stroke: options.backgroundStroke,
      fill: options.backgroundFill } );

    // Cutout where the value is displayed.
    var valueBackgroundNode = new Rectangle( 0, 0,
      ( ( 1 - POINTER_WIDTH_PERCENTAGE ) * options.backgroundWidth ) - ( 2 * options.backgroundXMargin ),
      0.5 * options.backgroundHeight - options.backgroundYMargin - ( options.ySpacing / 2 ),
      0.5 * options.backgroundCornerRadius, 0.5 * options.backgroundCornerRadius, {
        fill: 'white',
        stroke: 'gray'
      } );

    // Value, scaled to fit background height
    var valueNode = new ScientificNotationNode( valueProperty, {
      font: new PhetFont( 28 ),
      fill: 'black',
      mantissaDecimalPlaces: options.mantissaDecimalPlaces,
      exponent: options.exponent
    } );
    valueNode.setScaleMagnitude( 0.7 );

    // molecule and formula, scaled to fit available height
    var moleculeAndFormula = new Node();
    moleculeAndFormula.addChild( moleculeNode );
    moleculeAndFormula.addChild( formulaNode );
    formulaNode.left = moleculeNode.right + options.xSpacing;
    formulaNode.centerY = moleculeNode.centerY;
    moleculeAndFormula.setScaleMagnitude( 0.7 );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( valueBackgroundNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( moleculeAndFormula );

    // layout, relative to backgroundNode
    if ( options.pointerLocation === 'topRight' || options.pointerLocation === 'bottomRight' ) {
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    valueNode.centerY = valueBackgroundNode.centerY;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    moleculeAndFormula.centerX = valueBackgroundNode.centerX;
    moleculeAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

    if ( options.isInteractive ) {

      // add double-headed arrow
      var arrowNode = new ArrowNode( 0, 0, 0, 0.75 * options.backgroundHeight, {
        doubleHead: true,
        tailWidth: 10,
        headWidth: 28,
        headHeight: 22,
        fill: options.arrowFill,
        stroke: 'black',
        lineWidth: 2
      } );
      thisNode.addChild( arrowNode );

      // put the arrow on opposite side of the indicator's pointer
      if ( options.pointerLocation === 'topRight' || options.pointerLocation === 'bottomRight' ) {
        arrowNode.right = backgroundNode.left - options.arrowXSpacing;
      }
      else {
        arrowNode.left = backgroundNode.right + options.arrowXSpacing;
      }
      arrowNode.centerY = backgroundNode.centerY;

      // make the entire bounds interactive, so there's no dead space between background and arrows
      thisNode.mouseArea = thisNode.touchArea = thisNode.localBounds;

      // set pickable false for nodes that don't need to be interactive, to improve performance.
      valueNode.pickable = false;
      valueBackgroundNode.pickable = false;
      moleculeAndFormula.pickable = false;
    }

    // sync with value
    valueProperty.link( function( value ) {
      // disabled when value is zero
      var isEnabled = ( value !== 0 );
      thisNode.opacity = isEnabled ? 1.0 : 0.5;
      thisNode.cursor = ( isEnabled && options.isInteractive ) ? 'pointer' : 'default';
    } );

    /*
     * Don't do this by observing valueProperty, since we need to be certain that valueNode has updated its display.
     * Listen for 'childBounds' instead of 'bounds' so we don't get into an infinite bounds listener cycle caused
     * by moving the node whose bounds we're listening to.
     */
    valueNode.addEventListener( 'childBounds', function() {
      // center value in the display
      valueNode.center = valueBackgroundNode.center;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, GraphIndicator, {}, {

    /**
     * Creates an indicator for H3O+.
     * @static
     * @param {Property.<number>} valueProperty
     * @param {Object} [options] see GraphIndicator constructor
     */
    createH3OIndicator: function( valueProperty, options ) {
      return new GraphIndicator( valueProperty,
        new H3ONode(),
        new SubSupText( PHScaleConstants.H3O_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
        _.extend( {
          backgroundFill: PHScaleColors.ACIDIC,
          pointerLocation: 'topRight'
        }, options ) );
    },

    /**
     * Creates an indicator for OH-.
     * @static
     * @param {Property.<number>} valueProperty
     * @param {Object} [options] see GraphIndicator constructor
     */
    createOHIndicator: function( valueProperty, options ) {
      return new GraphIndicator( valueProperty,
        new OHNode(),
        new SubSupText( PHScaleConstants.OH_FORMULA, { font: new PhetFont( 28 ), fill: 'white', supXSpacing: 2 } ),
        _.extend( {
          backgroundFill: PHScaleColors.BASIC,
          pointerLocation: 'topLeft'
        }, options ) );
    },

    /**
     * Creates an indicator for H2O.
     * @static
     * @param {Property.<number>} valueProperty
     * @param {Object} [options] see GraphIndicator constructor
     */
    createH2OIndicator: function( valueProperty, options ) {
      return new GraphIndicator( valueProperty,
        new H2ONode(),
        new SubSupText( PHScaleConstants.H2O_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
        _.extend( {
          backgroundFill: PHScaleColors.H2O_BACKGROUND,
          pointerLocation: 'bottomLeft',
          mantissaDecimalPlaces: 0,
          exponent: 0
        }, options ) );
    }
  } );
} );