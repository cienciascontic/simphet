// Copyright 2002-2014, University of Colorado

/**
 * Base class for molecules with N atoms aligned on the horizontal axis, for N > 0.
 * Note that here is technically no such thing as a single-atom molecule,
 * but allowing N=1 simplifies the Equation model.
 * <p/>
 * Origin is at geometric center of the node's bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function ( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  /*
   * @param {Array<Element>} elements
   */
  var HorizontalMoleculeNode = function HorizontalMoleculeNode( elements, options ) {
    Node.call( this );

    var parentNode = new Node();
    this.addChild( parentNode );

    // add each node from left to right, overlapping consistently
    var x = 0;
    var previousNode = null;
    _.each( elements, function ( element ) {
      var currentNode = new AtomNode( element, options );
      parentNode.addChild( currentNode );
      if ( previousNode !== null ) {
        x = previousNode.right + ( 0.25 * currentNode.width );
      }
      currentNode.x = x;
      previousNode = currentNode;
    } );

    // move origin to geometric center
    parentNode.center = Vector2.ZERO;
  };

  return inherit( Node, HorizontalMoleculeNode );
} );
