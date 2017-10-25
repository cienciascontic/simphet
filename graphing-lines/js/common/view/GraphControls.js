// Copyright 2002-2014, University of Colorado Boulder

/**
 * Controls for various features related to the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var GLColors = require( 'GRAPHING_LINES/common/GLColors' );
  var GLFont = require( 'GRAPHING_LINES/common/GLFont' );
  var IconFactory = require( 'GRAPHING_LINES/common/view/IconFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'GRAPHING_LINES/common/model/Line' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var hideLinesString = require( 'string!GRAPHING_LINES/hideLines' );
  var slopeString = require( 'string!GRAPHING_LINES/slope' );
  var symbolXString = require( 'string!GRAPHING_LINES/symbol.x' );
  var symbolYString = require( 'string!GRAPHING_LINES/symbol.y' );

  // constants
  var Y_EQUALS_X = StringUtils.format( '{0} = {1}', symbolYString, symbolXString );  // y = x
  var Y_EQUALS_NEGATIVE_X = StringUtils.format( '{0} = -{1}', symbolYString, symbolXString ); // y = -x

  /**
   * @param {Property<Boolean>} linesVisibleProperty are lines visible on the graph?
   * @param {Property<Boolean>} slopeToolVisibleProperty is the slope tool visible on the graphed interactive line?
   * @param {ObservableArray<Lines>} standardLines standard lines (y = x, y = -x) that are available for viewing
   * @param {Object} [options] should check boxes for standard lines be accessible?
   * @constructor
   */
  function GraphControls( linesVisibleProperty, slopeToolVisibleProperty, standardLines, options ) {

    options = _.extend( {
      includeStandardLines: true // if true, includes visibility controls for 'y = x' and 'y = -x'
    }, options );

    var thisNode = this;

    // private properties for standard-line check boxes
    var notLinesVisibleProperty = new Property( !linesVisibleProperty.get() );
    var yEqualsXVisibleProperty = new Property( standardLines.contains( Line.Y_EQUALS_X_LINE ) );
    var yEqualsNegativeXVisibleProperty = new Property( standardLines.contains( Line.Y_EQUALS_NEGATIVE_X_LINE ) );

    // check boxes
    var TEXT_OPTIONS = { font: new GLFont( 18 ) };
    var ICON_SIZE = 60;
    var hideLinesCheckBox = CheckBox.createTextCheckBox( hideLinesString, TEXT_OPTIONS, notLinesVisibleProperty );
    hideLinesCheckBox.touchArea = hideLinesCheckBox.localBounds.dilatedXY( 15, 10 );
    var positiveCheckBox = CheckBox.createTextCheckBox( Y_EQUALS_X, TEXT_OPTIONS, yEqualsXVisibleProperty,
      { icon: IconFactory.createGraphIcon( ICON_SIZE, GLColors.Y_EQUALS_X, -3, -3, 3, 3 ) } );
    var negativeCheckBox = CheckBox.createTextCheckBox( Y_EQUALS_NEGATIVE_X, TEXT_OPTIONS, yEqualsNegativeXVisibleProperty,
      { icon: IconFactory.createGraphIcon( ICON_SIZE, GLColors.Y_EQUALS_NEGATIVE_X, -3, 3, 3, -3 ) } );
    var slopeCheckBox = CheckBox.createTextCheckBox( slopeString, TEXT_OPTIONS, slopeToolVisibleProperty,
      { icon: IconFactory.createSlopeToolIcon( ICON_SIZE ) } );

    // vertical layout
    var children = [ slopeCheckBox, positiveCheckBox, negativeCheckBox, hideLinesCheckBox ];
    if ( !options.includeStandardLines ) {
      children.splice( children.indexOf( positiveCheckBox ), 1 );
      children.splice( children.indexOf( negativeCheckBox ), 1 );
    }
    var contentNode = new VBox( {
      children: children,
      spacing: 20,
      align: 'left'
    } );

    Panel.call( thisNode, contentNode, {
      fill: GLColors.CONTROL_PANEL_BACKGROUND,
      stroke: 'black',
      lineWidth: 1,
      xMargin: 20,
      yMargin: 15,
      cornerRadius: 10
    } );

    thisNode.mutate( options );

    // when lines are not visible, hide related controls
    linesVisibleProperty.link( function( visible ) {
      notLinesVisibleProperty.set( !visible );
      positiveCheckBox.enabled = visible;
      negativeCheckBox.enabled = visible;
      slopeCheckBox.enabled = visible;
    } );

    notLinesVisibleProperty.link( function( visible ) {
      linesVisibleProperty.set( !visible );
    } );

    var setStandardLineVisible = function( visible, line ) {
      if ( visible && !standardLines.contains( line ) ) {
        standardLines.add( line );
      }
      else if ( !visible && standardLines.contains( line ) ) {
        standardLines.remove( line );
      }
    };

    // Add/remove standard line 'y = x'
    yEqualsXVisibleProperty.link( function( visible ) {
      setStandardLineVisible( visible, Line.Y_EQUALS_X_LINE );
    } );

    // Add/remove standard line 'y = -x'
    yEqualsNegativeXVisibleProperty.link( function( visible ) {
      setStandardLineVisible( visible, Line.Y_EQUALS_NEGATIVE_X_LINE );
    } );

    // Select appropriate check boxes when standard lines are added.
    standardLines.addItemAddedListener( function( line ) {
      if ( line === Line.Y_EQUALS_X_LINE ) {
        yEqualsXVisibleProperty.set( true );
      }
      else if ( line === Line.Y_EQUALS_NEGATIVE_X_LINE ) {
        yEqualsNegativeXVisibleProperty.set( true );
      }
    } );

    // Deselect appropriate check boxes when standard lines are removed.
    standardLines.addItemRemovedListener( function( line ) {
      if ( line === Line.Y_EQUALS_X_LINE ) {
        yEqualsXVisibleProperty.set( false );
      }
      else if ( line === Line.Y_EQUALS_NEGATIVE_X_LINE ) {
        yEqualsNegativeXVisibleProperty.set( false );
      }
    } );
  }

  return inherit( Panel, GraphControls );
} );