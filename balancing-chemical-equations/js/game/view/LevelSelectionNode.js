// Copyright 2002-2014, University of Colorado Boulder

/**
 * Controls for selecting a level and adjusting various game settings (sound, timer, ...)
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // images, ordered by level
  var levelImagesConstructors = [
    MoleculeFactory.HCl().nodeConstructor,
    MoleculeFactory.H2O().nodeConstructor,
    MoleculeFactory.NH3().nodeConstructor
  ];

  // strings
  var chooseYourLevelString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/chooseYourLevel' );
  var pattern_0level = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0level' );

  // constants
  var BUTTON_MARGIN = 20;

  // Creates a level selection button
  var createLevelSelectionButton = function( level, model ) {

    // 'Level N' centered above icon
    var label = new Text( StringUtils.format( pattern_0level, level + 1 ), { font: new PhetFont( 14 ), fontWeight: 'bold' } );
    var image = new levelImagesConstructors[level]( _.extend( { centerX: label.centerX, top: label.bottom + 20, scale: 2 }, BCEConstants.ATOM_OPTIONS ) );
    var icon = new VBox( { children: [ label, image ], spacing: 10 } );

    return new LevelSelectionButton(
      icon,
      model.getNumberOfEquations( level ),
      function() {
        model.level = level;
        model.state = model.states.START_GAME;
      },
      model.bestScores[ level ],
      model.getPerfectScore( level ),
      {
        baseColor: '#d9ebff',
        buttonWidth: 155,
        buttonHeight: 155
      } );
  };

  /**
   * @param {GameModel} model
   * @param {PropertySet} viewProperties
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionNode( model, viewProperties, layoutBounds, options ) {

    Node.call( this );

    // buttons
    var buttons = [];
    for ( var level = model.LEVELS_RANGE.min; level <= model.LEVELS_RANGE.max; level++ ) {
      buttons.push( createLevelSelectionButton( level, model ) );
    }
    var buttonsParent = new HBox( {
      children: buttons,
      spacing: 50,
      resize: false,
      center: layoutBounds.center
    } );
    this.addChild( buttonsParent );

    // title
    var title = new Text( chooseYourLevelString, {
      font: new PhetFont( 36 ),
      centerX: layoutBounds.centerX,
      centerY: buttonsParent.top / 2
    } );
    this.addChild( title );

    // Timer and Sound controls, lower left
    var toggleOptions = { stroke: 'black', cornerRadius: 10 };
    var soundToggleButton = new SoundToggleButton( viewProperties.soundEnabledProperty, _.extend( toggleOptions, {x: BUTTON_MARGIN, bottom: layoutBounds.bottom - BUTTON_MARGIN} ) );
    this.addChild( soundToggleButton );
    var timerToggleButton = new TimerToggleButton( viewProperties.timerEnabledProperty, _.extend( toggleOptions, {x: BUTTON_MARGIN, bottom: soundToggleButton.top - BUTTON_MARGIN / 2} ) );
    this.addChild( timerToggleButton );

    // Reset All button, lower right
    var resetButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: layoutBounds.right - BUTTON_MARGIN,
      bottom: layoutBounds.bottom - BUTTON_MARGIN
    } );
    this.addChild( resetButton );

    this.mutate( options );
  }

  return inherit( Node, LevelSelectionNode );
} );

