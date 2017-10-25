// Copyright 2002-2014, University of Colorado Boulder

/**
 * This node is intended for use as a background on a screen, and shows the
 * ground on the bottom and the sky on the top.
 * <p/>
 * The default size is chosen such that it works well with the default layout
 * size for a PhET HTML5 simulation.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param centerX
   * @param centerY
   * @param width
   * @param skyHeight
   * @param groundDepth
   * @param options
   * @constructor
   */
  function OutsideBackgroundNode( centerX, centerY, width, skyHeight, groundDepth, options ) {

    Node.call( this );

    options = _.extend(
      {
        // Defaults.
        skyGradientHeight: skyHeight / 2,
        groundGradientDepth: groundDepth / 2
      }, options );

    // parameter checking
    //TODO commenting out this assert, there is no options.skyHeight and height is not declared
//    assert && assert( options.skyHeight < height );

    // sky
    this.addChild( new SkyNode( centerX - width / 2, centerY - skyHeight, width, skyHeight, options.skyGradientHeight ) );

    // ground
    this.addChild( new GroundNode( centerX - width / 2, centerY, width, groundDepth, centerY + options.groundGradientDepth ) );
  }

  return inherit( Node, OutsideBackgroundNode );
} );
