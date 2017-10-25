// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph with a linear scale, for displaying concentration (mol/L) and quantity (moles).
 * <p>
 * Some of the code related to indicators (initialization and updateIndicators) is similar
 * to LogarithmicGraph. But it was difficult to identify a natural pattern for factoring
 * this out, so I chose to leave it as is. See issue #16.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GraphIndicator = require( 'PH_SCALE/common/view/graph/GraphIndicator' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var offScaleString = require( 'string!PH_SCALE/offScale' );

  /**
   * @param {Solution} solution
   * @param {Property.<GraphUnits>} graphUnitsProperty
   * @param {Range} mantissaRange
   * @param {Property.<number>} exponentProperty
   * @param {Object} [options]
   * @constructor
   */
  function LinearGraph( solution, graphUnitsProperty, mantissaRange, exponentProperty, options ) {

    options = _.extend( {
      // scale
      scaleHeight: 100,
      minScaleWidth: 100,
      scaleFill: 'rgb(230,230,230)',
      scaleStroke: 'black',
      scaleLineWidth: 2,
      scaleYMargin: 30,
      // arrow at top of scale
      arrowHeight: 75,
      // major ticks
      majorTickFont: new PhetFont( 18 ),
      majorTickLength: 10,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,
      majorTickXSpacing: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    var scaleWidth = options.minScaleWidth;
    var scaleHeight = options.scaleHeight;
    var arrowWidth = 1.5 * scaleWidth;
    var arrowHeight = options.arrowHeight;
    var arrowHeadHeight = 0.85 * arrowHeight;
    var arrowGap = -10; // this controls the vertical gap between the arrow and the scale

    // arrow above scale, starting from arrow tip and moving clockwise
    var arrowNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowWidth / 2, arrowHeadHeight )
      .lineTo( scaleWidth / 2, arrowHeadHeight )
      .lineTo( scaleWidth / 2, arrowHeight )
      .cubicCurveTo( -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 2, arrowHeight )
      .lineTo( -scaleWidth / 2, arrowHeadHeight )
      .lineTo( -arrowWidth / 2, arrowHeadHeight )
      .close(),
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth, top: arrowGap }
    );
    thisNode.addChild( arrowNode );

    // scale below the arrow
    var scaleNode = new Path( new Shape()
      .moveTo( -scaleWidth / 2, arrowHeight )
      .cubicCurveTo( scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 2, arrowHeight )
      .lineTo( scaleWidth / 2, scaleHeight )
      .lineTo( -scaleWidth / 2, scaleHeight )
      .close(),
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth }
    );
    thisNode.addChild( scaleNode );

    // 'off scale' label, positioned inside arrow
    var offScaleNode = new Text( offScaleString, { font: new PhetFont( 18 ), fill: 'black' } );
    thisNode.addChild( offScaleNode );
    offScaleNode.setScaleMagnitude( Math.min( 1, 0.5 * arrowWidth / offScaleNode.width ) ); // restrict size for i18n
    offScaleNode.centerX = arrowNode.centerX;
    offScaleNode.y = arrowNode.top + ( 0.85 * arrowHeadHeight );

    // Create the tick marks. Correct labels will be assigned later.
    var tickLabels = [];
    var numberOfTicks = mantissaRange.getLength() + 1;
    var ySpacing = ( scaleHeight - arrowHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    var tickLabel, tickLineLeft, tickLineRight;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      // major lines and label
      tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      tickLineRight = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      tickLabel = new ScientificNotationNode( new Property( i ), {
        font: options.majorTickFont,
        fill: 'black',
        mantissaDecimalPlaces: 0,
        showIntegersAsMantissaOnly: true
      } );
      // rendering order
      thisNode.addChild( tickLineLeft );
      thisNode.addChild( tickLineRight );
      thisNode.addChild( tickLabel );
      // layout
      tickLineLeft.left = scaleNode.left;
      tickLineLeft.centerY = scaleNode.bottom - options.scaleYMargin - ( i * ySpacing );
      tickLineRight.right = scaleNode.right;
      tickLineRight.centerY = tickLineLeft.centerY;
      tickLabel.centerX = scaleNode.centerX;
      tickLabel.centerY = tickLineLeft.centerY;
      // save label so we can update it layer
      tickLabels.push( tickLabel );
    }

    // indicators & associated properties
    var valueH2OProperty = new Property( 0 );
    var valueH3OProperty = new Property( 0 );
    var valueOHProperty = new Property( 0 );
    var h2OIndicatorNode = new GraphIndicator.createH2OIndicator( valueH2OProperty, {
      x: scaleNode.right - options.majorTickLength } );
    var h3OIndicatorNode = new GraphIndicator.createH3OIndicator( valueH3OProperty, {
      x: scaleNode.left + options.majorTickLength,
      isInteractive: options.isInteractive } );
    var oHIndicatorNode = new GraphIndicator.createOHIndicator( valueOHProperty, {
      x: scaleNode.right - options.majorTickLength,
      isInteractive: options.isInteractive } );
    thisNode.addChild( h2OIndicatorNode );
    thisNode.addChild( h3OIndicatorNode );
    thisNode.addChild( oHIndicatorNode );

    /*
     * Given a value, compute it's y position relative to the top of the scale.
     * @param {number} value in model coordinates
     * @param {number} offScaleYOffset optional y-offset added to the position if the value is off the scale
     * @return {number} y position in view coordinates
     */
    var valueToY = function( value, offScaleYOffset ) {
      var topTickValue = mantissaRange.max * Math.pow( 10, exponentProperty.get() );
      if ( value > topTickValue ) {
        // values out of range are placed in the arrow
        return arrowNode.top + ( 0.8 * arrowHeadHeight ) + ( offScaleYOffset || 0 );
      }
      else {
        return Util.linear( 0, topTickValue, tickLabels[0].centerY, tickLabels[tickLabels.length - 1].centerY, value );
      }
    };

    // Update the indicators
    var updateIndicators = function() {

      var valueH2O, valueH3O, valueOH;
      if ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER ) {
        // concentration
        valueH2O = solution.getConcentrationH2O();
        valueH3O = solution.getConcentrationH3O();
        valueOH = solution.getConcentrationOH();
      }
      else {
        // quantity
        valueH2O = solution.getMolesH2O();
        valueH3O = solution.getMolesH3O();
        valueOH = solution.getMolesOH();
      }

      // move indicators
      h2OIndicatorNode.y = valueToY( valueH2O, -4 ); // offset the H2O indicator when off scale, so it doesn't butt up again OH indicator
      h3OIndicatorNode.y = valueToY( valueH3O );
      oHIndicatorNode.y = valueToY( valueOH );

      // update indicator values
      valueH2OProperty.set( valueH2O );
      valueH3OProperty.set( valueH3O );
      valueOHProperty.set( valueOH );
    };

    // Move the indicators when any of these change.
    solution.pHProperty.link( updateIndicators.bind( thisNode ) );
    solution.volumeProperty.link( updateIndicators.bind( thisNode ) );
    graphUnitsProperty.link( updateIndicators.bind( thisNode ) );
    exponentProperty.link( updateIndicators.bind( thisNode ) );

    // updates the tick labels to match the exponent
    var updateTickLabels = function( exponent ) {
      var tickOptions = ( exponent >= 0 ) ? { exponent: 0 } : { exponent: exponent }; // show positive exponents as integers
      for ( var i = 0; i < tickLabels.length; i++ ) {
        tickLabels[i].valueProperty.set( i * Math.pow( 10, exponent ), tickOptions );
        tickLabels[i].centerX = scaleNode.centerX;
      }
    };

    // When the exponent changes...
    exponentProperty.link( function( exponent ) {
      // relabel the tick marks
      updateTickLabels( exponent );
    } );
  }

  return inherit( Node, LinearGraph );
} );
