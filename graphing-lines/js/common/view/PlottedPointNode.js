// Copyright 2002-2014, University of Colorado Boulder

/**
 * A plotted point on a graph, not interactive.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @param {Number} radius
   * @param {Color|String} color
   * @param {Object} [options]
   * @constructor
   */
  function PlottedPointNode( radius, color, options ) {

    var mainColor = Color.toColor( color );
    options = _.extend( {
      highlightColor: Color.WHITE,
      mainColor: mainColor,
      shadowColor: mainColor.darkerColor(),
      stroke: mainColor.darkerColor().darkerColor(),
      lineWidth: 1
    }, options );

    ShadedSphereNode.call( this, 2 * radius, options );
  }

  return inherit( ShadedSphereNode, PlottedPointNode );
} );