// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 */
define( function( require ) {
  'use strict';

  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var AtomIdentifier = require( 'BUILD_AN_ATOM/common/AtomIdentifier' );

  var NOMINAL_CELL_DIMENSION = 25;
  var NOMINAL_FONT_SIZE = 14;

  /**
   * Constructor.
   *
   * @param atomicNumber - Atomic number of atom represented by this cell.
   * @param length - Width and height of cell (cells are square).
   * @param interactive - Boolean flag that determines whether cell is interactive.
   * @param numberAtom - Atom that is set if this cell is selected by the user.
   * @constructor
   */
  function PeriodicTableCell( atomicNumber, length, interactive, numberAtom ) {
    Node.call( this ); // Call super constructor.

    this.normalFill = interactive ? new LinearGradient( 0, 0, 0, length ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb( 240, 240, 240 )' ) : 'white';
    this.highlightedFill = 'yellow';

    this.cell = new Rectangle( 0, 0, length, length, 0, 0,
      {
        stroke: 'black',
        lineWidth: 1,
        fill: this.normalFill,
        cursor: interactive ? 'pointer' : null
      } );
    this.label = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
      font: new PhetFont( NOMINAL_FONT_SIZE * ( length / NOMINAL_CELL_DIMENSION ) ),
      center: this.cell.center
    } );
    this.cell.addChild( this.label );
    this.addChild( this.cell );

    // If interactive, add a listener to set the atom when this cell is pressed.
    if ( interactive ) {
      this.cell.addInputListener( {
        up: function() {
          numberAtom.protonCount = atomicNumber;
          numberAtom.neutronCount = AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber );
          numberAtom.electronCount = atomicNumber;
        }
      } );
    }
  }

  // Inherit from Node.
  return inherit( Node, PeriodicTableCell, {
    setHighlighted: function( highLighted ) {
      this.cell.fill = highLighted ? this.highlightedFill : this.normalFill;
      this.cell.stroke = highLighted ? 'red' : 'black';
      this.cell.lineWidth = highLighted ? 2 : 1;
      this.label.fontWeight = highLighted ? 'bold' : 'normal';
    }
  } );
} );
