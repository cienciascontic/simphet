// Copyright 2002-2014, University of Colorado Boulder

/**
 * Function for doing a linear mapping between two domains ('a' and 'b').
 * <p>
 * Example usage:
 * <code>
 * var f = new dot.LinearFunction( 0, 100, 0, 200 );
 * f( 50 ); // 100
 * f.inverse( 100 ); // 50
 * </code>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  // modules
  require( 'DOT/Util' );

  /**
   * @param {Number} a1
   * @param {Number} a2
   * @param {Number} b1
   * @param {Number} b2
   * @param {Boolean} clamp clamp the result to the provided ranges, false by default
   * @constructor
   */
  dot.LinearFunction = function LinearFunction( a1, a2, b1, b2, clamp ) {

    clamp = _.isUndefined( clamp ) ? false : clamp;

    /*
     * Linearly interpolate two points and evaluate the line equation for a third point.
     * f( a1 ) = b1, f( a2 ) = b2, f( a3 ) = <linear mapped value>
     * Optionally clamp the result to the range [b1,b2].
     */
    var map = function( a1, a2, b1, b2, a3, clamp ) {
      var b3 = dot.Util.linear( a1, a2, b1, b2, a3 );
      if ( clamp ) {
        var max = Math.max( b1, b2 );
        var min = Math.min( b1, b2 );
        b3 = dot.Util.clamp( b3, min, max );
      }
      return b3;
    };

    // Maps from a to b.
    var evaluate = function( a3 ) {
      return map( a1, a2, b1, b2, a3, clamp );
    };

    // Maps from b to a.
    evaluate.inverse = function( b3 ) {
      return map( b1, b2, a1, a2, b3, clamp );
    };

    return evaluate; // return the evaluation function, so we use sites look like: f(a) f.inverse(b)
  };

  return dot.LinearFunction;
} );
