// Copyright 2002-2014, University of Colorado Boulder

/**
 * Arc segment
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DotUtil = require( 'DOT/Util' );

  var kite = require( 'KITE/kite' );
  var Segment = require( 'KITE/segments/Segment' );

  Segment.Arc = function Arc( center, radius, startAngle, endAngle, anticlockwise ) {
    if ( radius < 0 ) {
      // support this case since we might actually need to handle it inside of strokes?
      radius = -radius;
      startAngle += Math.PI;
      endAngle += Math.PI;
    }

    this._center = center;
    this._radius = radius;
    this._startAngle = startAngle;
    this._endAngle = endAngle;
    this._anticlockwise = anticlockwise;

    // TODO: performance test removal of these undefined declarations
    this._start = undefined;
    this._end = undefined;
    this._startTangent = undefined;
    this._endTangent = undefined;
    this._actualEndAngle = undefined;
    this._isFullPerimeter = undefined;
    this._angleDifference = undefined;

    // constraints
    assert && assert( !( ( !anticlockwise && endAngle - startAngle <= -Math.PI * 2 ) || ( anticlockwise && startAngle - endAngle <= -Math.PI * 2 ) ), 'Not handling arcs with start/end angles that show differences in-between browser handling' );
    assert && assert( !( ( !anticlockwise && endAngle - startAngle > Math.PI * 2 ) || ( anticlockwise && startAngle - endAngle > Math.PI * 2 ) ), 'Not handling arcs with start/end angles that show differences in-between browser handling' );
  };
  inherit( Segment, Segment.Arc, {

    getCenter: function() {
      return this._center;
    },
    get center() { return this.getCenter(); },

    getRadius: function() {
      return this._radius;
    },
    get radius() { return this.getRadius(); },

    getStartAngle: function() {
      return this._startAngle;
    },
    get startAngle() { return this.getStartAngle(); },

    getEndAngle: function() {
      return this._endAngle;
    },
    get endAngle() { return this.getEndAngle(); },

    getAnticlockwise: function() {
      return this._anticlockwise;
    },
    get anticlockwise() { return this.getAnticlockwise(); },

    getStart: function() {
      if ( this._start === undefined ) {
        this._start = this.positionAtAngle( this._startAngle );
      }
      return this._start;
    },
    get start() { return this.getStart(); },

    getEnd: function() {
      if ( this._end === undefined ) {
        this._end = this.positionAtAngle( this._endAngle );
      }
      return this._end;
    },
    get end() { return this.getEnd(); },

    getStartTangent: function() {
      if ( this._startTangent === undefined ) {
        this._startTangent = this.tangentAtAngle( this._startAngle );
      }
      return this._startTangent;
    },
    get startTangent() { return this.getStartTangent(); },

    getEndTangent: function() {
      if ( this._endTangent === undefined ) {
        this._endTangent = this.tangentAtAngle( this._endAngle );
      }
      return this._endTangent;
    },
    get endTangent() { return this.getEndTangent(); },

    getActualEndAngle: function() {
      if ( this._actualEndAngle === undefined ) {
        // compute an actual end angle so that we can smoothly go from this._startAngle to this._actualEndAngle
        if ( this._anticlockwise ) {
          // angle is 'decreasing'
          // -2pi <= end - start < 2pi
          if ( this._startAngle > this._endAngle ) {
            this._actualEndAngle = this._endAngle;
          }
          else if ( this._startAngle < this._endAngle ) {
            this._actualEndAngle = this._endAngle - 2 * Math.PI;
          }
          else {
            // equal
            this._actualEndAngle = this._startAngle;
          }
        }
        else {
          // angle is 'increasing'
          // -2pi < end - start <= 2pi
          if ( this._startAngle < this._endAngle ) {
            this._actualEndAngle = this._endAngle;
          }
          else if ( this._startAngle > this._endAngle ) {
            this._actualEndAngle = this._endAngle + Math.PI * 2;
          }
          else {
            // equal
            this._actualEndAngle = this._startAngle;
          }
        }
      }
      return this._actualEndAngle;
    },
    get actualEndAngle() { return this.getActualEndAngle(); },

    getIsFullPerimeter: function() {
      if ( this._isFullPerimeter === undefined ) {
        this._isFullPerimeter = ( !this._anticlockwise && this._endAngle - this._startAngle >= Math.PI * 2 ) || ( this._anticlockwise && this._startAngle - this._endAngle >= Math.PI * 2 );
      }
      return this._isFullPerimeter;
    },
    get isFullPerimeter() { return this.getIsFullPerimeter(); },

    getAngleDifference: function() {
      if ( this._angleDifference === undefined ) {
        // compute an angle difference that represents how "much" of the circle our arc covers
        this._angleDifference = this._anticlockwise ? this._startAngle - this._endAngle : this._endAngle - this._startAngle;
        if ( this._angleDifference < 0 ) {
          this._angleDifference += Math.PI * 2;
        }
        assert && assert( this._angleDifference >= 0 ); // now it should always be zero or positive
      }
      return this._angleDifference;
    },
    get angleDifference() { return this.getAngleDifference(); },

    getBounds: function() {
      if ( this._bounds === undefined ) {
        // acceleration for intersection
        this._bounds = Bounds2.NOTHING.copy().withPoint( this.getStart() )
          .withPoint( this.getEnd() );

        // if the angles are different, check extrema points
        if ( this._startAngle !== this._endAngle ) {
          // check all of the extrema points
          this.includeBoundsAtAngle( 0 );
          this.includeBoundsAtAngle( Math.PI / 2 );
          this.includeBoundsAtAngle( Math.PI );
          this.includeBoundsAtAngle( 3 * Math.PI / 2 );
        }
      }
      return this._bounds;
    },
    get bounds() { return this.getBounds(); },

    getNondegenerateSegments: function() {
      if ( this._radius <= 0 || this._startAngle === this._endAngle ) {
        return [];
      }
      else {
        return [this]; // basically, Arcs aren't really degenerate that easily
      }
    },

    includeBoundsAtAngle: function( angle ) {
      if ( this.containsAngle( angle ) ) {
        // the boundary point is in the arc
        this._bounds = this._bounds.withPoint( this._center.plus( Vector2.createPolar( this._radius, angle ) ) );
      }
    },

    // maps a contained angle to between [startAngle,actualEndAngle), even if the end angle is lower.
    mapAngle: function( angle ) {
      // consider an assert that we contain that angle?
      return ( this._startAngle > this.getActualEndAngle() ) ?
             DotUtil.moduloBetweenUp( angle, this._startAngle - 2 * Math.PI, this._startAngle ) :
             DotUtil.moduloBetweenDown( angle, this._startAngle, this._startAngle + 2 * Math.PI );
    },

    tAtAngle: function( angle ) {
      return ( this.mapAngle( angle ) - this._startAngle ) / ( this.getActualEndAngle() - this._startAngle );
    },

    angleAt: function( t ) {
      return this._startAngle + ( this.getActualEndAngle() - this._startAngle ) * t;
    },

    positionAt: function( t ) {
      return this.positionAtAngle( this.angleAt( t ) );
    },

    tangentAt: function( t ) {
      return this.tangentAtAngle( this.angleAt( t ) );
    },

    curvatureAt: function( t ) {
      return ( this._anticlockwise ? -1 : 1 ) / this._radius;
    },

    positionAtAngle: function( angle ) {
      return this._center.plus( Vector2.createPolar( this._radius, angle ) );
    },

    tangentAtAngle: function( angle ) {
      var normal = Vector2.createPolar( 1, angle );

      return this._anticlockwise ? normal.perpendicular() : normal.perpendicular().negated();
    },

    // TODO: refactor? shared with Segment.EllipticalArc (use this improved version)
    containsAngle: function( angle ) {
      // transform the angle into the appropriate coordinate form
      // TODO: check anticlockwise version!
      var normalizedAngle = this._anticlockwise ? angle - this._endAngle : angle - this._startAngle;

      // get the angle between 0 and 2pi
      var positiveMinAngle = DotUtil.moduloBetweenDown( normalizedAngle, 0, Math.PI * 2 );

      return positiveMinAngle <= this.angleDifference;
    },

    getSVGPathFragment: function() {
      // see http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands for more info
      // rx ry x-axis-rotation large-arc-flag sweep-flag x y

      var epsilon = 0.01; // allow some leeway to render things as 'almost circles'
      var sweepFlag = this._anticlockwise ? '0' : '1';
      var largeArcFlag;
      if ( this.angleDifference < Math.PI * 2 - epsilon ) {
        largeArcFlag = this.angleDifference < Math.PI ? '0' : '1';
        return 'A ' + kite.svgNumber( this._radius ) + ' ' + kite.svgNumber( this._radius ) + ' 0 ' + largeArcFlag +
               ' ' + sweepFlag + ' ' + kite.svgNumber( this.end.x ) + ' ' + kite.svgNumber( this.end.y );
      }
      else {
        // circle (or almost-circle) case needs to be handled differently
        // since SVG will not be able to draw (or know how to draw) the correct circle if we just have a start and end, we need to split it into two circular arcs

        // get the angle that is between and opposite of both of the points
        var splitOppositeAngle = ( this._startAngle + this._endAngle ) / 2; // this _should_ work for the modular case?
        var splitPoint = this._center.plus( Vector2.createPolar( this._radius, splitOppositeAngle ) );

        largeArcFlag = '0'; // since we split it in 2, it's always the small arc

        var firstArc = 'A ' + kite.svgNumber( this._radius ) + ' ' + kite.svgNumber( this._radius ) + ' 0 ' +
                       largeArcFlag + ' ' + sweepFlag + ' ' + kite.svgNumber( splitPoint.x ) + ' ' + kite.svgNumber( splitPoint.y );
        var secondArc = 'A ' + kite.svgNumber( this._radius ) + ' ' + kite.svgNumber( this._radius ) + ' 0 ' +
                        largeArcFlag + ' ' + sweepFlag + ' ' + kite.svgNumber( this.end.x ) + ' ' + kite.svgNumber( this.end.y );

        return firstArc + ' ' + secondArc;
      }
    },

    strokeLeft: function( lineWidth ) {
      return [new Segment.Arc( this._center, this._radius + ( this._anticlockwise ? 1 : -1 ) * lineWidth / 2, this._startAngle, this._endAngle, this._anticlockwise )];
    },

    strokeRight: function( lineWidth ) {
      return [new Segment.Arc( this._center, this._radius + ( this._anticlockwise ? -1 : 1 ) * lineWidth / 2, this._endAngle, this._startAngle, !this._anticlockwise )];
    },

    // not including 0 and 1
    getInteriorExtremaTs: function() {
      var that = this;
      var result = [];
      _.each( [ 0, Math.PI / 2, Math.PI, 3 * Math.PI / 2 ], function( angle ) {
        if ( that.containsAngle( angle ) ) {
          var t = that.tAtAngle( angle );
          var epsilon = 0.0000000001; // TODO: general kite epsilon?
          if ( t > epsilon && t < 1 - epsilon ) {
            result.push( t );
          }
        }
      } );
      return result.sort(); // modifies original, which is OK
    },

    subdivided: function( t ) {
      // TODO: verify that we don't need to switch anticlockwise here, or subtract 2pi off any angles
      var angle0 = this.angleAt( 0 );
      var angleT = this.angleAt( t );
      var angle1 = this.angleAt( 1 );
      return [
        new Segment.Arc( this._center, this._radius, angle0, angleT, this._anticlockwise ),
        new Segment.Arc( this._center, this._radius, angleT, angle1, this._anticlockwise )
      ];
    },

    intersectsBounds: function( bounds ) {
      throw new Error( 'Segment.intersectsBounds unimplemented!' );
    },

    intersection: function( ray ) {
      var result = []; // hits in order

      // left here, if in the future we want to better-handle boundary points
      var epsilon = 0;

      // Run a general circle-intersection routine, then we can test the angles later.
      // Solves for the two solutions t such that ray.pos + ray.dir * t is on the circle.
      // Then we check whether the angle at each possible hit point is in our arc.
      var centerToRay = ray.pos.minus( this._center );
      var tmp = ray.dir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared();
      var discriminant = 4 * tmp * tmp - 4 * ( centerToRayDistSq - this._radius * this._radius );
      if ( discriminant < epsilon ) {
        // ray misses circle entirely
        return result;
      }
      var base = ray.dir.dot( this._center ) - ray.dir.dot( ray.pos );
      var sqt = Math.sqrt( discriminant ) / 2;
      var ta = base - sqt;
      var tb = base + sqt;

      if ( tb < epsilon ) {
        // circle is behind ray
        return result;
      }

      var pointB = ray.pointAtDistance( tb );
      var normalB = pointB.minus( this._center ).normalized();

      if ( ta < epsilon ) {
        // we are inside the circle, so only one intersection is possible
        if ( this.containsAngle( normalB.angle() ) ) {
          result.push( {
            distance: tb,
            point: pointB,
            normal: normalB.negated(), // normal is towards the ray
            wind: this._anticlockwise ? -1 : 1 // since we are inside, wind this way
          } );
        }
      }
      else {
        // two possible hits (outside circle)
        var pointA = ray.pointAtDistance( ta );
        var normalA = pointA.minus( this._center ).normalized();

        if ( this.containsAngle( normalA.angle() ) ) {
          result.push( {
            distance: ta,
            point: pointA,
            normal: normalA,
            wind: this._anticlockwise ? 1 : -1 // hit from outside
          } );
        }
        if ( this.containsAngle( normalB.angle() ) ) {
          result.push( {
            distance: tb,
            point: pointB,
            normal: normalB.negated(),
            wind: this._anticlockwise ? -1 : 1 // this is the far hit, which winds the opposite way
          } );
        }
      }

      return result;
    },

    // returns the resultant winding number of this ray intersecting this segment.
    windingIntersection: function( ray ) {
      var wind = 0;
      var hits = this.intersection( ray );
      _.each( hits, function( hit ) {
        wind += hit.wind;
      } );
      return wind;
    },

    writeToContext: function( context ) {
      context.arc( this._center.x, this._center.y, this._radius, this._startAngle, this._endAngle, this._anticlockwise );
    },

    // TODO: test various transform types, especially rotations, scaling, shears, etc.
    transformed: function( matrix ) {
      // so we can handle reflections in the transform, we do the general case handling for start/end angles
      var startAngle = matrix.timesVector2( Vector2.createPolar( 1, this._startAngle ) ).minus( matrix.timesVector2( Vector2.ZERO ) ).angle();
      var endAngle = matrix.timesVector2( Vector2.createPolar( 1, this._endAngle ) ).minus( matrix.timesVector2( Vector2.ZERO ) ).angle();

      // reverse the 'clockwiseness' if our transform includes a reflection
      var anticlockwise = matrix.getDeterminant() >= 0 ? this._anticlockwise : !this._anticlockwise;

      if ( Math.abs( this._endAngle - this._startAngle ) === Math.PI * 2 ) {
        endAngle = anticlockwise ? startAngle - Math.PI * 2 : startAngle + Math.PI * 2;
      }

      var scaleVector = matrix.getScaleVector();
      if ( scaleVector.x !== scaleVector.y ) {
        var radiusX = scaleVector.x * this._radius;
        var radiusY = scaleVector.y * this._radius;
        return new Segment.EllipticalArc( matrix.timesVector2( this._center ), radiusX, radiusY, 0, startAngle, endAngle, anticlockwise );
      }
      else {
        var radius = scaleVector.x * this._radius;
        return new Segment.Arc( matrix.timesVector2( this._center ), radius, startAngle, endAngle, anticlockwise );
      }
    }
  } );

  return Segment.Arc;
} );
