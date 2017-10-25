// Copyright 2002-2013, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var DEFAULT_RADIUS = 28;

  /*
   * PlayPauseButton constructor
   *
   * @param {Property<Boolean>} runningProperty property that represents whether the sim is paused or not
   * @param {object} options node options
   * @constructor
   */
  function PlayPauseButton( runningProperty, options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS
    }, options );

    // play and pause symbols are sized relative to the radius
    var triangleHeight = options.radius;
    var triangleWidth = options.radius * 0.8;
    var barWidth = options.radius * 0.2;
    var barHeight = triangleHeight;

    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), { fill: 'black' } );
    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } ); };
    var bar1 = bar();
    var bar2 = bar();
    var pausePath = new HBox( {children: [ bar1, bar2], spacing: barWidth } );

    // put the play and pause symbols inside circles so they have the same bounds,
    // otherwise ToggleNode will re-adjust their positions relative to each other
    var playCircle = new Circle( options.radius );
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;
    playCircle.addChild( playPath );

    var pausedCircle = new Circle( options.radius );
    pausePath.centerX = 0;
    pausePath.centerY = 0;
    pausedCircle.addChild( pausePath );

    BooleanRoundToggleButton.call( this, pausedCircle, playCircle, runningProperty, options );
  }

  return inherit( BooleanRoundToggleButton, PlayPauseButton );
} );