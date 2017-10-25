// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  // constants
  var MIN_VOLUME = Math.pow( 10, -PHScaleConstants.VOLUME_DECIMAL_PLACES );

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {number} soluteVolume liters
   * @param {number} waterVolume liters
   * @param {number} maxVolume liters
   */
  function Solution( soluteProperty, soluteVolume, waterVolume, maxVolume ) {
    assert && assert( soluteVolume + waterVolume <= maxVolume );

    var thisSolution = this;

    thisSolution.soluteProperty = soluteProperty;
    thisSolution.soluteVolumeProperty = new Property( soluteVolume );
    thisSolution.waterVolumeProperty = new Property( waterVolume );
    thisSolution.maxVolume = maxVolume;

    /*
     * See issue #25.
     * True when changes to water volume and solute volume should be ignored, because they will both be changing,
     * which currently happens only during draining. To prevent bogus intermediate values (for example, pH and total volume),
     * clients who observe both waterVolumeProperty and soluteVolumeProperty should consult the ignoreVolumeUpdate flag before updating.
     */
    thisSolution.ignoreVolumeUpdate = false;

    // volume
    thisSolution.volumeProperty = new DerivedProperty( [ thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function() {
        return ( thisSolution.ignoreVolumeUpdate ) ? thisSolution.volumeProperty.get() : thisSolution.computeVolume();
      }
    );

    // pH, null if no value
    thisSolution.pHProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function() {
        if ( thisSolution.ignoreVolumeUpdate ) {
          return thisSolution.pHProperty.get();
        }
        else {
          var pH = thisSolution.computePH();
          if ( pH !== null ) {
            pH = Util.toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ); // constrain to the pH meter format, see issue #4
          }
          return pH;
        }
      } );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function( solute, soluteVolume, waterVolume ) {
        if ( soluteVolume + waterVolume === 0 ) {
          return Color.BLACK; // no solution, should never see this color displayed
        }
        else if ( soluteVolume === 0 || thisSolution.isEquivalentToWater() ) {
          return Water.color;
        }
        else {
          return solute.computeColor( soluteVolume / ( soluteVolume + waterVolume ) );
        }
      } );

    // solute
    thisSolution.soluteProperty.link( function() {
      // reset to volumes that were specified in the constructor
      thisSolution.waterVolumeProperty.set( waterVolume );
      thisSolution.soluteVolumeProperty.set( soluteVolume );
    } );
  }

  return inherit( Object, Solution, {

    reset: function() {
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.waterVolumeProperty.reset();
    },

    /*
     * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
     * Eg, the value displayed to the user is '7.00'.
     */
    isEquivalentToWater: function() {
      var pHString = Util.toFixed( this.computePH(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return ( parseFloat( pHString ) === Water.pH ) && ( this.waterVolumeProperty.get() > 0 );
    },

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    // @private
    isEmpty: function() { return this.computeVolume() === 0; },

    // @private
    isFull: function() { return this.computeVolume() === this.maxVolume; },

    // @private Returns the amount of volume that is available to fill.
    getFreeVolume: function() { return this.maxVolume - this.computeVolume(); },

    // Convenience function for adding solute
    addSolute: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        this.soluteVolumeProperty.set( Math.max( MIN_VOLUME, this.soluteVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) ) );
      }
    },

    // Convenience function for adding water
    addWater: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        this.waterVolumeProperty.set( Math.max( MIN_VOLUME, this.waterVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) ) );
      }
    },

    /**
     * Drains a specified amount of solution.
     * @param {number} deltaVolume amount of solution to drain, in liters
     */
    drainSolution: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        var totalVolume = this.computeVolume();
        if ( totalVolume > 0 ) {
          if ( totalVolume - deltaVolume < MIN_VOLUME ) {
            // drain the remaining solution
            this.setVolumeAtomic( 0, 0 );
          }
          else {
            // drain equal percentages of water and solute
            var waterVolume = this.waterVolumeProperty.get();
            var soluteVolume = this.soluteVolumeProperty.get();
            this.setVolumeAtomic( waterVolume - ( deltaVolume * waterVolume / totalVolume ), soluteVolume - ( deltaVolume * soluteVolume / totalVolume ) );
          }
        }
      }
    },

    /**
     * Sets volume atomically, to prevent pH value from going through an intermediate state.
     * See documentation of ignoreVolumeUpdate above.
     *
     * @private
     * @param {number} waterVolume liters
     * @param {number} soluteVolume liters
     */
    setVolumeAtomic: function( waterVolume, soluteVolume ) {
      // ignore the first notification if both volumes are changing
      this.ignoreVolumeUpdate = ( waterVolume !== this.waterVolumeProperty.get() ) && ( soluteVolume !== this.soluteVolumeProperty.get() );
      this.waterVolumeProperty.set( waterVolume );
      this.ignoreVolumeUpdate = false; // don't ignore the second notification, so that observers will update
      this.soluteVolumeProperty.set( soluteVolume );
    },

    //----------------------------------------------------------------------------
    // Computations for derived properties
    //----------------------------------------------------------------------------

    /**
     * Computes total volume for this solution.
     * @private Used in internal computations to prevent incorrect intermediate values, see issue #40
     * @return {number} liters
     */
    computeVolume: function() {
      return ( this.soluteVolumeProperty.get() + this.waterVolumeProperty.get() );
    },

    /**
     * Compute pH for this solution.
     * @private Used in internal computations to prevent incorrect intermediate values, see issue #40
     * @return {number|null} pH, null if total volume is zero
     */
    computePH: function() {
      return PHModel.computePH( this.soluteProperty.get().pH, this.soluteVolumeProperty.get(), this.waterVolumeProperty.get() );
    },

    //----------------------------------------------------------------------------
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    getConcentrationH3O: function() {
      return PHModel.pHToConcentrationH3O( this.computePH() );
    },

    getConcentrationOH: function() {
      return PHModel.pHToConcentrationOH( this.computePH() );
    },

    getConcentrationH2O: function() {
      return ( this.isEmpty() ? 0 : 55 );
    },

    //----------------------------------------------------------------------------
    // Number of molecules
    //----------------------------------------------------------------------------

    getMoleculesH3O: function() {
      return PHModel.computeMolecules( this.getConcentrationH3O(), this.computeVolume() );
    },

    getMoleculesOH: function() {
      return PHModel.computeMolecules( this.getConcentrationOH(), this.computeVolume() );
    },

    getMoleculesH2O: function() {
      return PHModel.computeMolecules( this.getConcentrationH2O(), this.computeVolume() );
    },

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    getMolesH3O: function() {
      return PHModel.computeMoles( this.getConcentrationH3O(), this.computeVolume() );
    },

    getMolesOH: function() {
      return PHModel.computeMoles( this.getConcentrationOH(), this.computeVolume() );
    },

    getMolesH2O: function() {
      return PHModel.computeMoles( this.getConcentrationH2O(), this.computeVolume() );
    }
  } );
} );