// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the concentration meter.
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
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @constructor
   */
  function ConcentrationMeter( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds ) {
    this.value = new Property( NaN ); // NaN if the meter is not reading a value
    this.body = new Movable( bodyLocation, bodyDragBounds );
    this.probe = new Movable( probeLocation, probeDragBounds );
  }

  return inherit( Object, ConcentrationMeter, {
    reset: function() {
      this.value.reset();
      this.body.reset();
      this.probe.reset();
    }
  } );

} );