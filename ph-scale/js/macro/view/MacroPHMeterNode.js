// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Macro' screen.
 * <p/>
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * <ul>
 * <li>solution in the beaker
 * <li>output of the water faucet
 * <li>output of the drain faucet
 * <li>output of the dropper
 * </ul>
 * <p/>
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  // images
  var probeImage = require( 'image!PH_SCALE/pH-meter-probe.png' );

  // strings
  var acidicString = require( 'string!PH_SCALE/acidic' );
  var basicString = require( 'string!PH_SCALE/basic' );
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var BACKGROUND_ENABLED_FILL = 'rgb(31,113,2)';
  var BACKGROUND_DISABLED_FILL = 'rgb(178,178,178)';
  var SCALE_SIZE = new Dimension2( 55, 450 );
  var SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
  var TICK_LENGTH = 15;
  var TICK_FONT = new PhetFont( 22 );
  var NEUTRAL_TICK_LENGTH = 40;
  var TICK_LABEL_X_SPACING = 5;

  /**
   * The meter's vertical scale.
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( options ) {

    options = _.extend( {
      range: PHScaleConstants.PH_RANGE,
      size: new Dimension2( 75, 450 )
    }, options );

    var thisNode = this;
    Node.call( this );

    // gradient background
    this.backgroundStrokeWidth = 2; // @private
    var backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      fill: new LinearGradient( 0, 0, 0, options.size.height )
        .addColorStop( 0, PHScaleColors.BASIC )
        .addColorStop( 0.5, PHScaleColors.NEUTRAL )
        .addColorStop( 1, PHScaleColors.ACIDIC ),
      stroke: 'black',
      lineWidth: this.backgroundStrokeWidth
    } );
    thisNode.addChild( backgroundNode );

    // 'Acidic' label
    var textOptions = { fill: 'white', font: SCALE_LABEL_FONT };
    var acidicNode = new Text( acidicString, textOptions );
    acidicNode.rotation = -Math.PI / 2;
    acidicNode.centerX = backgroundNode.centerX;
    acidicNode.centerY = 0.75 * backgroundNode.height;
    thisNode.addChild( acidicNode );

    // 'Basic' label
    var basicNode = new Text( basicString, textOptions );
    basicNode.rotation = -Math.PI / 2;
    basicNode.centerX = backgroundNode.centerX;
    basicNode.centerY = 0.25 * backgroundNode.height;
    thisNode.addChild( basicNode );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    var y = options.size.height;
    var dy = -options.size.height / options.range.getLength();
    for ( var pH = options.range.min; pH <= options.range.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        var lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.right = backgroundNode.left;
        lineNode.centerY = y;
        thisNode.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          var tickLabelNode = new Text( pH, { font: TICK_FONT } );
          tickLabelNode.right = lineNode.left - TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = lineNode.centerY;
          thisNode.addChild( tickLabelNode );
        }
      }
      y += dy;
    }

    // 'Neutral' tick mark
    var neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 3 } );
    neutralLineNode.right = backgroundNode.left;
    neutralLineNode.centerY = options.size.height / 2;
    thisNode.addChild( neutralLineNode );
    var neutralLabelNode = new Text( '7', { fill: PHScaleColors.NEUTRAL, font: new PhetFont( { family: 'Arial black', size: 28, weight: 'bold' } ) } );
    thisNode.addChild( neutralLabelNode );
    neutralLabelNode.right = neutralLineNode.left - TICK_LABEL_X_SPACING;
    neutralLabelNode.centerY = neutralLineNode.centerY;
  }

  inherit( Node, ScaleNode, {

    // needed for precise positioning of things that point to values on the scale
    getBackgroundStrokeWidth: function() {
      return this.backgroundStrokeWidth;
    }
  } );

  /**
   * Displays pH value inside of a rounded rectangle, which is then placed inside of yet-another rounded rectangle.
   * It highlights when pH is 7.
   * This is the thing that you see sliding up and down the pH Scale.
   * @param {Property.<number>} pHProperty
   * @param {Property.<boolean>} enabledProperty
   * @constructor
   */
  function ValueNode( pHProperty, enabledProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH value
    var valueNode = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var cornerRadius = 12;
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), cornerRadius, cornerRadius,
      { fill: 'white' } );

    // label above the value
    var labelNode = new Text( pHString,
      { fill: 'white', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // background
    var backgroundXMargin = 14;
    var backgroundYMargin = 10;
    var backgroundYSpacing = 6;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * backgroundXMargin );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    var backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: BACKGROUND_ENABLED_FILL } );

    // highlight around the background
    var highlightLineWidth = 3;
    var outerHighlight = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { stroke: 'black', lineWidth: highlightLineWidth } );
    var innerHighlight = new Rectangle( highlightLineWidth, highlightLineWidth, backgroundWidth - ( 2 * highlightLineWidth ), backgroundHeight - ( 2 * highlightLineWidth ), cornerRadius, cornerRadius,
      { stroke: 'white', lineWidth: highlightLineWidth } );
    var highlight = new Node( { children: [ innerHighlight, outerHighlight ], visible: false } );

    // rendering order
    thisNode.addChild( backgroundRectangle );
    thisNode.addChild( highlight );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( valueNode );

    // layout
    labelNode.centerX = backgroundRectangle.centerX;
    labelNode.top = backgroundRectangle.top + backgroundYMargin;
    valueRectangle.centerX = backgroundRectangle.centerX;
    valueRectangle.top = labelNode.bottom + backgroundYSpacing;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;

    // pH value
    pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueNode.text = stringNoValue;
        valueNode.centerX = valueRectangle.centerX; // center justified
        highlight.visible = false;
      }
      else {
        valueNode.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueNode.right = valueRectangle.right - valueXMargin; // right justified
        highlight.visible = ( parseFloat( valueNode.text ) === 7 );
      }
    } );

    if ( enabledProperty ) {
      enabledProperty.link( function( enabled ) {
        backgroundRectangle.fill = enabled ? BACKGROUND_ENABLED_FILL : BACKGROUND_DISABLED_FILL;
      } );
    }
  }

  inherit( Node, ValueNode );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( probe, modelViewTransform, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    // probe image file
    var imageNode = new Image( probeImage );
    thisNode.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -imageNode.width + radius; // assumes the image is oriented with probe 'handle' on left
    imageNode.y = -radius; // assumes the image is oriented horizontally

    // probe location
    probe.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // touch area
    var dx = 0.25 * imageNode.width;
    var dy = 0.25 * imageNode.height;
    thisNode.touchArea = Shape.rectangle( imageNode.x - dx, imageNode.y - dy, imageNode.width + dx + dx, imageNode.height + dy + dy );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( probe, modelViewTransform ) );

    var isInNode = function( node ) {
      return node.getBounds().containsPoint( probe.locationProperty.get() );
    };

    thisNode.isInSolution = function() {
      return isInNode( solutionNode );
    };

    thisNode.isInWater = function() {
      return isInNode( waterFluidNode );
    };

    thisNode.isInDrainFluid = function() {
      return isInNode( drainFluidNode );
    };

    thisNode.isInDropperSolution = function() {
      return isInNode( dropperFluidNode );
    };
  }

  inherit( Node, ProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, new Shape(), {
      stroke: 'rgb(80,80,80)',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    var updateCurve = function() {

      var scaleCenterX = bodyNode.x + ( SCALE_SIZE.width / 2 );

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( scaleCenterX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.left, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 300, probeNode.left - scaleCenterX ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( -50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    probe.locationProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  /**
   * pH indicator that slides vertically along scale.
   * When there is no pH value, it points to 'neutral' but does not display a value.
   * @param {Property.<number>} pHProperty
   * @param {number} scaleWidth
   * @constructor
   */
  function IndicatorNode( pHProperty, scaleWidth ) {

    var thisNode = this;
    Node.call( thisNode );

    // dashed line that extends across the scale
    var lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // value
    var valueEnabled = new Property( true );
    var valueNode = new ValueNode( pHProperty, valueEnabled );

    // arrow head pointing at the scale
    var arrowSize = new Dimension2( 21, 28 );
    var arrowNode = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( arrowSize.width, -arrowSize.height / 2 )
        .lineTo( arrowSize.width, arrowSize.height / 2 )
        .close(),
      { fill: 'black' } );

    // rendering order
    thisNode.addChild( arrowNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( lineNode );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
    valueNode.left = arrowNode.right - 1; // overlap to hide seam
    valueNode.centerY = arrowNode.centerY;

    pHProperty.link( function( pH ) {
      // make the indicator look enabled or disabled
      var enabled = ( pH !== null );
      valueEnabled.set( enabled );
      arrowNode.visible = lineNode.visible = enabled;
    } );
  }

  inherit( Node, IndicatorNode );

  /**
   * @param {PHMeter} meter
   * @param {Solution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function MacroPHMeterNode( meter, solution, dropper, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH scale, positioned at meter 'body' location
    var scaleNode = new ScaleNode( { size: SCALE_SIZE } );
    scaleNode.translation = modelViewTransform.modelToViewPosition( meter.bodyLocation );

    // indicator that slides vertically along scale
    var indicatorNode = new IndicatorNode( meter.valueProperty, SCALE_SIZE.width );
    indicatorNode.left = scaleNode.x;

    var probeNode = new ProbeNode( meter.probe, modelViewTransform, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.probe, scaleNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( probeNode );
    thisNode.addChild( scaleNode );
    thisNode.addChild( indicatorNode );

    // vertical position of the indicator
    meter.valueProperty.link( function( value ) {
      indicatorNode.centerY = scaleNode.y + Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    } );

    var updateValue = function() {
      var value;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        value = solution.pHProperty.get();
      }
      else if ( probeNode.isInWater() ) {
        value = Water.pH;
      }
      else if ( probeNode.isInDropperSolution() ) {
        value = dropper.soluteProperty.get().pH;
      }
      else {
        value = null;
      }
      meter.valueProperty.set( value );
    };
    meter.probe.locationProperty.link( updateValue );
    solution.soluteProperty.link( updateValue );
    solution.pHProperty.link( updateValue );
    solutionNode.addEventListener( 'bounds', updateValue );
    dropperFluidNode.addEventListener( 'bounds', updateValue );
    waterFluidNode.addEventListener( 'bounds', updateValue );
    drainFluidNode.addEventListener( 'bounds', updateValue );
  }

  return inherit( Node, MacroPHMeterNode );
} );
