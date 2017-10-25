// Copyright 2002-2014, University of Colorado Boulder


/**
 * General constants for Mixed Number Game, extends Constants.  See https://github.com/phetsims/fraction-matcher/issues/43
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var Constants = require( 'FRACTION_MATCHER/model/Constants' );
  var inherit = require( 'PHET_CORE/inherit' );

  function MixedNumbersConstants() {
    Constants.call( this );

    //mixed numbers added some more fractions or remove extra
    this.LEVEL_DESCRIPTION[0].fractions.pop();
    // add mixed fractions
    this.LEVEL_DESCRIPTION[0].fractions.push( Fraction.fraction( 3, 2 ), Fraction.fraction( 4, 3 ) );

    // level 2
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[1].fractions.push( Fraction.fraction( 3, 2 ), Fraction.fraction( 4, 3 ), Fraction.fraction( 5, 3 ), Fraction.fraction( 5, 4 ), Fraction.fraction( 6, 4 ), Fraction.fraction( 6, 5 ) );

    // level 3
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[2].fractions.push( Fraction.fraction( 5, 3 ), Fraction.fraction( 6, 5 ), Fraction.fraction( 7, 5 ), Fraction.fraction( 8, 5 ), Fraction.fraction( 9, 5 ), Fraction.fraction( 8, 6 ), Fraction.fraction( 9, 6 ), Fraction.fraction( 10, 6 ), Fraction.fraction( 11, 6 ), Fraction.fraction( 8, 7 ), Fraction.fraction( 9, 7 ), Fraction.fraction( 10, 7 ), Fraction.fraction( 11, 7 ), Fraction.fraction( 12, 7 ), Fraction.fraction( 13, 7 ), Fraction.fraction( 9, 8 ), Fraction.fraction( 10, 8 ), Fraction.fraction( 11, 8 ), Fraction.fraction( 12, 8 ), Fraction.fraction( 13, 8 ), Fraction.fraction( 14, 8 ), Fraction.fraction( 15, 8 ) );

    // level 4
    // remove one 13/7 fraction
    this.LEVEL_DESCRIPTION[3].fractions.shift();
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[3].fractions.push( Fraction.fraction( 6, 5 ), Fraction.fraction( 7, 5 ), Fraction.fraction( 8, 5 ), Fraction.fraction( 7, 6 ), Fraction.fraction( 8, 6 ), Fraction.fraction( 9, 6 ), Fraction.fraction( 10, 6 ), Fraction.fraction( 11, 6 ), Fraction.fraction( 8, 7 ), Fraction.fraction( 10, 7 ), Fraction.fraction( 11, 7 ), Fraction.fraction( 12, 7 ), Fraction.fraction( 10, 8 ), Fraction.fraction( 11, 8 ), Fraction.fraction( 12, 8 ), Fraction.fraction( 13, 8 ), Fraction.fraction( 15, 8 ), Fraction.fraction( 10, 9 ), Fraction.fraction( 11, 9 ), Fraction.fraction( 12, 9 ), Fraction.fraction( 13, 9 ), Fraction.fraction( 14, 9 ), Fraction.fraction( 15, 9 ), Fraction.fraction( 16, 9 ), Fraction.fraction( 17, 9 ) );
    this.LEVEL_DESCRIPTION[3].numericScaleFactors = [1];

    // level 5
    this.LEVEL_DESCRIPTION[4].fractions = this.LEVEL_DESCRIPTION[3].fractions.slice( 0 );

    // level 6
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[5].fractions.push( Fraction.fraction( 10, 6 ), Fraction.fraction( 11, 6 ), Fraction.fraction( 8, 7 ), Fraction.fraction( 11, 7 ), Fraction.fraction( 12, 7 ), Fraction.fraction( 12, 8 ), Fraction.fraction( 13, 8 ), Fraction.fraction( 15, 8 ), Fraction.fraction( 12, 9 ), Fraction.fraction( 13, 9 ), Fraction.fraction( 14, 9 ), Fraction.fraction( 15, 9 ), Fraction.fraction( 16, 9 ), Fraction.fraction( 17, 9 ) );

    // level 7
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[6].fractions.push( Fraction.fraction( 8, 6 ), Fraction.fraction( 9, 6 ), Fraction.fraction( 10, 6 ), Fraction.fraction( 8, 7 ), Fraction.fraction( 9, 7 ), Fraction.fraction( 10, 7 ), Fraction.fraction( 11, 7 ), Fraction.fraction( 12, 7 ), Fraction.fraction( 13, 7 ), Fraction.fraction( 9, 8 ), Fraction.fraction( 10, 8 ), Fraction.fraction( 11, 8 ), Fraction.fraction( 12, 8 ), Fraction.fraction( 13, 8 ), Fraction.fraction( 14, 8 ), Fraction.fraction( 15, 8 ), Fraction.fraction( 10, 9 ), Fraction.fraction( 11, 9 ), Fraction.fraction( 12, 9 ), Fraction.fraction( 13, 9 ), Fraction.fraction( 14, 9 ), Fraction.fraction( 15, 9 ), Fraction.fraction( 16, 9 ), Fraction.fraction( 17, 9 ) );
    this.LEVEL_DESCRIPTION[6].numericScaleFactors = [3, 6, 7];

    // level 8
    // add more mixed fractions
    this.LEVEL_DESCRIPTION[7].fractions.push( Fraction.fraction( 6, 5 ), Fraction.fraction( 7, 5 ), Fraction.fraction( 8, 5 ), Fraction.fraction( 9, 5 ), Fraction.fraction( 7, 6 ), Fraction.fraction( 8, 6 ), Fraction.fraction( 9, 6 ), Fraction.fraction( 10, 6 ), Fraction.fraction( 11, 6 ) );
    this.LEVEL_DESCRIPTION[7].numericScaleFactors = [3, 4, 5, 6, 7, 8, 9];
  }

  return inherit( Constants, MixedNumbersConstants );
} );