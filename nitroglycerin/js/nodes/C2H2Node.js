// Copyright 2002-2014, University of Colorado

/**
 * C2H2 Molecule
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function ( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var Element = require( 'NITROGLYCERIN/Element' );

  return inherit( Node, function C2H2Node( options ) {
    Node.call( this );

    var bigLeftNode = new AtomNode( Element.C, options );
    var bigRightNode = new AtomNode( Element.C, options );
    var smallLeftNode = new AtomNode( Element.H, options );
    var smallRightNode = new AtomNode( Element.H, options );

    // rendering order
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( smallLeftNode );
    parentNode.addChild( bigLeftNode );
    parentNode.addChild( bigRightNode );
    parentNode.addChild( smallRightNode );

    // layout
    var x = 0;
    var y = 0;
    bigLeftNode.setTranslation( x, y );
    x = bigLeftNode.right + ( 0.25 * bigRightNode.width );
    bigRightNode.setTranslation( x, y );
    x = bigLeftNode.left;
    smallLeftNode.setTranslation( x, y );
    x = bigRightNode.right;
    smallRightNode.setTranslation( x, y );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  } );
} );
