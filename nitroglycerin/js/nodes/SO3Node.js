// Copyright 2002-2014, University of Colorado

/**
 * SO3 Molecule
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

  return inherit( Node, function SO3Node( options ) {
    Node.call( this );

    // atom nodes
    var centerNode = new AtomNode( Element.S, options );
    var leftNode = new AtomNode( Element.O, options );
    var rightNode = new AtomNode( Element.O, options );
    var topNode = new AtomNode( Element.O, options );

    // rendering order
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( topNode );
    parentNode.addChild( leftNode );
    parentNode.addChild( centerNode );
    parentNode.addChild( rightNode );

    // layout
    var x = 0;
    var y = 0;
    centerNode.setTranslation( x, y );
    x = centerNode.x + ( 0.1 * topNode.width );
    y = centerNode.left + ( 0.1 * topNode.height );
    topNode.setTranslation( x, y );
    x = centerNode.left;
    y = centerNode.y + ( 0.25 * leftNode.height );
    leftNode.setTranslation( x, y );
    x = centerNode.right;
    y = centerNode.y + ( 0.25 * rightNode.height );
    rightNode.setTranslation( x, y );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  } );
} );
