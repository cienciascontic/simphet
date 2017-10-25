// Copyright 2002-2014, University of Colorado Boulder

/**
 * A translucent red 'X', to be placed on top of an equation whose slope is undefined.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} [options]
   * @constructor
   */
  function UndefinedSlopeIndicator( width, height, options ) {

    options = _.extend( {
      stroke: 'rgba( 255, 0, 0, 0.3 )',
      lineWidth: 4
    }, options );

    this.line1 = new Line( 0, 0, 0, 1, options ); // @private
    this.line2 = new Line( 0, 0, 0, 1, options ); // @private

    Node.call( this, { children: [ this.line1, this.line2 ] } );

    // initialize
    this.setSize( width, height );
  }

  return inherit( Node, UndefinedSlopeIndicator, {

    // sets the size of the 'X'
    setSize: function( width, height ) {
      this.line1.setLine( 0, 0, width, height );
      this.line2.setLine( 0, height, width, 0 );
    }
  } );
} );