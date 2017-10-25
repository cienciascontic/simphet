// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the level screen.
 *
 * @author Anton Ulyanov, Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var SingleShapeModel = require( 'FRACTION_MATCHER/model/SingleShapeModel' );

  /**
   * @param gameModel
   * @param levelDescription
   * @param {Number} levelNumber 1-based level that is displayed to the user (starts at 1, not zero)
   * @constructor
   */
  function LevelModel( gameModel, levelDescription, levelNumber ) {
    this.gameModel = gameModel;
    this.levelNumber = levelNumber;
    this.levelDescription = levelDescription;

    PropertySet.call( this, {
      score: 0,
      time: 0,
      stepScore: 2,
      answers: [], //shapes, which moved to answer zone
      lastPair: [-1, -1], //pair of shapes on scales, user can't compare the same pair two times
      lastChangedZone: -1, //when showing correct answer, change only last dragged shape position
      shapes: [], //array of SingleShapeModels
      canDrag: true,
      buttonStatus: 'none' // ['none','ok','check','tryAgain','showAnswer']
    } );

    this.dropZone = []; //contains indexes of shapes, which are placed in current zone, -1 if empty

    for ( var i = 0; i < 2 * this.gameModel.MAXIMUM_PAIRS; i++ ) {
      this.dropZone[i] = -1;
    }

    //two more dropZones 12 and 13 - scales
    this.dropZone.push( -1 );
    this.dropZone.push( -1 );

    this.generateLevel();
  }

  inherit( PropertySet, LevelModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.generateLevel();
      for ( var i = 0; i < this.dropZone.length; i++ ) {
        this.dropZone[i] = -1;
      }
      this.answers = [];
      this.lastPair = [-1, -1];
    },
    step: function( dt ) {

      //Always increase time, even when the timer is hidden because the timer should be shown at any time, see https://github.com/phetsims/fraction-matcher/issues/57
      this.time += dt;
    },
    // return filtered shapes set for the selected denominator, from java model
    filterShapes: function( shapes, d ) {
      var arr = [],
      //rules if shape_type can be used for denominator d
        map = {
          PIES: true,
          HORIZONTAL_BARS: d < 9,
          VERTICAL_BARS: d < 9,
          PLUSES: d === 6,
          GRID: d === 4 || d === 9,
          PYRAMID: d === 1 || d === 4 || d === 9,
          TETRIS: d === 4,
          FLOWER: d === 6,
          LETTER_L_SHAPES: d % 2 === 0,
          INTERLEAVED_L_SHAPES: d === 2 || d === 4,
          RING_OF_HEXAGONS: d === 7,
          NINJA_STAR: d === 8
        };

      // move through all possible shapes and add it if filter through map
      shapes.forEach( function( shape ) {
        if ( map[shape] ) {
          arr.push( shape );
        }
      } );

      return arr;
    },
    // generate new level
    generateLevel: function() {
      var fractions = _.shuffle( this.levelDescription.fractions.slice( 0 ) ).splice( 0, this.gameModel.MAXIMUM_PAIRS ), //get random MAXIMUM_PAIRS fractions
        numericScaleFactors = this.levelDescription.numericScaleFactors.slice( 0 ), //scaleFactors to multiply fractions
        numberType = 'NUMBER',
        newShapes = [];

      var shapesAll = this.levelDescription.shapes.slice( 0 ); // get possible shapes for selected level
      shapesAll.push( numberType ); // add fractions to possible shapes

      // add shapes
      for ( var i = 0; i < this.gameModel.MAXIMUM_PAIRS; i++ ) {
        var fraction = fractions[i]; // Fraction object
        var scaleFactor = numericScaleFactors[_.random( numericScaleFactors.length - 1 )]; //random scaleFactor

        var shapes = this.filterShapes( shapesAll, fraction.denominator ); //filter only shapes for current denominator
        var fillType = this.levelDescription.fillType[_.random( this.levelDescription.fillType.length - 1 )];

        // first 3 fractions - number, last 3 fractions - shapes with different colors (3 numbers and 3 shapes at least)
        var type = (i < this.gameModel.MAXIMUM_PAIRS / 2) ? numberType : shapes[ i % (shapes.length - 1) ];
        var color = (type === numberType) ? 'rgb(0,0,0)' : this.gameModel.colorScheme[i % 3];
        newShapes.push( new SingleShapeModel( type, fraction, scaleFactor, color, fillType, this.gameModel.toSimplify ) );

        // add partner: if was number - add shape, if was shape - add number or random shape with another color
        type = shapes[_.random( shapes.length - (type === numberType ? 2 : 1) )];
        color = (type === numberType) ? 'rgb(0,0,0)' : this.gameModel.colorScheme[(i + 1) % 3];
        newShapes.push( new SingleShapeModel( type, fraction, scaleFactor, color, fillType, this.gameModel.toSimplify ) );
      }

      newShapes = _.shuffle( newShapes );
      for ( i = 0; i < newShapes.length; i++ ) {
        newShapes[i].dropZone = i;
      }

      this.shapes = newShapes;
    },
    answerButton: function( buttonName ) {
      var self = this;
      switch( buttonName ) { //['none','ok','check','tryAgain','showAnswer']
        case 'ok':
          this.lastChangedZone = -1;
          self.stepScore = 2;
          this.canDrag = true;
          this.buttonStatus = 'none';
          if ( self.answers.length === self.gameModel.MAXIMUM_PAIRS ) {
            self.hiScore = Math.max( self.hiScore, self.score );
          }
          break;
        case 'check':
          if ( self.isShapesEqual( self.shapes[this.dropZone[12]], self.shapes[this.dropZone[13]] ) ) {
            //answer correct
            this.buttonStatus = 'ok';
            self.score += self.stepScore;
            self.gameModel.sounds.correct.play();
          }
          else {
            //answer incorrect
            self.gameModel.sounds.incorrect.play();
            self.stepScore--;
            this.buttonStatus = (self.stepScore) ? 'tryAgain' : 'showAnswer';
            this.lastPair = [this.dropZone[12], this.dropZone[13]];
          }
          this.canDrag = false;
          break;
        case 'tryAgain' :
          this.canDrag = true;
          this.buttonStatus = 'none';
          break;
        case 'showAnswer' :
          this.buttonStatus = 'ok';
          break;
      }
    },
    isShapesEqual: function( shape1, shape2 ) {
      return Math.abs( shape1.getValue() - shape2.getValue() ) < 0.001;
    }
  } );

  return LevelModel;
} );