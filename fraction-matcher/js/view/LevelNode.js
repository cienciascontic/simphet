// Copyright 2002-2014, University of Colorado Boulder

/**
 * Contains all nodes for single level. Shapes, strings, buttons.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var cheerAudio = require( 'audio!VEGAS/cheer' );
  var Sound = require( 'VIBE/Sound' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ShapeNode = require( 'FRACTION_MATCHER/shapes/ShapeNode' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var ComparisonChartNode = require( 'FRACTION_MATCHER/view/ComparisonChartNode' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var platform = require( 'PHET_CORE/platform' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var NumericShape = require( 'FRACTION_MATCHER/shapes/NumericShape' );

  // strings
  var equallyAnswerSymbolString = require( 'string!FRACTION_MATCHER/equallyAnswerSymbol' );
  var buttonCheckString = require( 'string!FRACTION_MATCHER/buttonCheck' );
  var buttonOkString = require( 'string!FRACTION_MATCHER/buttonOk' );
  var buttonTryAgainString = require( 'string!FRACTION_MATCHER/buttonTryAgain' );
  var patternLevelString = require( 'string!FRACTION_MATCHER/patternLevel' );
  var patternScoreString = require( 'string!FRACTION_MATCHER/patternScore' );
  var patternTimeString = require( 'string!FRACTION_MATCHER/time.pattern' );
  var buttonShowAnswerString = require( 'string!FRACTION_MATCHER/buttonShowAnswer' );

  //Toggle this to true to make the rewards show after any shape comparison, for debugging
  var debugRewards = false;

  // audio
  var cheerSound = new Sound( cheerAudio );

  /**
   *
   * @param {LevelModel} model
   * @param levelsContainer
   * @param layoutBounds
   * @param {Events} stepSource used for animating the RewardNode
   * @param options
   * @constructor
   */
  function LevelNode( model, levelsContainer, layoutBounds, stepSource, options ) {
    var margin = 15;
    var thisNode = this;
    this.stepSource = stepSource;
    Node.call( this );

    this.levelsContainer = levelsContainer;
    this.model = model;

    //drawing labels at the right
    var levelLabel = new Text( StringUtils.format( patternLevelString, model.levelNumber ), { font: new PhetFont( { size: 12, weight: 'bold'} )} );
    var scoreLabel = new Text( StringUtils.format( patternScoreString, 0 ), { font: new PhetFont( { size: 12, weight: 'bold'} )} );
    var timeLabel = new Text( StringUtils.format( patternScoreString, 0 ), { font: new PhetFont( { size: 12, weight: 'bold'} )} );
    var vBox = new VBox( {
      children: [levelLabel, scoreLabel, timeLabel],
      spacing: 5,
      y: 90,
      right: model.gameModel.width - margin,
      align: 'right'
    } );
    thisNode.addChild( vBox );

    //drawing smile
    var smile = new FaceWithPointsNode( {
      spacing: 6,
      pointsAlignment: 'rightCenter',
      faceDiameter: 100,
      pointsFont: new PhetFont( { size: 20, weight: 'bold' } ),
      centerX: layoutBounds.right - 105,
      centerY: 205
    } );
    thisNode.addChild( smile );

    //drawing left part buttons: check, ok, tryAgain, showAnswer
    var commonButtonStyle = {
      font: new PhetFont( { size: 18, weight: 'bold'} ),
      centerX: smile.centerX,
      centerY: smile.bottom + 27
    };

    var buttonCheck = new TextPushButton(
      buttonCheckString,
      _.extend( commonButtonStyle, {
        baseColor: '#FFD63F',
        listener: function() {model.answerButton( 'check' );}
      } ) );
    thisNode.addChild( buttonCheck );

    var buttonOk = new TextPushButton(
      buttonOkString,
      _.extend( commonButtonStyle, {
        baseColor: '#44FF44',
        listener: function() {
          model.answerButton( 'ok' );
          //animate to answers area and remove listeners
          thisNode.moveShapesOnScalesToAnswer();
        }
      } ) );
    thisNode.addChild( buttonOk );

    var buttonTryAgain = new TextPushButton(
      buttonTryAgainString,
      _.extend( commonButtonStyle, {
        baseColor: '#FF7C3B',
        listener: function() {
          model.answerButton( 'tryAgain' );
        }
      } ) );
    thisNode.addChild( buttonTryAgain );

    var buttonShowAnswer = new TextPushButton(
      buttonShowAnswerString,
      _.extend( commonButtonStyle, {
        baseColor: '#FF7C3B',
        listener: function() {
          model.answerButton( 'showAnswer' );
          thisNode.showCorrectAnswer();
        }
      } ) );
    thisNode.addChild( buttonShowAnswer );

    //drawing comparisonChart
    this.comparisonChart = new ComparisonChartNode( model.gameModel, {centerX: model.gameModel.width / 2, y: 250} );
    thisNode.addChild( this.comparisonChart );

    //equal signs at the top for six gray answer rectangles
    this.equallyAnswerSymbol = [];
    this.levelsContainer.answerRects.forEach( function( answerRect, i ) {
      thisNode.equallyAnswerSymbol[i] = new Text( equallyAnswerSymbolString, { font: new PhetFont( { size: 22, _weight: 'bold'} ), center: answerRect.center, visible: false  } );
      thisNode.addChild( thisNode.equallyAnswerSymbol[i] );
    } );

    //drag handler for shapes
    var offsetCursor = {};
    var startDrag = function( event ) {
        if ( model.canDrag ) {
          event.currentTarget.moveToFront();
          offsetCursor = {x: thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x, y: thisNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y};

          //if touch device show shape above the pointer
          if ( platform.mobileSafari || platform.android ) {
            offsetCursor.y += 50;
          }
          model.dropZone[model.shapes[event.currentTarget.indexShape].dropZone] = -1;
          if ( model.lastChangedZone === model.shapes[event.currentTarget.indexShape].dropZone ) {
            model.lastChangedZone = -1;
          }
        }
      },
      moveDrag = function( event ) {
        if ( model.canDrag ) {
          event.currentTarget.x = thisNode.globalToParentPoint( event.pointer.point ).x - offsetCursor.x;
          event.currentTarget.y = thisNode.globalToParentPoint( event.pointer.point ).y - offsetCursor.y;
        }
      },
      endDrag = function( event ) {
        if ( model.canDrag ) {
          var zone = thisNode.getClosestDropZone( event.currentTarget.center, true );
          if ( zone >= 12 && model.dropZone[zone] >= 0 ) { //if scale and scale not empty
            var zone2 = thisNode.getClosestDropZone( model.shapes[model.dropZone[zone]].view.center, false ); //get free zone, not scale
            thisNode.dropShapeToZone( model.shapes[model.dropZone[zone]], zone2 );
          }
          if ( zone === 12 || zone === 13 ) {
            model.lastChangedZone = zone;
          }
          thisNode.dropShapeToZone( model.shapes[event.currentTarget.indexShape], zone );
          if ( model.buttonStatus === 'check' || model.buttonStatus === 'none' ) {
            if ( model.dropZone[12] >= 0 && model.dropZone[13] >= 0 && (model.dropZone[12] !== model.lastPair[0] || model.dropZone[13] !== model.lastPair[1]) ) {
              model.buttonStatus = 'check';
            }
            else {
              model.buttonStatus = 'none';
            }
          }
        }
      },
      dragParamers = {
        allowTouchSnag: true,
        start: startDrag,
        drag: moveDrag,
        end: endDrag,
        dragCursor: null
      };

    //container for all shapes on the screen
    var shapeNode = new Node();
    thisNode.addChild( shapeNode );

    //drawing new level shapes, placing them and adding drag handler
    this.generateNewLevel = function() {
      var i, singleShapeModel;
      shapeNode.removeAllChildren();

      for ( i = 0; i < model.shapes.length; i++ ) {
        singleShapeModel = model.shapes[i];
        //new shapeView
        if ( singleShapeModel.view === undefined ) {
          singleShapeModel.view = ShapeNode.create( singleShapeModel );
          singleShapeModel.view.cursor = 'pointer';
          //handler for new single shape
          singleShapeModel.view.addInputListener( new SimpleDragHandler( dragParamers ) );
          singleShapeModel.view.indexShape = i;
        }
        //add to container
        shapeNode.addChild( singleShapeModel.view );
        //placing at the correct position (dropZone)
        if ( singleShapeModel.dropZone >= 0 ) {
          singleShapeModel.view.center = thisNode.getShapeDropPosition( singleShapeModel.dropZone );
          thisNode.model.dropZone[singleShapeModel.dropZone] = singleShapeModel.view.indexShape;
        }
      }

      //hiding equal signs at the answer zone
      for ( var j = 0; j < model.gameModel.MAXIMUM_PAIRS; j++ ) {
        thisNode.equallyAnswerSymbol[j].setVisible( false );
      }
      if ( this.levelCompletedNodeContainer !== null ) {
        this.levelCompletedNodeContainer.detach();
        this.levelCompletedNodeContainer = null;
      }
    };

    //show correct button depending on the previous actions
    model.buttonStatusProperty.link( function updateButtonStatus( value ) {
      buttonOk.setVisible( value === 'ok' );
      buttonCheck.setVisible( value === 'check' );
      buttonTryAgain.setVisible( value === 'tryAgain' );
      buttonShowAnswer.setVisible( value === 'showAnswer' );
      if ( model.buttonStatus === 'ok' ) {
        smile.setPoints( model.stepScore );
        smile.visible = model.stepScore > 0;
      }
      else {
        smile.setPoints( 0 );
        smile.visible = false;
      }
      if ( model.buttonStatus !== 'none' ) {
        thisNode.comparisonChart.reset();
        if ( model.buttonStatus !== 'check' ) {
          thisNode.comparisonChart.compare( model.shapes[model.dropZone[12]], model.shapes[model.dropZone[13]] );
        }
      }
      else {
        thisNode.comparisonChart.hide();
      }
    } );

    //adjustion timer position if necessary
    model.gameModel.isTimerProperty.link( function( isTimer ) {
      timeLabel.visible = isTimer;
      vBox.right = model.gameModel.width - margin;
    } );

    //update timer
    model.timeProperty.link( function( newTime ) {
      timeLabel.text = StringUtils.format( patternTimeString, Util.toFixed( newTime, 0 ) );
      vBox.right = model.gameModel.width - margin;
    } );

    //update score
    model.scoreProperty.link( function( newScore ) {
      scoreLabel.text = StringUtils.format( patternScoreString, newScore );
      vBox.right = model.gameModel.width - margin;
    } );

    model.canDragProperty.lazyLink( function( canDrag ) {
      var cursor = canDrag ? 'pointer' : 'default';
      model.shapes.forEach( function( shape ) {
        shape.view.cursor = cursor;
      } );
    } );

    this.levelCompletedNodeContainer = null;
    this.mutate( options );
  }

  return inherit( Node, LevelNode, {
      //get Vector2(x,y) - position in dropZones rect at the bottom
      getShapeDropPosition: function( position ) {
        //inside dropZones at the bottom
        if ( position < this.model.gameModel.MAXIMUM_PAIRS * 2 ) {
          return this.levelsContainer.sourceRectangles[position].center;
        }
        else {
          //one of two scales
          var scale = this.levelsContainer.scales[position - this.model.gameModel.MAXIMUM_PAIRS * 2];
          return new Vector2( scale.centerX, scale.top + 6 );
        }
      },
      //get Vector2(x,y) - position in answer gray rect at the top
      getShapeAnswerPosition: function( position ) {
        var targetRect = this.levelsContainer.answerRects[Math.floor( position / 2 )];
        var diff = (position % 2 === 0) ? -targetRect.width / 4 : targetRect.width / 4;
        return new Vector2( targetRect.centerX + diff, targetRect.centerY );
      },
      //get closest dropZone for shape when drag ends
      getClosestDropZone: function( coord, canDropOnScale ) {
        var closestZone = -1,
          min = 1e10;
        for ( var i = 0; i < this.model.dropZone.length; i++ ) {
          //if empty or one of two scales and canDropOnScale
          if ( this.model.dropZone[i] < 0 || (canDropOnScale && (i === 12 || i === 13)) ) {
            var dist = coord.distanceSquared( this.getShapeDropPosition( i ) );
            if ( min > dist ) {
              min = dist;
              closestZone = i;
            }
          }
        }
        return closestZone;
      },
      //animation for 'snapping' shape to correct position
      dropShapeToZone: function( shape, zoneIndex ) {
        //target dropZone now = indexShape
        this.model.dropZone[zoneIndex] = shape.view.indexShape;
        shape.dropZone = zoneIndex;
        var targetPosition = this.getShapeDropPosition( zoneIndex );
        if ( zoneIndex > this.model.gameModel.MAXIMUM_PAIRS * 2 - 1 ) {
          targetPosition.y -= shape.view.height / 2 - 13; //adjust position on scales

          //Adjust numeric mixed fractions down a bit because they are too high by default.  See https://github.com/phetsims/fraction-matcher/issues/46
          if ( shape.view instanceof NumericShape && shape.numerator / shape.denominator > 1 ) {
            targetPosition.y += 11;
          }
          else if ( shape.view instanceof NumericShape ) {
            targetPosition.y += 7;
          }
        }
        shape.view.moveToFront();
        new TWEEN.Tween( shape.view ).easing( TWEEN.Easing.Cubic.InOut ).to( { centerX: targetPosition.x, centerY: targetPosition.y }, this.model.gameModel.ANIMATION_TIME ).start();
      },
      //move correct shape to scales
      showCorrectAnswer: function() {
        var thisNode = this;
        //the unchanged shape on scale
        var correctShape = this.model.shapes[this.model.dropZone[this.model.lastChangedZone === 12 ? 13 : 12]];
        var secondCorrectShape;
        for ( var i = 0; i < this.model.dropZone.length; i++ ) {
          if ( this.model.dropZone[i] !== -1 && thisNode.model.isShapesEqual( correctShape, this.model.shapes[this.model.dropZone[i]] ) ) {
            secondCorrectShape = this.model.shapes[this.model.dropZone[i]];
            break;
          }
        }
        var lastShapeOnScale = this.model.shapes[this.model.dropZone[this.model.lastChangedZone]];
        this.model.dropZone[secondCorrectShape.dropZone] = -1;
        this.dropShapeToZone( secondCorrectShape, this.model.lastChangedZone );
        this.dropShapeToZone( lastShapeOnScale, this.getClosestDropZone( lastShapeOnScale.view.center, false ) );
        secondCorrectShape.view.moveToFront();
        thisNode.comparisonChart.compare( thisNode.model.shapes[thisNode.model.dropZone[12]], thisNode.model.shapes[thisNode.model.dropZone[13]] );
      },
      //move shapes from scales to answer zone and disable them
      moveShapesOnScalesToAnswer: function() {
        var thisNode = this;
        thisNode.equallyAnswerSymbol[thisNode.model.answers.length / 2].setVisible( true );
        [0, 1].forEach( function( i ) {
          var shape = thisNode.model.shapes[thisNode.model.dropZone[thisNode.model.gameModel.MAXIMUM_PAIRS * 2 + i]];
          var newPosition = thisNode.getShapeAnswerPosition( thisNode.model.answers.length );
          var initialScale = shape.view.matrix.scaleVector.x;
          var targetScale = initialScale / 2;
          var linearFunction = new LinearFunction( 0, 1, initialScale, targetScale );
          new TWEEN.Tween( shape.view ).easing( TWEEN.Easing.Cubic.InOut ).to( { scale: 0.5, centerX: newPosition.x, centerY: newPosition.y }, thisNode.model.gameModel.ANIMATION_TIME ).onUpdate( function( step ) {
            var scale = linearFunction( step );
            shape.view.setScaleMagnitude( scale, scale );
          } ).start();
          thisNode.model.answers.push( thisNode.model.dropZone[thisNode.model.gameModel.MAXIMUM_PAIRS * 2 + i] );
          thisNode.model.dropZone[thisNode.model.gameModel.MAXIMUM_PAIRS * 2 + i] = -1;
          shape.view.removeInputListener( shape.view.getInputListeners()[0] );
        } );
        if ( this.model.answers.length === this.model.gameModel.MAXIMUM_PAIRS * 2 || debugRewards ) {

          var levelNode = this;
          var completedTime = this.model.time;
          var lastBestForThisLevel = this.model.gameModel.bestTimes[this.model.levelNumber - 1].get();
          var newBestTime = false;
          if ( this.model.score === 12 && (lastBestForThisLevel === null || completedTime < lastBestForThisLevel) ) {
            newBestTime = true;
            this.model.gameModel.bestTimes[this.model.levelNumber - 1].set( completedTime );
          }

          //If a perfect score, show the reward node
          if ( this.model.score === 12 || debugRewards ) {

            //Play the "cheer" sound for a perfect score
            cheerSound.play();

            //If there was already a reward node, get rid of it before creating the new one.
            this.rewardNode && this.rewardNode.detach();

            //Use the shapes from the level in the RewardNode
            var rewardNodes = this.model.shapes.map( function( shape ) {return shape.view;} );

            //Set the scale for each node to be the same, since some may not have animated to the "my matches" boxes yet, and may be a different size
            var scale = 0.9;
            for ( var i = 0; i < rewardNodes.length; i++ ) {
              rewardNodes[i].previousScale = rewardNodes[i].getScaleVector();
              rewardNodes[i].setScaleMagnitude( scale * scale );
            }

            //Create and attach the new Reward Node

            var face = new FaceNode( 40, {headStroke: 'black', headLineWidth: 1.5} );
            var star = new StarNode();
            rewardNodes = RewardNode.createRandomNodes( rewardNodes, 100 ).concat( _.times( 6, _.constant( face ) ), _.times( 6, _.constant( star ) ) );
            this.rewardNode = new RewardNode( {
              stepSource: this.stepSource,
              nodes: rewardNodes
            } );
            this.addChild( this.rewardNode );

            // Restore the sizes of the nodes after toImage completed
            for ( i = 0; i < rewardNodes.length; i++ ) {
              if ( rewardNodes[i].previousScale ) {
                rewardNodes[i].setScaleMagnitude( rewardNodes[i].previousScale.x, rewardNodes[i].previousScale.y );
              }
            }
          }

          //Show the level completed dialog which shows scores, etc.
          this.levelCompletedNodeContainer = new Node( {children: [

            //Prevent the user from pressing anything other than the "continue" button
            new Plane( {fill: 'black', opacity: 0, pickable: true} ),

            //Show the dialog with scores
            new LevelCompletedNode( this.model.levelNumber - 1, this.model.score, 12, 3, this.model.gameModel.isTimer, completedTime, lastBestForThisLevel, newBestTime,
              function() {
                var model = levelNode.model;
                model.gameModel.highScores[model.levelNumber - 1].set( Math.max( model.gameModel.highScores[model.levelNumber - 1].get(), model.score ) );
                model.gameModel.currentLevel = 0;
                model.reset();
                levelNode.generateNewLevel();
                levelNode.rewardNode.stop();

                //TODO: only detach after animation transition away complete?
                levelNode.rewardNode.detach();
                levelNode.rewardNode = null;
              }, {
                centerX: this.model.gameModel.width / 2,
                centerY: this.model.gameModel.height / 2
              } )
          ]} );
          this.addChild( this.levelCompletedNodeContainer );
        }
      }
    }
  );
} );