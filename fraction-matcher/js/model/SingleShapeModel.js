// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for single shape. Responds for single piece in LevelNode screen, coordinates and view parameters
 *
 * @author Anton Ulyanov, Andrey Zelenkov (Mlearner)
 */
define( function() {
  'use strict';

  /**
   *  @param {String}  type of shape (PIES, HORIZONTAL_BARS, etc)
   *  @param {Fraction} fraction of shape
   *  @param {Number} scaleFactor multiply numerator and denominator by scaleFactor
   *  @param {String} fill color of shape
   *  @param {FillType} fillType of filling piece(SEQUENTIAL, MIXED, etc)
   *  @param {Boolean} toSimplify whether we must show shape in form of 13/5 or 2 3/5
   * */

  function SingleShapeModel( type, fraction, scaleFactor, fill, fillType, toSimplify ) {
    this.x = 0;
    this.y = 0;
    this.type = type;
    this.numerator = fraction.numerator;
    this.denominator = fraction.denominator;
    this.scaleFactor = scaleFactor;
    this.toSimplify = toSimplify;
    this.fill = fill;
    this.fillType = fillType;

    //dropZone - index of rectangle at the bottom in LevelNode where this shape currently placed
    this.dropZone = -1;

    //width and height of view of current shape, required for creating view of shape
    this.width = 60;
    this.height = 60;

    if ( this.numerator / this.denominator > 1 ) {
      this.width = 80;
      this.height = 80;
    }

    this.getValue = function() {
      return fraction.getValue();
    };
  }

  return SingleShapeModel;
} );