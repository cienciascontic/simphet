// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the pH meter.
 * <p/>
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PH_SCALE/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @constructor
   */
  function PHMeter( bodyLocation, probeLocation, probeDragBounds ) {
    this.valueProperty = new Property( null ); // null if the meter is not reading a value
    this.bodyLocation = bodyLocation;
    this.probe = new Movable( probeLocation, probeDragBounds );
  }

  return inherit( Object, PHMeter, {
    reset: function() {
      this.valueProperty.reset();
      this.probe.reset();
    }
  } );
} );