// Copyright 2002-2013, University of Colorado Boulder

/**
 * Displays the number of molecules in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var H2ONode = require( 'PH_SCALE/common/view/molecules/H2ONode' );
  var H3ONode = require( 'PH_SCALE/common/view/molecules/H3ONode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHNode = require( 'PH_SCALE/common/view/molecules/OHNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function MoleculeCountNode( solution, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // margins and spacing
    var xMargin = 10;
    var yMargin = 5;
    var xSpacing = 10;
    var ySpacing = 6;

    // molecule icons
    var nodeH3O = new H3ONode();
    var nodeOH = new OHNode();
    var nodeH2O = new H2ONode();
    var maxMoleculeWidth = Math.max( nodeH3O.width, Math.max( nodeOH.width, nodeH2O.width ) );
    var maxMoleculeHeight = Math.max( nodeH3O.height, Math.max( nodeOH.height, nodeH2O.height ) );

    // internal properties for counts
    var countH3OProperty = new Property( 1e16 );
    var countOHProperty = new Property( 1e16 );
    var countH2OProperty = new Property( 1e16 );

    // count values
    var notationOptions = { font: new PhetFont( 22 ), fill: 'white', mantissaDecimalPlaces: 2 };
    var countH3ONode = new ScientificNotationNode( countH3OProperty, notationOptions );
    var countOHNode = new ScientificNotationNode( countOHProperty, notationOptions );
    var countH2ONode = new ScientificNotationNode( countH2OProperty, _.extend( { exponent: 25 }, notationOptions ) );
    var maxCountWidth = countH3ONode.width;
    var maxCountHeight = countH3ONode.height;

    // backgrounds
    var backgroundWidth = maxCountWidth + xSpacing + maxMoleculeWidth + ( 2 * xMargin );
    var backgroundHeight = Math.max( maxCountHeight, maxMoleculeHeight ) + ( 2 * yMargin );
    var cornerRadius = 5;
    var backgroundStroke = 'rgb(200,200,200)';
    var backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.ACIDIC, stroke: backgroundStroke } );
    var backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.BASIC, stroke: backgroundStroke } );
    var backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.H2O_BACKGROUND, stroke: backgroundStroke } );

    // rendering order
    thisNode.addChild( backgroundH3O );
    thisNode.addChild( backgroundOH );
    thisNode.addChild( backgroundH2O );
    thisNode.addChild( countH3ONode );
    thisNode.addChild( countOHNode );
    thisNode.addChild( countH2ONode );
    thisNode.addChild( nodeH3O );
    thisNode.addChild( nodeOH );
    thisNode.addChild( nodeH2O );

    // layout...
    // backgrounds are vertically stacked
    backgroundOH.left = backgroundH3O.left;
    backgroundOH.top = backgroundH3O.bottom + ySpacing;
    backgroundH2O.left = backgroundOH.left;
    backgroundH2O.top = backgroundOH.bottom + ySpacing;
    // molecule icons are vertically centered in the backgrounds, horizontally centered above each other
    nodeH3O.centerX = backgroundH3O.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeH3O.centerY = backgroundH3O.centerY;
    nodeOH.centerX = backgroundOH.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeOH.centerY = backgroundOH.centerY;
    nodeH2O.centerX = backgroundH2O.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeH2O.centerY = backgroundH2O.centerY;
    // counts will be dynamically positioned

    // update counts when the solution changes
    var moleculesLeft = Math.min( nodeH3O.left, Math.min( nodeOH.left, nodeH2O.left ) ); // for right justifying counts
    var updateCounts = function() {

      // set counts, which in turn updates values displayed by nodes
      countH3OProperty.set( solution.getMoleculesH3O() );
      countOHProperty.set( solution.getMoleculesOH() );
      countH2OProperty.set( solution.getMoleculesH2O() );

      // right justified
      countH3ONode.right = moleculesLeft - xSpacing;
      countOHNode.right = moleculesLeft - xSpacing;
      countH2ONode.right = moleculesLeft - xSpacing;

      // vertically centered
      countH3ONode.centerY = backgroundH3O.centerY;
      countOHNode.centerY = backgroundOH.centerY;
      countH2ONode.centerY = backgroundH2O.centerY;
    };
    solution.pHProperty.link( updateCounts.bind( thisNode ) );
    solution.waterVolumeProperty.link( updateCounts.bind( thisNode ) );
    solution.soluteVolumeProperty.link( updateCounts.bind( thisNode ) );

    thisNode.mutate( options );
  }

  return inherit( Node, MoleculeCountNode );
} );
