// Copyright 2002-2014, University of Colorado Boulder

/**
 * Object for actual element properties (symbol, radius, etc.)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function() {
  'use strict';
  
  var Element = function( symbol, radius, electronegativity, atomicWeight, color ) {
    this.symbol = symbol;
    this.radius = radius;
    this.electronegativity = electronegativity;
    this.atomicWeight = atomicWeight;
    this.color = color;
  };

  Element.prototype = {
    constructor: Element,

    isSameElement: function( element ) {
      return element.symbol === this.symbol;
    },

    isHydrogen: function() {
      return this.isSameElement( Element.H );
    },

    isCarbon: function() {
      return this.isSameElement( Element.C );
    },

    isOxygen: function() {
      return this.isSameElement( Element.O );
    },

    toString: function() {
      return this.symbol;
    }
  };

  Element.B = new Element( 'B', 85, 2.04, 10.811, 'rgb(255,170,119)' ); // peach/salmon colored, CPK coloring
  Element.Be = new Element( 'Be', 105, 1.57, 9.012182, '#c2ff00' ); // beryllium
  Element.Br = new Element( 'Br', 114, 2.96, 79.904, 'rgb(190,30,20)' ); // brown
  Element.C = new Element( 'C', 77, 2.55, 12.0107, 'rgb(178,178,178)' );
  Element.Cl = new Element( 'Cl', 100, 3.16, 35.4527, 'rgb(153,242,57)' );
  Element.F = new Element( 'F', 72, 3.98, 18.9984032, 'rgb(247,255,74)' );
  Element.H = new Element( 'H', 37, 2.20, 1.00794, '#ffffff' );
  Element.I = new Element( 'I', 133, 2.66, 126.90447, '#940094' ); // dark violet, CPK coloring
  Element.N = new Element( 'N', 75, 3.04, 14.00674, '#0000ff' );
  Element.O = new Element( 'O', 73, 3.44, 15.9994, 'rgb(255,85,0)' );
  Element.P = new Element( 'P', 110, 2.19, 30.973762, 'rgb(255,128,0)' );
  Element.S = new Element( 'S', 103, 2.58, 32.066, 'rgb(212,181,59)' );
  Element.Si = new Element( 'Si', 118, 1.90, 28.0855, 'rgb(240,200,160)' ); // tan, Jmol coloring listed from https://secure.wikimedia.org/wikipedia/en/wiki/CPK_coloring
  Element.Sn = new Element( 'Sn', 145, 1.96, 118.710, '#668080' ); // tin
  Element.Xe = new Element( 'Xe', 108, 2.60, 131.293, '#429eb0' ); // radius is based on calculated (not empirical) data

  Element.elements = [
    Element.B, Element.Be, Element.Br, Element.C, Element.Cl, Element.F, Element.H,
    Element.I, Element.N, Element.O, Element.P, Element.S, Element.Si, Element.Xe
  ];
  
  // maps symbol => element
  Element.elementMap = {};
  _.each( Element.elements, function( element ) {
    Element.elementMap[element.symbol] = element;
  } );

  Element.getElementBySymbol = function( symbol ) {
    assert && assert( Element.elementMap[symbol], 'Element not found: ' + symbol );
    return Element.elementMap[symbol];
  };
  
  return Element;
} );
