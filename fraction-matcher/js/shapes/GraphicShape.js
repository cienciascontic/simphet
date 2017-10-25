// Copyright 2002-2014, University of Colorado Boulder

/**
 * Abstract shape for the 'Build a Fraction' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var FillType = require( 'FRACTION_MATCHER/model/FillType' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function AbstractShape( options ) {
    options = _.extend( {
        fillType: FillType.SEQUENTIAL
      },
      options );
    HBox.call( this, {resize: false, x: options.x, y: options.y} );
    this.options = options;

    //created all paths from pattern, fill with colors and add to container
    this.addShapeChildren( options.createdPaths.shapes, options.createdPaths.margin, options.createdPaths.outlines );

    //Expand the touch areas for the graphical fractions, see #56
    this.touchArea = this.localBounds.dilatedXY( 4, 4 );

    //Add a transparent rectangle that is used to make sure there are no litter left behind when using SVG to render the shapes, see #54
    var clearingRegion = this.localBounds.dilatedXY( 1, 1 );
    this.addChild( new Rectangle( clearingRegion.x, clearingRegion.y, clearingRegion.width, clearingRegion.height, {fill: 'rgba(0,0,0,0)'} ) );
  }

  return inherit( HBox, AbstractShape, {
    // fill shapes depending on fillType value
    // shapes - array of shapes, shapes[i] - array of pieces, which created shape
    fillShapes: function( shapes ) {
      if ( shapes.length ) {
        var filled = 0, i = 0, j = 0, len1 = shapes.length, len2 = shapes[0].length;

        while ( filled < this.options.numerator ) { //while number of filled pieces < required (numerator)
          if ( this.options.fillType === FillType.SEQUENTIAL ) {
            //fill first shape, then second, etc.
            shapes[Math.floor( i / len2 ) % len1][i++ % len2].fill = this.options.fill;
            filled++;
          }
          else if ( this.options.fillType === FillType.MIXED ) {
            //fill first shape always, then random piece in random shape
            if ( filled < len2 ) {
              shapes[Math.floor( i / len2 ) % len1][i++ % len2].fill = this.options.fill;
              filled++;
            }
            else {
              i = _.random( 1, len1 - 1 );
              j = _.random( len2 - 1 );
              if ( shapes[i][j].fill === 'white' ) {
                shapes[i][j].fill = this.options.fill;
                filled++;
              }
            }
          }
          else if ( this.options.fillType === FillType.RANDOM ) {
            //random shape, random piece in shape, fill if not filled yet
            i = _.random( len1 - 1 );
            j = _.random( len2 - 1 );
            if ( shapes[i][j].fill === 'white' ) {
              shapes[i][j].fill = this.options.fill;
              filled++;
            }
          }
        }
      }
    },

    // convert array to shapes and add them to main container
    addShapeChildren: function( array, offset, outlines ) {
      this.fillShapes( array );
      var nodes = this.getNodesFromArray( array, outlines );

      // add nodes to main container
      var self = this,
        scaleFactor;

      // set spacing
      self.options.spacing = function() { return offset; };

      // add nodes
      nodes.forEach( function( node ) {
        self.addChild( node );
      } );

      // update layout
      self.updateLayout();

      // fit the size of shapes
      scaleFactor = Math.min( this.options.width / this.getWidth(), this.options.height / this.getHeight() );
      this.scale( scaleFactor );
      this.centerX = 0;
      this.centerY = 0;
    },

    // convert array to nodes
    getNodesFromArray: function( array, outlines ) {
      var nodes = [];
      for ( var i = 0, j; i < array.length; i++ ) {
        nodes[i] = new Node();
        for ( j = 0; j < array[i].length; j++ ) {
          nodes[i].addChild( array[i][j] );
        }
        if ( outlines ) {
          nodes[i].addChild( outlines[i] );
        }
      }
      return nodes;
    }
  } );
} );
