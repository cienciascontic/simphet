(function() {
  module( 'Dot: Transform3' );

  var Matrix3 = dot.Matrix3;
  var Transform3 = dot.Transform3;
  var Vector2 = dot.Vector2;

  var epsilon = 1e-7;

  function approximateEqual( a, b, msg ) {
    ok( Math.abs( a - b ) < epsilon, msg + ' expected: ' + b + ', got: ' + a );
  }

  // function approximateMatrixEqual( a, b, msg ) {
  //   ok( a.equalsEpsilon( b, epsilon ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  // }

  function approximateRayEqual( a, b, msg ) {
    ok( a.pos.equalsEpsilon( b.pos, 0.00001 ) && a.dir.equalsEpsilon( b.dir, 0.00001 ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  }

  test( 'Ray2 transforms', function() {
    var transform = new Transform3( Matrix3.createFromPool( 0, -2, 5, 3, 0, 8, 0, 0, 1 ) );
    var ray = new dot.Ray2( new dot.Vector2( 2, 7 ), new dot.Vector2( -5, 2 ).normalized() );

    var tray = transform.transformRay2( ray );
    var iray = transform.inverseRay2( ray );

    var backOffset = transform.inversePosition2( tray.pointAtDistance( 1 ) );
    var backPos = transform.inversePosition2( tray.pos );
    ok( ray.dir.equalsEpsilon( backOffset.minus( backPos ).normalized(), 0.00001 ), 'transformRay2 ray linearity' );

    var forwardOffset = transform.transformPosition2( iray.pointAtDistance( 1 ) );
    var forwardPos = transform.transformPosition2( iray.pos );
    ok( ray.dir.equalsEpsilon( forwardOffset.minus( forwardPos ).normalized(), 0.00001 ), 'inverseRay2 ray linearity' );

    approximateRayEqual( transform.inverseRay2( transform.transformRay2( ray ) ), ray, 'inverse correctness' );
  } );

  test( 'Transform x/y', function() {
    var t = new Transform3( Matrix3.createFromPool( 2, 0, 10, 0, 3, 1, 0, 0, 1 ) );
    equal( t.transformX( 5 ), 20 );
    equal( t.transformY( 5 ), 16 );
    equal( t.inverseX( 20 ), 5 );
    equal( t.inverseY( 16 ), 5 );

    var t2 = new Transform3( Matrix3.rotation2( Math.PI / 6 ) );
    assert && throws( function() {
      var x = t2.transformX( 5 );
    } );
    assert && throws( function() {
      var y = t2.transformY( 5 );
    } );
  } );

  test( 'Transform delta', function() {
    var t1 = new Transform3( Matrix3.createFromPool( 2, 1, 0, -2, 5, 0, 0, 0, 1 ) );
    var t2 = new Transform3( Matrix3.createFromPool( 2, 1, 52, -2, 5, -61, 0, 0, 1 ) );

    ok( t1.transformDelta2( Vector2.ZERO ).equalsEpsilon( Vector2.ZERO, 1e-7 ), 'ensuring linearity at 0, no translation' );
    ok( t2.transformDelta2( Vector2.ZERO ).equalsEpsilon( Vector2.ZERO, 1e-7 ), 'ensuring linearity at 0, with translation' );

    ok( t1.transformDelta2( new Vector2( 2, -3 ) ).equalsEpsilon( new Vector2( 1, -19 ), 1e-7 ), 'basic delta check, no translation' );
    ok( t2.transformDelta2( new Vector2( 2, -3 ) ).equalsEpsilon( new Vector2( 1, -19 ), 1e-7 ), 'basic delta check, with translation' );

    var v = new Vector2( -71, 27 );
    ok( t1.inverseDelta2( t1.transformDelta2( v ) ).equalsEpsilon( v, 1e-7 ), 'inverse check, no translation' );
    ok( t2.inverseDelta2( t2.transformDelta2( v ) ).equalsEpsilon( v, 1e-7 ), 'inverse check, with translation' );
  } );

  test( 'Transform delta x/y', function() {
    var t = new Transform3( Matrix3.createFromPool( 2, 0, 52, 0, 5, -61, 0, 0, 1 ) );

    approximateEqual( t.transformDeltaX( 1 ), 2, 'deltaX' );
    approximateEqual( t.transformDeltaY( 1 ), 5, 'deltaY' );

    approximateEqual( t.transformDeltaX( 71 ), t.transformDelta2( new Vector2( 71, 27 ) ).x, 'deltaX check vs transformDelta' );
    approximateEqual( t.transformDeltaY( 27 ), t.transformDelta2( new Vector2( 71, 27 ) ).y, 'deltaY check vs transformDelta' );

    var v = new Vector2( -71, 27 );
    approximateEqual( t.inverseDeltaX( t.transformDeltaX( v.x ) ), v.x, 'inverse check X' );
    approximateEqual( t.inverseDeltaY( t.transformDeltaY( v.y ) ), v.y, 'inverse check Y' );

    var t2 = new Transform3( Matrix3.rotation2( Math.PI / 6 ) );
    assert && throws( function() {
      var x = t2.transformDeltaX( 5 );
    } );
    assert && throws( function() {
      var y = t2.transformDeltaY( 5 );
    } );
  } );
})();
