// Copyright 2002-2014, University of Colorado Boulder

/**
 * Visual representation of H3O+/OH- ratio.
 * Molecules are drawn as circles, directly to Canvas for performance.
 * In the pH range close to neutral, the relationship between number of molecules and pH is log.
 * Outside of that range, we can't possibly draw that many molecules, so we fake it using a linear relationship.
 * <p>
 * Note: The implementation refers to 'majority' or 'minority' species throughout.
 * This is a fancy was of saying 'the molecule that has the larger (or smaller) count'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var TOTAL_MOLECULES_AT_PH_7 = 100;
  var MAX_MAJORITY_MOLECULES = 3000;
  var MIN_MINORITY_MOLECULES = 5; // any non-zero number of particles will be set to this number
  var LOG_PH_RANGE = new Range( 6, 8 ); // in this range, number of molecule is computed using log
  var MAJORITY_ALPHA = 0.55; // alpha of the majority species, [0-1], transparent-opaque
  var MINORITY_ALPHA = 1.0; // alpha of the minority species, [0-1], transparent-opaque
  var H3O_RADIUS = 3;
  var OH_RADIUS = H3O_RADIUS;

  // @private ----------------------------------------------------------------------------

  // Creates a random {number} x-coordinate inside some {Bounds2} bounds. Integer values improve Canvas performance.
  var createRandomX = function( bounds ) {
    return Math.floor( bounds.x + ( Math.random() * bounds.getWidth() ) );
  };

  // Creates a random {number} y-coordinate inside some {Bounds2} bounds. Integer values improve Canvas performance.
  var createRandomY = function( bounds ) {
    return Math.floor( bounds.y + ( Math.random() * bounds.getHeight() ) );
  };

  // Computes the {number} number of H3O+ molecules for some {number} pH.
  var computeNumberOfH3O = function( pH ) {
    return Math.round( PHModel.pHToConcentrationH3O( pH ) * ( TOTAL_MOLECULES_AT_PH_7 / 2 ) / 1E-7 );
  };

  // Computes the {number} number of OH- molecules for some {number} pH.
  var computeNumberOfOH = function( pH ) {
    return Math.round( PHModel.pHToConcentrationOH( pH ) * ( TOTAL_MOLECULES_AT_PH_7 / 2 ) / 1E-7 );
  };

  //-------------------------------------------------------------------------------------

  /**
   * Draws all molecules directly to Canvas.
   * @param {Bounds2} beakerBounds beaker bounds in view coordinate frame
   * @constructor
   */
  function MoleculesCanvas( beakerBounds ) {

    var thisNode = this;
    CanvasNode.call( thisNode, { canvasBounds: beakerBounds } );

    thisNode.beakerBounds = beakerBounds; // @private
    thisNode.numberOfH3OMolecules = 0; // @private
    thisNode.numberOfOHMolecules = 0; // @private

    // use typed array if available, it will use less memory and be faster
    var ArrayConstructor = window.Float32Array || window.Array;

    // pre-allocate arrays for molecule coordinates, to eliminate allocation in critical code
    thisNode.xH3O = new ArrayConstructor( MAX_MAJORITY_MOLECULES ); // @private
    thisNode.yH3O = new ArrayConstructor( MAX_MAJORITY_MOLECULES ); // @private
    thisNode.xOH = new ArrayConstructor( MAX_MAJORITY_MOLECULES ); // @private
    thisNode.yOH = new ArrayConstructor( MAX_MAJORITY_MOLECULES ); // @private

    /*
     * Generate majority and minority images for each molecule.
     * We don't care whether the images are in the same position as a scenery.Circle, so ignore x, y args in toImage callbacks.
     * toImage also takes optional x,y,width,height args, but we'll omit those and let scenery intelligently pick bounds.
     */
    new Circle( H3O_RADIUS, { fill: PHScaleColors.H3O_MOLECULES.withAlpha( MAJORITY_ALPHA ) } ).toImage( function( image, x, y ) {
      thisNode.imageH3OMajority = image; // @private
    } );
    new Circle( H3O_RADIUS, { fill: PHScaleColors.H3O_MOLECULES.withAlpha( MINORITY_ALPHA ) } ).toImage( function( image, x, y ) {
      thisNode.imageH3OMinority = image; // @private
    } );
    new Circle( OH_RADIUS, { fill: PHScaleColors.OH_MOLECULES.withAlpha( MAJORITY_ALPHA ) } ).toImage( function( image, x, y ) {
      thisNode.imageOHMajority = image; // @private
    } );
    new Circle( OH_RADIUS, { fill: PHScaleColors.OH_MOLECULES.withAlpha( MINORITY_ALPHA ) } ).toImage( function( image, x, y ) {
      thisNode.imageOHMinority = image; // @private
    } );
  }

  inherit( CanvasNode, MoleculesCanvas, {

    /**
     * Called when the solution's pH changes.
     * @param {number} numberOfH3OMolecules
     * @param {number} numberOfOHMolecules
     */
    drawMolecules: function( numberOfH3OMolecules, numberOfOHMolecules ) {
      if ( numberOfH3OMolecules !== this.numberOfH3OMolecules || numberOfOHMolecules !== this.numberOfOHMolecules ) {

        /*
         * paintCanvas may be called when other things in beakerBounds change,
         * and we don't want the molecule positions to change when the pH remains constant.
         * So generate and store molecule coordinates here, reusing the array.
         * See #25.
         */
        var i;
        for ( i = 0; i < numberOfH3OMolecules; i++ ) {
          this.xH3O[i] = createRandomX( this.beakerBounds );
          this.yH3O[i] = createRandomY( this.beakerBounds );
        }
        for ( i = 0; i < numberOfOHMolecules; i++ ) {
          this.xOH[i] = createRandomX( this.beakerBounds );
          this.yOH[i] = createRandomY( this.beakerBounds );
        }

        // remember how many entries in coordinate arrays are significant
        this.numberOfH3OMolecules = numberOfH3OMolecules;
        this.numberOfOHMolecules = numberOfOHMolecules;

        this.invalidatePaint(); // results in paintCanvas being called
      }
    },

    /**
     * Paints both species of molecule to the canvas.
     * @override
     * @protected
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {
      // draw majority species behind minority species
      if ( this.numberOfH3OMolecules > this.numberOfOHMolecules ) {
        this.paintMolecules( wrapper, this.numberOfH3OMolecules, this.imageH3OMajority, this.xH3O, this.yH3O );
        this.paintMolecules( wrapper, this.numberOfOHMolecules, this.imageOHMinority, this.xOH, this.yOH );
      }
      else {
        this.paintMolecules( wrapper, this.numberOfOHMolecules, this.imageOHMajority, this.xOH, this.yOH );
        this.paintMolecules( wrapper, this.numberOfH3OMolecules, this.imageH3OMinority, this.xH3O, this.yH3O );
      }
    },

    /**
     * Paints one species of molecule. Using drawImage is faster than arc.
     * @private
     * @param {CanvasContextWrapper} wrapper
     * @param {number} numberOfMolecules
     * @param {Image} image
     * @param {number[]} xCoords
     * @param {number[]} yCoords
     */
    paintMolecules: function( wrapper, numberOfMolecules, image, xCoords, yCoords ) {
      if ( image ) { // images are generated asynchronously, so test just in case they aren't available when this is first called
        for ( var i = 0; i < numberOfMolecules; i++ ) {
          wrapper.context.drawImage( image, xCoords[i], yCoords[i] );
        }
      }
    }
  }, {

  } );

  //-------------------------------------------------------------------------------------

  /**
   * @param {Beaker} beaker
   * @param {Solution} solution
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function RatioNode( beaker, solution, modelViewTransform, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // save constructor args
    thisNode.solution = solution; // @private

    // current pH
    thisNode.pH = null; // @private null to force an update

    // bounds of the beaker, in view coordinates
    var beakerBounds = modelViewTransform.modelToViewBounds( beaker.bounds );

    // parent for all molecules
    thisNode.moleculesNode = new MoleculesCanvas( beakerBounds ); // @private
    thisNode.addChild( thisNode.moleculesNode );

    // dev mode, show numbers of molecules at bottom of beaker
    if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
      thisNode.ratioText = new Text( '?', { font: new PhetFont( 30 ), fill: 'black', left: beakerBounds.getCenterX(), bottom: beakerBounds.maxY - 20 } ); // @private
      thisNode.addChild( thisNode.ratioText );
    }

    thisNode.mutate( options ); // call before registering for property notifications, because 'visible' significantly affects initialization time

    // sync view with model
    solution.pHProperty.link( thisNode.update.bind( thisNode ) );

    // clip to the shape of the solution in the beaker
    solution.volumeProperty.link( function( volume ) {
      if ( volume === 0 ) {
        thisNode.clipArea = null;
      }
      else {
        var solutionHeight = beakerBounds.getHeight() * volume / beaker.volume;
        thisNode.clipArea = Shape.rectangle( beakerBounds.minX, beakerBounds.maxY - solutionHeight, beakerBounds.getWidth(), solutionHeight );
      }
      thisNode.moleculesNode.invalidatePaint(); //WORKAROUND: #25, scenery#200
    } );
  }

  return inherit( Node, RatioNode, {

    // @override When this node becomes visible, update it.
    setVisible: function( visible ) {
      var doUpdate = visible && !this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( doUpdate ) { this.update(); }
    },

    /**
     * Updates the number of molecules when the pH (as displayed on the meter) changes.
     * If volume changes, we don't create more molecules, we just expose more of them.
     * @private
     */
    update: function() {

      // don't update if not visible
      if ( !this.visible ) { return; }

      var pH = this.solution.pHProperty.get();
      if ( pH !== null ) {
        pH = Util.toFixedNumber( this.solution.pHProperty.get(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      }

      if ( this.pH !== pH ) {

        this.pH = pH;
        var numberOfH3O = 0;
        var numberOfOH = 0;

        if ( pH !== null ) {

          // compute number of molecules
          if ( LOG_PH_RANGE.contains( pH ) ) {
            // # molecules varies logarithmically in this range
            numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, computeNumberOfH3O( pH ) );
            numberOfOH = Math.max( MIN_MINORITY_MOLECULES, computeNumberOfOH( pH ) );
          }
          else {
            // # molecules varies linearly in this range
            // N is the number of molecules to add for each 1 unit of pH above or below the thresholds
            var N = ( MAX_MAJORITY_MOLECULES - computeNumberOfOH( LOG_PH_RANGE.max ) ) / ( PHScaleConstants.PH_RANGE.max - LOG_PH_RANGE.max );
            var pHDiff;
            if ( pH > LOG_PH_RANGE.max ) {
              // strong base
              pHDiff = pH - LOG_PH_RANGE.max;
              numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, ( computeNumberOfH3O( LOG_PH_RANGE.max ) - pHDiff ) );
              numberOfOH = computeNumberOfOH( LOG_PH_RANGE.max ) + ( pHDiff * N );
            }
            else {
              // strong acid
              pHDiff = LOG_PH_RANGE.min - pH;
              numberOfH3O = computeNumberOfH3O( LOG_PH_RANGE.min ) + ( pHDiff * N );
              numberOfOH = Math.max( MIN_MINORITY_MOLECULES, ( computeNumberOfOH( LOG_PH_RANGE.min ) - pHDiff ) );
            }
          }

          // convert to integer values
          numberOfH3O = Math.round( numberOfH3O );
          numberOfOH = Math.round( numberOfOH );
        }

        // update molecules
        this.moleculesNode.drawMolecules( numberOfH3O, numberOfOH );

        // update dev counts
        if ( this.ratioText ) {
          this.ratioText.text = numberOfH3O + ' / ' + numberOfOH;
        }
      }
    }
  } );
} );