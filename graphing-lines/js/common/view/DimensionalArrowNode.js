// Copyright 2002-2014, University of Colorado Boulder

/**
 * A dimensional arrow is used in engineering drawings or technical drawings to denote the dimensions
 * of something in the drawing. It includes an arrow drawn between two perpendicular lines which mark
 * the end points of the thing in the drawing that's being measured.
 * <p>
 * We're using a dimensional arrow in this sim to indicate the dimensions of slope: rise and run.
 * <p>
 * The arrow has a head at the tip, and there are delimiters (perpendicular lines) at the tip and tail.
 * The arrow head is different than scenery-phet.ArrowNode.
 * Currently supports only horizontal and vertical arrows.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Number} tailX
   * @param {Number} tailY
   * @param {Number} tipX
   * @param {Number} tipY
   * @param {Object} [options]
   */
  function DimensionalArrowNode( tailX, tailY, tipX, tipY, options ) {

    options = _.extend( {
      stroke: 'black',
      lineWidth: 1,
      arrowTipSize: new Dimension2( 6, 8 ), // use even-number dimensions, or tip will look asymmetrical due to rounding
      delimiterLength: 10,
      delimitersVisible: true
    }, options );

    this.arrowTipSize = options.arrowTipSize; // @private
    this.delimiterLength = options.delimiterLength; // @private
    this.lineWidth = options.lineWidth; // @private

    // nodes with dummy initial shapes
    this.lineNode = new Line( 0, 0, 0, 1, options );  // @private
    this.tipNode = new Path( null, options ); // @private
    this.tipDelimiterNode = new Line( 0, 0, 0, 1, _.extend( { visible: options.delimitersVisible }, options ) ); // @private
    this.tailDelimiterNode = new Line( 0, 0, 0, 1, _.extend( { visible: options.delimitersVisible }, options ) ); // @private

    options.children = [ this.tipDelimiterNode, this.tailDelimiterNode, this.lineNode, this.tipNode ];
    Node.call( this, options );

    // initialize
    this.setTailAndTip( tailX, tailY, tipX, tipY );
  }

  return inherit( Node, DimensionalArrowNode, {

    /**
     * Sets the tail and tip of the arrow, accounting for the lineWidth when positioning the arrow head.
     *
     * @param {Number} tailX
     * @param {Number} tailY
     * @param {Number} tipX
     * @param {Number} tipY
     */
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {

      var tipWidth = this.arrowTipSize.width;
      var tipHeight = this.arrowTipSize.height;
      var tipOffset = this.lineWidth / 2;
      var tipShape = new Shape();
      if ( tailX === tipX ) {
        // vertical arrow
        if ( tipY > tailY ) {
          this.lineNode.setLine( tailX, tailY, tipX, tipY - ( this.lineWidth / 2 ) );
          // pointing down
          tipShape.moveTo( tipX - ( tipWidth / 2 ), tipY - tipHeight - tipOffset );
          tipShape.lineTo( tipX, tipY - tipOffset );
          tipShape.lineTo( tipX + ( tipWidth / 2 ), tipY - tipHeight - tipOffset );
        }
        else {
          this.lineNode.setLine( tailX, tailY, tipX, tipY + ( this.lineWidth / 2 ) );
          // pointing up
          tipShape.moveTo( tipX - ( tipWidth / 2 ), tipY + tipHeight + tipOffset );
          tipShape.lineTo( tipX, tipY + tipOffset );
          tipShape.lineTo( tipX + ( tipWidth / 2 ), tipY + tipHeight + tipOffset );
        }
        this.tipDelimiterNode.setLine( tipX - this.delimiterLength / 2, tipY, tipX + this.delimiterLength / 2, tipY );
        this.tailDelimiterNode.setLine( tailX - this.delimiterLength / 2, tailY, tailX + this.delimiterLength / 2, tailY );
      }
      else if ( tailY === tipY ) {
        this.lineNode.setLine( tailX, tailY, tipX, tipY );
        // horizontal arrow
        if ( tailX > tipX ) {
          this.lineNode.setLine( tailX, tailY, tipX + ( this.lineWidth / 2 ), tipY );
          // pointing left
          tipShape.moveTo( tipX + tipHeight + tipOffset, tipY - ( tipWidth / 2 ) );
          tipShape.lineTo( tipX + tipOffset, tipY );
          tipShape.lineTo( tipX + tipHeight + tipOffset, tipY + ( tipWidth / 2 ) );
        }
        else {
          this.lineNode.setLine( tailX, tailY, tipX - ( this.lineWidth / 2 ), tipY );
          // pointing right
          tipShape.moveTo( tipX - tipHeight - tipOffset, tipY - ( tipWidth / 2 ) );
          tipShape.lineTo( tipX - tipOffset, tipY );
          tipShape.lineTo( tipX - tipHeight - tipOffset, tipY + ( tipWidth / 2 ) );
        }
        this.tipDelimiterNode.setLine( tipX, tipY - this.delimiterLength / 2, tipX, tipY + this.delimiterLength / 2 );
        this.tailDelimiterNode.setLine( tailX, tailY - this.delimiterLength / 2, tailX, tailY + this.delimiterLength / 2 );
      }
      else {
        throw new Error( 'this implementation supports only horizontal and vertical arrows' );
      }
      this.tipNode.shape = tipShape;
    }
  } );
} );
