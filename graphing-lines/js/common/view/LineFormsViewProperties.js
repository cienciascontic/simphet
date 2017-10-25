// Copyright 2002-2014, University of Colorado Boulder

/**
 * Properties that are specific to subtypes of LineFormsView.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  function LineFormsViewProperties() {
    PropertySet.call( this, {
      linesVisible: true, // determines whether all lines are visible on the graph
      interactiveEquationVisible: true, // determines whether the interactive line is visible in the control panel
      slopeToolVisible: true // determines whether the slope tool is visible on the graph
    } );
  }

  return inherit( PropertySet, LineFormsViewProperties );
} );
