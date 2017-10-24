// Copyright 2002-2014, University of Colorado Boulder

/**
 * Miscellaneous chemistry functions.
 */
define( function() {
  'use strict';

  function ChemUtils() {}
  
  /*
   * Creates a symbol (HTML fragment) based on the list of atoms in the molecule.
   * The atoms must be specified in order of appearance in the symbol.
   * Examples:
   *    [C,C,H,H,H,H] becomes "C<sub>2</sub>H<sub>4</sub>"
   *    [H,H,O] becomes "H<sub>2</sub>O"
   */
  ChemUtils.createSymbol = function( elements ) {
    return ChemUtils.toSubscript( ChemUtils.createSymbolWithoutSubscripts( elements ) );
  };
  
  /*
   * Creates a symbol (text) based on the list of atoms in the molecule.
   * The atoms must be specified in order of appearance in the symbol.
   * Examples:
   *    [C,C,H,H,H,H] becomes "C2H4"
   *    [H,H,O] becomes "H2O"
   */
  ChemUtils.createSymbolWithoutSubscripts = function( elements ) {
    var result = '';
    var atomCount = 1;
    var length = elements.length;
    for ( var i = 0; i < length; i++ ) {
      if ( i === 0 ) {
        // first atom is treated differently
        result += elements[i].symbol;
      } else if ( elements[i] === elements[i - 1] ) {
        // this atom is the same as the previous atom
        atomCount++;
      } else {
        // this atom is NOT the same
        if ( atomCount > 1 ) {
          // create a subscript
          result += atomCount;
        }
        atomCount = 1;
        result += elements[i].symbol;
      }
    }
    if ( atomCount > 1 ) {
      // create a subscript for the final atom
      result += atomCount;
    }
    return result;
  };
  
  /**
   * Return an integer that can be used for sorting atom symbols alphabetically. Lower values will be returned for
   * symbols that should go first. Two-letter symbols will come after a one-letter symbol with the same first
   * character (Br after B). See http://en.wikipedia.org/wiki/Hill_system, for without carbon
   *
   * @param {Element} element An element
   * @return {Number} Value for sorting
   */
  ChemUtils.nonCarbonHillSortValue = function( element ) {
    // TODO: if it's a performance issue, we should put these in Element itself
    // yes, will totally fail if our Unicode code point of the 2nd character is >1000. Agile coding? We like to live on the edge
    var value = 1000 * element.symbol.charCodeAt( 0 );
    if ( element.symbol.length > 1 ) {
      value += element.symbol.charCodeAt( 1 );
    }
    return value;
  };
  
  /**
   * Returns an integer that can be used for sorting atom symbols for the Hill system when the molecule contains
   * carbon. See http://en.wikipedia.org/wiki/Hill_system
   *
   * @param {Element} element An element
   * @return {Number} Value for sorting (lowest is first)
   */
  ChemUtils.carbonHillSortValue = function( element ) {
    // TODO: if it's a performance issue, we should put these in Element itself
    if ( element.isCarbon() ) {
      return 0;
    } else if ( element.isHydrogen() ) {
      return 1;
    } else {
      return ChemUtils.nonCarbonHillSortValue( element );
    }
  };

  /**
   * Handles HTML subscript formatting for molecule symbols.
   * All numbers in a string are assumed to be part of a subscript, and will be enclosed in a <sub> tag.
   * For example, 'C2H4' becomes 'C<sub>2</sub>H<sub>4</sub>'.
   * @param {String} inString the input plaintext string
   * @return {String} HTML fragment
   */
  ChemUtils.toSubscript = function( inString ) {
    var outString = '';
    var sub = false; // are we in a <sub> tag?
    var isDigit = function( c ) {
      return ( c >= '0' && c <= '9');
    };
    for ( var i = 0; i < inString.length; i++ ) {
      var c = inString.charAt( i );
      if ( !sub && isDigit( c ) ) {
        // start the subscript tag when a digit is found
        outString += '<sub>';
        sub = true;
      }
      else if ( sub && !isDigit( c ) ) {
        // end the subscript tag when a non-digit is found
        outString += '</sub>';
        sub = false;
      }
      outString += c;
    }
    // end the subscript tag if inString ends with a digit
    if ( sub ) {
      outString += '</sub>';
      sub = false;
    }
    return outString;
  };
  
  /**
   * @param atoms A collection of atoms in a molecule. NOTE: in Java, they were Element objects! 
   * @return The molecular formula of the molecule in the Hill system. Returned as an HTML fragment. See
   *         http://en.wikipedia.org/wiki/Hill_system for more information.
   */
  ChemUtils.hillOrderedSymbol = function( atoms ) {
    var containsCarbon = _.some( atoms, function( atom ) { return atom.isCarbon(); } );
    var sortedAtoms = _.sortBy( atoms, containsCarbon ?
                                       ChemUtils.carbonHillSortValue :  // carbon first, then hydrogen, then others alphabetically
                                       ChemUtils.nonCarbonHillSortValue // compare alphabetically since there is no carbon
                                       );
    return ChemUtils.createSymbol( sortedAtoms );
  };

  return ChemUtils;
} );
