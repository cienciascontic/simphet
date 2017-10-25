// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that allows a user to enter a numerical value using up/down arrow
 * buttons.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Constants
  var NUMBER_BOX_SIZE = { width: 55, height: 48 }; // Size empirically determined.
  var NUMBER_FONT = new PhetFont( 28 );

  /**
   * Main constructor.
   *
   * @param numberProperty
   * @param options
   * @constructor
   */
  function NumberEntryNode( numberProperty, options ) {

    Node.call( this ); // Call super constructor.
    var thisNode = this;

    options = _.extend(
      {
        prependPlusSign: false, // Generally set to true when depicting charge.
        getTextColor: function() { return 'black'; },
        minValue: Number.NEGATIVE_INFINITY,
        maxValue: Number.POSITIVE_INFINITY
      }, options );

    // Node creation
    var arrowButtonOptions = { arrowHeight: 12, arrowWidth: 15, timerDelay: 200 };
    var upArrowButton = new ArrowButton( 'up', function() { numberProperty.value = numberProperty.value + 1; }, arrowButtonOptions );
    thisNode.addChild( upArrowButton );
    var downArrowButton = new ArrowButton( 'down', function() { numberProperty.value = numberProperty.value - 1; }, arrowButtonOptions );
    thisNode.addChild( downArrowButton );
    var answerValueBackground = new Rectangle( 0, 0, NUMBER_BOX_SIZE.width, NUMBER_BOX_SIZE.height, 4, 4,
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      } );
    thisNode.addChild( answerValueBackground );
    numberProperty.link( function( newValue ) {
      answerValueBackground.removeAllChildren();
      var prepend = options.prependPlusSign && newValue > 0 ? '+' : '';
      var textNode = new Text( prepend + newValue,
        { font: NUMBER_FONT,
          fill: options.getTextColor( newValue )
        } );
      textNode.scale( Math.min( 1, Math.min( ( answerValueBackground.width * 0.8 ) / textNode.width, ( answerValueBackground.height * 0.9 ) / textNode.height ) ) );
      textNode.centerX = answerValueBackground.width / 2;
      textNode.centerY = answerValueBackground.height / 2;
      answerValueBackground.addChild( textNode );
      upArrowButton.setEnabled( newValue < options.maxValue );
      downArrowButton.setEnabled( newValue > options.minValue );
    } );

    // Layout.  Upper left corner of overall node will be at (0,0).
    var interNodeSpacing = upArrowButton.height * 0.2;
    var totalHeight = Math.max( answerValueBackground.height, upArrowButton.height + downArrowButton.height + interNodeSpacing );
    answerValueBackground.left = 0;
    answerValueBackground.centerY = totalHeight / 2;
    upArrowButton.left = answerValueBackground.right + interNodeSpacing;
    upArrowButton.bottom = totalHeight / 2 - interNodeSpacing / 2;
    downArrowButton.top = totalHeight / 2 + interNodeSpacing / 2;
    downArrowButton.left = answerValueBackground.right + interNodeSpacing;

    // Set up extended touch areas for the up/down buttons.  The areas are
    // set up such that they don't overlap with one another.
    var extendedTouchAreaWidth = upArrowButton.width * 2.5;
    var extendedTouchAreaHeight = upArrowButton.height * 1.65; // Tweaked for minimal overlap in most layouts that use this.
    upArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + upArrowButton.width / 2,
      -extendedTouchAreaHeight + upArrowButton.height,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );
    downArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + upArrowButton.width / 2,
      0,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );

    thisNode.mutate( options );
  }

  // Inherit from Node.
  return inherit( Node, NumberEntryNode );
} );
