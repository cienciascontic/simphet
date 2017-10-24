function runAxonTests( pathToTestBase ) {
  function loadTestFile( src ) {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.async = false;

    // make sure things aren't cached, just in case
    script.src = pathToTestBase + '/' + src + '?random=' + Math.random().toFixed( 10 );

    document.getElementsByTagName( 'head' )[0].appendChild( script );
  }

  loadTestFile( 'js/simple-tests.js' );
  loadTestFile( 'js/events.js' );
  loadTestFile( 'js/linting.js' );
}
