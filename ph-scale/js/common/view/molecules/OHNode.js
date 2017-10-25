// Copyright 2002-2013, University of Colorado Boulder

/**
 * OH- (hydroxide) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HydrogenNode = require( 'PH_SCALE/common/view/molecules/HydrogenNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OxygenNode = require( 'PH_SCALE/common/view/molecules/OxygenNode' );
  var Node = require( 'SCENERY/nodes/Node' );

  function OHNode( options ) {

    Node.call( this );

    // atoms
    var oxygen = new OxygenNode();
    var hydrogen = new HydrogenNode();

    // rendering order
    this.addChild( oxygen );
    this.addChild( hydrogen );

    // layout
    hydrogen.left = oxygen.right - ( 0.2 * oxygen.width );
    hydrogen.centerY = oxygen.centerY - ( 0.1 * oxygen.height );

    this.mutate( options );
  }

  return inherit( Node, OHNode );
} );
