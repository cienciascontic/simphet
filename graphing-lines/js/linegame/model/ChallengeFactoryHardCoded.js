// Copyright 2002-2014, University of Colorado Boulder

/**
 * Hard-coded challenges, used in initial development of the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var GraphTheLine = require( 'GRAPHING_LINES/linegame/model/GraphTheLine' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var MakeTheEquation = require( 'GRAPHING_LINES/linegame/model/MakeTheEquation' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var PlaceThePoints = require( 'GRAPHING_LINES/linegame/model/PlaceThePoints' );

  // constants
  var DESCRIPTION = 'dev-hardcoded';

  return {
    /**
     * Creates hard-coded challenges, for development testing.
     * @param {Number} level the game level
     * @param {Range} xRange range of the graph's x axis
     * @param {Range} yRange range of the graph's y axis
     * @return {Array<Challenge>} array of challenges
     */
    createChallenges: function( level, xRange, yRange ) {
      var challenges = [];
      switch( level ) {
        case 0:
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 1, 1, -2 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.INTERCEPT, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 5, 1, 1 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 4, 2, 3 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 3, 3, -3 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.TWO_POINTS, xRange, yRange ) );
          // mismatched equation form and graph manipulators
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 3, 3, -3 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
          break;
        case 1:
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createPointSlope( 2, 1, 1, 2 ), EquationForm.POINT_SLOPE, ManipulationMode.SLOPE, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createPointSlope( 1, -3, 1, 3 ), EquationForm.POINT_SLOPE, ManipulationMode.POINT, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createPointSlope( -2, 1, -4, 3 ), EquationForm.POINT_SLOPE, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createPointSlope( 5, 4, 3, 2 ), EquationForm.POINT_SLOPE, ManipulationMode.TWO_POINTS, xRange, yRange ) );
          // mismatched equation form and graph manipulators
          challenges.push( new GraphTheLine( DESCRIPTION, Line.createSlopeIntercept( 4, 2, 3 ), EquationForm.POINT_SLOPE, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
          break;
        case 2:
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createSlopeIntercept( 1, 1, -2 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.INTERCEPT, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createSlopeIntercept( 5, 1, 1 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createSlopeIntercept( 4, 2, 3 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createSlopeIntercept( 3, 3, -3 ), EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
          break;
        case 3:
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createPointSlope( 2, 1, 1, 2 ), EquationForm.POINT_SLOPE, ManipulationMode.SLOPE, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createPointSlope( 1, -3, 1, 3 ), EquationForm.POINT_SLOPE, ManipulationMode.POINT, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createPointSlope( -2, 1, -4, 3 ), EquationForm.POINT_SLOPE, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
          challenges.push( new MakeTheEquation( DESCRIPTION, Line.createPointSlope( 5, 4, 3, 2 ), EquationForm.POINT_SLOPE, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
          break;
        case 4:
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createSlopeIntercept( 1, 1, -2 ), EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createSlopeIntercept( 5, 1, 1 ), EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createSlopeIntercept( 4, 2, 3 ), EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createSlopeIntercept( 3, 3, -3 ), EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );
          break;
        case 5:
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createPointSlope( 2, 1, 1, 2 ), EquationForm.POINT_SLOPE, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createPointSlope( 1, -3, 1, 3 ), EquationForm.POINT_SLOPE, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createPointSlope( -2, 1, -4, 3 ), EquationForm.POINT_SLOPE, xRange, yRange ) );
          challenges.push( new PlaceThePoints( DESCRIPTION, Line.createPointSlope( 5, 4, 3, 2 ), EquationForm.POINT_SLOPE, xRange, yRange ) );
          break;
        default:
          throw new Error( 'unsupported level: ' + level );
      }
      return challenges;
    }
  };
} );