// Copyright 2002-2014, University of Colorado

/**
 * C2H4 Molecule
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

  return inherit( Node, function C2H4Node( options ) {
    Node.call( this );

    var bigLeftNode = new AtomNode( Element.C, options );
    var bigRightNode = new AtomNode( Element.C, options );
    var smallTopLeftNode = new AtomNode( Element.H, options );
    var smallTopRightNode = new AtomNode( Element.H, options );
    var smallBottomLeftNode = new AtomNode( Element.H, options );
    var smallBottomRightNode = new AtomNode( Element.H, options );

    // rendering order
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( smallTopRightNode );
    parentNode.addChild( smallTopLeftNode );
    parentNode.addChild( bigLeftNode );
    parentNode.addChild( bigRightNode );
    parentNode.addChild( smallBottomLeftNode );
    parentNode.addChild( smallBottomRightNode );

    // layout
    var offsetSmall = smallTopLeftNode.width / 4;
    var x = 0;
    var y = 0;
    bigLeftNode.setTranslation( x, y );
    x = bigLeftNode.right + ( 0.25 * bigRightNode.width );
    y = bigLeftNode.y;
    bigRightNode.setTranslation( x, y );
    x = bigLeftNode.left + offsetSmall;
    y = bigLeftNode.top + offsetSmall;
    smallTopLeftNode.setTranslation( x, y );
    x = bigRightNode.right - offsetSmall;
    y = bigRightNode.top + offsetSmall;
    smallTopRightNode.setTranslation( x, y );
    x = bigLeftNode.left + offsetSmall;
    y = bigLeftNode.bottom - offsetSmall;
    smallBottomLeftNode.setTranslation( x, y );
    x = bigRightNode.right - offsetSmall;
    y = bigRightNode.bottom - offsetSmall;
    smallBottomRightNode.setTranslation( x, y );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  } );
} );
