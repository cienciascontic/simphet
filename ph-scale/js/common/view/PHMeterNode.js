// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Micro' and 'Custom' screens.
 * Origin is at top left.
 * The meter can be expanded and collapsed.
 * By default, the meter displays pH but does not allow you to change it.
 * pH can be optionally changed (using a picker) for custom solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var X_MARGIN = 14;
  var Y_MARGIN = 10;
  var CORNER_RADIUS = 12;
  var SPINNER_DELTA = 0.01;
  var SPINNER_X_SPACING = 6;
  var SPINNER_Y_SPACING = 4;
  var SPINNER_INTERVAL_DELAY = 40;
  var SPINNER_ARROW_COLOR = 'rgb(0,200,0)';

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * This button also causes the ValueNode to show/hide the value.
   *
   * @param {Solution} solution
   * @param {Property.<boolean>} expandedProperty
   * @param {boolean} isInteractive
   * @constructor
   */
  function ValueNode( solution, expandedProperty, isInteractive ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH value
    var valueText = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var valueRectangle = new Rectangle( 0, 0, valueText.width + ( 2 * valueXMargin ), valueText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
      { fill: 'white', stroke: 'darkGray' } );

    // layout
    valueText.right = valueRectangle.right - valueXMargin;
    valueText.centerY = valueRectangle.centerY;

    // parent for all components related to the value
    var valueNode = new Node( { children: [ valueRectangle, valueText ] } );

    // sync with pH value
    solution.pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueText.text = stringNoValue;
        valueText.centerX = valueRectangle.centerX; // center justified
      }
      else {
        valueText.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueText.right = valueRectangle.right - valueXMargin; // right justified
      }
    } );

    // optional spinner arrows
    if ( isInteractive ) {

      var pHValueProperty, upArrowNode, downArrowNode;

      // options common to both arrow buttons
      var arrowButtonOptions = { intervalDelay: SPINNER_INTERVAL_DELAY, enabledFill: SPINNER_ARROW_COLOR };

      // up arrow
      upArrowNode = new ArrowButton( 'up',
        function() {
          pHValueProperty.set( Math.min( PHScaleConstants.PH_RANGE.max, solution.pHProperty.get() + SPINNER_DELTA ) );
        },
        _.extend( {
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 )
        }, arrowButtonOptions )
      );
      valueNode.addChild( upArrowNode );

      // down arrow
      downArrowNode = new ArrowButton( 'down',
        function() {
          pHValueProperty.set( Math.max( PHScaleConstants.PH_RANGE.min, solution.pHProperty.get() - SPINNER_DELTA ) );
        },
        _.extend( {
          left: upArrowNode.left,
          top: upArrowNode.bottom + SPINNER_Y_SPACING
        }, arrowButtonOptions )
      );
      valueNode.addChild( downArrowNode );

      // touch areas, expanded mostly to the right
      var expandX = upArrowNode.width / 2;
      var expandY = 6;
      upArrowNode.touchArea = upArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, -expandY );
      downArrowNode.touchArea = downArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, expandY );

      /*
       * solution.pHProperty is derived, so we can't change it directly.
       * So when pH changes, create a new custom solution with the desired pH.
       */
      pHValueProperty = new Property( solution.pHProperty.get() );
      solution.pHProperty.link( function( pH ) {
        pHValueProperty.set( pH );
      } );
      pHValueProperty.link( function( pH ) {
        if ( pH !== null && pH !== solution.pHProperty.get() ) {
          solution.soluteProperty.set( Solute.createCustom( pH ) );
        }
        upArrowNode.enabled = ( pH < PHScaleConstants.PH_RANGE.max );
        downArrowNode.enabled = ( pH > PHScaleConstants.PH_RANGE.min );
      } );
    }

    // label above the value
    var labelNode = new Text( pHString, { fill: 'black', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // expanded background
    var backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width, valueNode.width ) + ( 2 * X_MARGIN );
    var ySpacing = isInteractive ? 25 : 10;
    var expandedHeight = labelNode.height + valueNode.height + ( 2 * Y_MARGIN ) + ySpacing;
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * Y_MARGIN );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, { sideLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH } );
    expandCollapseButton.touchArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 10, 10 ) );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = expandedRectangle.top + Y_MARGIN;
    labelNode.left = X_MARGIN;
    valueNode.centerX = expandedRectangle.centerX;
    valueNode.top = labelNode.bottom + ySpacing;
    expandCollapseButton.right = expandedRectangle.right - X_MARGIN;
    expandCollapseButton.centerY = labelNode.centerY;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = valueNode.visible = expanded;
      collapsedRectangle.visible = !expanded;
    } );
  }

  inherit( Node, ValueNode );

  /**
   * Probe that extends out the bottom of the meter.
   * @param probeHeight
   * @constructor
   */
  function ProbeNode( probeHeight ) {

    Node.call( this );

    var probeWidth = 20;
    var tipHeight = 50;
    var overlap = 10;

    var shaftNode = new Rectangle( 0, 0, 0.5 * probeWidth, probeHeight - tipHeight + overlap, { fill: 'rgb(140,140,140)' } );

    // clockwise from tip of probe
    var cornerRadius = 4;
    var tipNode = new Path( new Shape()
      .moveTo( probeWidth / 2, tipHeight )
      .lineTo( 0, 0.6 * tipHeight )
      .lineTo( 0, cornerRadius )
      .arc( cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI )
      .lineTo( cornerRadius, 0 )
      .lineTo( probeWidth - cornerRadius, 0 )
      .arc( probeWidth - cornerRadius, cornerRadius, cornerRadius, -0.5 * Math.PI, 0 )
      .lineTo( probeWidth, 0.6 * tipHeight )
      .close(),
      { fill: 'black' }
    );

    this.addChild( shaftNode );
    this.addChild( tipNode );

    tipNode.centerX = shaftNode.centerX;
    tipNode.top = shaftNode.bottom - overlap;
  }

  inherit( Node, ProbeNode );

  /**
   * @param {Solution} solution
   * @param {number} probeYOffset distance from top of meter to tip of probe, in view coordinate frame
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function PHMeterNode( solution, probeYOffset, expandedProperty, options ) {

    options = _.extend( {
      isInteractive: false, // true: pH can be changed, false: pH is read-only
      attachProbe: 'center' // where to attach the probe: 'left'|'center'|'right'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new ValueNode( solution, expandedProperty, options.isInteractive );
    var probeNode = new ProbeNode( probeYOffset );

    // rendering order
    thisNode.addChild( probeNode );
    thisNode.addChild( valueNode );

    // layout
    if ( options.attachProbe === 'center' ) {
      probeNode.centerX = valueNode.centerX;
    }
    else if ( options.attachProbe === 'right' ) {
      probeNode.centerX = valueNode.left + ( 0.75 * valueNode.width );
    }
    else {
      probeNode.centerX = valueNode.left + ( 0.25 * valueNode.width );
    }
    probeNode.top = valueNode.top;

    expandedProperty.link( function( expanded ) {
      probeNode.visible = expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, PHMeterNode );
} );
