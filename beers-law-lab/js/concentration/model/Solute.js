// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SoluteColorScheme = require( 'BEERS_LAW_LAB/concentration/model/SoluteColorScheme' );
  var Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );

  // strings
  var cobaltChlorideString = require( 'string!BEERS_LAW_LAB/cobaltChloride' );
  var cobaltIINitrateString = require( 'string!BEERS_LAW_LAB/cobaltIINitrate' );
  var copperSulfateString = require( 'string!BEERS_LAW_LAB/copperSulfate' );
  var drinkMixString = require( 'string!BEERS_LAW_LAB/drinkMix' );
  var nickelIIChlorideString = require( 'string!BEERS_LAW_LAB/nickelIIChloride' );
  var potassiumChromateString = require( 'string!BEERS_LAW_LAB/potassiumChromate' );
  var potassiumDichromateString = require( 'string!BEERS_LAW_LAB/potassiumDichromate' );
  var potassiumPermanganateString = require( 'string!BEERS_LAW_LAB/potassiumPermanganate' );

  /**
   * Constructor.
   * @param {String} name
   * @param {String} formula
   * @param {Number} stockSolutionConcentration
   * @param {SoluteColorScheme} colorScheme
   * @param {Color|undefined} particleColor
   * @param {Number|undefined} particleSize
   * @param {Number|undefined} particlesPerMole
   * @constructor
   */
  function Solute( name, formula, stockSolutionConcentration, colorScheme, particleColor, particleSize, particlesPerMole ) {
    this.name = name;
    this.formula = formula;
    this.stockSolutionConcentration = stockSolutionConcentration;
    this.colorScheme = colorScheme;
    this.particleColor = particleColor || colorScheme.maxColor;
    this.particleSize = particleSize || 5;
    this.particlesPerMole = particlesPerMole || 200;
  }

  inherit( Object, Solute, {
    // convenience method
    getSaturatedConcentration: function() {
      return this.colorScheme.maxConcentration;
    }
  } );

  // Specific solutes ===========================================

  Solute.DRINK_MIX = new Solute(
    drinkMixString,
    drinkMixString,
    5.5,
    new SoluteColorScheme( 0, new Color( 224, 255, 255 ),
      0.05, new Color( 255, 225, 225 ),
      5.96, new Color( 255, 0, 0 ) ) );

  Solute.COBALT_II_NITRATE = new Solute(
    cobaltIINitrateString,
    BLLSymbols.COBALT_II_NITRATE,
    5.0,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.05, new Color( 255, 225, 225 ),
      5.64, new Color( 255, 0, 0 ) ) );

  Solute.COBALT_CHLORIDE = new Solute(
    cobaltChlorideString,
    BLLSymbols.COBALT_CHLORIDE,
    4.0,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.05, new Color( 255, 242, 242 ),
      4.33, new Color( 255, 106, 106 ) ) );

  Solute.POTASSIUM_DICHROMATE = new Solute(
    potassiumDichromateString,
    BLLSymbols.POTASSIUM_DICHROMATE,
    0.5,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.01, new Color( 255, 204, 153 ),
      0.51, new Color( 255, 127, 0 ) ) );

  Solute.POTASSIUM_CHROMATE = new Solute(
    potassiumChromateString,
    BLLSymbols.POTASSIUM_CHROMATE,
    3.0,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.05, new Color( 255, 255, 153 ),
      3.35, new Color( 255, 255, 0 ) ) );

  Solute.NICKEL_II_CHLORIDE = new Solute(
    nickelIIChlorideString,
    BLLSymbols.NICKEL_II_CHLORIDE,
    5.0,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.2, new Color( 170, 255, 170 ),
      5.21, new Color( 0, 128, 0 ) ) );

  Solute.COPPER_SULFATE = new Solute(
    copperSulfateString,
    BLLSymbols.COPPER_SULFATE,
    1.0,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.2, new Color( 200, 225, 255 ),
      1.38, new Color( 30, 144, 255 ) ) );

  Solute.POTASSIUM_PERMANGANATE = new Solute(
    potassiumPermanganateString,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    0.4,
    new SoluteColorScheme( 0, Solvent.WATER_COLOR,
      0.01, new Color( 255, 0, 255 ),
      0.48, new Color( 80, 0, 120 ) ),
    Color.BLACK );

  return Solute;
} );
