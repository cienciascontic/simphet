// Copyright 2002-2013, University of Colorado Boulder

/**
 * Image plugin that loads an image dynamically from the file system at development time, but from base64 content after a build.
 * For development time, this is pretty similar to the image plugin at https://github.com/millermedeiros/requirejs-plugins
 *
 * The plugin code itself is excluded from the build by declaring it as a stubModule.
 *
 * @author Sam Reid
 */
define( [

  //Path is relative to the simulation directory where grunt is run from
  '../../chipper/requirejs-plugins/loadFileAsDataURI',
  '../../chipper/requirejs-plugins/getProjectURL'], function( loadFileAsDataURI, getProjectURL ) {

  //Keep track of the images that are used during dependency resolution so they can be converted to base64 at compile time
  var buildMap = {};

  return {
    load: function( name, parentRequire, onload, config ) {
      var imageName = name.substring( name.lastIndexOf( '/' ) );
      var path = getProjectURL( name, parentRequire ) + 'images' + imageName;

      if ( config.isBuild ) {
        buildMap[name] = path;
        onload( null );
      }
      else {
        var image = document.createElement( 'img' );
        image.onerror = function( error ) {
          console.log( 'failed to load image: ' + path );
          onload.error( error );
        };
        image.onload = function() {
          onload( image );
          delete image.onload;
        };
        image.src = path + '?' + config.urlArgs;
      }
    },

    //write method based on RequireJS official text plugin by James Burke
    //https://github.com/jrburke/requirejs/blob/master/text.js
    write: function( pluginName, moduleName, write ) {
      if ( moduleName in buildMap ) {
        var content = buildMap[moduleName];

        var base64 = loadFileAsDataURI( content );

        //Write code that will load the image and register with a global `phetImages` to make sure everything loaded, see SimLauncher.js
        write( 'define("' + pluginName + '!' + moduleName + '", function(){ ' +
               'var img = new Image();\n' +
               'window.phetImages = window.phetImages || []\n' +
               'window.phetImages.push(img);\n' +
               'img.src=\'' + base64 + '\';\n' +
               'return img;});\n' );
      }
    }

  };
} );
