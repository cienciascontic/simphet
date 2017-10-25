// Copyright 2002-2014, University of Colorado Boulder

/**
 * Shape for the 'Fractions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumericShape = require( 'FRACTION_MATCHER/shapes/NumericShape' );
  var Pattern = require( 'FRACTION_MATCHER/shapes/Pattern' );
  var GraphicShape = require( 'FRACTION_MATCHER/shapes/GraphicShape' );

  function ShapeNode() {
  }

  return inherit( Node, ShapeNode,

    //instance methods
    { },

    //statics
    {
      create: function( options ) {
        //default parameters
        options = _.extend( {
            type: 'PIES',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            numerator: 1,
            denominator: 1,
            toSimplify: false,
            fill: '#F00',
            outlineWidth: 2,
            stroke: '#000'
          },
          options );

        if ( options.type !== 'NUMBER' ) {
          options.createdPaths = Pattern.createShapes( options );
        }
        return options.type === 'NUMBER' ? new NumericShape( options ) : new GraphicShape( options );
      }
    } );
} );