// Copyright 2002-2013, University of Colorado Boulder

/**
 * Combo box for choosing a solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern_0name_1pH = require( 'string!PH_SCALE/pattern.0name.1pH' );

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSolute
   * @param {Node} soluteListParent
   * @constructor
   */
  function SoluteComboBox( solutes, selectedSolute, soluteListParent ) {

    // items
    var items = [];
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[i];
      items[i] = createItem( solute );
    }

    ComboBox.call( this, items, selectedSolute, soluteListParent, {
      listPosition: 'below',
      itemYMargin: 12,
      itemHighlightFill: 'rgb(218,255,255)',
      buttonLineWidth: 3,
      buttonCornerRadius: 10
    } );
  }

  /**
   * Creates an item for the combo box.
   * @param solute
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( solute ) {
    var node = new Node();

    // color chip
    var soluteColor = solute.stockColor;
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: soluteColor, stroke: soluteColor.darkerColor() } );

    // label
    var textNode = new Text(
      StringUtils.format( pattern_0name_1pH, solute.name, Util.toFixed( solute.pH, PHScaleConstants.PH_COMBO_BOX_DECIMAL_PLACES ) ),
      { font: new PhetFont( 22 ) } );

    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;
    return ComboBox.createItem( node, solute );
  };

  return inherit( ComboBox, SoluteComboBox );
} );