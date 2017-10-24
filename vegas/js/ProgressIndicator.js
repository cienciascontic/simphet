//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Indicates a user's progress on a level by illuminating stars.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  /**
   * @param {Number} numStars
   * @param {Property<Number>} scoreProperty
   * @param {Number} perfectScore
   * @param {Object} options
   * @constructor
   */
  function ProgressIndicator( numStars, scoreProperty, perfectScore, options ) {

    options = _.extend( {
      starOuterRadius: 10,
      starInnerRadius: 5,
      starFilledLineWidth: 1.5,
      starEmptyLineWidth: 1.5
    }, options );

    HBox.call( this, {spacing: 3, children: []} );
    var progressIndicator = this;

    // Update visibility of filled and half-filled stars based on score.
    // TODO: Could be rewritten to use deltas if it needs to animate
    scoreProperty.link( function( score ) {

      assert && assert( score <= perfectScore );

      var children = [];

      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numStars );

      var starOptions = {
        outerRadius: options.starOuterRadius,
        innerRadius: options.starInnerRadius,
        filledLineWidth: options.starFilledLineWidth,
        emptyLineWidth: options.starEmptyLineWidth
      };

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( _.extend( {value: 1}, starOptions ) ) );
      }
      var remainder = proportion * numStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( _.extend( {value: remainder}, starOptions ) ) );
      }
      var numEmptyStars = numStars - children.length;
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( _.extend( {value: 0}, starOptions ) ) );
      }

      progressIndicator.children = children;
    } );

    this.mutate( options );
  }

  return inherit( HBox, ProgressIndicator );
} );