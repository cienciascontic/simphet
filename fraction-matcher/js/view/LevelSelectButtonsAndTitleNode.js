// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for a level select buttons in 'Fraction Matcher' sim.
 *
 * @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var ShapeNode = require( 'FRACTION_MATCHER/shapes/ShapeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LevelStartButton = require( 'VEGAS/LevelStartButton' );
  var HomeScreen = require( 'JOIST/HomeScreen' );

  // strings
  var patternLevelString = require( 'string!FRACTION_MATCHER/patternLevel' );
  var mixedNumbersTitleString = require( 'string!FRACTION_MATCHER/mixedNumbersTitle' );
  var mixedNumbersChooseYourLevelString = require( 'string!FRACTION_MATCHER/mixedNumbersChooseYourLevel' );
  var fractionsChooseYourLevelString = require( 'string!FRACTION_MATCHER/fractionsChooseYourLevel' );

  //constants
  var NUM_STARS_ON_BUTTON = 3; //number of stars on StartLevelButton
  var BUTTONS_PER_LINE = 4; //number on buttons in a single row
  var FONT = new PhetFont( { size: 14, weight: 'bold'} );

  function LevelSelectButtonsAndTitleNode( model, options ) {
    var mixedNumber = (model.game === mixedNumbersTitleString);

    var vBoxChildren = [];
    vBoxChildren.push( new Text( mixedNumber ? mixedNumbersChooseYourLevelString : fractionsChooseYourLevelString, {font: new PhetFont( {size: 28, family: HomeScreen.TITLE_FONT_FAMILY} )} ) );

    var START_BUTTON_OPTIONS = {
      buttonWidth: 90,
      buttonHeight: 150,
      backgroundColor: 'rgb( 242, 242, 242)',
      highlightedBackgroundColor: 'rgb( 242, 242, 242)'
    };

    var colors = model.constants.COLORS;
    var shapes = [
      {
        type: 'PIES',
        color: colors.LIGHT_RED
      },
      {
        type: 'HORIZONTAL_BARS',
        color: colors.LIGHT_GREEN
      },
      {
        type: 'VERTICAL_BARS',
        color: colors.LIGHT_BLUE
      },
      {
        type: 'LETTER_L_SHAPES',
        color: colors.ORANGE,
        height: 75
      },
      {
        type: 'POLYGON',
        color: colors.PINK
      },
      {
        type: 'FLOWER',
        color: colors.YELLOW,
        width: 65,
        height: 65
      },
      {
        type: 'RING_OF_HEXAGONS',
        color: colors.LIGHT_PINK
      },
      {
        type: 'NINJA_STAR',
        color: colors.GREEN
      }
    ];

    //inner button view
    var createButtonContent = function( shape, index ) {
      var children = [
        new Text( StringUtils.format( patternLevelString, index + 1 ), { font: FONT, centerX: 0 } ),
        ShapeNode.create( {
          x: 0,
          y: -5,
          type: shape.type,
          numerator: mixedNumber ? index + 2 : index + 1,
          denominator: index + 1,
          value: index + 1,
          fill: shape.color,
          width: shape.width ? shape.width : 60,
          height: shape.height ? shape.height : 60
        } )
      ];
      return new VBox( {children: children, spacing: 20} );
    };

    var hBoxChildren = [];
    shapes.forEach( function( shape, index ) {
      hBoxChildren.push(
        new LevelStartButton(
          createButtonContent( shape, index ),
          NUM_STARS_ON_BUTTON,
          function() {

            //Switch to the selected level, but only if the user was on the level selection screen, see #66
            if ( model.currentLevel === 0 ) {
              model.currentLevel = (index + 1);
            }
          },
          model.highScores[index],
          model.MAX_POINTS_PER_GAME_LEVEL,
          START_BUTTON_OPTIONS ) );

      if ( index % BUTTONS_PER_LINE === BUTTONS_PER_LINE - 1 || index === shapes.length - 1 ) { //end of row
        vBoxChildren.push( new HBox( {resize: false, children: hBoxChildren, spacing: 45} ) );
        hBoxChildren = [];
      }
    } );

    VBox.call( this, _.extend( {resize: false, children: vBoxChildren, spacing: 30}, options ) );
  }

  return inherit( VBox, LevelSelectButtonsAndTitleNode );
} );