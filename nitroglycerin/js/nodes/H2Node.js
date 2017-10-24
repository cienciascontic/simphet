// Copyright 2002-2014, University of Colorado

/**
 * H2 Molecule
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function ( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var HorizontalMoleculeNode = require( 'NITROGLYCERIN/nodes/HorizontalMoleculeNode' );
  var Element = require( 'NITROGLYCERIN/Element' );

  return inherit( HorizontalMoleculeNode, function H2Node( options ) {
    HorizontalMoleculeNode.call( this, [ Element.H, Element.H ], options );
  } );
} );
