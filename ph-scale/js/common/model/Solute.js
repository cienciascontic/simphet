// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solute model, with instances used by this sim.
 * Solutes are immutable, so all fields should be considered immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  var drainCleanerString = require( 'string!PH_SCALE/choice.drainCleaner' );
  var handSoapString = require( 'string!PH_SCALE/choice.handSoap' );
  var bloodString = require( 'string!PH_SCALE/choice.blood' );
  var spitString = require( 'string!PH_SCALE/choice.spit' );
  var milkString = require( 'string!PH_SCALE/choice.milk' );
  var chickenSoupString = require( 'string!PH_SCALE/choice.chickenSoup' );
  var coffeeString = require( 'string!PH_SCALE/choice.coffee' );
  var orangeJuiceString = require( 'string!PH_SCALE/choice.orangeJuice' );
  var sodaString = require( 'string!PH_SCALE/choice.soda' );
  var vomitString = require( 'string!PH_SCALE/choice.vomit' );
  var batteryAcidString = require( 'string!PH_SCALE/choice.batteryAcid' );
  var customString = require( 'string!PH_SCALE/choice.custom' );

  /**
   * @param {string} name
   * @param {number} pH
   * @param {stockColor:Color, [dilutedColor]:Color, colorStop:{color:{Color}, [ratio]:Number} } colorScheme
   *
   * colorScheme is an object literal with these properties:
   * stockColor: color of the solute in stock solution (no dilution)
   * dilutedColor: color when the solute is barely present in solution (fully diluted), optional, defaults to Water.color
   * color: color when soluteVolume/totalVolume === ratio, used to smooth out some color transitions if provided, optional
   * ratio: ratio for the color-stop, (0,1) exclusive, optional, defaults to 0.25
   */
  function Solute( name, pH, colorScheme ) {

    if ( !PHScaleConstants.PH_RANGE.contains( pH ) ) {
      throw new Error( "Solute constructor, pH value is out of range: " + pH );
    }

    this.name = name;
    this.pH = pH;

    // unpack the colors to make accessing them more convenient in client code
    this.stockColor = colorScheme.stockColor; // @public
    this.dilutedColor = colorScheme.dilutedColor || Water.color; // @private
    this.colorStop = colorScheme.colorStop; // @private, optional, color computation will ignore it if undefined
    if ( this.colorStop ) {
      this.colorStop.ratio = this.colorStop.ratio || 0.25;
    }
  }

  inherit( Object, Solute, {

    toString: function() {
      return 'Solution[name:' + this.name + ' pH:' + this.pH + ']';
    },

    /**
     * Computes the color for a dilution of this solute.
     * @param {number} ratio describes the dilution, range is [0,1] inclusive, 0 is no solute, 1 is all solute
     * @returns {Color}
     */
    computeColor: function( ratio ) {
      assert && assert( ratio >= 0 && ratio <= 1 );
      var color;
      if ( this.colorStop ) {
        // solute has an optional color-stop
        if ( ratio > this.colorStop.ratio ) {
          color = Color.interpolateRGBA( this.colorStop.color, this.stockColor, ( ratio - this.colorStop.ratio ) / ( 1 - this.colorStop.ratio) );
        }
        else {
          color = Color.interpolateRGBA( this.dilutedColor, this.colorStop.color, ratio / this.colorStop.ratio );
        }
      }
      else {
        color = Color.interpolateRGBA( this.dilutedColor, this.stockColor, ratio );
      }
      return color;
    }
  }, {

    /**
     * Creates a custom solute.
     * @static
     * @param {number} pH
     * @returns {Solute}
     */
    createCustom: function( pH ) {
      return new Solute( customString, pH, { stockColor: PHScaleColors.WATER } );
    }
  } );

  // 'real world' immutable solutions

  Solute.DRAIN_CLEANER = new Solute( drainCleanerString, 13, {
    stockColor: new Color( 255, 255, 0 ),
    colorStop: { color: new Color( 255, 255, 204 ) }
  } );

  Solute.HAND_SOAP = new Solute( handSoapString, 10, {
    stockColor: new Color( 224, 141, 242 ),
    colorStop: { color: new Color( 232, 204, 255 ) }
  } );

  Solute.BLOOD = new Solute( bloodString, 7.4, {
    stockColor: new Color( 211, 79, 68 ),
    colorStop: { color: new Color( 255, 207, 204 ) }
  } );

  Solute.SPIT = new Solute( spitString, 7.4, { stockColor: new Color( 202, 240, 239 ) } );

  Solute.MILK = new Solute( milkString, 6.5, { stockColor: new Color( 250, 250, 250 ) } );

  Solute.CHICKEN_SOUP = new Solute( chickenSoupString, 5.8, {
    stockColor: new Color( 255, 240, 104 ),
    colorStop: { color: new Color( 255, 250, 204 ) }
  } );

  Solute.COFFEE = new Solute( coffeeString, 5, {
    stockColor: new Color( 164, 99, 7 ),
    colorStop: { color: new Color( 255, 240, 204 ) }
  } );

  Solute.ORANGE_JUICE = new Solute( orangeJuiceString, 3.5, {
    stockColor: new Color( 255, 180, 0 ),
    colorStop: { color: new Color( 255, 242, 204 ) }
  } );

  Solute.SODA = new Solute( sodaString, 2.5, {
    stockColor: new Color( 204, 255, 102 ),
    colorStop: { color: new Color( 238, 255, 204 ) }
  } );

  Solute.VOMIT = new Solute( vomitString, 2, {
    stockColor: new Color( 255, 171, 120 ),
    colorStop: { color: new Color( 255, 224, 204 ) }
  } );

  Solute.BATTERY_ACID = new Solute( batteryAcidString, 1, {
    stockColor: new Color( 255, 255, 0 ),
    colorStop: { color: new Color( 255, 224, 204 ) }
  } );

  return Solute;
} );
