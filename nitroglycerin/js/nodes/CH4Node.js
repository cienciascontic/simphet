// Copyright 2002-2014, University of Colorado

/**
 * CH4 Molecule
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

  return inherit( Node, function CH4Node( options ) {
    Node.call( this );

    // atom nodes
    var bigNode = new AtomNode( Element.C, options );
    var smallTopLeftNode = new AtomNode( Element.H, options );
    var smallTopRightNode = new AtomNode( Element.H, options );
    var smallBottomLeftNode = new AtomNode( Element.H, options );
    var smallBottomRightNode = new AtomNode( Element.H, options );

    // rendering order
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( smallTopRightNode );
    parentNode.addChild( smallBottomLeftNode );
    parentNode.addChild( bigNode );
    parentNode.addChild( smallTopLeftNode );
    parentNode.addChild( smallBottomRightNode );

    // layout
    var offsetSmall = smallTopLeftNode.width / 4;
    var x = 0;
    var y = 0;
    bigNode.setTranslation( x, y );
    x = bigNode.left + offsetSmall;
    y = bigNode.top + offsetSmall;
    smallTopLeftNode.setTranslation( x, y );
    x = bigNode.right - offsetSmall;
    y = bigNode.top + offsetSmall;
    smallTopRightNode.setTranslation( x, y );
    x = bigNode.left + offsetSmall;
    y = bigNode.bottom - offsetSmall;
    smallBottomLeftNode.setTranslation( x, y );
    x = bigNode.right - offsetSmall;
    y = bigNode.bottom - offsetSmall;
    smallBottomRightNode.setTranslation( x, y );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  } );
} );
