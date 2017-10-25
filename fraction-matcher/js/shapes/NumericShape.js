// Copyright 2002-2014, University of Colorado Boulder

/**
 * Numeric shape for the 'Fractions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  function NumericShape( options ) {
    var fractionNode = new Node(),
      spaceX = 0,
      offsetX = 0,
      side,
      fontSizeBig,
      fontSizeSmall,
      numerator,
      denominator,
      integralPart,
      integralPartNode,
      integralPartWidth,
      integralPartLength;

    Node.call( this, options );
    numerator = options.numerator * options.scaleFactor;
    denominator = options.denominator * options.scaleFactor;
    integralPart = Math.floor( numerator / denominator );
    fontSizeSmall = options.fontSize || 32;
    fontSizeBig = fontSizeSmall * 2.2;
    side = fontSizeBig; // define size of fraction

    if ( integralPart && options.toSimplify ) {
      if ( numerator % denominator ) {
        // add simplified fraction node
        fractionNode = this.getFractionNode( numerator % denominator, denominator, side, fontSizeSmall );
        this.addChild( fractionNode );

        // correct its position
        spaceX = fractionNode.shapeWidth / 2 + 3; // space between fraction node and integral node
      }

      // add integral part
      this.addChild( integralPartNode = new Text( integralPart + '', {font: new PhetFont( fontSizeBig ), centerY: 0 } ) );

      // add additional offset taking into account whole part width
      integralPartWidth = integralPartNode.getWidth();
      integralPartLength = integralPart.toString().length;
      offsetX = (integralPartWidth - integralPartWidth / integralPartLength) / 4;
      integralPartNode.centerX = -offsetX - spaceX;
      fractionNode.centerX = spaceX + offsetX;

      // common alignment
      if ( isFinite( fractionNode.getWidth() ) ) {
        this.setX( -(fractionNode.getWidth() - integralPartWidth) / 8 );
      }
    }
    else {
      // add fraction node
      this.addChild( this.getFractionNode( numerator, denominator, side, fontSizeSmall ) );
    }

    //Expand the touch and mouse areas for the numeric fractions, so there are no "gaps", see #56
    this.mouseArea = this.touchArea = this.localBounds.dilatedXY( 2, 2 );
  }

  return inherit( Node, NumericShape, {
    getFractionNode: function( numerator, denominator, side, fontSizeSmall ) {
      var line = new Shape().moveTo( -fontSizeSmall / 2, 0 ).lineTo( fontSizeSmall / 2, 0 ),
        fractionNode = new Node( {children: [
          new Text( numerator + '', { font: new PhetFont( fontSizeSmall ), centerX: 0, centerY: -side / 4  } ),
          new Text( denominator + '', { font: new PhetFont( fontSizeSmall ), centerX: 0, centerY: +side / 4  } ),
          new Path( line, {stroke: 'black', lineWidth: 3, lineCap: 'round'} )
        ]} );

      fractionNode.shapeWidth = line.bounds.width;
      return fractionNode;
    }
  } );
} );