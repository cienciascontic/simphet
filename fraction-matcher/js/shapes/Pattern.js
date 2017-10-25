// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pattern for creation shapes for the 'Fractions' sim.
 *
 * @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  var Pattern = {
    createShapes: function( options ) {
      var shapes = []; //each shape[i] contains all paths, relative to i's single shape
      var outlines = []; //array of outlines of shapes
      for ( var i = 0; i < Math.ceil( options.numerator / options.denominator ); i++ ) {
        shapes.push( [] );
      }
      options.diameter = Math.min( options.width, options.height );

      var createdPaths = this[options.type]( shapes, outlines, options ); // {shapes:[Array], outlines:[]}
      return _.extend( {margin: options.diameter / 10}, createdPaths );
    },
    //array of points to Shape
    pointsToShape: function( s, array, size ) {
      size = size || 1;
      for ( var i = 0; i < array.length; i++ ) {
        s.lineTo( array[i].x * size, array[i].y * size );
      }
      s.close();
      return s;
    },
    VERTICAL_BARS: function( shapes, outlines, options ) {
      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( new Shape.rect( 0, 0, options.width / options.denominator, options.height ), {
            x: j / options.denominator * options.width, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( new Shape.rect( 0, 0, options.width, options.height ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    HORIZONTAL_BARS: function( shapes, outlines, options ) {
      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( new Shape.rect( 0, 0, options.width, options.height / options.denominator ), {
            y: j / options.denominator * options.height, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( new Shape.rect( 0, 0, options.width, options.height ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    PIES: function( shapes, outlines, options ) {
      var radiansPerSlice = Math.PI * 2 / options.denominator;
      //single slice of shape
      var getSlice = function( startAngle, endAngle ) {
        var shape = new Shape();
        if ( Math.abs( (startAngle / 2) % Math.PI - (endAngle / 2) % Math.PI ) > 0.001 ) {
          shape.moveTo( 0, 0 )
            .lineTo( Math.cos( startAngle ) * options.diameter / 2, Math.sin( startAngle ) * options.diameter / 2 )
            .arc( 0, 0, options.diameter / 2, startAngle, endAngle, false )
            .close();
        }
        else {
          shape.circle( 0, 0, options.diameter / 2 );
        }
        return shape;
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( getSlice( radiansPerSlice * j, radiansPerSlice * ( j + 1 ) ), {fill: 'white', stroke: options.stroke, lineWidth: 1} ) );
        }
        //outlines
        outlines.push( new Path( getSlice( 0, radiansPerSlice * options.denominator ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    POLYGON: function( shapes, outlines, options ) {
      var radiansPerSlice = Math.PI * 2 / options.denominator;
      var baseVector = new Vector2( 0, -1 );
      //single slice of shape
      var getSlice = function( startAngle, endAngle ) {
        return Pattern.pointsToShape( new Shape(), [
          new Vector2( 0, 0 ),
          baseVector.rotated( -startAngle ),
          baseVector.rotated( -endAngle )
        ], options.diameter / 2 );
      };

      var getOutline = function() {
        var keyPoints = [];
        for ( var i = 0; i < options.denominator; i++ ) {
          keyPoints.push( baseVector.rotated( radiansPerSlice * i ) );
        }
        return Pattern.pointsToShape( new Shape(), keyPoints, options.diameter / 2 );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( getSlice( radiansPerSlice * j, radiansPerSlice * ( j + 1 ) ), {fill: 'white', stroke: options.stroke, lineWidth: 1} ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    FLOWER: function( shapes, outlines, options ) {
      var radiansPerSlice = Math.PI * 2 / options.denominator;
      var baseVector = new Vector2( 0, -1 );
      var halfVector = new Vector2( 0, -0.5 );

      //single slice of shape
      var getSlice = function( position ) {
        return Pattern.pointsToShape( new Shape(), [
          new Vector2( 0, 0 ),
          halfVector.rotated( -radiansPerSlice * (position - 1 / 2) ),
          baseVector.rotated( -radiansPerSlice * position ),
          halfVector.rotated( -radiansPerSlice * (position + 1 / 2) )
        ], options.diameter / 2 );
      };

      var getOutline = function() {
        var keyPoints = [];
        for ( var i = 0; i < options.denominator; i++ ) {
          keyPoints.push( halfVector.rotated( -radiansPerSlice * (i - 1 / 2) ) );
          keyPoints.push( baseVector.rotated( -radiansPerSlice * i ) );
        }
        return Pattern.pointsToShape( new Shape(), keyPoints, options.diameter / 2 );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( getSlice( j ), {fill: 'white', stroke: options.stroke, lineWidth: 1} ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    RING_OF_HEXAGONS: function( shapes, outlines, options ) {
      var angle = Math.PI * 2 / 6;
      var hexDiameter = options.diameter / 3;
      var baseVector = new Vector2( 0, -hexDiameter );
      var distanceBetweenHexCenters = new Vector2( 0, -1 ).multiply( hexDiameter * Math.sqrt( 3 ) );
      var hexCenterPoints = [
        new Vector2( 0, 0 ),
        distanceBetweenHexCenters,
        distanceBetweenHexCenters.rotated( -angle ),
        distanceBetweenHexCenters.rotated( -2 * angle ),
        distanceBetweenHexCenters.rotated( -3 * angle ),
        distanceBetweenHexCenters.rotated( -4 * angle ),
        distanceBetweenHexCenters.rotated( -5 * angle )
      ];

      var hexPoints = [
        baseVector.rotated( -angle / 2 ),
        baseVector.rotated( -3 * angle / 2 ),
        baseVector.rotated( -5 * angle / 2 ),
        baseVector.rotated( -7 * angle / 2 ),
        baseVector.rotated( -9 * angle / 2 ),
        baseVector.rotated( -11 * angle / 2 )
      ];

      var getHex = function() {
        return Pattern.pointsToShape( new Shape(), hexPoints );
      };

      var getOutline = function() {
        var keyPoints = [];
        for ( var i = 1; i < 7; i++ ) {
          for ( var j = -1; j < 2; j++ ) {
            keyPoints.push( hexPoints[(j + 6 + i - 1) % 6].plus( hexCenterPoints[i] ) );
          }
        }
        return Pattern.pointsToShape( new Shape(), keyPoints );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < 7; j++ ) {
          shapes[i].push( new Path( getHex( hexDiameter ), {x: hexCenterPoints[j].x, y: hexCenterPoints[j].y, fill: 'white', stroke: options.stroke, lineWidth: 1} ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    LETTER_L_SHAPES: function( shapes, outlines, options ) {
      //Compression along axis y
      var getYCoeff = function( d ) {
        return (d >= 7 ? 7 / 4 :
                d >= 5 ? 6 / 4 :
                d >= 3 ? 5 / 4 : 1);
      };

      // determine size of shape
      var max = options.denominator * Math.ceil( options.numerator / options.denominator );
      var w = options.width * 4 / max;
      var h = options.height / getYCoeff( options.denominator );
      var diameter = Math.min( w, h );
      var size = diameter * Math.ceil( options.numerator / options.denominator ) / 4;

      var shapeDefinition = {
        top: [
          {x: 0, y: 0},
          {x: 2, y: 0},
          {x: 2, y: 3},
          {x: 1, y: 3},
          {x: 1, y: 1},
          {x: 0, y: 1},
          {x: 0, y: 0}
        ],
        bottom: [
          {x: 0, y: 1},
          {x: 1, y: 1},
          {x: 1, y: 3},
          {x: 2, y: 3},
          {x: 2, y: 4},
          {x: 0, y: 4},
          {x: 0, y: 1}
        ]
      };

      var getOutline = function() {
        var keyPoints = [];
        for ( var j = 0; j < options.denominator / 2; j++ ) {
          keyPoints.push( {x: j * 2 * size, y: j * size} );
          keyPoints.push( {x: (j + 1) * 2 * size, y: j * size} );
        }
        for ( j = options.denominator / 2 - 1; j > -1; j-- ) {
          keyPoints.push( {x: (j + 1) * 2 * size, y: j * size + 4 * size} );
          keyPoints.push( {x: j * 2 * size, y: j * size + 4 * size} );
        }
        return Pattern.pointsToShape( new Shape(), keyPoints );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator / 2; j++ ) {
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), shapeDefinition.top, size ), {
            x: j * 2 * size, y: j * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), shapeDefinition.bottom, size ), {
            x: j * 2 * size, y: j * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    NINJA_STAR: function( shapes, outlines, options ) {
      var radiansPerSlice = Math.PI * 2 / options.denominator;
      var baseVector = new Vector2( 0, -1 );
      var halfVector = new Vector2( 0, -0.5 );
      var pattern = [];
      var i = 0;
      var l = 0;

      for ( i = 0; i < options.denominator / 2; i++ ) {
        pattern.push( baseVector.rotated( -2 * i * radiansPerSlice ) );
        pattern.push( halfVector.rotated( -(2 * i + 1) * radiansPerSlice ) );
      }

      var getSlice = function( position ) {
        return Pattern.pointsToShape( new Shape(), [
          {x: 0, y: 0},
          pattern[position % options.denominator],
          pattern[(position + 1) % options.denominator]
        ], options.diameter / 2 );
      };

      var getOutline = function() {
        return Pattern.pointsToShape( new Shape(), pattern, options.diameter / 2 );
      };

      for ( i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( getSlice( j ), {fill: 'white', stroke: options.stroke, lineWidth: 1} ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    PLUSES: function( shapes, outlines, options ) {
      var DIRECTIONS = {
        UP: new Vector2( 0, -2 ),
        LEFT: new Vector2( -2, 0 ),
        DOWN: new Vector2( 0, 2 ),
        RIGHT: new Vector2( 2, 0 )
      };
      // determine size of shape
      var w = options.width / 16;
      var h = options.height / 14;
      var size = Math.min( w, h );
      var position = new Vector2( -3, -3 );
      var positionOutline = new Vector2( -1, -7 );

      var plusSign = [ 'RIGHT', 'DOWN', 'RIGHT', 'DOWN', 'LEFT', 'DOWN', 'LEFT', 'UP', 'LEFT', 'UP', 'RIGHT', 'UP' ];
      var plusSignOutline = [ 'RIGHT', 'DOWN', 'RIGHT', 'RIGHT', 'DOWN', 'RIGHT', 'RIGHT', 'DOWN', 'RIGHT', 'DOWN', 'LEFT', 'DOWN', 'DOWN', 'LEFT', 'DOWN', 'LEFT', 'UP', 'LEFT', 'LEFT', 'UP', 'LEFT', 'LEFT', 'UP', 'LEFT', 'UP', 'RIGHT', 'UP', 'UP', 'RIGHT', 'UP' ];
      var plusSignPattern = [];
      var plusSignOutlinePattern = [];

      plusSign.forEach( function( direction ) {
        plusSignPattern.push( position.add( DIRECTIONS[direction] ).copy() );
      } );

      plusSignOutline.forEach( function( direction ) {
        plusSignOutlinePattern.push( positionOutline.add( DIRECTIONS[direction] ).copy() );
      } );


      var getOutline = function() {
        return Pattern.pointsToShape( new Shape(), plusSignOutlinePattern, size );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator / 2; j++ ) {
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), plusSignPattern, size ), {
            x: 4 * size * j, y: 2 * size * j, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), plusSignPattern, size ), {
            x: (4 * j + 2) * size, y: (2 * j - 4) * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    PYRAMID: function( shapes, outlines, options ) {
      // size of one piece
      var size = 1.1 * options.diameter / Math.sqrt( options.denominator );

      var SQRT_3 = Math.sqrt( 3 );
      var map = { // positions of triangles in pyramid
        1: [
          {x: 0, y: 0, type: 'top'}
        ],
        4: [
          {x: 0, y: -0.5, type: 'top'},
          {x: -SQRT_3 / 4, y: 0.25, type: 'top'},
          {x: 0, y: 0, type: 'bottom'},
          {x: SQRT_3 / 4, y: 0.25, type: 'top'}
        ],
        9: [
          {x: 0, y: -1, type: 'top'},
          {x: -SQRT_3 / 4, y: -0.25, type: 'top'},
          {x: 0, y: -0.5, type: 'bottom'},
          {x: SQRT_3 / 4, y: -0.25, type: 'top'},
          {x: -SQRT_3 / 2, y: 0.5, type: 'top'},
          {x: -SQRT_3 / 4, y: 0.25, type: 'bottom'},
          {x: 0, y: 0.5, type: 'top'},
          {x: SQRT_3 / 4, y: 0.25, type: 'bottom'},
          {x: SQRT_3 / 2, y: 0.5, type: 'top'}
        ]
      };

      var getSlice = function( orientation, size ) {
        var points = [];
        if ( orientation === 'top' ) {
          points = [
            {x: 0, y: -0.5},
            {x: SQRT_3 / 4, y: 0.25},
            {x: -SQRT_3 / 4, y: 0.25},
            {x: 0, y: -0.5}
          ];
        }
        else if ( orientation === 'bottom' ) {
          points = [
            {x: 0, y: 0.5},
            {x: SQRT_3 / 4, y: -0.25},
            {x: -SQRT_3 / 4, y: -0.25},
            {x: 0, y: 0.5}
          ];
        }

        return Pattern.pointsToShape( new Shape(), points, size );
      };

      var getOutline = function() {
        var keyPoints = [
          {x: 0, y: -options.diameter / 2},
          {x: -options.diameter / 2, y: options.diameter / (2 * SQRT_3)},
          {x: options.diameter / 2, y: options.diameter / (2 * SQRT_3)}
        ];
        return Pattern.pointsToShape( new Shape(), keyPoints );
      };

      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          var path = new Path( getSlice( map[options.denominator][j].type, size ), {
            x: map[options.denominator][j].x * size, y: map[options.denominator][j].y * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } );
          shapes[i].push( path );
        }
        //outlines
        outlines.push( new Path( getOutline(), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    GRID: function( shapes, outlines, options ) {
      var d = Math.sqrt( options.denominator ); // dimension of grid
      var size = options.diameter / d; // size of one piece
      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( new Shape.rect( 0, 0, size, size ), {
            x: j % d * size, y: Math.floor( j / d ) * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( new Shape.rect( 0, 0, options.width, options.height ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    TETRIS: function( shapes, outlines, options ) {
      var size = options.diameter / 4; //size of 1 square, each tetris piece contains 4 squares
      var pointsMap = [
        [
          {x: 0, y: 0},
          {x: 3, y: 0},
          {x: 3, y: 1},
          {x: 2, y: 1},
          {x: 2, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 1},
          {x: 0, y: 1},
          {x: 0, y: 0}
        ],
        [
          {x: 3, y: 0},
          {x: 4, y: 0},
          {x: 4, y: 3},
          {x: 3, y: 3},
          {x: 3, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 1},
          {x: 3, y: 1},
          {x: 3, y: 0}
        ],
        [
          {x: 4, y: 3},
          {x: 4, y: 4},
          {x: 1, y: 4},
          {x: 1, y: 3},
          {x: 2, y: 3},
          {x: 2, y: 2},
          {x: 3, y: 2},
          {x: 3, y: 3},
          {x: 4, y: 3}
        ],
        [
          {x: 0, y: 4},
          {x: 0, y: 1},
          {x: 1, y: 1},
          {x: 1, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 3},
          {x: 1, y: 3},
          {x: 1, y: 4},
          {x: 0, y: 4}
        ]
      ];
      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator; j++ ) {
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), pointsMap[j], size ), {
            fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( new Shape.rect( 0, 0, options.width, options.height ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    },
    INTERLEAVED_L_SHAPES: function( shapes, outlines, options ) {
      var size = 2 * options.diameter / options.denominator; //size of 1 square, each tetris piece contains 4 squares
      var pointsMap = {
        left: [
          {x: 0, y: 0},
          {x: 1 / 3, y: 0},
          {x: 1 / 3, y: 1 / 2},
          {x: 2 / 3, y: 1 / 2},
          {x: 2 / 3, y: 1},
          {x: 0, y: 1},
          {x: 0, y: 0}
        ],
        right: [
          {x: 1, y: 0},
          {x: 1, y: 1},
          {x: 2 / 3, y: 1},
          {x: 2 / 3, y: 1 / 2},
          {x: 1 / 3, y: 1 / 2},
          {x: 1 / 3, y: 0},
          {x: 1, y: 0}
        ]
      };
      for ( var i = 0, l = shapes.length; i < l; i++ ) {
        for ( var j = 0; j < options.denominator / 2; j++ ) {
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), pointsMap.left, size ), {
            x: j * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
          shapes[i].push( new Path( Pattern.pointsToShape( new Shape(), pointsMap.right, size ), {
            x: j * size, fill: 'white', stroke: options.stroke, lineWidth: 1
          } ) );
        }
        //outlines
        outlines.push( new Path( new Shape.rect( 0, 0, options.width, options.height / (options.denominator / 2) ), {stroke: options.stroke, lineWidth: options.outlineWidth} ) );
      }
      return {
        shapes: shapes,
        outlines: outlines
      };
    }
  };

  return Pattern;
} );