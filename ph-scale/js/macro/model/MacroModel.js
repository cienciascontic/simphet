// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Macro' screen. Also serves as the supertype for the 'Micro' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Dropper = require( 'PH_SCALE/common/model/Dropper' );
  var Faucet = require( 'PH_SCALE/common/model/Faucet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHMeter = require( 'PH_SCALE/macro/model/PHMeter' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function MacroModel( options ) {

    options = _.extend( {
      autoFillVolume: 0.5 // L, automatically fill beaker with this much solute when the solute changes
    }, options );

    var thisModel = this;

    // solute choices, in order that they'll appear in the combo box
    thisModel.solutes = [
      Solute.DRAIN_CLEANER,
      Solute.HAND_SOAP,
      Solute.BLOOD,
      Solute.SPIT,
      Solute.MILK,
      Solute.CHICKEN_SOUP,
      Solute.COFFEE,
      Solute.ORANGE_JUICE,
      Solute.SODA,
      Solute.VOMIT,
      Solute.BATTERY_ACID
    ];

    // Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    thisModel.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

    // Dropper above the beaker
    var yDropper = thisModel.beaker.location.y - thisModel.beaker.size.height - 15;
    thisModel.dropper = new Dropper( Solute.CHICKEN_SOUP,
      new Vector2( thisModel.beaker.location.x - 50, yDropper ),
      new Bounds2( thisModel.beaker.left + 40, yDropper, thisModel.beaker.right - 200, yDropper ) );

    // Solution in the beaker
    thisModel.solution = new Solution( thisModel.dropper.soluteProperty, 0, 0, thisModel.beaker.volume );

    // Water faucet at the beaker's top-right
    thisModel.waterFaucet = new Faucet( new Vector2( thisModel.beaker.right - 50, thisModel.beaker.location.y - thisModel.beaker.size.height - 45 ),
      thisModel.beaker.right + 400,
      { enabled: thisModel.solution.volumeProperty.get() < thisModel.beaker.volume } );

    // Drain faucet at the beaker's bottom-left.
    thisModel.drainFaucet = new Faucet( new Vector2( thisModel.beaker.left - 75, thisModel.beaker.location.y + 43 ), thisModel.beaker.left,
      { enabled: thisModel.solution.volumeProperty.get() > 0 } );

    // pH meter to the left of the drain faucet
    var pHMeterLocation = new Vector2( thisModel.drainFaucet.location.x - 300, 75 );
    thisModel.pHMeter = new PHMeter( pHMeterLocation, new Vector2( pHMeterLocation.x + 150, thisModel.beaker.location.y ),
      PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds );

    // auto-fill when the solute changes
    this.autoFillVolume = options.autoFillVolume; // @private
    this.isAutoFilling = false; // @private
    thisModel.dropper.soluteProperty.link( function() {
      // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
      thisModel.waterFaucet.enabledProperty.set( false );
      thisModel.drainFaucet.enabledProperty.set( false );
      // animate the dropper adding solute to the beaker
      thisModel.startAutoFill();
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    thisModel.solution.volumeProperty.link( function( volume ) {
      thisModel.updateFaucetsAndDropper();
    } );
  }

  return inherit( Object, MacroModel, {

    reset: function() {
      this.beaker.reset();
      this.dropper.reset();
      this.solution.reset();
      this.waterFaucet.reset();
      this.drainFaucet.reset();
      this.pHMeter.reset();
      this.startAutoFill();
    },

    /*
     * Enables faucets and dropper based on amount of solution in the beaker.
     * @private
     */
    updateFaucetsAndDropper: function() {
      var volume = this.solution.volumeProperty.get();
      this.waterFaucet.enabledProperty.set( volume < this.beaker.volume );
      this.drainFaucet.enabledProperty.set( volume > 0 );
      this.dropper.enabledProperty.set( volume < this.beaker.volume );
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      if ( this.isAutoFilling ) {
        this.stepAutoFill( deltaSeconds );
      }
      else {
        this.solution.addSolute( this.dropper.flowRateProperty.get() * deltaSeconds );
        this.solution.addWater( this.waterFaucet.flowRateProperty.get() * deltaSeconds );
        this.solution.drainSolution( this.drainFaucet.flowRateProperty.get() * deltaSeconds );
      }
    },

    /**
     * Starts the auto-fill animation.
     * @private
     */
    startAutoFill: function() {
      this.isAutoFilling = true;
      this.dropper.onProperty.set( true );
      this.dropper.flowRateProperty.set( 0.75 ); // faster than standard flow rate
    },

    /**
     * Advances the auto-fill animation.
     * @private
     * @param deltaSeconds clock time change, in seconds.
     */
    stepAutoFill: function( deltaSeconds ) {
      this.solution.addSolute( Math.min( this.dropper.flowRateProperty.get() * deltaSeconds, this.autoFillVolume - this.solution.volumeProperty.get() ) );
      if ( this.solution.volumeProperty.get() === this.autoFillVolume ) {
        this.stopAutoFill();
      }
    },

    /**
     * Stops the auto-fill animation.
     * @private
     */
    stopAutoFill: function() {
      this.isAutoFilling = false;
      this.dropper.onProperty.set( false );
      this.updateFaucetsAndDropper();
    }
  } );
} );
