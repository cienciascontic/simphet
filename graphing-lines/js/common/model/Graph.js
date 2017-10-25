// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a simple 2D graph.  Used in the icon as well as the sim screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function Graph( xRange, yRange ) {
    this.xRange = xRange;
    this.yRange = yRange;
    this.lines = new ObservableArray(); // {Line} lines that the graph is currently displaying
  }

  return inherit( Object, Graph, {

    getWidth: function() { return this.xRange.getLength(); },

    getHeight: function() { return this.yRange.getLength(); },

    /**
     * Does the graph contain the specified point?
     * @param {Vector2} point
     * @returns {Boolean}
     */
    contains: function( point ) {
      return this.xRange.contains( point.x ) && this.yRange.contains( point.y );
    }
  } );
} );