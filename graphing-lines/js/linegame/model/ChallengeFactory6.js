// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates game challenges for Level 6, as specified in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory' );
  var ChallengeFactory5 = require( 'GRAPHING_LINES/linegame/model/ChallengeFactory5' );
  var Color = require( 'SCENERY/util/Color' );
  var EquationForm = require( 'GRAPHING_LINES/linegame/model/EquationForm' );
  var GraphTheLine = require( 'GRAPHING_LINES/linegame/model/GraphTheLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var ManipulationMode = require( 'GRAPHING_LINES/linegame/model/ManipulationMode' );
  var PlaceThePoints = require( 'GRAPHING_LINES/linegame/model/PlaceThePoints' );
  var RandomChooser = require( 'GRAPHING_LINES/linegame/model/RandomChooser' );
  var Range = require( 'DOT/Range' );

  function ChallengeFactory6() {
    ChallengeFactory.call( this );
  }

  return inherit( ChallengeFactory, ChallengeFactory6, {

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
      var yIntercepts, equationForms, equationForm, slope, yIntercept, line;
      var x1, y1, x2, y2, xList, yList, i;

      yIntercepts = RandomChooser.rangeToArray( yRange );

      // Place-the-Point, slope-intercept form, slope=0 (horizontal line), slope and intercept variable
      yIntercept = RandomChooser.choose( yIntercepts );
      challenges.push( new PlaceThePoints( 'slope=0',
        Line.createSlopeIntercept( 0, 1, yIntercept ),
        EquationForm.SLOPE_INTERCEPT, xRange, yRange ) );

      // 2 Place-the-Point challenges (same as level 5)
      ChallengeFactory5.addPlaceThePointsChallenges( challenges, xRange, yRange );

      // 3 Graph-the-Line challenges with mismatched representations (eg, point-slope equation with slope-intercept manipulators)
      {
        // we'll pick 3 from here
        equationForms = [ EquationForm.SLOPE_INTERCEPT, EquationForm.SLOPE_INTERCEPT, EquationForm.POINT_SLOPE, EquationForm.POINT_SLOPE ];
        assert && assert( equationForms.length === 4 );

        for ( i = 0; i < 3; i++ ) {

          equationForm = RandomChooser.choose( equationForms );

          // random points
          var range = new Range( -7, 7 );
          assert && assert( xRange.containsRange( range ) && yRange.containsRange( range ) );
          xList = RandomChooser.rangeToArray( range );
          yList = RandomChooser.rangeToArray( range );
          x1 = 0; // y-intercept must be an integer since we're mismatching representations
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

          // challenge, with mismatched representations
          line = new Line( x1, y1, x2, y2, Color.BLACK );
          if ( equationForm === EquationForm.SLOPE_INTERCEPT ) {
            challenges.push( new GraphTheLine( 'slope-intercept, Graph-the-Line ' + i, line, equationForm, ManipulationMode.POINT_SLOPE, xRange, yRange ) );
          }
          else {
            challenges.push( new GraphTheLine( 'point-slope, Graph-the-Line ' + i, line, equationForm, ManipulationMode.SLOPE_INTERCEPT, xRange, yRange ) );
          }
        }
      }

      // shuffle and return
      return _.shuffle( challenges );
    }  } );
} );