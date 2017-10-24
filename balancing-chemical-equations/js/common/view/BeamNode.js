// Copyright 2002-2014, University of Colorado Boulder

/**
 * The beam is a horizontal lever, centered on the fulcrum.
 * It will be pivoted to represent the relationship between quantities on either side of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  /**
   * @param {number} beamLength
   * @param {number} beamThickness
   * @constructor
   */
  function BeamNode( beamLength, beamThickness, options ) {
    options = _.extend( {fill: 'black', stroke: 'black'}, options );
    Rectangle.call( this, -beamLength / 2, -beamThickness / 2, beamLength, beamThickness, options );
  }

  return inherit( Rectangle, BeamNode, {

    setHighlighted: function( highlighted ) {
      this.fill = highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : 'black';
      this.lineWidth = highlighted ? 1 : 0;
    }
  } );
} );