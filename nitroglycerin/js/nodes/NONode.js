// Copyright 2002-2014, University of Colorado

/**
 * NO Molecule
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function ( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var HorizontalMoleculeNode = require( 'NITROGLYCERIN/nodes/HorizontalMoleculeNode' );
  var Element = require( 'NITROGLYCERIN/Element' );

  return inherit( HorizontalMoleculeNode, function NONode( options ) {
    HorizontalMoleculeNode.call( this, [ Element.N, Element.O ], options );
  } );
} );
