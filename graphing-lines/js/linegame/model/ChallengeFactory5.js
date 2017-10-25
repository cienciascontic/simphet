// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates game challenges for Level 5, as specified in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory' );
  var Color = require( 'SCENERY/util/Color' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var GraphTheLine = require( 'GRAPHING_LINES/linegame/model/GraphTheLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var MakeTheEquation = require( 'GRAPHING_LINES/linegame/model/MakeTheEquation' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var PlaceThePoints = require( 'GRAPHING_LINES/linegame/model/PlaceThePoints' );
  var RandomChooser = require( 'GRAPHING_LINES/linegame/model/RandomChooser' );
  var Range = require( 'DOT/Range' );

  function ChallengeFactory5() {
    ChallengeFactory.call( this );
  }

  /**
   * Adds 2 'Place the Point' challenges, 1 slope-intercept form, 1 point-slope form.
   * Pulled out into a method that can be reused in level=6.
   *
   * @param {Array<Challenge>} challenges add challenges to this list
   * @param {Range} xRange range of the graph's x axis
   * @param {Range} yRange range of the graph's y axis
   */
  ChallengeFactory5.addPlaceThePointsChallenges = function( challenges, xRange, yRange ) {

    var x1, y1, rise, run;

    // all ranges limited to [-5,5]
    var range = new Range( -5, 5 );
    assert && assert( xRange.containsRange( range ) && yRange.containsRange( range ) );
    var xList = RandomChooser.rangeToArray( range );
    var yList = RandomChooser.rangeToArray( range );
    var riseList = RandomChooser.rangeToArray( range, { excludeZero: true } ); // prevent zero slope
    var runList = RandomChooser.rangeToArray( range, { excludeZero: true } );  // prevent undefined slope

    // slope-intercept form, slope and intercept variable
    x1 = 0; // y-intercept must be an integer
    y1 = RandomChooser.choose( yList );
    rise = RandomChooser.choose( riseList );
    run = RandomChooser.choose( runList );
    if ( Math.abs( rise / run ) === 1 ) { // prevent unit slope
      run = RandomChooser.choose( runList );
    }
    challenges.push( new PlaceThePoints( 'slope-intercept, random points',
      new Line( x1, y1, x1 + run, y1 + rise, Color.BLACK ),
      EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );

    // point-slope form, point and slope variable
    x1 = RandomChooser.choose( xList );
    y1 = RandomChooser.choose( yList );
    rise = RandomChooser.choose( riseList );
    run = RandomChooser.choose( runList );
    if ( Math.abs( rise / run ) === 1 ) { // prevent unit slope
      run = RandomChooser.choose( runList );
    }
    challenges.push( new PlaceThePoints( 'point-slope, random points',
      new Line( x1, y1, x1 + run, y1 + rise, Color.BLACK ),
      EquationForm.POINT_SLOPE, xRange, yRange ) );
  };

  return inherit( ChallengeFactory, ChallengeFactory5, {

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
      var yIntercepts, riseList, runList, excluded;
      var equationForm, slope, excludedSlopes, yIntercept, point, line;
      var x1, y1, x2, y2, xList, yList, rise, run, i;

      // for y-intercept manipulation challenges
      yIntercepts = RandomChooser.rangeToArray( yRange );

      // Make-the-Equation, slope-intercept form, slope=0
      yIntercept = RandomChooser.choose( yIntercepts );
      challenges.push( new MakeTheEquation( 'slope=0',
        Line.createSlopeIntercept( 0, 1, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );

      // Graph-the-Line, slope-intercept form, slope=0
      yIntercept = RandomChooser.choose( yIntercepts );
      challenges.push( new GraphTheLine( 'slope=0',
        Line.createSlopeIntercept( 0, 1, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );

      // Graph-the-Line, slope-intercept or point-slope form (random choice), 2 variables
      {
        // randomly choose equation form
        equationForm = RandomChooser.choose( [ EquationForm.SLOPE_INTERCEPT, EquationForm.POINT_SLOPE ] );

        // random points
        var range = new Range( -5, 5 );
        assert && assert( xRange.containsRange( range ) && yRange.containsRange( range ) );
        xList = RandomChooser.rangeToArray( range );
        yList = RandomChooser.rangeToArray( range);
        x1 = ( equationForm === EquationForm.SLOPE_INTERCEPT ) ? 0 : RandomChooser.choose( xList );
        y1 = RandomChooser.choose( yList );
        x2 = RandomChooser.choose( xList );
        if ( x2 === x1 ) {
          x2 = RandomChooser.choose( xList ); // prevent undefined slope
        }
        y2 = RandomChooser.choose( yList );

        // exclude slopes of +1 and -1
        slope = ( y2 - y1 ) / ( x2 - x1 );
        if ( slope === 1 || slope === -1 ) {
          y2 = RandomChooser.choose( yList );
        }

        // challenge
        line = new Line( x1, y1, x2, y2, Color.BLACK );
        if ( equationForm === EquationForm.SLOPE_INTERCEPT ) {
          challenges.push( new GraphTheLine( 'random choice of slope-intercept, points in [-5,5]',
            line, EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
        }
        else {
          challenges.push( new GraphTheLine( 'random choice of point-slope, points in [-5,5]',
            line, EquationForm.POINT_SLOPE, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
        }
      }

      // Make-the-Equation, slope-intercept or point-slope form (random choice), 2 variables, random slope with exclusions
      {
        // randomly choose equation form
        equationForm = RandomChooser.choose( [ EquationForm.SLOPE_INTERCEPT, EquationForm.POINT_SLOPE ] );

        // exclude slopes whose simplified absolute value matches these
        excludedSlopes = [
          new Fraction( 1, 1 ),
          new Fraction( 2, 1 ),
          new Fraction( 1, 2 ),
          new Fraction( 1, 3 ),
          new Fraction( 1, 4 ),
          new Fraction( 2, 3 )
        ];

        // choose rise and run such that they don't make an undefined or excluded slope
        riseList = RandomChooser.rangeToArray( yRange );
        runList = RandomChooser.rangeToArray( xRange );
        rise = RandomChooser.choose( riseList );
        run = RandomChooser.choose( runList );
        excluded = true;
        while ( excluded && runList.length > 0 ) {
          slope = new Fraction( rise, run ).getValue();
          excluded = false;
          // is this an excluded or undefined slope?
          for ( i = 0; i < excludedSlopes.length; i++ ) {
            if ( run === 0 || slope === excludedSlopes[i].getValue() ) {
              excluded = true;
              run = RandomChooser.choose( runList ); // choose a new run, and remove it from runList
              break;
            }
          }
        }
        if ( excluded ) {
          run = 5; // a run that's not in excludedSlopes
        }
        assert && assert( run !== 0 );

        // points
        point = ChallengeFactory.choosePointForSlope( new Fraction( rise, run ), xRange, yRange );
        x1 = ( equationForm === EquationForm.SLOPE_INTERCEPT ) ? 0 : point.x;
        y1 = point.y;
        x2 = x1 + run;
        y2 = y1 + rise;

        // challenge
        line = new Line( x1, y1, x2, y2, Color.BLACK );
        if ( equationForm === EquationForm.SLOPE_INTERCEPT ) {
          challenges.push( new GraphTheLine( 'random choice of slope-intercept, some excluded slopes',
            line, EquationForm.SLOPE_INTERCEPT, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
        }
        else {
          challenges.push( new GraphTheLine( 'random choice of point-slope, some excluded slopes',
            line, EquationForm.POINT_SLOPE, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
        }
      }

      // 2 Place-the-Point challenges
      ChallengeFactory5.addPlaceThePointsChallenges( challenges, xRange, yRange );

      // shuffle and return
      return _.shuffle( challenges );
    }  } );
} );