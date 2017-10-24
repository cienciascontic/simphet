// Copyright 2002-2013, University of Colorado Boulder

/**
 * Concentration meter, with probe.
 * <p/>
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * <ul>
 * <li>solution in the beaker
 * <li>output of the solvent faucet
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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeterBodyNode = require( 'SCENERY_PHET/MeterBodyNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/concentration' );
  var pattern_parentheses_0text = require( 'string!BEERS_LAW_LAB/pattern.parentheses.0text' );
  var units_molesPerLiterString = require( 'string!BEERS_LAW_LAB/units.molesPerLiter' );

  // images
  var bodyLeftImage = require( 'image!BEERS_LAW_LAB/concentration-meter-body-left.png' );
  var bodyCenterImage = require( 'image!BEERS_LAW_LAB/concentration-meter-body-center.png' );
  var bodyRightImage = require( 'image!BEERS_LAW_LAB/concentration-meter-body-right.png' );
  var probeImage = require( 'image!BEERS_LAW_LAB/concentration-meter-probe.png' );

  // constants
  var BODY_IS_DRAGGABLE = true;
  var VALUE_DECIMALS = 3;
  var NO_VALUE = '-';
  var TITLE_TOP = 10; // specific to bodyCenterImage
  var TEXT_X_MARGIN = 25;  // specific to bodyCenterImage
  var VALUE_X_MARGIN = 30; // specific to bodyCenterImage
  var VALUE_CENTER_Y = 84; // specific to bodyCenterImage

  /**
   * Meter body, origin at upper left.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BodyNode( meter, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    // text nodes
    var titleNode = new Text( concentrationString,
      { font: new PhetFont( 18 ), fill: 'white' } );
    var unitsNode = new Text( StringUtils.format( pattern_parentheses_0text, units_molesPerLiterString ),
      { font: new PhetFont( 18 ), fill: 'white' } );
    var valueNode = new Text( ( 1 ).toFixed( VALUE_DECIMALS ),
      { font: new PhetFont( 24 ), fill: 'black' } );

    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, unitsNode.width );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;
    var backgroundNode = new MeterBodyNode( bodyWidth, bodyLeftImage, bodyCenterImage, bodyRightImage );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( unitsNode );
    thisNode.addChild( valueNode );

    // layout
    titleNode.centerX = backgroundNode.centerX;
    titleNode.top = TITLE_TOP;
    unitsNode.centerX = backgroundNode.centerX;
    unitsNode.top = titleNode.bottom + 5;
    valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
    valueNode.centerY = VALUE_CENTER_Y;

    if ( BODY_IS_DRAGGABLE ) {
      thisNode.addInputListener( new MovableDragHandler( meter.body, modelViewTransform ) );
    }

    // body location
    meter.body.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // displayed value
    meter.value.link( function( value ) {
      if ( isNaN( value ) ) {
        valueNode.setText( NO_VALUE );
        valueNode.centerX = backgroundNode.centerX; // center justified
      }
      else {
        valueNode.setText( value.toFixed( VALUE_DECIMALS ) );
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    } );
  }

  inherit( Node, BodyNode );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    var imageNode = new Image( probeImage );
    thisNode.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -radius;
    imageNode.y = -radius;

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
      var localPoint = node.parentToLocalPoint( probe.locationProperty.get() );
      var nodeShape = node.getShape();
      var shapeBounds = nodeShape.bounds;
      return shapeBounds.getWidth() > 0 && shapeBounds.getHeight() > 0 && nodeShape.containsPoint( localPoint ); // see issue #65
    };

    thisNode.isInSolution = function() {
      return isInNode( solutionNode );
    };

    thisNode.isInSolvent = function() {
      return isInNode( solventFluidNode );
    };

    thisNode.isInDrainFluid = function() {
      return isInNode( drainFluidNode );
    };

    thisNode.isInStockSolution = function() {
      return isInNode( stockSolutionNode );
    };
  }

  inherit( Node, ProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, new Shape(), {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    var updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( 50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.locationProperty.link( updateCurve );
    probe.locationProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  /**
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( meter, modelViewTransform );
    var probeNode = new ProbeNode( meter.probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );

    var updateValue = function() {
      if ( probeNode.isInSolution() ) {
        meter.value.set( solution.concentration.get() );
      }
      else if ( probeNode.isInSolvent() ) {
        meter.value.set( 0 );
      }
      else if ( probeNode.isInDrainFluid() ) {
        meter.value.set( solution.concentration.get() );
      }
      else if ( probeNode.isInStockSolution() ) {
        meter.value.set( dropper.solute.get().stockSolutionConcentration );
      }
      else {
        meter.value.set( NaN );
      }
    };
    meter.probe.locationProperty.link( updateValue );
    solution.solute.link( updateValue );
    solution.concentration.link( updateValue );
    solutionNode.addEventListener( 'bounds', updateValue );
    stockSolutionNode.addEventListener( 'bounds', updateValue );
    solventFluidNode.addEventListener( 'bounds', updateValue );
    drainFluidNode.addEventListener( 'bounds', updateValue );
  }

  return inherit( Node, ConcentrationMeterNode );
} );
