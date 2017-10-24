// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of the light in the Beer's Law screen.
 * Origin is at the right center, where the light comes out of the 'housing'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var ToggleButton = require( 'BEERS_LAW_LAB/common/view/ToggleButton' );

  // images
  var lightImage = require( 'image!BEERS_LAW_LAB/light.png' );
  var buttonPressedImage = require( 'image!BEERS_LAW_LAB/red_button_pressed.png' );
  var buttonUnpressedImage = require( 'image!BEERS_LAW_LAB/red_button_unpressed.png' );
  var buttonDisabledImage = require( 'image!BEERS_LAW_LAB/red_button_disabled.png' );

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function LightNode( light, modelViewTransform ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var housing = new Image( lightImage, { pickable: false } );
    var button = new ToggleButton( buttonUnpressedImage, buttonPressedImage, buttonDisabledImage, light.on, new Property( true ) );

    // expand touch area for button. Do this before scaling the button!
    button.touchArea = Shape.circle( button.width / 2, button.height / 2, 1.0 * button.width /* radius */ );

    // make the button fit in the housing
    button.setScaleMagnitude( 0.65 * housing.height / button.height );

    // rendering order
    thisNode.addChild( housing );
    thisNode.addChild( button );

    // layout
    housing.x = -housing.width;
    housing.y = -housing.height / 2;
    button.left = housing.right - button.width - 40;
    button.centerY = housing.centerY;

    // position
    var position = modelViewTransform.modelToViewPosition( light.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  return inherit( Node, LightNode );
} );