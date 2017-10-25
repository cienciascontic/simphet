// Copyright 2002-2013, University of Colorado Boulder

/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var neutralString = require( 'string!PH_SCALE/neutral' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function NeutralIndicator( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    var label = new Text( neutralString, { font: new PhetFont( { size: 30, weight: 'bold' } ) } );

    // translucent light-gray background, so this shows up on all solution colors
    var background = new Rectangle( 0, 0, 1.4 * label.width, 1.2 * label.height, 8, 8,
      { fill: 'rgba( 240, 240, 240, 0.6 )' } );

    // rendering order
    thisNode.addChild( background );
    thisNode.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution is saturated
    solution.pHProperty.link( function() {
      thisNode.setVisible( solution.isEquivalentToWater() );
    } );
  }

  return inherit( Node, NeutralIndicator );
} );