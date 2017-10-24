// Copyright 2002-2014, University of Colorado Boulder

/**
 * A factory object that creates the challenges for the Area Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var Color = require( 'SCENERY/util/Color' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH; // In screen coords

  // Basic shapes used in the 'creator kits'.
  var UNIT_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .close();
  var HORIZONTAL_DOUBLE_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .close();
  var VERTICAL_DOUBLE_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH * 2 )
    .lineTo( 0, UNIT_SQUARE_LENGTH * 2 )
    .close();
  var QUAD_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH * 2 )
    .lineTo( 0, UNIT_SQUARE_LENGTH * 2 )
    .close();
  var RIGHT_BOTTOM_TRIANGLE_SHAPE = new Shape()
    .moveTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .close();
  var LEFT_BOTTOM_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();
  var RIGHT_TOP_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();
  var LEFT_TOP_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();

  // Shape kits that give the user things to create.
  var BASIC_RECTANGLES_SHAPE_KIT = [
    {
      shape: UNIT_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: HORIZONTAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: VERTICAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: QUAD_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    }
  ];

  var RECTANGLES_AND_TRIANGLES_SHAPE_KIT = [
    {
      shape: HORIZONTAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: UNIT_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: VERTICAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: LEFT_BOTTOM_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: LEFT_TOP_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: RIGHT_BOTTOM_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: RIGHT_TOP_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    }
  ];

  // Color chooser, used for selecting randomized colors for 'find the area' challenges.
  var COLOR_CHOOSER = {
    colorList: _.shuffle( [ new Color( '#1A7137' ), new Color( '#634F8C' ), new Color( '#A95327' ), new Color( '#277DA9' ), new Color( '#AA548D' ) ] ),
    index: 0,
    nextColor: function() {
      if ( this.index >= this.colorList.length ) {
        // Time to shuffle the color list.  Make sure that when we do, the color that was at the end of the previous
        // list isn't at the beginning of this one, or we'll get two of the same colors in a row.
        var lastColor = this.colorList[ this.colorList.length - 1 ];
        do {
          this.colorList = _.shuffle( this.colorList );
        } while ( this.colorList[0] === lastColor );

        // Reset the index.
        this.index = 0;
      }
      return this.colorList[ this.index++ ];
    }
  };


  // Color pair chooser, used for selecting randomized colors for two tone 'build it' challenges.
  var COLOR_PAIR_CHOOSER = {
    colorPairList: _.shuffle( [
      {
        color1: AreaBuilderSharedConstants.GREENISH_COLOR,
        color2: '#1A7137'
      },
      {
        color1: AreaBuilderSharedConstants.PURPLISH_COLOR,
        color2: '#634F8C'
      },
      {
        color1: AreaBuilderSharedConstants.ORANGISH_COLOR,
        color2: '#A95327'
      },
      {
        color1: '#5DB9E7',  // Bluish
        color2: '#277DA9'
      },
      {
        color1: '#E88DC9', // Pinkish
        color2: '#AA548D'
      }
    ] ),
    index: 0,
    nextColorPair: function() {
      if ( this.index >= this.colorPairList.length ) {
        // Time to shuffle the list.
        var lastColorPair = this.colorPairList[ this.colorPairList.length - 1 ];
        do {
          this.colorPairList = _.shuffle( this.colorPairList );
        } while ( this.colorPairList[0] === lastColorPair );

        // Reset the index.
        this.index = 0;
      }
      return this.colorPairList[ this.index++ ];
    }
  };

  // -------------- private functions ---------------------------

  // Select a random element from an array
  function randomElement( array ) {
    return array[ Math.floor( Math.random() * array.length ) ];
  }

  // Create a solution spec (a.k.a. an example solution) that represents a rectangle with the specified origin and size.
  function createMonochromeRectangularSolutionSpec( x, y, width, height, color ) {
    var solutionSpec = [];
    for ( var column = 0; column < width; column++ ) {
      for ( var row = 0; row < height; row++ ) {
        solutionSpec.push( {
          cellColumn: column + x,
          cellRow: row + y,
          color: color
        } );
      }
    }
    return solutionSpec;
  }

  // Create a solution spec (a.k.a. an example solution) for a two-tone challenge
  function createTwoColorRectangularSolutionSpec( x, y, width, height, color1, color2, color1proportion ) {
    var solutionSpec = [];
    for ( var row = 0; row < height; row++ ) {
      for ( var column = 0; column < width; column++ ) {
        solutionSpec.push( {
          cellColumn: column + x,
          cellRow: row + y,
          color: ( row * width + column ) / ( width * height ) < color1proportion ? color1 : color2
        } );
      }
    }
    return solutionSpec;
  }

  function createTwoToneRectangleBuildKit( color1, color2 ) {
    var kit = [];
    BASIC_RECTANGLES_SHAPE_KIT.forEach( function( kitElement ) {
      var color1Element = {
        shape: kitElement.shape,
        color: color1
      };
      kit.push( color1Element );
      var color2Element = {
        shape: kitElement.shape,
        color: color2
      };
      kit.push( color2Element );
    } );
    return kit;
  }

  function flipPerimeterPointsHorizontally( perimeterPointList ) {
    var reflectedPoints = [];
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    perimeterPointList.forEach( function( point ) {
      minX = Math.min( point.x, minX );
      maxX = Math.max( point.x, maxX );
    } );
    perimeterPointList.forEach( function( point ) {
      reflectedPoints.push( new Vector2( -1 * ( point.x - minX - maxX ), point.y ) );
    } );
    return reflectedPoints;
  }

  function flipPerimeterPointsVertically( perimeterPointList ) {
    var reflectedPoints = [];
    var minY = Number.POSITIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    perimeterPointList.forEach( function( point ) {
      minY = Math.min( point.y, minY );
      maxY = Math.max( point.y, maxY );
    } );
    perimeterPointList.forEach( function( point ) {
      reflectedPoints.push( new Vector2( point.x, -1 * ( point.y - minY - maxY ) ) );
    } );
    return reflectedPoints;
  }

  function createRectangularPerimeterShape( x, y, width, height, fillColor ) {
    return new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( x, y ),
          new Vector2( x + width, y ),
          new Vector2( x + width, y + height ),
          new Vector2( x, y + height )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH,

      // color
      {
        fillColor: fillColor,
        edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
      }
    );
  }

  function createLShapedPerimeterShape( x, y, width, height, missingCorner, widthMissing, heightMissing, fillColor ) {
    assert && assert( width > widthMissing && height > heightMissing, 'Invalid parameters' );

    var perimeterPoints = [
      new Vector2( x + widthMissing, y ),
      new Vector2( x + width, y ),
      new Vector2( x + width, y + height ),
      new Vector2( x, y + height ),
      new Vector2( x, y + heightMissing ),
      new Vector2( x + widthMissing, y + heightMissing )
    ];

    if ( missingCorner === 'rightTop' || missingCorner === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( missingCorner === 'leftBottom' || missingCorner === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH, {
        fillColor: fillColor,
        edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
      }
    );
  }

  // Create a perimeter shape with a cutout in the top, bottom, left, or right side.
  function createUShapedPerimeterShape( x, y, width, height, sideWithCutout, cutoutWidth, cutoutHeight, cutoutOffset, fillColor ) {
    var perimeterPoints = [ new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2() ];

    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      perimeterPoints[ 0 ].setXY( x, y );
      perimeterPoints[ 1 ].setXY( x + width, y );
      perimeterPoints[ 2 ].setXY( x + width, y + height );
      perimeterPoints[ 3 ].setXY( x, y + height );
      perimeterPoints[ 4 ].setXY( x, y + cutoutOffset + cutoutHeight );
      perimeterPoints[ 5 ].setXY( x + cutoutWidth, y + cutoutOffset + cutoutHeight );
      perimeterPoints[ 6 ].setXY( x + cutoutWidth, y + cutoutOffset );
      perimeterPoints[ 7 ].setXY( x, y + cutoutOffset );
      if ( sideWithCutout === 'right' ) {
        perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
      }
    }
    else {
      perimeterPoints[ 0 ].setXY( x, y );
      perimeterPoints[ 1 ].setXY( x + cutoutOffset, y );
      perimeterPoints[ 2 ].setXY( x + cutoutOffset, y + cutoutHeight );
      perimeterPoints[ 3 ].setXY( x + cutoutOffset + cutoutWidth, y + cutoutHeight );
      perimeterPoints[ 4 ].setXY( x + cutoutOffset + cutoutWidth, y );
      perimeterPoints[ 5 ].setXY( x + width, y );
      perimeterPoints[ 6 ].setXY( x + width, y + height );
      perimeterPoints[ 7 ].setXY( x, y + height );
      if ( sideWithCutout === 'bottom' ) {
        perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
      }
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH, {
      fillColor: fillColor,
      edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
  }

  function createPerimeterShapeWithHole( x, y, width, height, holeWidth, holeHeight, holeXOffset, holeYOffset, fillColor ) {
    var exteriorPerimeterPoints = [
      new Vector2( x, y ),
      new Vector2( x + width, y ),
      new Vector2( x + width, y + height ),
      new Vector2( x, y + height )
    ];
    var interiorPerimeterPoints = [
      // Have to draw hole in opposite direction for it to appear.
      new Vector2( x + holeXOffset, y + holeYOffset ),
      new Vector2( x + holeXOffset, y + holeYOffset + holeHeight ),
      new Vector2( x + holeXOffset + holeWidth, y + holeYOffset + holeHeight ),
      new Vector2( x + holeXOffset + holeWidth, y + holeYOffset )
    ];

    return new PerimeterShape( [ exteriorPerimeterPoints ], [ interiorPerimeterPoints ], UNIT_SQUARE_LENGTH, {
      fillColor: fillColor,
      edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
  }

  function createPerimeterShapeSlantedHypotenuseRightIsoscelesTriangle( x, y, edgeLength, cornerPosition, fillColor ) {
    var perimeterPoints = [ new Vector2( x, y ), new Vector2( x + edgeLength, y ), new Vector2( x, y + edgeLength ) ];
    if ( cornerPosition === 'rightTop' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( cornerPosition === 'leftBottom' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH, {
      fillColor: fillColor,
      edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
  }

  function createPerimeterShapeLevelHypotenuseRightIsoscelesTriangle( x, y, hypotenuseLength, cornerPosition, fillColor ) {
    var perimeterPoints;
    if ( cornerPosition === 'centerTop' || cornerPosition === 'centerBottom' ) {
      perimeterPoints = [ new Vector2( x, y ), new Vector2( x + hypotenuseLength, y ),
        new Vector2( x + hypotenuseLength / 2, y + hypotenuseLength / 2 ) ];
      if ( cornerPosition === 'centerBottom' ) {
        perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
      }
    }
    else {
      perimeterPoints = [ new Vector2( x, y ), new Vector2( x, y + hypotenuseLength ),
        new Vector2( x + hypotenuseLength / 2, y + hypotenuseLength / 2 ) ];
      if ( cornerPosition === 'centerLeft' ) {
        perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
      }
    }

    // Reflect as appropriate to create the specified orientation.
    if ( cornerPosition === 'centerTop' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( cornerPosition === 'leftBottom' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH, {
      fillColor: fillColor,
      edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
  }

  function createShapeWithDiagonalAndMissingCorner( x, y, width, height, diagonalPosition, diagonalSquareLength, cutWidth, cutHeight, fillColor ) {
    assert && assert( width - diagonalSquareLength >= cutWidth && height - diagonalSquareLength >= cutHeight, 'Invalid parameters' );

    var perimeterPoints = [];
    // Draw shape with diagonal in lower right corner, starting in upper right corner.
    perimeterPoints.push( new Vector2( x + width, y ) );
    perimeterPoints.push( new Vector2( x + width, y + height - diagonalSquareLength ) );
    perimeterPoints.push( new Vector2( x + width - diagonalSquareLength, y + height ) );
    perimeterPoints.push( new Vector2( x, y + height ) );
    perimeterPoints.push( new Vector2( x, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y ) );

    // Reflect shape as needed to meet the specified orientation.
    if ( diagonalPosition === 'leftTop' || diagonalPosition === 'leftBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( diagonalPosition === 'rightTop' || diagonalPosition === 'leftTop' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH, {
      fillColor: fillColor,
      edgeColor: fillColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
  }

  // Return a value that indicates whether two challenges are similar, used when generating challenges that are
  // distinct enough to keep the game interesting.
  function isChallengeSimilar( challenge1, challenge2 ) {
    if ( challenge1.buildSpec && challenge2.buildSpec ) {
      if ( challenge1.buildSpec.proportions && challenge2.buildSpec.proportions ) {
        if ( challenge1.buildSpec.proportions.color1Proportion.denominator === challenge2.buildSpec.proportions.color1Proportion.denominator ) {
          if ( challenge1.buildSpec.perimeter && challenge2.buildSpec.perimeter || !challenge1.buildSpec.perimeter && !challenge2.buildSpec.perimeter ) {
            return true;
          }
        }
      }
      else if ( !challenge1.buildSpec.proportions && !challenge1.buildSpec.proportions ) {
        if ( challenge1.buildSpec.area === challenge2.buildSpec.area ) {
          return true;
        }
      }
    }
    else {
      if ( challenge1.backgroundShape && challenge2.backgroundShape ) {
        if ( challenge1.backgroundShape.unitArea === challenge2.backgroundShape.unitArea ) {
          return true;
        }
      }
    }

    // If we got to here, the challenges are not similar.
    return false;
  }

  // Test the challenge against the history of recently generated challenges to see if it is unique.
  function isChallengeUnique( challenge ) {
    var challengeIsUnique = true;
    for ( var i = 0; i < challengeHistory.length; i++ ) {
      if ( isChallengeSimilar( challenge, challengeHistory[ i ] ) ) {
        challengeIsUnique = false;
        break;
      }
    }
    return challengeIsUnique;
  }

  function generateBuildAreaChallenge() {

    // Create a unique challenge
    var challenge;
    var width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height = 0;
    while ( width * height < 8 || width * height > 36 ) {
      height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    }
    var exampleSolution = createMonochromeRectangularSolutionSpec(
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - width ) / 2 ),
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - height ) / 2 ),
      width,
      height,
      AreaBuilderSharedConstants.GREENISH_COLOR
    );
    challenge = AreaBuilderGameChallenge.createBuildAreaChallenge( width * height, BASIC_RECTANGLES_SHAPE_KIT, exampleSolution );
    return challenge;
  }

  /**
   * Generate a 'build it' area+perimeter challenge that consists of two connected rectangles.  See the design spec
   * for details.
   */
  function generateTwoRectangleBuildAreaAndPerimeterChallenge() {

    // Create first rectangle dimensions
    var width1 = _.random( 2, 6 );
    var height1;
    do {
      height1 = _.random( 1, 4 );
    } while ( width1 % 2 === height1 % 2 );

    // Create second rectangle dimensions
    var width2 = 0;
    do {
      width2 = _.random( 1, 6 );
    } while ( width1 + width2 > AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height2;
    do {
      height2 = _.random( 1, 6 );
    } while ( width2 % 2 === height2 % 2 || height1 + height2 > AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );

    // Choose the amount of overlap
    var overlap = _.random( 1, Math.min( width1, width2 ) - 1 );

    var left = Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - ( width1 + width2 - overlap ) ) / 2 );
    var top = Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - ( height1 + height2 ) ) / 2 );

    // Create a solution spec by merging specs for each of the rectangles together.
    var solutionSpec = createMonochromeRectangularSolutionSpec( left, top, width1, height1, AreaBuilderSharedConstants.GREENISH_COLOR ).concat(
      createMonochromeRectangularSolutionSpec( left + width1 - overlap, top + height1, width2, height2, AreaBuilderSharedConstants.GREENISH_COLOR ) );

    return( AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge( width1 * height1 + width2 * height2,
        2 * width1 + 2 * height1 + 2 * width2 + 2 * height2 - 2 * overlap, BASIC_RECTANGLES_SHAPE_KIT, solutionSpec ) );
  }

  function generateBuildAreaAndPerimeterChallenge() {

    var width, height;

    // Width can be any value from 3 to 8 excluding 7, see design doc.
    do {
      width = _.random( 3, 8 );
    } while ( width === 0 || width === 7 );

    // Choose the height based on the total area.
    do {
      height = _.random( 3, 8 );
    } while ( width * height < 12 || width * height > 36 || height === 7 || height > AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );

    var exampleSolution = createMonochromeRectangularSolutionSpec(
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - width ) / 2 ),
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - height ) / 2 ),
      width,
      height,
      AreaBuilderSharedConstants.GREENISH_COLOR
    );
    return AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge( width * height,
        2 * width + 2 * height, BASIC_RECTANGLES_SHAPE_KIT, exampleSolution );
  }

  function generateRectangularFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var perimeterShape = createRectangularPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var missingWidth = _.random( 1, width - 1 );
    var missingHeight = _.random( 1, height - 1 );
    var missingCorner = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var perimeterShape = createLShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      missingCorner, missingWidth * UNIT_SQUARE_LENGTH, missingHeight * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateUShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    } while ( width * height < 16 || width * height > 36 );
    var sideWithCutout = randomElement( ['left', 'right', 'top', 'bottom' ] );
    var cutoutWidth, cutoutHeight, cutoutOffset;
    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      cutoutWidth = _.random( 2, width - 1 );
      cutoutHeight = _.random( 1, height - 2 );
      cutoutOffset = _.random( 1, height - cutoutHeight - 1 );
    }
    else {
      cutoutWidth = _.random( 1, width - 2 );
      cutoutHeight = _.random( 2, height - 1 );
      cutoutOffset = _.random( 1, width - cutoutWidth - 1 );
    }
    var perimeterShape = createUShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      sideWithCutout, cutoutWidth * UNIT_SQUARE_LENGTH, cutoutHeight * UNIT_SQUARE_LENGTH,
        cutoutOffset * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateOShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    } while ( width * height < 16 || width * height > 36 );
    var holeWidth = _.random( 1, width - 2 );
    var holeHeight = _.random( 1, height - 2 );
    var holeXOffset = _.random( 1, width - holeWidth - 1 );
    var holeYOffset = _.random( 1, height - holeHeight - 1 );
    var perimeterShape = createPerimeterShapeWithHole( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
        holeWidth * UNIT_SQUARE_LENGTH, holeHeight * UNIT_SQUARE_LENGTH, holeXOffset * UNIT_SQUARE_LENGTH,
        holeYOffset * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateIsoscelesRightTriangleSlantedHypotenuseFindAreaChallenge() {
    var cornerPosition = randomElement( [ 'leftTop', 'rightTop', 'rightBottom', 'leftBottom' ] );
    var edgeLength = 0;
    do {
      edgeLength = _.random( 4, Math.min( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2,
          AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 ) );
    } while ( edgeLength % 2 !== 0 );
    var perimeterShape = createPerimeterShapeSlantedHypotenuseRightIsoscelesTriangle( 0, 0,
        edgeLength * UNIT_SQUARE_LENGTH, cornerPosition, COLOR_CHOOSER.nextColor() );
    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
  }

  function generateIsoscelesRightTriangleLevelHypotenuseFindAreaChallenge() {
    var cornerPosition = randomElement( [ 'centerTop', 'rightCenter', 'centerBottom', 'leftCenter' ] );
    var hypotenuseLength = 0;
    var maxHypotenuse;
    if ( cornerPosition === 'centerTop' || cornerPosition === 'centerBottom' ) {
      maxHypotenuse = AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4;
    }
    else {
      maxHypotenuse = AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2;
    }
    do {
      hypotenuseLength = _.random( 2, maxHypotenuse );
    } while ( hypotenuseLength % 2 !== 0 );
    var perimeterShape = createPerimeterShapeLevelHypotenuseRightIsoscelesTriangle( 0, 0,
        hypotenuseLength * UNIT_SQUARE_LENGTH, cornerPosition, COLOR_CHOOSER.nextColor() );
    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithChipMissingChallenge() {
    var width = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    var sideWithCutout = randomElement( ['left', 'right', 'top', 'bottom' ] );
    var cutoutWidth, cutoutHeight, cutoutOffset;
    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      cutoutWidth = 1;
      cutoutHeight = _.random( 1, 3 );
      cutoutOffset = _.random( 1, height - cutoutHeight - 1 );
    }
    else {
      cutoutWidth = _.random( 1, 3 );
      cutoutHeight = 1;
      cutoutOffset = _.random( 1, width - cutoutWidth - 1 );
    }
    var perimeterShape = createUShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      sideWithCutout, cutoutWidth * UNIT_SQUARE_LENGTH, cutoutHeight * UNIT_SQUARE_LENGTH,
        cutoutOffset * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithSmallHoleMissingChallenge() {
    var width = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    var holeWidth, holeHeight;
    if ( Math.random() < 0.5 ) {
      holeWidth = _.random( 1, 3 );
      holeHeight = 1;
    }
    else {
      holeHeight = _.random( 1, 3 );
      holeWidth = 1;
    }
    var holeXOffset = _.random( 1, width - holeWidth - 1 );
    var holeYOffset = _.random( 1, height - holeHeight - 1 );
    var perimeterShape = createPerimeterShapeWithHole( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
        holeWidth * UNIT_SQUARE_LENGTH, holeHeight * UNIT_SQUARE_LENGTH, holeXOffset * UNIT_SQUARE_LENGTH,
        holeYOffset * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithPieceMissingChallenge() {
    return Math.random() < 0.7 ? generateLargeRectWithChipMissingChallenge() : generateLargeRectWithSmallHoleMissingChallenge();
  }

  function generateShapeWithDiagonalFindAreaChallenge() {
    var width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
    var height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    var diagonalPosition = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var diagonalSquareLength = 2;
    if ( height > 4 && width > 4 && Math.random() > 0.5 ) {
      diagonalSquareLength = 4;
    }
    var cutWidth = _.random( 1, width - diagonalSquareLength );
    var cutHeight = _.random( 1, height - diagonalSquareLength );

    var perimeterShape = createShapeWithDiagonalAndMissingCorner( 0, 0, width * UNIT_SQUARE_LENGTH,
        height * UNIT_SQUARE_LENGTH, diagonalPosition, diagonalSquareLength * UNIT_SQUARE_LENGTH,
        cutWidth * UNIT_SQUARE_LENGTH, cutHeight * UNIT_SQUARE_LENGTH, COLOR_CHOOSER.nextColor() );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
  }

  function generateEasyProportionalBuildAreaChallenge() {
    return generateProportionalBuildAreaChallenge( 'easy', false );
  }

  function generateHarderProportionalBuildAreaChallenge() {
    return generateProportionalBuildAreaChallenge( 'harder', false );
  }

  function generateProportionalBuildAreaChallenge( difficulty, includePerimeter ) {
    assert && assert( difficulty === 'easy' || difficulty === 'harder' );
    var width, height;

    // Randomly generate width, height, and the possible factors from which a proportional challenge can be created.
    var factors = [];
    do {
      height = _.random( 3, 6 );
      if ( height === 3 ) {
        width = _.random( 4, 8 );
      }
      else {
        width = _.random( 2, 10 );
      }

      var minFactor = difficulty === 'easy' ? 2 : 5;
      var maxFactor = difficulty === 'easy' ? 4 : 9;

      var area = width * height;
      for ( var i = minFactor; i <= maxFactor; i++ ) {
        if ( area % i === 0 ) {
          // This is a factor of the area.
          factors.push( i );
        }
      }
    } while ( factors.length === 0 );

    // Choose the fractional proportion.
    var fractionDenominator = randomElement( factors );
    var color1FractionNumerator;
    do {
      color1FractionNumerator = _.random( 1, fractionDenominator - 1 );
    } while ( Util.gcd( color1FractionNumerator, fractionDenominator ) > 1 );
    var color1Fraction = new Fraction( color1FractionNumerator, fractionDenominator );

    // Choose the colors for this challenge
    var colorPair = COLOR_PAIR_CHOOSER.nextColorPair();

    // Create the example solution
    var exampleSolution = createTwoColorRectangularSolutionSpec(
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - width ) / 2 ),
      Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - height ) / 2 ),
      width,
      height,
      colorPair.color1,
      colorPair.color2,
      color1Fraction.getValue()
    );

    var userShapes = createTwoToneRectangleBuildKit( colorPair.color1, colorPair.color2 );

    // Build the challenge from all the pieces.
    if ( includePerimeter ) {
      return AreaBuilderGameChallenge.createTwoToneBuildAreaAndPerimeterChallenge( width * height,
        ( 2 * width + 2 * height ), colorPair.color1, colorPair.color2, color1Fraction, userShapes, exampleSolution );
    }
    else {
      return AreaBuilderGameChallenge.createTwoToneBuildAreaChallenge( width * height, colorPair.color1,
        colorPair.color2, color1Fraction, userShapes, exampleSolution );
    }
  }

  function generateEasyProportionalBuildAreaAndPerimeterChallenge() {
    return generateProportionalBuildAreaChallenge( 'easy', true );
  }

  function generateHarderProportionalBuildAreaAndPerimeterChallenge() {
    return generateProportionalBuildAreaChallenge( 'harder', true );
  }

  // Challenge history, used to make sure unique challenges are generated.
  var challengeHistory = [];

  // Use the provided generation function to create challenges until a unique one has been created.
  function generateUniqueChallenge( generationFunction ) {
    var challenge;
    var uniqueChallengeGenerated = false;
    var attempts = 0;
    while ( !uniqueChallengeGenerated ) {
      challenge = generationFunction();
      attempts++;
      uniqueChallengeGenerated = isChallengeUnique( challenge );
      if ( attempts > 10 && !uniqueChallengeGenerated ) {
        // Remove the oldest half of challenges.
        challengeHistory = challengeHistory.slice( 0, challengeHistory.length / 2 + 1 );
      }
    }

    challengeHistory.push( challenge );
    return challenge;
  }

  // In the spec, level 4 has some unique requirements.  This function encapsulates these requirements, see the spec
  // for details.
  function makeLevel4SpecificModifications( challenge ) {
    challenge.toolSpec.gridControl = false;
    challenge.userShapes = [
      {
        shape: UNIT_SQUARE_SHAPE,
        color: AreaBuilderSharedConstants.GREENISH_COLOR
      }
    ];

    // Limit the number of shapes to the length of the larger side.  This encourages certain strategies.
    assert && assert( challenge.backgroundShape.exteriorPerimeters.length === 1, 'Unexpected configuration for background shape.' );
    var perimeterShape = new PerimeterShape( challenge.backgroundShape.exteriorPerimeters, [], UNIT_SQUARE_LENGTH );
    challenge.userShapes[ 0 ].creationLimit = Math.max( perimeterShape.getWidth() / UNIT_SQUARE_LENGTH,
        perimeterShape.getHeight() / UNIT_SQUARE_LENGTH );
    return challenge;
  }

  // No constructor - this is a static type.
  return  {

    /**
     * Generate a set of challenges for the given game level.
     *
     * @public
     * @param level
     * @param numChallenges
     * @returns {Array}
     */
    generateChallengeSet: function( level, numChallenges ) {
      var challengeSet = [];
      var tempChallenge;
      switch( level ) {
        case 0:
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateBuildAreaChallenge ) ); } );
          _.times( 2, function() { challengeSet.push( generateUniqueChallenge( generateRectangularFindAreaChallenge ) ); } );
          challengeSet.push( generateUniqueChallenge( generateLShapedFindAreaChallenge ) );
          break;

        case 1:
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateBuildAreaAndPerimeterChallenge ) ); } );
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateTwoRectangleBuildAreaAndPerimeterChallenge ) ); } );
          break;

        case 2:
          challengeSet.push( generateUniqueChallenge( generateUShapedFindAreaChallenge ) );
          challengeSet.push( generateUniqueChallenge( generateOShapedFindAreaChallenge ) );
          challengeSet.push( generateUniqueChallenge( generateShapeWithDiagonalFindAreaChallenge ) );
          challengeSet = _.shuffle( challengeSet );
          var triangleChallenges = _.shuffle( [
            generateUniqueChallenge( generateIsoscelesRightTriangleLevelHypotenuseFindAreaChallenge ),
            generateUniqueChallenge( generateIsoscelesRightTriangleSlantedHypotenuseFindAreaChallenge )
          ] );
          triangleChallenges.forEach( function( challenge ) { challengeSet.push( challenge ); } );
          challengeSet.push( generateUniqueChallenge( generateLargeRectWithPieceMissingChallenge ) );
          break;

        case 3:
          // For this level, the grid is disabled for all challenges and some different build kits are used.
          challengeSet.push( makeLevel4SpecificModifications( generateUniqueChallenge( generateUShapedFindAreaChallenge ) ) );
          challengeSet.push( makeLevel4SpecificModifications( generateUniqueChallenge( generateOShapedFindAreaChallenge ) ) );
          challengeSet.push( makeLevel4SpecificModifications( generateUniqueChallenge( generateOShapedFindAreaChallenge ) ) );
          challengeSet.push( makeLevel4SpecificModifications( generateUniqueChallenge( generateShapeWithDiagonalFindAreaChallenge ) ) );
          challengeSet = _.shuffle( challengeSet );
          // For the next challenge, choose randomly from the shapes that don't have diagonals.
          tempChallenge = generateUniqueChallenge( randomElement( [ generateLShapedFindAreaChallenge, generateUShapedFindAreaChallenge ] ) );
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = null;
          challengeSet.push( tempChallenge );
          tempChallenge = generateUniqueChallenge( generateShapeWithDiagonalFindAreaChallenge );
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = null;
          challengeSet.push( tempChallenge );
          break;

        case 4:
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateEasyProportionalBuildAreaChallenge ) ); } );
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateHarderProportionalBuildAreaChallenge ) ); } );
          break;

        case 5:
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateEasyProportionalBuildAreaAndPerimeterChallenge ) ); } );
          _.times( 3, function() { challengeSet.push( generateUniqueChallenge( generateHarderProportionalBuildAreaAndPerimeterChallenge ) ); } );
          break;

      }
      assert && assert( challengeSet.length === numChallenges, 'Error: Didn\'t generate correct number of challenges.' );
      return challengeSet;
    }
  };
} );