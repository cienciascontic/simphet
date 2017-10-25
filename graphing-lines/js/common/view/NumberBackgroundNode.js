// Copyright 2002-2014, University of Colorado Boulder

/**
 * A number displayed on a rectangular background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberBackgroundNode( valueProperty, options ) {

    options = _.extend( {
      decimalPlaces: 0,
      font: new GLFont( 12 ),
      textFill: 'black',
      backgroundFill: 'white',
      backgroundStroke: null,
      minWidth: 0,
      minHeight: 0,
      xMargin: 5,
      yMargin: 5,
      cornerRadius: 6
    }, options );

    // text and background
    var textNode = new Text( '?', { fill: options.textFill, font: options.font } ); // @private
    var backgroundNode = new Rectangle( 0, 0, 1, 1, { fill: options.backgroundFill, stroke: options.backgroundStroke } ); // @private
    options.children = [ backgroundNode, textNode ];
    Node.call( this, options );

    valueProperty.link( function( value ) {

      // format the value
      textNode.text = Util.toFixed( value, options.decimalPlaces );

      // adjust the background to fit the value
      var backgroundWidth = Math.max( options.minWidth, textNode.width + options.xMargin + options.xMargin );
      var backgroundHeight = Math.max( options.minHeight, textNode.height + options.yMargin + options.yMargin );
      backgroundNode.setRect( 0, 0, backgroundWidth, backgroundHeight, options.cornerRadius, options.cornerRadius );

      // center the value in the background
      textNode.centerX = backgroundNode.centerX;
      textNode.centerY = backgroundNode.centerY;
    } );
  }

  return inherit( Node, NumberBackgroundNode );
} );