// Copyright 2002-2013, University of Colorado Boulder

//TODO: Consolidate with MutableArrowNode, see #34
/**
 * A single- or double-headed arrow. This is a convenience class, most of the
 * work is done in ArrowShape.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // Imports
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} options
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

    // default options
    options = _.extend( {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    Path.call( this, new ArrowShape( tailX, tailY, tipX, tipY, options ), options );
    this.options = options;
  }

  return inherit( Path, ArrowNode, {

    //Set the tail and tip locations to update the arrow shape.  Matches API in MutableArrowNode so they can easily be swapped
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {
      this.shape = new ArrowShape( tailX, tailY, tipX, tipY, this.options );
    }
  } );
} );
