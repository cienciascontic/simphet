// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for 'Graph the Line' challenges.
 * In this challenge, the user is given an equation and must graph the line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'GRAPHING_LINES/linegame/model/Challenge' );
  var GraphTheLineNode = require( 'GRAPHING_LINES/linegame/view/GraphTheLineNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var graphTheLineString = require( 'string!GRAPHING_LINES/graphTheLine' );

  /**
   * @param {String} description brief description of the challenge, visible in dev versions
   * @param {Line} answer  the correct answer
   * @param {EquationForm} equationForm specifies the form of the equation
   * @param {ManipulationMode} manipulationMode indicates which properties of a line the user is able to change
   * @param {Range} xRange range of the graph's x axis
   * @param {Range} yRange range of the graph's y axis
   * @constructor
   */
  function GraphTheLine( description, answer, equationForm, manipulationMode, xRange, yRange ) {
    Challenge.call( this,
      Challenge.createTitle( graphTheLineString, manipulationMode ),
      description,
      answer,
      equationForm,
      manipulationMode,
      xRange,
      yRange
    );
  }

  return inherit( Challenge, GraphTheLine, {

    /**
     * Creates the view for this challenge.
     * @override
     * @param {LineGameModel} model the game model
     * @param {Dimension2} challengeSize dimensions of the view rectangle that is available for rendering the challenge
     * @param {GameAudioPlayer} audioPlayer the audio player, for providing audio feedback during game play
     */
    createView: function( model, challengeSize, audioPlayer ) {
      return new GraphTheLineNode( this, model, challengeSize, audioPlayer );
    },

    /**
     * Updates the collection of lines that are 'seen' by the point tools.
     * @override
     */
    updateGraphLines: function() {
      this.graph.lines.clear();
      // add lines in the order that they would be rendered
      if ( this.guess ) {
        this.graph.lines.push( this.guess );
      }
      if ( this.answerVisible ) {
        this.graph.lines.push( this.answer );
      }
    }
  } );
} );