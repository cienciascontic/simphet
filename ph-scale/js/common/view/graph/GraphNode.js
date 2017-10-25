// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for all components related to the graph feature.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * Logarithmic graph is the standard scale. Interactivity and a linear scale are optional.
 * Origin is at top-left of the expand/collapse bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'SUN/ExpandCollapseBar' );
  var GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGraph = require( 'PH_SCALE/common/view/graph/LinearGraph' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var linearString = require( 'string!PH_SCALE/linear' );
  var logarithmicString = require( 'string!PH_SCALE/logarithmic' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  /**
   * @param {Solution} solution
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function GraphNode( solution, expandedProperty, options ) {

    options = _.extend( {
      isInteractive: false, // only the Log scale can be interactive
      logScaleHeight: 500,
      linearScaleHeight: 500,
      units: GraphUnits.MOLES_PER_LITER, // initial state of the units switch
      hasLinearFeature: false, // add the linear graph feature?
      graphScale: GraphScale.LOGARITHMIC // initial state of the scale switch, meaningful only if hasLinearFeature === true
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // @private
    thisNode.viewProperties = new PropertySet( {
      graphUnits: options.units
    } );

    // options for the text in all AB switches
    var switchTextOptions = { font: new PhetFont( { size: 18, weight: 'bold' } ) };

    // units switch (Concentration vs Quantity)
    var graphUnitsSwitch = new ABSwitch( this.viewProperties.graphUnitsProperty,
      GraphUnits.MOLES_PER_LITER, new MultiLineText( concentrationString + '\n(' + molesPerLiterString + ')', switchTextOptions ),
      GraphUnits.MOLES, new MultiLineText( quantityString + '\n(' + molesString + ')', switchTextOptions ),
      { size: new Dimension2( 50, 25 ) } );
    graphUnitsSwitch.setScaleMagnitude( Math.min( 1, 300 / graphUnitsSwitch.width ) ); // scale for i18n

    // expand/collapse bar
    var expandCollapseBar = new ExpandCollapseBar(
      graphUnitsSwitch,
      expandedProperty, {
        minWidth: 350,
        barFill: PHScaleColors.PANEL_FILL,
        barLineWidth: 2,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
      } );

    // logarithmic graph
    var logarithmicGraph = new LogarithmicGraph( solution, thisNode.viewProperties.graphUnitsProperty, {
      scaleHeight: options.logScaleHeight,
      isInteractive: options.isInteractive
    } );

    // vertical line that connects bottom of expand/collapse bar to top of graph
    var lineToBarNode = new Line( 0, 0, 0, 75, { stroke: 'black' } );

    // rendering order
    thisNode.addChild( expandCollapseBar );
    var graphNode = new Node();
    thisNode.addChild( graphNode );
    graphNode.addChild( lineToBarNode );
    graphNode.addChild( logarithmicGraph );

    // layout
    logarithmicGraph.centerX = lineToBarNode.centerX;
    logarithmicGraph.y = 30; // y, not top
    graphNode.centerX = expandCollapseBar.centerX;
    graphNode.y = expandCollapseBar.bottom; // y, not top

    // expand/collapse the graph
    expandedProperty.link( function( expanded ) {
      graphNode.visible = expanded;
    } );

    // optional linear graph
    thisNode.hasLinearFeature = options.hasLinearFeature; // @private
    if ( thisNode.hasLinearFeature ) {

      var mantissaRange = PHScaleConstants.LINEAR_MANTISSA_RANGE;
      var exponentRange = PHScaleConstants.LINEAR_EXPONENT_RANGE;

      // add view properties related to the linear graph
      thisNode.viewProperties.addProperty( 'exponent', exponentRange.max );
      thisNode.viewProperties.addProperty( 'graphScale', options.graphScale );

      // linear graph
      var linearGraph = new LinearGraph( solution, thisNode.viewProperties.graphUnitsProperty, mantissaRange, thisNode.viewProperties.exponentProperty, {
        scaleHeight: options.linearScaleHeight
      } );

      // zoom buttons for the linear graph
      var magnifyingGlassRadius = 13;
      var zoomOutButton = new ZoomButton( { in: false, radius: magnifyingGlassRadius } );
      var zoomInButton = new ZoomButton( { in: true, radius: magnifyingGlassRadius } );
      var zoomButtons = new Node( { children: [ zoomOutButton, zoomInButton ]} );
      zoomInButton.left = zoomOutButton.right + 25;
      zoomInButton.centerY = zoomOutButton.centerY;
      // expand touch area
      zoomOutButton.touchArea = zoomOutButton.localBounds.dilate( 5, 5 );
      zoomInButton.touchArea = zoomOutButton.localBounds.dilate( 5, 5 );

      // scale switch (Logarithmic vs Linear)
      var graphScaleSwitch = new ABSwitch( thisNode.viewProperties.graphScaleProperty,
        GraphScale.LOGARITHMIC, new Text( logarithmicString, switchTextOptions ),
        GraphScale.LINEAR, new Text( linearString, switchTextOptions ),
        { size: new Dimension2( 50, 25 ), centerOnButton: true } );

      // vertical line that connects bottom of graph to top of scale switch
      var lineToSwitchNode = new Line( 0, 0, 0, 200, { stroke: 'black ' } );

      // rendering order
      graphNode.addChild( lineToSwitchNode );
      lineToSwitchNode.moveToBack();
      graphNode.addChild( linearGraph );
      graphNode.addChild( zoomButtons );
      graphNode.addChild( graphScaleSwitch );

      // layout
      var ySpacing = 15;
      linearGraph.centerX = logarithmicGraph.centerX;
      linearGraph.y = logarithmicGraph.y; // y, not top
      zoomButtons.centerX = logarithmicGraph.centerX;
      zoomButtons.top = linearGraph.y + options.linearScaleHeight + ( 3 * ySpacing );
      graphScaleSwitch.centerX = lineToSwitchNode.centerX;
      graphScaleSwitch.top = zoomButtons.bottom + ySpacing;
      lineToSwitchNode.centerX = lineToBarNode.centerX;
      lineToSwitchNode.bottom = graphScaleSwitch.top + 1;

      // handle scale changes
      thisNode.viewProperties.graphScaleProperty.link( function( graphScale ) {
        logarithmicGraph.visible = ( graphScale === GraphScale.LOGARITHMIC );
        linearGraph.visible = zoomButtons.visible = ( graphScale === GraphScale.LINEAR );
      } );

      // enable/disable zoom buttons
      thisNode.viewProperties.exponentProperty.link( function( exponent ) {
        assert && assert( exponentRange.contains( exponent ) );
        zoomInButton.enabled = ( exponent > exponentRange.min );
        zoomOutButton.enabled = ( exponent < exponentRange.max );
      } );

      // handle zoom of linear graph
      zoomInButton.addListener( function() {
        thisNode.viewProperties.exponentProperty.set( thisNode.viewProperties.exponentProperty.get() - 1 );
      } );
      zoomOutButton.addListener( function() {
        thisNode.viewProperties.exponentProperty.set( thisNode.viewProperties.exponentProperty.get() + 1 );
      } );
    }
  }

  return inherit( Node, GraphNode, {

    reset: function() {
      this.viewProperties.reset();
    }
  } );
} );
