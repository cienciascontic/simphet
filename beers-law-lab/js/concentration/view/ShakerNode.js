// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // images
  var shakerImage = require( 'image!BEERS_LAW_LAB/shaker.png' );

  // constants
  var DEBUG_ORIGIN = false;
  var SHOW_ARROWS = true;
  var ARROW_LENGTH = 40;
  var ARROW_HEAD_LENGTH = 30;
  var ARROW_HEAD_WIDTH = 40;
  var ARROW_TAIL_WIDTH = 23;
  var ARROW_FILL = 'yellow';
  var ARROW_STROKE = 'rgb(160,160,160)';

  /**
   * Constructor
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ShakerNode( shaker, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode, { renderer: 'svg', rendererOptions: { cssTransform: true } } );

    // shaker image
    var imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    var labelNode = new SubSupText( shaker.solute.formula, { font: new PhetFont( { size: 22, weight: 'bold' } ), fill: 'black' } );

    // arrows
    var downArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -ARROW_HEAD_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, -ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, -ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( ARROW_HEAD_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .close();
    var downArrowNode = new Path( downArrowShape, {fill: ARROW_FILL, stroke: ARROW_STROKE } );
    downArrowNode.top = imageNode.bottom + 4;
    downArrowNode.centerX = imageNode.centerX;
    downArrowNode.pickable = false;
    downArrowNode.visible = false;

    var upArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -ARROW_HEAD_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( ARROW_HEAD_WIDTH / 2, ARROW_HEAD_LENGTH )
      .close();
    var upArrowNode = new Path( upArrowShape, { fill: ARROW_FILL, stroke: ARROW_STROKE } );
    upArrowNode.bottom = imageNode.top - 4;
    upArrowNode.centerX = imageNode.centerX;
    upArrowNode.pickable = false;
    upArrowNode.visible = false;

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node();
    thisNode.addChild( parentNode );
    parentNode.addChild( imageNode );
    parentNode.addChild( labelNode );
    if ( SHOW_ARROWS ) {
      parentNode.addChild( upArrowNode );
      parentNode.addChild( downArrowNode );
    }
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync location with model
    var shakerWasMoved = false;
    shaker.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
      shakerWasMoved = true;
      upArrowNode.visible = downArrowNode.visible = false;
    } );
    shakerWasMoved = false; // reset to false, because function is fired when link is performed

    // sync visibility with model
    shaker.visible.link( function( visible ) {
      thisNode.setVisible( visible );
    } );

    // sync solute with model
    shaker.solute.link( function( solute ) {
      // label the shaker with the solute formula
      labelNode.setText( solute.formula );
      // center the label on the shaker
      var capWidth = 0.3 * imageNode.width;
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.centerY;
    } );

    // interactivity
    thisNode.cursor = 'pointer';
    thisNode.addInputListener( new MovableDragHandler( shaker, modelViewTransform ) );
    thisNode.addInputListener( {
        enter: function() {
          upArrowNode.visible = downArrowNode.visible = !shakerWasMoved;
        },
        exit: function() {
          upArrowNode.visible = downArrowNode.visible = false;
        }
      }
    );
  }

  return inherit( Node, ShakerNode );
} );
