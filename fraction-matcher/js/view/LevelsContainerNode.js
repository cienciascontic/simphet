// Copyright 2002-2014, University of Colorado Boulder

/**
 * Levels Container. Contains levels and common buttons and scales
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BackButton = require( 'FRACTION_MATCHER/view/BackButton' );
  var RefreshButton = require( 'SCENERY_PHET/RefreshButton' );
  var LevelNode = require( 'FRACTION_MATCHER/view/LevelNode' );

  // strings
  var myMatchesString = require( 'string!FRACTION_MATCHER/myMatches' );

  // images
  var scaleImage = require( 'image!FRACTION_MATCHER/scale.png' );

  /**
   *
   * @param {FractionMatcherModel} model
   * @param layoutBounds
   * @constructor
   */
  function LevelsContainerNode( model, layoutBounds ) {
    var margin = 15;
    this.model = model;

    var thisNode = this, i, j;
    Node.call( this );

    //top gray targets                                          f
    this.answerRects = [];
    for ( i = 0; i < 6; i++ ) {
      this.answerRects.push( new Rectangle( margin + i * 125, margin, 115, 70, 10, 10, {fill: '#C0C0C0'} ) );
      thisNode.addChild( this.answerRects[i] );
    }

    //My matches string
    thisNode.addChild( new Text( myMatchesString, { font: new PhetFont( { size: 14, weight: 'bold'} ), x: 15, y: 100  } ) );

    //right buttons, reset and toLevelSelection
    var backButton = new BackButton( {listener: function() {model.currentLevel = 0;}, y: 120, left: margin} );
    thisNode.addChild( backButton );

    var refreshButton = new RefreshButton( {
      listener: function() {
        model.levels[model.currentLevel - 1].reset();
        thisNode.levelNodes[model.currentLevel - 1].generateNewLevel();
      },
      y: backButton.bottom + 8, left: margin} );
    thisNode.addChild( refreshButton );

    //scales
    var scalesMarginFromCenter = 150;
    this.scales = [];
    var scalePositionY = 222;
    this.scales[0] = new Image( scaleImage, {centerX: model.width / 2 - scalesMarginFromCenter, y: scalePositionY, scale: 0.33} );
    this.scales[1] = new Image( scaleImage, {centerX: model.width / 2 + scalesMarginFromCenter, y: scalePositionY, scale: 0.33} );
    thisNode.addChild( this.scales[0] );
    thisNode.addChild( this.scales[1] );

    //source rectangles
    this.sourceRectangles = [];
    for ( i = 0; i < 6; i++ ) {
      for ( j = 0; j < 2; j++ ) {
        this.sourceRectangles.push( new Rectangle( 85 + i * 96, 315 + j * 90, 96, 90, 0, 0, { stroke: '#C0C0C0', lineWidth: 1} ) );
        thisNode.addChild( this.sourceRectangles[this.sourceRectangles.length - 1] );
      }
    }

    this.levelNodes = [];

    model.currentLevelProperty.link( function( newLevel ) {
      if ( newLevel > 0 ) {
        //generate each node levelNode on demand, to make loading faster
        if ( !thisNode.levelNodes[newLevel - 1] ) {
          thisNode.levelNodes[newLevel - 1] = new LevelNode( model.levels[newLevel - 1], thisNode, layoutBounds, thisNode.model );
        }

        //if we keep it in memory - append to dom
        if ( !thisNode.levelNodes[newLevel - 1].getParent() ) {
          thisNode.addChild( thisNode.levelNodes[newLevel - 1] );
        }

        //if shapes not drawn, draw shapes then show level. Made this to not generate all levels at once as it freeze simulation for 1-2 seconds
        if ( !model.levels[newLevel - 1].shapes[0].view ) {
          thisNode.levelNodes[newLevel - 1 ].generateNewLevel();
        }

      }
    } );


  }

  return inherit( Node, LevelsContainerNode );
} );
