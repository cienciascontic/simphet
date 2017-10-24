// Copyright 2002-2013, University of Colorado

/**
 * Basic down/up pointer handling for a Node, so that it's easy to handle buttons
 *
 * TODO: test hand handle down, go off screen, up. How to handle that properly?
 * TODO: tests
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';
  
  var scenery = require( 'SCENERY/scenery' );
  require( 'SCENERY/util/Trail' );
  
  /*
   * The 'trail' parameter passed to down/upInside/upOutside will end with the node to which this DownUpListener has been added.
   *
   * Allowed options: {
   *    mouseButton: 0  // The mouse button to use: left: 0, middle: 1, right: 2, see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
   *    down: null      // down( event, trail ) is called when the pointer is pressed down on this node
   *                    // (and another pointer is not already down on it).
   *    up: null        // up( event, trail ) is called after 'down', regardless of the pointer's current location.
   *                    // Additionally, it is called AFTER upInside or upOutside, whichever is relevant
   *    upInside: null  // upInside( event, trail ) is called after 'down', when the pointer is released inside
   *                    // this node (it or a descendant is the top pickable node under the pointer)
   *    upOutside: null // upOutside( event, trail ) is called after 'down', when the pointer is released outside
   *                    // this node (it or a descendant is the not top pickable node under the pointer, even if the
   *                    // same instance is still directly under the pointer)
   * }
   */
  scenery.DownUpListener = function DownUpListener( options ) {
    var handler = this;
    
    this.options = _.extend( {
      mouseButton: 0 // allow a different mouse button 
    }, options );
    this.isDown = false;   // public, whether this listener is down
    this.downCurrentTarget = null; // 'up' is handled via a pointer lister, which will have null currentTarget, so save the 'down' currentTarget
    this.downTrail = null;
    this.pointer = null;
    
    // this listener gets added to the pointer on a 'down'
    this.downListener = {
      // mouse/touch up
      up: function( event ) {
        sceneryEventLog && sceneryEventLog( 'DownUpListener (pointer) up for ' + handler.downTrail.toString() );
        assert && assert( event.pointer === handler.pointer );
        if ( !event.pointer.isMouse || event.domEvent.button === handler.options.mouseButton ) {
          handler.buttonUp( event );
        }
      },
      
      // touch cancel
      cancel: function( event ) {
        sceneryEventLog && sceneryEventLog( 'DownUpListener (pointer) cancel for ' + handler.downTrail.toString() );
        assert && assert( event.pointer === handler.pointer );
        handler.buttonUp( event );
      }
    };
  };
  var DownUpListener = scenery.DownUpListener;
  
  DownUpListener.prototype = {
    constructor: DownUpListener,
    
    buttonDown: function( event ) {
      // already down from another pointer, don't do anything
      if ( this.isDown ) { return; }
      
      // ignore other mouse buttons
      if ( event.pointer.isMouse && event.domEvent.button !== this.options.mouseButton ) { return; }
      
      // add our listener so we catch the up wherever we are
      event.pointer.addInputListener( this.downListener );
      
      this.isDown = true;
      this.downCurrentTarget = event.currentTarget;
      this.downTrail = event.trail.subtrailTo( event.currentTarget, false );
      this.pointer = event.pointer;
      
      sceneryEventLog && sceneryEventLog( 'DownUpListener buttonDown for ' + this.downTrail.toString() ); 
      if ( this.options.down ) {
        this.options.down( event, this.downTrail );
      }
    },
    
    buttonUp: function( event ) {
      this.isDown = false;
      this.pointer.removeInputListener( this.downListener );

      var currentTargetSave = event.currentTarget;
      event.currentTarget = this.downCurrentTarget; // up is handled by a pointer listener, so currentTarget would be null.
      if ( this.options.upInside || this.options.upOutside ) {
        var trailUnderPointer = event.trail;
        
        // TODO: consider changing this so that it just does a hit check and ignores anything in front?
        var isInside = trailUnderPointer.isExtensionOf( this.downTrail, true );
        
        if ( isInside && this.options.upInside ) {
          this.options.upInside( event, this.downTrail );
        } else if ( !isInside && this.options.upOutside ) {
          this.options.upOutside( event, this.downTrail );
        }
      }
      sceneryEventLog && sceneryEventLog( 'DownUpListener buttonUp for ' + this.downTrail.toString() ); 
      if ( this.options.up ) {
        this.options.up( event, this.downTrail );
      }
      event.currentTarget = currentTargetSave; // be polite to other listeners, restore currentTarget
    },
    
    /*---------------------------------------------------------------------------*
    * events called from the node input listener
    *----------------------------------------------------------------------------*/
    
    // mouse/touch down on this node
    down: function( event ) {
      this.buttonDown( event );
    }
  };
  
  return DownUpListener;
} );


