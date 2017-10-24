// Copyright 2002-2014, University of Colorado

/**
 * CH2O Molecule
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

  return inherit( Node, function CH2ONode( options ) {
    Node.call( this );

    // atom nodes
    var leftNode = new AtomNode( Element.C, options );
    var smallTopNode = new AtomNode( Element.H, options );
    var smallBottomNode = new AtomNode( Element.H, options );
    var rightNode = new AtomNode( Element.O, options );

    // rendering order
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( smallTopNode );
    parentNode.addChild( leftNode );
    parentNode.addChild( rightNode );
    parentNode.addChild( smallBottomNode );

    // layout
    var offsetSmall = smallTopNode.width / 4;
    var x = 0;
    var y = 0;
    leftNode.setTranslation( x, y );
    x = leftNode.right + ( 0.25 * rightNode.width );
    y = leftNode.y;
    rightNode.setTranslation( x, y );
    x = leftNode.left + offsetSmall;
    y = leftNode.top + offsetSmall;
    smallTopNode.setTranslation( x, y );
    x = smallTopNode.x;
    y = leftNode.bottom - offsetSmall;
    smallBottomNode.setTranslation( x, y );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  } );
} );
