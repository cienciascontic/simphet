var assert = require( 'assert' );
var fs = require( 'fs' );
var child_process = require( 'child_process' );
var info = require( '../../sherpa/info' );
var _ = require( '../../sherpa/lodash-2.4.1.min' );
var checkoutShas = require( '../../chipper/grunt/checkout-shas' );
var pullAll = require( '../../chipper/grunt/pull-all' );
var createSim = require( '../../chipper/grunt/create-sim' );

//Register fs as a global so it can be accessed through the requirejs build system.  Text.js plugin may have a superior way to handle this but I (SR) couldn't get it working after a small amount of effort
global.fs = fs;

/**
 * Grunt configuration file for simulations.
 * Requires a package.json file containing project settings.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jon Olson
 * @author Sam Reid
 * @author John Blanco
 */
module.exports = function( grunt ) {
  function trimWhitespace( str ) {
    return str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
  }

  function padString( str, n ) {
    while ( str.length < n ) {
      str += ' ';
    }
    return str;
  }

  //TODO: This is copied in requirejs-plugins/loadFileAsDataURI and should be deleted from here if we can figure out how to load that one
  function loadFileAsDataURI( filename ) {
    var mimeType = {
      'png': 'image/png',
      'svg': 'image/svg+xml',
      'jpg': 'image/jpeg',
      'cur': 'image/x-icon', // cursor files (used in build-a-molecule). x-win-bitmap gives off warnings in Chrome
      'mp3': 'audio/mpeg',
      'm4a': 'audio/mp4',
      'ogg': 'audio/ogg',
      'oga': 'audio/ogg',
      'bma': 'audio/webm', // webma is the full extension
      'wav': 'audio/wav'
    }[filename.slice( -3 )];
    assert( mimeType, 'Unknown mime type for filename: ' + filename );

    return 'data:' + mimeType + ';base64,' + Buffer( fs.readFileSync( filename ) ).toString( 'base64' );
  }

  function stringReplace( str, substring, replacement ) {
    var idx = str.indexOf( substring );
    if ( str.indexOf( substring ) !== -1 ) {
      return str.slice( 0, idx ) + replacement + str.slice( idx + substring.length );
    }
    else {
      return str;
    }
  }

  assert( fs.existsSync( 'package.json' ), 'We need to be in a sim directory with package.json' );

  var pkg = grunt.file.readJSON( 'package.json' );

  // TODO: eek, this is scary! we are importing from the sim dir. ideally we should just have uglify-js installed once in chipper?
  var uglify = require( '../../' + pkg.name + '/node_modules/uglify-js' );
  var requirejs = require( '../../' + pkg.name + '/node_modules/requirejs' ); // TODO: not currently used, figure out how to include almond correctly?

  var preloadMapFilename = 'preload.js.map';

  // Project configuration.
  grunt.initConfig(
    {
      // Read in the project settings from the package.json file into the pkg property.
      // This allows us to refer to project settings from within this config file.
      pkg: pkg,

      // configure the RequireJS plugin
      requirejs: {

        // builds the minified script
        build: {
          options: {
            almond: true,
            mainConfigFile: 'js/<%= pkg.name %>-config.js',
            out: 'build/<%= pkg.name %>.min.js',
            name: '<%= pkg.name %>-config',

            //Minification strategy.  Put this to none if you want to debug a non-minified but compiled version
            optimize: 'uglify2',
            wrap: true,
//            generateSourceMaps: true, //#42 commented out this line until source maps are fixed
            preserveLicenseComments: false,
            uglify2: {
              output: {
                inline_script: true // escape </script
              },
              compress: {
                global_defs: {
                  // global assertions
                  assert: false,
                  assertSlow: false,
                  // scenery logging
                  sceneryLog: false,
                  sceneryLayerLog: false,
                  sceneryEventLog: false,
                  sceneryAccessibilityLog: false,
                  phetAllocation: false
                },
                dead_code: true
              }
            },

            //stub out the plugins so their source code won't be included in the minified file
            stubModules: ['string', 'audio', 'image']
          }
        }
      },

      // configure the JSHint plugin
      jshint: {
        // source files that are specific to this simulation
        simFiles: [ 'js/**/*.js' ],
        // source files for common-code dependencies.
        // phetLibs is a string of repo names, space separated.
        // split converts the string to an array of repo names.
        // map then converts each repo name to the form '../repo/js/**/*.js'.
        // includes an exclusion for kite/js/parser/svgPath.js, which is auto-generated
        commonFiles: [ _.map( pkg.phetLibs.split( ' ' ), function( repo ) { return '../' + repo + '/js/**/*.js'; } ), '!../kite/js/parser/svgPath.js' ],
        // reference external JSHint options in jshint-options.js
        options: require( './jshint-options' )
      }
    } );

  var clean = function() {
    if ( fs.existsSync( 'build' ) ) {
      grunt.log.writeln( 'Cleaning build directory' );
      grunt.file.delete( 'build' );
    }
    grunt.file.mkdir( 'build' );
  };

  // Default task ('grunt')
  grunt.registerTask( 'default', 'clean, lint and build the English HTML', [ 'generateLicenseInfo', 'lint-sim', 'lint-common', 'clean', 'build' ] );

  // Other tasks ('grunt taskName')
  grunt.registerTask( 'lint-sim', 'lint just the sim\'s js files', [ 'jshint:simFiles' ] );
  grunt.registerTask( 'lint-common', 'lint all of the common js files', [ 'jshint:commonFiles' ] );
  grunt.registerTask( 'lint', 'lint the sim code and the common code', [ 'lint-sim', 'lint-common' ] );
  grunt.registerTask( 'clean', 'Erases the build/ directory and all its contents, and recreates the build/ directory', clean );
  grunt.registerTask( 'build', 'Builds the simulation (without cleaning or linting):\n' +
                               '--all-locales true:\n\tto build HTML for all locales in strings/\n' +
                               '--locales $project:\n\tuse locales inferred from another project\'s strings/ directory\n' +
                               '--locale fr:\n\tto build just the French locale\n' +
                               '[no options]:\n\tto build just the English locale', [ 'generateLicenseInfo', 'simBeforeRequirejs', 'requirejs:build', 'simAfterRequirejs' ] );

  //Build without cleaning, so that files can be added from different tasks for i18n
  grunt.registerTask( 'nolint', 'clean and build but without the lint steps', [ 'generateLicenseInfo', 'clean', 'build' ] );
  grunt.registerTask( 'string', 'After running a build step, provide a report about all of the strings (just for the built locales)', function() {
    var stringMap = grunt.file.readJSON( 'build/' + pkg.name + '_string-map.json' );

    //for each language, say what is missing
    for ( var locale in stringMap ) {
      if ( stringMap.hasOwnProperty( locale ) && locale !== 'en' ) {
        var strings = stringMap[locale];
        var fallback = stringMap['en'];
        var missing = _.omit( fallback, _.keys( strings ) );

        //Print the missing keys and the english values so the translator knows what to provide
        console.log( locale, 'missing\n', JSON.stringify( missing, null, '\t' ) );
      }
    }
  } );

  //Task that clones the dependencies for a project (except for the project itself, chipper and sherpa)
  //See #56
  grunt.registerTask( 'get-dependencies', 'Clone all dependencies of the project, as listed in the package.json phetLibs entry', function() {
    console.log( 'pkg.name', pkg.name );

    var dependencies = _.without( pkg.phetLibs.split( ' ' ), 'sherpa', 'chipper', pkg.name );
    console.log( 'cloning dependencies for', pkg.name, ': ', pkg.phetLibs );
    var numCloned = 0;
    var done = grunt.task.current.async();
    for ( var i = 0; i < dependencies.length; i++ ) {
      var dependency = dependencies[i];
      var command = 'git clone https://github.com/phetsims/' + dependency + '.git';
      console.log( 'executing:', command );
      child_process.exec( command, {cwd: '../'}, function( error1, stdout1, stderr1 ) {
        console.log( stdout1 );
        console.log( stderr1 );
        assert( !error1, "error in " + command );
        console.log( 'Finished checkout.' );
        numCloned++;
        if ( numCloned === dependencies.length ) {
          done();
        }
      } );
    }
  } );

  //Task that creates a list of git clone commands that will check out a simulation and all its depnedencies
  //This can be used by a PhET Developer to create a script to put in a simulation's README.md
  //See #56
  grunt.registerTask( 'list-clone-commands', 'Clone all dependencies of the project, as listed in the package.json phetLibs entry', function() {
    console.log( 'pkg.name', pkg.name );

    var dependencies = pkg.phetLibs.split( ' ' );
    console.log( 'listing git clone commands for', pkg.name, ': ', pkg.phetLibs );
    console.log( 'start script' );
    for ( var i = 0; i < dependencies.length; i++ ) {
      var dependency = dependencies[i];
      var command = 'git clone https://github.com/phetsims/' + dependency + '.git';
      console.log( command );
    }
    console.log( 'end script' );
  } );

  //Look up the locale strings provided in the simulation
  //Requires a form like energy-skate-park-basics_ar_SA, where no _ appear in the sim name
  var getLocalesForDirectory = function( directory ) {
    var stringFiles = fs.readdirSync( directory );
    return stringFiles.map( function( stringFile ) {
      return stringFile.substring( stringFile.indexOf( '_' ) + 1, stringFile.lastIndexOf( '.' ) );
    } );
  };

  //Look up the locale strings provided in the simulation
  //Requires a form like energy-skate-park-basics_ar_SA, where no _ appear in the sim name
  var getLocales = function() { return getLocalesForDirectory( 'strings' ); };

  //Look up which locales should be built, accounting for flags provided by the developer on the command line
  //--all-locales true: to build all of the provided locales
  //--locales beers-law-lab: use locales from another sim's strings directory
  //--locale fr: to build just the french locale
  //[no options] to build just the english locale
  var getLocalesToBuild = function() {
    return grunt.option( 'all-locales' ) ? getLocales() :
           grunt.option( 'locale' ) ? [grunt.option( 'locale' ) ] :
           grunt.option( 'locales' ) ? getLocalesForDirectory( '../' + grunt.option( 'locales' ) + '/strings' ) :
           ['en'];
  };

  var getStringsWithFallbacks = function( locale, global_phet_strings ) {
    var fallbackStrings = global_phet_strings['en'];
    var strings = global_phet_strings[locale];

    //Assuming the strings has all of the right keys, look up fallbacks where the locale did not translate a certain string
    var extended = {};
    for ( var key in strings ) {
      if ( strings.hasOwnProperty( key ) ) {
        extended[key] = strings[key] || fallbackStrings[key];
      }
    }
    return extended;
  };

  //Scoped variable to hold the result from the generateLicenseInfoTask.
  //TODO: A better way to store the return value?
  var licenseText;
  grunt.registerTask( 'generateLicenseInfo', 'Generate the license info', function() {

    //Prepare the license info
    //Run this first so that if something is missing from the license file you will find out before having to wait for jshint/requirejs build
    var licenseInfo = info();

    //Find all dependencies that have 'sherpa' in the path.
    //Please note, this requires all simulations to keep their dependencies in sherpa!
    var sherpaDependencyPaths = _.filter( pkg.preload.split( ' ' ), function( dependency ) { return dependency.indexOf( 'sherpa' ) >= 0; } );

    //Add libraries that are not explicitly included by the sim
    //Note: must have a . character for the parsing below //TODO: Remove this restriction
    sherpaDependencyPaths.push( 'almond-0.2.9.js' );
    sherpaDependencyPaths.push( 'pegjs.' );
    sherpaDependencyPaths.push( 'font-awesome.' );
    sherpaDependencyPaths.push( 'require-i18n.js' );
    sherpaDependencyPaths.push( 'text.js' );
    sherpaDependencyPaths.push( 'base64binary.js' );//TODO: Not all simulations use Vibe

    //Sort by name of the library, have to match cases to sort properly
    var sortedSherpaDependencyPaths = _.sortBy( sherpaDependencyPaths, function( path ) {return path.toUpperCase();} );

    //Map the paths to instances from the info.js file
    var licenses = _.uniq( _.map( sortedSherpaDependencyPaths, function( sherpaDependencyPath ) {
      var lastSlash = sherpaDependencyPath.lastIndexOf( '/' );
      var lastDot = sherpaDependencyPath.lastIndexOf( '.' );
      var dependencyName = sherpaDependencyPath.substring( lastSlash + 1, lastDot );
      //    console.log( 'found dependency: ' + sherpaDependencyPath + ', name = ' + dependencyName );

      //Make sure there is an entry in the info.js file, and return it
      assert( licenseInfo[dependencyName], 'no license entry for ' + dependencyName );
      return licenseInfo[dependencyName];
    } ) );

    //Get the text of each entry
    var separator = '=';

    //TODO: better way to return a value?
    licenseText = _.reduce( licenses, function( memo, license ) {
      var selectedLicenseText = license.selectedLicense ? '> Selected license: ' + license.selectedLicense + '\n' : '';
      return memo + license.text + '\n' +
             selectedLicenseText +
             separator +
             '\n';
    }, separator + '\n' ).trim();

    grunt.log.writeln( 'created license info for ' + licenses.length + ' dependencies' );
  } );

  grunt.registerTask( 'checkout-shas', 'Check out the shas for a project as specified in a dependencies.json file in its top level.  Optional to checkout master branch if you specify --tomaster=true', function() {
    checkoutShas( grunt, child_process, assert, pkg.name );
  } );

  grunt.registerTask( 'pull-all', 'Pull all repo above this directory', function() {
    pullAll( grunt, child_process, assert, pkg.name );
  } );

  //This task updates the last value in the version by one.  For example from 0.0.0-dev.12 to 0.0.0-dev.13
  //This updates the package.json and js/version.js files, and commits + pushes to git.
  //BEWARE: do not run this task unless your git is clean, otherwise it will commit other work on your repo as well
  //TODO: Also, if you embed this task in another, you should make sure the global pkg.version gets updated as well, since this modifies the files but not the pkg.version, which may be used elsewhere in the gruntfile.
  grunt.registerTask( 'bump-version', 'This task updates the last value in the version by one.  For example from 0.0.0-dev.12 to 0.0.0-dev.13.' +
                                      'This updates the package.json and js/version.js files, and commits + pushes to git.' +
                                      'BEWARE: do not run this task unless your git is clean, otherwise it will commit other work on your repo as well.', function() {
    var lastDot = pkg.version.lastIndexOf( '.' );
    var number = parseInt( pkg.version.substring( lastDot + 1 ) );
    var newNumber = number + 1;
    var newFullVersion = pkg.version.substring( 0, lastDot + 1 ) + newNumber;

    var replace = function( path, oldText, newText ) {
      var fullText = grunt.file.read( path );
      var firstIndex = fullText.indexOf( oldText );
      var lastIndex = fullText.lastIndexOf( oldText );
      assert( lastIndex === firstIndex, 'should only be one occurrence of the text string' );
      assert( lastIndex !== -1, 'should be at least one occurrence of the text string' );
      grunt.file.write( path, fullText.replace( oldText, newText ) );
      grunt.log.writeln( 'updated version in ' + path + ' from ' + oldText + ' to ' + newText );
    };

    //Write the new version to the package.json file and version.js file
    replace( 'package.json', pkg.version, newFullVersion );
    replace( 'js/version.js', pkg.version, newFullVersion );

    var cmd1 = 'git add js/version.js package.json';
    var cmd2 = 'git commit -m "updated version to ' + newFullVersion + '"';
    var cmd3 = 'git push';

    grunt.log.writeln( 'Running: ' + cmd1 );
    var done = grunt.task.current.async();

    child_process.exec( cmd1, function( error1, stdout1, stderr1 ) {
      assert( !error1, "error in " + cmd1 );
      console.log( 'finished ' + cmd1 );
      console.log( stdout1 );
      grunt.log.writeln( 'Running: ' + cmd2 );
      child_process.exec( cmd2, function( error2, stdout2, stderr2 ) {
        assert( !error2, "error in git commit" );
        console.log( 'finished ' + cmd2 );
        console.log( stdout2 );

        grunt.log.writeln( 'Running: ' + cmd3 );
        child_process.exec( cmd3, function( error3, stdout3, stderr3 ) {
          assert( !error3, "error in git push" );
          console.log( 'finished ' + cmd3 );
          console.log( stdout3 );
          done();
        } );
      } );
    } );
  } );

  // creates a performance snapshot for profiling changes
  grunt.registerTask( 'simBeforeRequirejs', '(internal use only) Prepare for the requirejs step, enumerate locales to build', function() {
    grunt.log.writeln( 'Building simulation: ' + pkg.name + ' ' + pkg.version );

    assert( pkg.name, 'name required in package.json' );
    assert( pkg.version, 'version required in package.json' );
    assert( pkg.phetLibs, 'phetLibs required in package.json' );
    assert( pkg.preload, 'preload required in package.json' );

    //See if a specific language was specified like:
    // grunt build --locale fr
    var locale = grunt.option( 'locale' ) || 'en';

    //Pass an option to requirejs through its config build options
    grunt.config.set( 'requirejs.build.options.phetLocale', locale );

    //set up a place for the strings to go:
    global.phet = {};
    global.phet.strings = {};

    var localesToBuild = getLocalesToBuild();

    //Pass a global to the string! plugin so we know which strings to look up
    global.phet.localesToBuild = localesToBuild;
    for ( var i = 0; i < localesToBuild.length; i++ ) {
      global.phet.strings[localesToBuild[i]] = {};
    }
    global.phet.strings['en'] = {};//may overwrite above

    //TODO: Use requirejs directly instead of through the grunt plugin (?)
    // grunt.log.writeln( 'Running Require.js optimizer' );
    // requirejs.optimize( {
    //   almond: true,
    //   mainConfigFile: 'js/' + pkg.name + '-config.js',
    //   out: 'build/' + pkg.name + '.min.js',
    //   name: pkg.name + '-config',
    //   optimize: 'uglify2',
    //   wrap: true,
    //   generateSourceMaps: true,
    //   preserveLicenseComments: false,
    //   uglify2: {
    //     output: {
    //       inline_script: true // escape </script
    //     },
    //     compress: {
    //       global_defs: {
    //         // scenery assertions
    //         sceneryAssert: false,
    //         sceneryAssertExtra: false,
    //         // scenery logging
    //         sceneryLog: false,
    //         sceneryLayerLog: false,
    //         sceneryEventLog: false,
    //         sceneryAccessibilityLog: false
    //       },
    //       dead_code: true
    //     }
    //   }
    // }, function( response ) {
    // }
  } );

  grunt.registerTask( 'simAfterRequirejs', '(internal use only) Finish writing files after requirjs finished', function() {
    var done = this.async();

    grunt.log.writeln( 'Minifying preload scripts' );
    var preloadResult = uglify.minify( pkg.preload.split( ' ' ), {
//      outSourceMap: preloadMapFilename,  //#42 commented out this line until source maps are fixed
      output: {
        inline_script: true // escape </script
      },
      compress: {
        // here for now, for when we want to include options for the preloaded code
        global_defs: {}
      }
    } );

    var preloadJS = preloadResult.code; // minified output
    var preloadMap = preloadResult.map; // map for minified output, use preloadMapFilename

    //#42 commented out next 2 lines until source maps are fixed
//    grunt.log.writeln( 'Copying preload source map' );
//    grunt.file.write( 'build/' + preloadMapFilename, preloadMap );

    grunt.log.writeln( 'Copying changes.txt' );
    if ( fs.existsSync( 'changes.txt' ) ) {
      grunt.file.copy( 'changes.txt', 'build/changes.txt' );
    }
    else {
      grunt.log.error( 'WARNING: no changes.txt' );
    }

    var dependencies = pkg.phetLibs.split( ' ' );
    if ( dependencies.indexOf( 'chipper' ) === -1 ) {
      dependencies.push( 'chipper' );
    }

    var dependencyInfo = {};

    // git --git-dir ../scenery/.git rev-parse HEAD                 -- sha
    // git --git-dir ../scenery/.git rev-parse --abbrev-ref HEAD    -- branch
    function nextDependency() {
      if ( dependencies.length ) {
        var dependency = dependencies.pop();

        // get the SHA
        child_process.exec( 'git --git-dir ../' + dependency + '/.git rev-parse HEAD', function( error, stdout, stderr ) {
          assert( !error, error ? ( 'ERROR on git SHA attempt: code: ' + error.code + ', signal: ' + error.signal + ' with stderr:\n' + stderr ) : 'An error without an error? not good' );

          var sha = trimWhitespace( stdout );

          // get the branch
          child_process.exec( 'git --git-dir ../' + dependency + '/.git rev-parse --abbrev-ref HEAD', function( error, stdout, stderr ) {
            assert( !error, error ? ( 'ERROR on git branch attempt: code: ' + error.code + ', signal: ' + error.signal + ' with stderr:\n' + stderr ) : 'An error without an error? not good' );

            var branch = trimWhitespace( stdout );

            grunt.log.writeln( padString( dependency, 20 ) + branch + ' ' + sha );
            dependencyInfo[dependency] = { sha: sha, branch: branch };


            nextDependency();
          } );
        } );
      }
      else {
        // now continue on with the process! CALLBACK SOUP FOR YOU!

        // TODO: finish!
        grunt.log.writeln( 'Writing dependencies.json' );

        var comment = '# ' + pkg.name + ' ' + pkg.version + ' ' + (new Date().toString());

        //protect against repos or other attributions named 'comment'
        assert( !dependencyInfo.comment, 'there was already a "comment" dependency!' );
        dependencyInfo.comment = comment;

        grunt.file.write( 'build/dependencies.json', JSON.stringify( dependencyInfo, null, 2 ) + '\n' );

        var splashDataURI = loadFileAsDataURI( '../brand/images/splash.svg' );
        var mainInlineJavascript = grunt.file.read( 'build/' + pkg.name + '.min.js' );

        //Create the license header for this html and all the 3rd party dependencies
        //TODO: This puts the license for everything as GPLv3.  If we want to build other libraries with this, we should change the license to MIT
        var htmlHeader = pkg.name + '\n' +
                         'Copyright 2002-2013, University of Colorado Boulder\n' +
                         'PhET Interactive Simulations\n' +
                         'Licensed under GPLv3\n' +
                         'http://phet.colorado.edu/en/about/licensing\n' +
                         '\n' +
                         'Libraries:\n' + licenseText;

        grunt.log.writeln( 'Constructing HTML from template' );
        var html = grunt.file.read( '../chipper/templates/sim.html' );
        html = stringReplace( html, 'HTML_HEADER', htmlHeader );
        html = stringReplace( html, 'SPLASH_SCREEN_DATA_URI', splashDataURI );
        html = stringReplace( html, 'PRELOAD_INLINE_JAVASCRIPT', preloadJS + '\n//# sourceMappingURL=preload.js.map' );
        html = stringReplace( html, 'MAIN_INLINE_JAVASCRIPT', mainInlineJavascript );

        grunt.log.writeln( 'Writing HTML' );

        //Create the translated versions
        var locales = getLocalesToBuild();

        //Write the stringless template in case we want to use it with the translation addition process.
        //Skip it if only building one HTML
        if ( locales.length > 1 ) {
          grunt.file.write( 'build/' + pkg.name + '_STRING_TEMPLATE.html', html );
        }

        //TODO: Write a list of the string keys & values for translation utilities to use

        for ( var i = 0; i < locales.length; i++ ) {
          var locale = locales[i];
          var strings = getStringsWithFallbacks( locale, global.phet.strings );
          var phetStringsCode = 'window.phetStrings=' + JSON.stringify( strings, null, '' );//TODO: right hand side should be object literal for looked up strings
          var localeHTML = stringReplace( html, 'PHET_STRINGS', phetStringsCode );

          //Make the locale accessible at runtime (e.g., for changing layout based on RTL languages), see #40
          localeHTML = stringReplace( localeHTML, 'PHET_INFO', 'window.phetLocale=\'' + locale + '\';' +
                                                               'window.phetVersion=\'' + pkg.name + ' ' + pkg.version + '\';' );

          var titleKey = pkg.simTitleStringKey;
          localeHTML = stringReplace( localeHTML, 'SIM_TITLE', strings[titleKey] + ' ' + pkg.version ); // TODO: i18n order
          grunt.file.write( 'build/' + pkg.name + '_' + locale + '.html', localeHTML );
        }

        // Create a file for testing iframe embedding.  English (en) is assumed as the locale.
        grunt.log.writeln( 'Constructing HTML for iframe testing from template' );
        var iframeTestHtml = grunt.file.read( '../chipper/templates/sim-iframe.html' );
        iframeTestHtml = stringReplace( iframeTestHtml, 'SIM_TITLE', strings[titleKey] + ' ' + pkg.version + ' iframe test' );
        iframeTestHtml = stringReplace( iframeTestHtml, 'SIM_URL', pkg.name + '_en.html' );

        // Write the iframe test file.  English (en) is assumed as the locale.
        grunt.log.writeln( 'Writing HTML for iframe testing' );
        grunt.file.write( 'build/' + pkg.name + '_en-iframe' + '.html', iframeTestHtml );

        //Write the string map, which may be used by translation utility for showing which strings are available for translation
        grunt.log.writeln( 'Writing string map to ', stringMap );
        var stringMap = 'build/' + pkg.name + '_string-map.json';
        grunt.file.write( stringMap, JSON.stringify( global.phet.strings, null, '\t' ) );

        grunt.log.writeln( 'Cleaning temporary files' );
        grunt.file.delete( 'build/' + pkg.name + '.min.js' );

        done();
      }
    }

    grunt.log.writeln( 'Scanning dependencies from:\n' + dependencies.toString() );
    nextDependency();
  } );

  grunt.registerTask( 'create-sim', 'Create a sim based on the simula-rasa template', function() {
    createSim( grunt, grunt.option( 'name' ), grunt.option( 'author' ), grunt.option( 'overwrite' ) );
  } );

  // Load tasks from grunt plugins that have been installed locally using npm.
  // Put these in package.json and run 'npm install' before running grunt.
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
