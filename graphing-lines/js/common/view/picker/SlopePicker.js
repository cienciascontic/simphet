// Copyright 2002-2014, University of Colorado Boulder

/**
 * Picker for changing a component of slope.
 * Avoids creating an undefined line with slope=0/0.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var GLConstants = require( 'GRAPHING_LINES/common/GLConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );

  /**
   * @param {Property<Number>} variableComponent the part of the slope we're manipulating
   * @param {Property<Number>} fixedComponent the part of the slope we're not manipulating
   * @param {Property<Range>} variableRange the range of variableComponent
   * @param {Object} [options]
   * @constructor
   */
  function SlopePicker( variableComponent, fixedComponent, variableRange, options ) {

    options = _.extend( {
      color: GLColors.SLOPE,
      touchAreaExpandX: GLConstants.PICKER_TOUCH_AREA_EXPAND_X
    }, options );

    // 'up' function, skips over undefined line condition (slope=0/0) - not changeable by clients
    options.upFunction = function() {
      return ( variableComponent.get() === -1 && fixedComponent.get() === 0 ) ? 1 : variableComponent.get() + 1;
    };

    // 'down' function, skips over undefined line condition (slope=0/0) - not changeable by clients
    options.downFunction = function() {
      return ( variableComponent.get() === 1 && fixedComponent.get() === 0 ) ? -1 : variableComponent.get() - 1;
    };

    NumberPicker.call( this, variableComponent, variableRange, options );
  }

  return inherit( NumberPicker, SlopePicker );
} );
