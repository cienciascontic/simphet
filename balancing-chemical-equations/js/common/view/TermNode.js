// Copyright 2002-2014, University of Colorado

/**
 * A term in the equation, includes the coefficient and symbol.
 * The coefficient may or may not be editable.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  /**
   * @param {DOT.Range} coefficientRange
   * @param {EquationTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function TermNode( coefficientRange, term, options ) {

    options = _.extend( {
      fontSize: 32,
      xSpacing: 4
    }, options );

    // coefficient picker
    var coefficientNode = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
      color: 'rgb(50,50,50)',
      activatedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaExpandX: 30,
      font: new PhetFont( options.fontSize ),
      timerDelay: 400, // ms until the picker starts to fire continuously
      intervalDelay: 200 // ms between value change while firing continuously
    } );

    // symbol, non-subscript part of the symbol is vertically centered on the picker
    var subSupOptions = { font: new PhetFont( options.fontSize ), supScale: 1 };
    var symbolNode = new SubSupText( term.molecule.symbol, subSupOptions );
    symbolNode.left = coefficientNode.right + options.xSpacing;
    symbolNode.centerY = coefficientNode.centerY + ( symbolNode.height - new SubSupText( 'H', subSupOptions ).height )/2;

    options.children = [ coefficientNode, symbolNode ];
    Node.call( this, options );
  }

  return inherit( Node, TermNode );
} );
