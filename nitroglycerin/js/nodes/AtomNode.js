// Copyright 2002-2014, University of Colorado

/**
 * Atoms look like shaded spheres.
 * Origin is at geometric center of bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function ( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Element = require( 'NITROGLYCERIN/Element' );

  var rateOfChange = 0.75; // >0 and <1, increase this to make small atoms appear smaller
  var maxRadius = Element.P.radius; // not actually the maximum, but this is a constant from the previous version
  var modelToViewScale = 0.11;

  /*
   * There is a large difference between the radii of the smallest and largest atoms.
   * This function adjusts scaling so that the difference is still noticeable, but not as large.
   */
  function radiusScalingFunction( radius ) {
    var adjustedRadius = ( maxRadius - rateOfChange * ( maxRadius - radius ) );
    return modelToViewScale * adjustedRadius;
  }

  var AtomNode = function AtomNode( element, options ) {
    options = _.extend( {
      mainColor: element.color // passed to ShadedSphereNode
    }, options );
    
    ShadedSphereNode.call( this, 2 * radiusScalingFunction( element.radius ), options );
  };

  return inherit( ShadedSphereNode, AtomNode );
} );
