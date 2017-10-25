// Copyright 2002-2013, University of Colorado Boulder

/**
 * Problem where the user is presented with a set of counts for protons,
 * neutrons, and electrons, and must find the represented element on a
 * periodic table.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var ParticleCountsNode = require( 'BUILD_AN_ATOM/game/view/ParticleCountsNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ToElementProblemView = require( 'BUILD_AN_ATOM/game/view/ToElementProblemView' );

  /**
   * Main constructor function.
   *
   * @constructor
   */
  function CountsToElementProblemView( countsToElementProblem, layoutBounds ) {
    ToElementProblemView.call( this, countsToElementProblem, layoutBounds ); // Call super constructor.

    // Particle counts
    var particleCountsNode = new ParticleCountsNode( countsToElementProblem.answerAtom );
    this.problemPresentationNode.addChild( particleCountsNode );

    // Layout
    particleCountsNode.centerX = layoutBounds.width * 0.25;
    particleCountsNode.centerY = this.periodicTable.centerY;
  }

  // Inherit from ProblemView.
  return inherit( ToElementProblemView, CountsToElementProblemView );
} );
