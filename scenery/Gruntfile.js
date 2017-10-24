
var exec = require( 'child_process' ).exec;
var escodegen = require( 'escodegen' );
var esprima = require( 'esprima' );

var chipperRewrite = require( '../chipper/ast/chipperRewrite.js' );

/*global module:false*/
module.exports = function( grunt ) {
  'use strict';
  
  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Scenery' );
  
  var onBuildRead = function( name, path, contents ) {
    return chipperRewrite.chipperRewrite( contents, esprima, escodegen );
  };
  
  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',
    
    requirejs: {
      // unminified, with has.js
      development: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "build/development/scenery.js",
          name: "config",
          optimize: 'none',
          wrap: {
            startFile: [ "js/wrap-start.frag", "../sherpa/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // with has.js
      standalone: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "build/standalone/scenery.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag", "../sherpa/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          },
          uglify2: {
            compress: {
              global_defs: {
                assert: false,
                assertSlow: false,
                sceneryLayerLog: false,
                sceneryEventLog: false,
                sceneryAccessibilityLog: false,
                phetAllocation: false
              },
              dead_code: true
            }
          },
          onBuildRead: onBuildRead
        }
      },
      
      // without has.js
      production: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "build/production/scenery.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag" ],
            endFile: [ "js/wrap-end.frag" ]
          },
          uglify2: {
            compress: {
              global_defs: {
                assert: false,
                assertSlow: false,
                sceneryLayerLog: false,
                sceneryEventLog: false,
                sceneryAccessibilityLog: false,
                phetAllocation: false
              },
              dead_code: true
            }
          },
          onBuildRead: onBuildRead
        }
      }
    },
    
    jshint: {
      all: [
        'Gruntfile.js', 'js/**/*.js', '../kite/js/**/*.js', '../dot/js/**/*.js', '../phet-core/js/**/*.js', '../assert/js/**/*.js'
      ],
      scenery: [
        'js/**/*.js'
      ],
      // reference external JSHint options in jshint-options.js
      options: require( '../chipper/grunt/jshint-options' )
    }
  } );
  
  // default task ('grunt')
  grunt.registerTask( 'default', [ 'jshint:all', 'development', 'standalone', 'production' ] );
  
  // linter on scenery subset only ('grunt lint')
  grunt.registerTask( 'lint', [ 'jshint:scenery' ] );
  
  // compilation targets. invoke only one like ('grunt development')
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone' ] );
  grunt.registerTask( 'development', [ 'requirejs:development' ] );
  
  grunt.registerTask( 'snapshot', [ 'standalone', '_createSnapshot' ] );
  
  // creates a performance snapshot for profiling changes
  grunt.registerTask( '_createSnapshot', 'Description', function( arg ) {
    var done = this.async();
    
    exec( 'git log -1 --date=short', function( error, stdout, stderr ) {
      if ( error ) { throw error; }
      
      var sha = /commit (.*)$/m.exec( stdout )[1];
      var date = /Date: *(\d+)-(\d+)-(\d+)$/m.exec( stdout );
      var year = date[1].slice( 2, 4 );
      var month = date[2];
      var day = date[3];
      
      var suffix = '-' + year + month + day + '-' + sha.slice( 0, 10 ) + '.js';
      
      grunt.file.copy( 'build/standalone/scenery.min.js', 'snapshots/scenery-min' + suffix );
      grunt.file.copy( 'tests/benchmarks/js/perf-current.js', 'snapshots/perf' + suffix );
      
      grunt.log.writeln( 'Copied standalone js to snapshots/scenery-min' + suffix );
      grunt.log.writeln( 'Copied perf js to       snapshots/perf' + suffix );
      
      done();
    } );
  } );
  
  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
