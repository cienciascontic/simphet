// Copyright 2002-2014, University of Colorado Boulder

/**
 * Object for actual element properties (symbol, radius, etc.)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';
  
  var Element = require( 'NITROGLYCERIN/Element' );
  
  var idCounter = 1;
  
  var Atom = function( element ) {
    this.element = element;
    this.symbol = element.symbol;
    this.radius = element.radius;
    this.diameter = element.radius * 2;
    this.electronegativity = element.electronegativity;
    this.atomicWeight = element.atomicWeight;
    this.color = element.color;
    
    // IDs for uniqueness and fast lookups
    this.reference = (idCounter++).toString( 16 );
    this.id = this.symbol + '_' + this.reference;
  };

  Atom.prototype = {
    constructor: Atom,

    hasSameElement: function( atom ) {
      return this.element.isSameElement( atom.element );
    },

    isHydrogen: function() {
      return this.element.isHydrogen();
    },

    isCarbon: function() {
      return this.element.isCarbon();
    },

    isOxygen: function() {
      return this.element.isOxygen();
    },

    toString: function() {
      return this.symbol;
    }
  };
  
  Atom.createAtomFromSymbol = function( symbol ) {
    return new Atom( Element.getElementBySymbol( symbol ) );
  };
  
  return Atom;
} );
