// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates game challenges for Level 2, as specified in the design document.
 * Slope and intercept are uniquely chosen.
 * Point (x1,y1) is not unique, but is chosen such that slope indicator is on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var GraphTheLine = require( 'GRAPHING_LINES/linegame/model/GraphTheLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var MakeTheEquation = require( 'GRAPHING_LINES/linegame/model/MakeTheEquation' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var RandomChooser = require( 'GRAPHING_LINES/linegame/model/RandomChooser' );
  var Range = require( 'DOT/Range' );

  function ChallengeFactory2() {
    ChallengeFactory.call( this );
  }

  // Creates the set of positive fractional slopes that are identified in the design document.
  ChallengeFactory2.createPositiveFractionalSlopes = function() {
    return [
      // positive fractions
      new Fraction( 1, 4 ),
      new Fraction( 1, 5 ),
      new Fraction( 1, 6 ),
      new Fraction( 1, 7 ),
      new Fraction( 2, 5 ),
      new Fraction( 3, 5 ),
      new Fraction( 2, 7 ),
      new Fraction( 3, 7 ),
      new Fraction( 4, 7 ),
      new Fraction( 5, 2 ),
      new Fraction( 3, 2 ),
      new Fraction( 7, 2 ),
      new Fraction( 7, 3 ),
      new Fraction( 7, 4 )
    ];
  };

  // Creates the 3 sets of slopes that are identified in the design document.
  ChallengeFactory2.createSlopeArrays = function() {
    return [
      // positive and negative integers
      [
        new Fraction( 1, 1 ),
        new Fraction( 2, 1 ),
        new Fraction( 3, 1 ),
        new Fraction( 4, 1 ),
        new Fraction( 5, 1 ),
        new Fraction( -1, 1 ),
        new Fraction( -2, 1 ),
        new Fraction( -3, 1 ),
        new Fraction( -4, 1 ),
        new Fraction( -5, 1 )
      ],
      // positive fractions
      ChallengeFactory2.createPositiveFractionalSlopes(),
      // negative fractions
      [
        new Fraction( -1, 2 ),
        new Fraction( -1, 3 ),
        new Fraction( -1, 4 ),
        new Fraction( -1, 5 ),
        new Fraction( -2, 3 ),
        new Fraction( -3, 4 ),
        new Fraction( -2, 5 ),
        new Fraction( -3, 5 ),
        new Fraction( -4, 5 ),
        new Fraction( -3, 2 ),
        new Fraction( -4, 3 ),
        new Fraction( -5, 2 ),
        new Fraction( -5, 3 ),
        new Fraction( -5, 4 )
      ]
    ];
  };

  return inherit( ChallengeFactory, ChallengeFactory2, {

    /**
     * Creates challenges for this game level.
     * @override
     * @param {Range} xRange range of the graph's x axis
     * @param {Range} yRange range of the graph's y axis
     * @return {Array<Challenge>} array of challenges
     */
    createChallenges: function( xRange, yRange ) {

      // all variables, manually hoisted
      var challenges = [];
      var slopeArrays, slopeArrayIndices, yInterceptArrays, yInterceptArrayIndices;
      var pointSlopeManipulationModes;
      var slope, yIntercept, point, description, manipulationMode;

      // for slope manipulation challenges, 1 slope must come from each list
      slopeArrays = ChallengeFactory2.createSlopeArrays();
      slopeArrayIndices = RandomChooser.rangeToArray( new Range( 0, slopeArrays.length - 1 ) );

      // for y-intercept manipulation challenges, one must be positive, one negative
      yInterceptArrays = [
        RandomChooser.rangeToArray( new Range( yRange.min, -1 ) ),
        RandomChooser.rangeToArray( new Range( 1, yRange.max ) )
      ];
      yInterceptArrayIndices = RandomChooser.rangeToArray( new Range( 0, yInterceptArrays.length - 1 ) );

      // for point-slope form, one of each manipulation mode
      pointSlopeManipulationModes = [ ManipulationMode.POINT, ManipulationMode.SLOPE ];

      // Graph-the-Line, slope-intercept form, slope variable
      slope = RandomChooser.chooseFromArrays( slopeArrays, slopeArrayIndices ); // first required slope, unique
      yIntercept = RandomChooser.chooseFromArrays( yInterceptArrays ); // unique y-intercept
      challenges.push( new GraphTheLine( '1 of 3 required slopes',
        Line.createSlopeIntercept( slope.numerator, slope.denominator, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE, xRange, yRange ) );

      // Graph-the-Line, slope-intercept form, intercept variable
      slope = RandomChooser.chooseFromArrays( slopeArrays ); // unique slope
      yIntercept = RandomChooser.chooseFromArrays( yInterceptArrays, yInterceptArrayIndices ); // first required y-intercept, unique
      challenges.push( new GraphTheLine( '1 of 2 required y-intercepts',
        Line.createSlopeIntercept( slope.numerator, slope.denominator, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.INTERCEPT, xRange, yRange ) );

      // Make-the-Equation, slope-intercept form, slope variable
      slope = RandomChooser.chooseFromArrays( slopeArrays, slopeArrayIndices );  // second required slope, unique
      yIntercept = RandomChooser.chooseFromArrays( yInterceptArrays ); // unique y-intercept
      challenges.push( new MakeTheEquation( '2 of 3 requires slopes',
        Line.createSlopeIntercept( slope.numerator, slope.denominator, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE, xRange, yRange ) );

      // Make-the-Equation, slope-intercept form, intercept variable
      slope = RandomChooser.chooseFromArrays( slopeArrays ); // unique slope
      yIntercept = RandomChooser.chooseFromArrays( yInterceptArrays, yInterceptArrayIndices ); // second required y-intercept, unique
      challenges.push( new MakeTheEquation( '2 of 2 required y-intercepts',
        Line.createSlopeIntercept( slope.numerator, slope.denominator, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.INTERCEPT, xRange, yRange ) );

      // Graph-the-Line, point-slope form, point or slope variable (random choice)
      {
        // manipulation mode
        manipulationMode = RandomChooser.choose( pointSlopeManipulationModes );

        if ( manipulationMode === ManipulationMode.SLOPE ) {
          slope = RandomChooser.chooseFromArrays( slopeArrays, slopeArrayIndices ); // third required slope, unique
          description = 'random choice of slope manipulation, 3 of 3 required slopes';
        }
        else {
          slope = RandomChooser.chooseFromArrays( slopeArrays ); // unique slope
          description = 'random choice of point manipulation';
        }
        point = ChallengeFactory.choosePointForSlope( slope, xRange, yRange ); // random point, not necessarily unique

        // challenge
        challenges.push( new GraphTheLine( description,
          Line.createPointSlope( point.x, point.y, slope.numerator, slope.denominator ),
          EquationForm.POINT_SLOPE, manipulationMode, xRange, yRange ) );
      }

      // Make-the-Equation, point-slope form, point or slope variable (whichever was not variable above)
      {
        // manipulation mode
        manipulationMode = RandomChooser.choose( pointSlopeManipulationModes );

        if ( manipulationMode === ManipulationMode.SLOPE ) {
          slope = RandomChooser.chooseFromArrays( slopeArrays, slopeArrayIndices ); // third required slope, unique
          description = 'slope manipulation because Graph-the-Line uses point, 3 of 3 required slopes';
        }
        else {
          slope = RandomChooser.chooseFromArrays( slopeArrays ); // unique slope
          description = 'point manipulation because Graph-the-Line uses slope';
        }
        point = ChallengeFactory.choosePointForSlope( slope, xRange, yRange ); // random point, not necessarily unique

        // challenge
        challenges.push( new MakeTheEquation( description,
          Line.createPointSlope( point.x, point.y, slope.numerator, slope.denominator ),
          EquationForm.POINT_SLOPE, manipulationMode, xRange, yRange ) );
      }

      // shuffle and return
      return _.shuffle( challenges );
    }
  } );
} );