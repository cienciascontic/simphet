// Copyright 2002-2013, University of Colorado Boulder
/**
 * Launches a PhET Simulation, after preloading the specified images.
 *
 * @author Sam Reid
 */
define( function() {
  'use strict';

  return {
    /**
     * Launch the Sim by preloading the images and calling the callback.
     *
     * TODO: add an awesome loading screen
     *
     * @param callback the callback function which should create and start the sim, given that the images are loaded
     */
    launch: function( callback ) {

      assert && assert( !window.phetJoistSimLauncher, 'Tried to launch twice' );

      //Signify that the SimLauncher was called, see https://github.com/phetsims/joist/issues/142
      window.phetJoistSimLauncher = true;

      // image elements to remove once we are fully loaded
      var elementsToRemove = [];

      function doneLoadingImages() {
        $( '#splash' ).remove();
        callback();
      }

      // if image dimensions exist, immediately fire the "all images loaded" event
      var loaded = 0;

      //For the images that were written to base64 format using requirejs, make sure they are loaded.
      //img.src = base64 is asynchronous on IE10 and OSX/Safari, so we have to make sure they loaded before returning.
      if ( window.phetImages ) {
        for ( var i = 0; i < window.phetImages.length; i++ ) {
          var phetImage = window.phetImages[i];
          phetImage.onload = function() {
            loaded++;
            if ( loaded === window.phetImages.length ) {
              doneLoadingImages();
            }
          };
        }
      }
      else {
        doneLoadingImages();
      }

      $( window ).load( function() {
        // if images were not loaded immediately, signal the "all images loaded" event

        // we wait for here to remove the images from the DOM, otherwise IE9/10 treat the images as completely blank!
        _.each( elementsToRemove, function( element ) {

          //TODO: Why is this null sometimes?
          if ( element.parentNode ) {
            element.parentNode.removeChild( element );
          }
        } );
      } );
    }};
} );