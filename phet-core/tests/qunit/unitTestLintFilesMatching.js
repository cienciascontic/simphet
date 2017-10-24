/*
 * Meant to be called in qUnit modules to run linting tests
 */

function unitTestLintFilesMatching( predicate ) {
  var filenames = _.filter( $( 'head script' ).map( function( i, script ) { return script.src; } ), predicate );

  var options = window.jshintOptions;
  var globals = window.jshintGlobals;
  if ( options && globals ) {
    _.each( filenames, function( filename ) {
      var name = filename.slice( filename.lastIndexOf( '/' ) + 1, filename.indexOf( '?' ) );
      var lib = filename.slice( 0, filename.lastIndexOf( '/js/' ) );
      lib = lib.slice( lib.lastIndexOf( '/' ) + 1 );
      qHint( lib + ': ' + name, filename, options, globals );
    } );
  }
  else {
    test( 'Linter options', function() {
      equal( 0, 1, 'Linter options missing' );
    } );
  }
}
