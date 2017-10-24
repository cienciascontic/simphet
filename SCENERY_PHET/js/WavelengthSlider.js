// Copyright 2002-2013, University of Colorado Boulder

/**
 * WavelengthSlider is a slider-like control used for setting visible wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var pattern_0value_1unitsString = require( 'string!SCENERY_PHET/pattern_0value_1units' );
  var units_nmString = require( 'string!SCENERY_PHET/units_nm' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * The slider thumb (aka knob)
   * @param {Number} width
   * @param {Number} height
   * @param {Number} touchAreaExpandX
   * @param {Number} touchAreaExpandY
   * @param {Boolean} pointerAreasOverTrack whether or not the pointer areas for dragging should extend to the top of the track
   * @param {Number} trackHeight only used if pointerAreasOverTrack is true
   * @constructor
   */
  function Thumb( width, height, touchAreaExpandX, touchAreaExpandY, pointerAreasOverTrack, trackHeight ) {
    // set the radius of the arcs based on the height or width, whichever is smaller
    var radiusScale = 0.15;
    var radius = ( width < height ) ? radiusScale * width : radiusScale * height;

    // calculate some parameters of the upper triangles of the thumb for getting arc offsets
    var hypotenuse = Math.sqrt( Math.pow( 0.5 * width, 2 ) + Math.pow( 0.3 * height, 2 ) );
    var angle = Math.acos( width * 0.5 / hypotenuse );
    var heightOffset = radius * Math.sin( angle );

    // draw the thumb shape starting at the right upper corner of the pentagon below the arc,
    // this way we can get the arc coordinates for the arc in this corner from the other side, which
    // will be easier to calculate arcing from bottom to top
    var shape = new Shape()
      .moveTo( 0.5 * width, 0.3 * height + heightOffset )
      .lineTo( 0.5 * width, 1 * height - radius )
      .arc( 0.5 * width - radius, 1 * height - radius, radius, 0, Math.PI / 2 )
      .lineTo( -0.5 * width + radius, 1 * height )
      .arc( -0.5 * width + radius, 1 * height - radius, radius, Math.PI / 2, Math.PI )
      .lineTo( -0.5 * width, 0.3 * height + heightOffset )
      .arc( -0.5 * width + radius, 0.3 * height + heightOffset, radius, Math.PI, Math.PI + angle );

    // save the coordinates for the point above the left side arc, for use on the other side
    var sideArcPoint = shape.getLastPoint();

    shape.lineTo( 0, 0 )
      .lineTo( -sideArcPoint.x, sideArcPoint.y )
      .arc( 0.5 * width - radius, 0.3 * height + heightOffset, radius, -angle, 0 )
      .close();

    Path.call( this, shape, { stroke: 'black', lineWidth: 1, fill: 'black' } );

    // compute mouse/touch areas, extend up to top of track if pointerAreasOverTrack is true
    var bounds = shape.computeBounds().copy();
    if ( pointerAreasOverTrack ) {
      this.touchArea = Shape.rectangle( bounds.minX - touchAreaExpandX, bounds.minY - trackHeight, bounds.width + 2 * touchAreaExpandX, bounds.height + 2 * touchAreaExpandY + trackHeight );
      this.mouseArea = Shape.rectangle( bounds.minX, bounds.minY - trackHeight, bounds.width, bounds.height + trackHeight );
    }

    // don't extend above the thumb so that we don't encroach on slider track if pointerAreasOverTrack is false
    else {
      this.touchArea = Shape.rectangle( bounds.minX - touchAreaExpandX, bounds.minY, bounds.width + 2 * touchAreaExpandX, bounds.height + 2 * touchAreaExpandY );
    }
  }

  inherit( Path, Thumb );

  /**
   * Displays the value and units.
   * @param property
   * @param {String} font
   * @param {String} fill
   * @constructor
   */
  function ValueDisplay( property, font, fill ) {
    var thisNode = this;
    Text.call( this, '?', { font: font, fill: fill } );
    property.link( function( value ) {
      thisNode.text = StringUtils.format( pattern_0value_1unitsString, value.toFixed( 0 ), units_nmString );
    } );
  }

  inherit( Text, ValueDisplay );

  /**
   * Rectangular 'cursor' that appears in the track directly above the thumb. Origin is at top center of cursor.
   * @param {Number} width
   * @param {Number} height
   * @constructor
   */
  function Cursor( width, height, stroke ) {
    Rectangle.call( this, -width / 2, 0, width, height, { stroke: stroke, lineWidth: 1 } );
  }

  inherit( Rectangle, Cursor );

  /**
   * @param {Property<Number>} wavelength
   * @param {object} options
   * @constructor
   */
  function WavelengthSlider( wavelength, options ) {

    // calculate default touchAreaExpand parameters as half of the width
    var defaultThumbWidth = 35;
    var defaultThumbHeight = 45;
    var thumbWidth = options.thumbWidth || defaultThumbWidth;
    var thumbHeight = options.thumbHeight || defaultThumbHeight;
    var thumbTouchAreaExpandX = options.thumbTouchAreaExpandX || 0.5 * thumbWidth;
    var thumbTouchAreaExpandY = options.thumbTouchAreaExpandY || 0.5 * thumbHeight;

    // options that are specific to this type
    options = _.extend( {
      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      trackWidth: 150,
      trackHeight: 30,
      trackOpacity: 1,
      trackBorderStroke: 'black',
      thumbWidth: defaultThumbWidth,
      thumbHeight: defaultThumbHeight,
      valueFont: new PhetFont( 20 ),
      valueFill: 'black',
      valueVisible: true,
      tweakersVisible: true,
      cursorVisible: true,
      cursorStroke: 'black',
      pointerAreasOverTrack: false
    }, options );

    // validate wavelengths
    assert && assert( options.minWavelength < options.maxWavelength );
    assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );

    var thisNode = this;
    Node.call( thisNode );

    var thumb = new Thumb( options.thumbWidth, options.thumbHeight, thumbTouchAreaExpandX, thumbTouchAreaExpandY, options.pointerAreasOverTrack, options.trackHeight );
    var valueDisplay = ( options.valueVisible ) ? new ValueDisplay( wavelength, options.valueFont, options.valueFill ) : null;
    var track = new SpectrumNode( options.trackWidth, options.trackHeight, options.minWavelength, options.maxWavelength, options.trackOpacity );
    var cursor = ( options.cursorVisible ) ? new Cursor( 3, track.height, options.cursorStroke ) : null;

    // tweaker buttons for single-unit increments
    var plusButton, minusButton;
    if ( options.tweakersVisible ) {
      plusButton = new ArrowButton( 'right', function() {
        wavelength.set( wavelength.get() + 1 );
      } );
      minusButton = new ArrowButton( 'left', function() {
        wavelength.set( wavelength.get() - 1 );
      } );
    }

    /*
     * Put a border around the track.
     * We don't stroke the track itself because stroking the track will affect its bounds,
     * and will thus affect the drag handle behavior.
     * Having a separate border also gives subclasses a place to add markings (eg, tick marks)
     * without affecting the track's bounds.
     */
    var trackBorder = new Rectangle( 0, 0, track.width, track.height, { stroke: options.trackBorderStroke, lineWidth: 1, pickable: false } );

    // rendering order
    thisNode.addChild( track );
    thisNode.addChild( trackBorder );
    thisNode.addChild( thumb );
    if ( valueDisplay ) { thisNode.addChild( valueDisplay ); }
    if ( cursor ) { thisNode.addChild( cursor ); }
    if ( options.tweakersVisible ) {
      thisNode.addChild( plusButton );
      thisNode.addChild( minusButton );
    }

    // layout
    if ( cursor ) { cursor.top = track.top; }
    thumb.top = track.bottom;
    if ( valueDisplay ) { valueDisplay.bottom = track.top - 2; }
    if ( options.tweakersVisible ) {
      plusButton.left = track.right + 8;
      plusButton.centerY = track.centerY;
      minusButton.right = track.left - 8;
      minusButton.centerY = track.centerY;
    }

    // transforms between position and wavelength
    var positionToWavelength = function( x ) {
      return Math.floor( Util.clamp( Util.linear( 0, track.width, options.minWavelength, options.maxWavelength, x ), options.minWavelength, options.maxWavelength ) );
    };
    var wavelengthToPosition = function( wavelength ) {
      return Math.floor( Util.clamp( Util.linear( options.minWavelength, options.maxWavelength, 0, track.width, wavelength ), 0, track.width ) );
    };

    // track interactivity
    track.cursor = 'pointer';
    track.addInputListener(
      {
        down: function( event ) {
          var x = track.globalToParentPoint( event.pointer.point ).x;
          wavelength.set( positionToWavelength( x ) );
        }
      } );

    // thumb interactivity
    thumb.cursor = 'pointer';
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumb.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,

        start: function( event ) {
          clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
        },

        drag: function( event ) {
          var x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
          wavelength.set( positionToWavelength( x ) );
        }
      } ) );

    // sync with model
    var updateUI = function( wavelength ) {
      // positions
      var x = wavelengthToPosition( wavelength );
      thumb.centerX = x;
      if ( cursor ) { cursor.centerX = x; }
      if ( valueDisplay ) { valueDisplay.centerX = x; }
      // thumb color
      thumb.fill = VisibleColor.wavelengthToColor( wavelength );
      // tweaker buttons
      if ( options.tweakersVisible ) {
        plusButton.setEnabled( wavelength < options.maxWavelength );
        minusButton.setEnabled( wavelength > options.minWavelength );
      }
    };
    wavelength.link( function( wavelength ) {
      updateUI( wavelength );
    } );

    /*
     * The horizontal bounds of the wavelength control changes as the slider knob is dragged.
     * To prevent this, we determine the extents of the control's bounds at min and max values,
     * then add an invisible horizontal strut.
     */
    {
      // determine bounds at min and max wavelength settings
      updateUI( options.minWavelength );
      var minX = thisNode.left;
      updateUI( options.maxWavelength );
      var maxX = thisNode.right;

      // restore the wavelength
      updateUI( wavelength.get() );

      // add a horizontal strut
      var strut = new Rectangle( minX, 0, maxX - minX, 1, { pickable: false } );
      thisNode.addChild( strut );
      strut.moveToBack();
    }

    thisNode.mutate( options );
  }

  return inherit( Node, WavelengthSlider );
} );
