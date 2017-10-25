// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that defines a periodic table of the elements.
 */
define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var PeriodicTableCell = require( 'BUILD_AN_ATOM/common/view/PeriodicTableCell' );

  // 2D array that defines the table structure.
  var POPULATED_CELLS = [
    [0, 17],
    [0, 1, 12, 13, 14, 15, 16, 17],
    [0, 1, 12, 13, 14, 15, 16, 17],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  ];

  var CELL_DIMENSION = 25;

  /**
   * Constructor.
   *
   * @param numberAtom - Atom that defines which element is currently highlighted.
   * @param interactiveMax - Atomic number of the heaviest element that should be interactive.
   * @constructor
   */
  function PeriodicTableNode( numberAtom, interactiveMax ) {
    Node.call( this, { renderer: 'svg' } ); // Call super constructor.
    var thisPeriodicTable = this;

    // Add the cells of the table.
    this.cells = [];
    var elementIndex = 1;
    for ( var i = 0; i < POPULATED_CELLS.length; i++ ) {
      var populatedCellsInRow = POPULATED_CELLS[i];
      for ( var j = 0; j < populatedCellsInRow.length; j++ ) {
        var cell = new PeriodicTableCell( elementIndex, CELL_DIMENSION, interactiveMax >= elementIndex, numberAtom );
        cell.translation = new Vector2( populatedCellsInRow[j] * CELL_DIMENSION, i * CELL_DIMENSION );
        this.addChild( cell );
        this.cells.push( cell );
        elementIndex++;
      }
    }

    // Highlight the cell that corresponds to the atom.
    var highlightedCell = null;
    numberAtom.protonCountProperty.link( function( protonCount ) {
      if ( highlightedCell !== null ) {
        highlightedCell.setHighlighted( false );
      }
      if ( protonCount > 0 && protonCount <= thisPeriodicTable.cells.length ) {
        highlightedCell = thisPeriodicTable.cells[protonCount - 1];
        highlightedCell.moveToFront();
        highlightedCell.setHighlighted( true );
      }
    } );
  }

  // Inherit from Node.
  return inherit( Node, PeriodicTableNode );
} );
