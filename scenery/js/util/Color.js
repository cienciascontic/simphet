// Copyright 2002-2013, University of Colorado

/**
 * Encapsulates common color information and transformations.
 *
 * See http://www.w3.org/TR/css3-color/
 *
 * TODO: make a getHue, getSaturation, getLightness. we can then expose them via ES5!
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';

  // modules
  var scenery = require( 'SCENERY/scenery' );
  var clamp = require( 'DOT/Util' ).clamp;
  var linear = require( 'DOT/Util' ).linear;

  // r,g,b integers 0-255, 'a' float 0-1
  scenery.Color = function Color( r, g, b, a ) {
    
    // allow listeners to be notified on any changes. called with listener()
    this.listeners = [];

    if ( typeof r === 'string' ) {
      var str = r.replace( / /g, '' ).toLowerCase();
      var success = false;
      
      // replace colors based on keywords
      var keywordMatch = Color.colorKeywords[str];
      if ( keywordMatch ) {
        str = '#' + keywordMatch;
      }
      
      // run through the available text formats
      for ( var i = 0; i < Color.formatParsers.length; i++ ) {
        var parser = Color.formatParsers[i];
        
        var matches = parser.regexp.exec( str );
        if ( matches ) {
          parser.apply( this, matches );
          success = true;
          break;
        }
      }
      
      if ( !success ) {
        throw new Error( 'scenery.Color unable to parse color string: ' + r );
      }
    } else {
      // alpha
      var alpha = a === undefined ? 1 : a;

      // bitwise handling if 3 elements aren't defined
      if ( g === undefined || b === undefined ) {
        this.setRGBA( ( r >> 16 ) && 0xFF,
                      ( r >> 8 ) && 0xFF,
                      ( r >> 0 ) && 0xFF,
                      alpha );
      }
      else {
        // otherwise, copy them over
        this.setRGBA( r, g, b, alpha );
      }
    }
    
    phetAllocation && phetAllocation( 'Color' );
  };
  var Color = scenery.Color;
  
  // regex utilities
  var rgbNumber = '(-?\\d{1,3}%?)'; // syntax allows negative integers and percentages
  var aNumber = '(\\d+|\\d*\\.\\d+)'; // decimal point number. technically we allow for '255', even though this will be clamped to 1.
  var rawNumber = '(\\d{1,3})'; // a 1-3 digit number
  
  // handles negative and percentage values
  function parseRGBNumber( str ) {
    var multiplier = 1;
    
    // if it's a percentage, strip it off and handle it that way
    if ( str.charAt( str.length - 1 ) === '%' ) {
      multiplier = 2.55;
      str = str.slice( 0, str.length - 1 );
    }
    
    return Math.round( parseInt( str, 10 ) * multiplier );
  }
  
  Color.formatParsers = [
    {
      // 'transparent'
      regexp: /^transparent$/,
      apply: function( color, matches ) {
        color.setRGBA( 0, 0, 0, 0 );
      }
    },{
      // short hex form, a la '#fff'
      regexp: /^#(\w{1})(\w{1})(\w{1})$/,
      apply: function( color, matches ) {
        color.setRGBA( parseInt( matches[1] + matches[1], 16 ),
                       parseInt( matches[2] + matches[2], 16 ),
                       parseInt( matches[3] + matches[3], 16 ),
                       1 );
      }
    },{
      // long hex form, a la '#ffffff'
      regexp: /^#(\w{2})(\w{2})(\w{2})$/,
      apply: function( color, matches ) {
        color.setRGBA( parseInt( matches[1], 16 ),
                       parseInt( matches[2], 16 ),
                       parseInt( matches[3], 16 ),
                       1 );
      }
    },{
      // rgb(...)
      regexp: new RegExp( '^rgb\\(' + rgbNumber + ',' + rgbNumber + ',' + rgbNumber + '\\)$' ),
      apply: function( color, matches ) {
        color.setRGBA( parseRGBNumber( matches[1] ),
                       parseRGBNumber( matches[2] ),
                       parseRGBNumber( matches[3] ),
                       1 );
      }
    },{
      // rgba(...)
      regexp: new RegExp( '^rgba\\(' + rgbNumber + ',' + rgbNumber + ',' + rgbNumber + ',' + aNumber + '\\)$' ),
      apply: function( color, matches ) {
        color.setRGBA( parseRGBNumber( matches[1] ),
                       parseRGBNumber( matches[2] ),
                       parseRGBNumber( matches[3] ),
                       parseFloat( matches[4] ) );
      }
    },{
      // hsl(...)
      regexp: new RegExp( '^hsl\\(' + rawNumber + ',' + rawNumber + '%,' + rawNumber + '%\\)$' ),
      apply: function( color, matches ) {
        color.setHSLA( parseInt( matches[1], 10 ),
                       parseInt( matches[2], 10 ),
                       parseInt( matches[3], 10 ),
                       1 );
      }
    },{
      // hsla(...)
      regexp: new RegExp( '^hsla\\(' + rawNumber + ',' + rawNumber + '%,' + rawNumber + '%,' + aNumber + '\\)$' ),
      apply: function( color, matches ) {
        color.setHSLA( parseInt( matches[1], 10 ),
                       parseInt( matches[2], 10 ),
                       parseInt( matches[3], 10 ),
                       parseFloat( matches[4] ) );
      }
    }
  ];
  
  // see http://www.w3.org/TR/css3-color/
  Color.hueToRGB = function( m1, m2, h ) {
    if ( h < 0 ) {
      h = h + 1;
    }
    if ( h > 1 ) {
      h = h - 1;
    }
    if ( h * 6 < 1 ) {
      return m1 + ( m2 - m1 ) * h * 6;
    }
    if ( h * 2 < 1 ) {
      return m2;
    }
    if ( h * 3 < 2 ) {
      return m1 + ( m2 - m1 ) * ( 2 / 3 - h ) * 6;
    }
    return m1;
  };

  /**
   * Convenience function that converts a color spec to a color object if
   * necessary, or simply returns the color object if not.
   * @param {String|Color} colorSpec
   */
  Color.toColor = function( colorSpec ) {
    return colorSpec instanceof Color ? colorSpec : new Color( colorSpec );
  };
  
  Color.prototype = {
    constructor: Color,
    
    copy: function() {
      return new Color( this.r, this.g, this.b, this.a );
    },
    
    // red, integral 0-255
    getRed: function() { return this.r; },
    setRed: function( value ) { return this.setRGBA( value, this.g, this.b, this.a ); },
    get red() { return this.getRed(); },
    set red( value ) { return this.setRed( value ); },
    
    // green, integral 0-255
    getGreen: function() { return this.g; },
    setGreen: function( value ) { return this.setRGBA( this.r, value, this.b, this.a ); },
    get green() { return this.getGreen(); },
    set green( value ) { return this.setGreen( value ); },
    
    // blue, integral 0-255
    getBlue: function() { return this.b; },
    setBlue: function( value ) { return this.setRGBA( this.r, this.g, value, this.a ); },
    get blue() { return this.getBlue(); },
    set blue( value ) { return this.setBlue( value ); },
    
    // alpha, floating 0-1
    getAlpha: function() { return this.a; },
    setAlpha: function( value ) { return this.setRGBA( this.r, this.g, this.b, value ); },
    get alpha() { return this.getAlpha(); },
    set alpha( value ) { return this.setAlpha( value ); },
    
    // RGB integral between 0-255, alpha (float) between 0-1
    setRGBA: function( red, green, blue, alpha ) {
      this.r = Math.round( clamp( red, 0, 255 ) );
      this.g = Math.round( clamp( green, 0, 255 ) );
      this.b = Math.round( clamp( blue, 0, 255 ) );
      this.a = clamp( alpha, 0, 1 );
      
      this.updateColor(); // update the cached value
      
      return this; // allow chaining
    },
    
    computeCSS: function() {
      if ( this.a === 1 ) {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
      } else {
        var alphaString = this.a === 0 || this.a === 1 ? this.a : this.a.toFixed( 20 ); // toFixed prevents scientific notation
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + alphaString + ')';
      }
    },
    
    toCSS: function() {
      // verify that the cached value is correct (in debugging builds only, defeats the point of caching otherwise)
      assert && assert( this._css === this.computeCSS(), 'CSS cached value is ' + this._css + ', but the computed value appears to be ' + this.computeCSS() );
      
      return this._css;
    },
    
    // called to update the interally cached CSS value
    updateColor: function() {
      assert && assert( !this.immutable, 'Cannot modify an immutable color' );
      
      var oldCSS = this._css;
      this._css = this.computeCSS();
      
      // notify listeners if it changed
      if ( oldCSS !== this._css && this.listeners.length ) {
        var listeners = this.listeners.slice( 0 ); // defensive copy. consider removing if it's a performance bottleneck?
        var length = listeners.length;
        
        for ( var i = 0; i < length; i++ ) {
          listeners[i]();
        }
      }
    },
    
    // allow setting this Color to be immutable when assertions are disabled. any change will throw an error
    setImmutable: function() {
      if ( assert ) {
        this.immutable = true;
      }
      
      return this; // allow chaining
    },
    
    // to what value a Canvas's context.fillStyle should be set
    getCanvasStyle: function() {
      return this.toCSS(); // should be inlined, leave like this for future maintainability
    },
    
    // TODO: make a getHue, getSaturation, getLightness. we can then expose them via ES5!
    setHSLA: function( hue, saturation, lightness, alpha ) {
      hue = ( hue % 360 ) / 360;                    // integer modulo 360
      saturation = clamp( saturation / 100, 0, 1 ); // percentage
      lightness = clamp( lightness / 100, 0, 1 );   // percentage
      
      // see http://www.w3.org/TR/css3-color/
      var m1, m2;
      if ( lightness < 0.5 ) {
        m2 = lightness * ( saturation + 1 );
      } else {
        m2 = lightness + saturation - lightness * saturation;
      }
      m1 = lightness * 2 - m2;
      
      this.r = Math.round( Color.hueToRGB( m1, m2, hue + 1/3 ) * 255 );
      this.g = Math.round( Color.hueToRGB( m1, m2, hue ) * 255 );
      this.b = Math.round( Color.hueToRGB( m1, m2, hue - 1/3 ) * 255 );
      this.a = clamp( alpha, 0, 1 );
      
      this.updateColor(); // update the cached value
      
      return this; // allow chaining
    },
    
    equals: function( color ) {
      return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    },
    
    withAlpha: function( alpha ) {
      return new Color( this.r, this.g, this.b, alpha );
    },
    
    checkFactor: function( factor ) {
      if ( factor < 0 || factor > 1 ) {
        throw new Error( 'factor must be between 0 and 1: ' + factor );
      }
      return ( factor === undefined ) ? 0.7 : factor;
    },
    
    // matches Java's Color.brighter()
    brighterColor: function( factor ) {
      factor = this.checkFactor( factor );
      var red   = Math.min( 255, Math.floor( this.r / factor ) );
      var green = Math.min( 255, Math.floor( this.g / factor ) );
      var blue  = Math.min( 255, Math.floor( this.b / factor ) );
      return new Color( red, green, blue, this.a );
    },
    
    /**
     * Brightens a color in RGB space. Useful when creating gradients from a
     * single base color.
     *
     * @param color
     * @param factor 0 (no change) to 1 (white)
     * @return lighter (closer to white) version of the original color.
     */
    colorUtilsBrighter: function( factor ) {
      factor = this.checkFactor( factor );
      var red = Math.min( 255, this.getRed() + Math.floor( factor * ( 255 - this.getRed() ) ) );
      var green = Math.min( 255, this.getGreen() + Math.floor( factor * ( 255 - this.getGreen() ) ) );
      var blue = Math.min( 255, this.getBlue() + Math.floor( factor * ( 255 - this.getBlue() ) ) );
      return new Color( red, green, blue, this.getAlpha() );
    },
    
    // matches Java's Color.darker()
    darkerColor: function( factor ) {
      factor = this.checkFactor( factor );
      var red   = Math.max( 0, Math.floor( factor * this.r ) );
      var green = Math.max( 0, Math.floor( factor * this.g ) );
      var blue  = Math.max( 0, Math.floor( factor * this.b ) );
      return new Color( red, green, blue, this.a );
    },
    
    /**
     * Darken a color in RGB space. Useful when creating gradients from a single
     * base color.
     *
     * @param color  the original color
     * @param factor 0 (no change) to 1 (black)
     * @return darker (closer to black) version of the original color.
     */
    colorUtilsDarker: function( factor ) {
      factor = this.checkFactor( factor );
      var red = Math.max( 0, this.getRed() - Math.floor( factor * this.getRed() ) );
      var green = Math.max( 0, this.getGreen() - Math.floor( factor * this.getGreen() ) );
      var blue = Math.max( 0, this.getBlue() - Math.floor( factor * this.getBlue() ) );
      return new Color( red, green, blue, this.getAlpha() );
    },
    
    /*
     * Like colorUtilsBrighter/Darker, however factor should be in the range -1 to 1, and it will call:
     *   colorUtilsBrighter( factor )   for factor >  0
     *   this                           for factor == 0
     *   colorUtilsDarker( -factor )    for factor <  0
     * Thus:
     * @param factor from -1 (black), to 0 (no change), to 1 (white)
     */
    colorUtilsBrightness: function( factor ) {
      if ( factor === 0 ) {
        return this;
      } else if ( factor > 0 ) {
        return this.colorUtilsBrighter( factor );
      } else {
        return this.colorUtilsDarker( -factor );
      }
    },
    
    /*---------------------------------------------------------------------------*
    * listeners TODO: consider mixing in this behavior, it's common
    *----------------------------------------------------------------------------*/
    
    // listener should be a callback expecting no arguments, listener() will be called when the color changes
    addChangeListener: function( listener ) {
      assert && assert( listener !== undefined && listener !== null, 'Verify that the listener exists' );
      assert && assert( !_.contains( this.listeners, listener ) );
      this.listeners.push( listener );
    },
    
    removeChangeListener: function( listener ) {
      assert && assert( _.contains( this.listeners, listener ) );
      this.listeners.splice( _.indexOf( this.listeners, listener ), 1 );
    },

    toString: function() {
      return this.constructor.name + "[r:" + this.r + " g:" + this.g + " b:" + this.b + " a:" + this.a + "]";
    }
  };
  
  Color.basicColorKeywords = {
    aqua:    '00ffff',
    black:   '000000',
    blue:    '0000ff',
    fuchsia: 'ff00ff',
    gray:    '808080',
    green:   '008000',
    lime:    '00ff00',
    maroon:  '800000',
    navy:    '000080',
    olive:   '808000',
    purple:  '800080',
    red:     'ff0000',
    silver:  'c0c0c0',
    teal:    '008080',
    white:   'ffffff',
    yellow:  'ffff00'
  };
  
  Color.colorKeywords = {
    aliceblue:            'f0f8ff',
    antiquewhite:         'faebd7',
    aqua:                 '00ffff',
    aquamarine:           '7fffd4',
    azure:                'f0ffff',
    beige:                'f5f5dc',
    bisque:               'ffe4c4',
    black:                '000000',
    blanchedalmond:       'ffebcd',
    blue:                 '0000ff',
    blueviolet:           '8a2be2',
    brown:                'a52a2a',
    burlywood:            'deb887',
    cadetblue:            '5f9ea0',
    chartreuse:           '7fff00',
    chocolate:            'd2691e',
    coral:                'ff7f50',
    cornflowerblue:       '6495ed',
    cornsilk:             'fff8dc',
    crimson:              'dc143c',
    cyan:                 '00ffff',
    darkblue:             '00008b',
    darkcyan:             '008b8b',
    darkgoldenrod:        'b8860b',
    darkgray:             'a9a9a9',
    darkgreen:            '006400',
    darkkhaki:            'bdb76b',
    darkmagenta:          '8b008b',
    darkolivegreen:       '556b2f',
    darkorange:           'ff8c00',
    darkorchid:           '9932cc',
    darkred:              '8b0000',
    darksalmon:           'e9967a',
    darkseagreen:         '8fbc8f',
    darkslateblue:        '483d8b',
    darkslategray:        '2f4f4f',
    darkturquoise:        '00ced1',
    darkviolet:           '9400d3',
    deeppink:             'ff1493',
    deepskyblue:          '00bfff',
    dimgray:              '696969',
    dodgerblue:           '1e90ff',
    feldspar:             'd19275',
    firebrick:            'b22222',
    floralwhite:          'fffaf0',
    forestgreen:          '228b22',
    fuchsia:              'ff00ff',
    gainsboro:            'dcdcdc',
    ghostwhite:           'f8f8ff',
    gold:                 'ffd700',
    goldenrod:            'daa520',
    gray:                 '808080',
    green:                '008000',
    greenyellow:          'adff2f',
    honeydew:             'f0fff0',
    hotpink:              'ff69b4',
    indianred :           'cd5c5c',
    indigo :              '4b0082',
    ivory:                'fffff0',
    khaki:                'f0e68c',
    lavender:             'e6e6fa',
    lavenderblush:        'fff0f5',
    lawngreen:            '7cfc00',
    lemonchiffon:         'fffacd',
    lightblue:            'add8e6',
    lightcoral:           'f08080',
    lightcyan:            'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgrey:            'd3d3d3',
    lightgreen:           '90ee90',
    lightpink:            'ffb6c1',
    lightsalmon:          'ffa07a',
    lightseagreen:        '20b2aa',
    lightskyblue:         '87cefa',
    lightslateblue:       '8470ff',
    lightslategray:       '778899',
    lightsteelblue:       'b0c4de',
    lightyellow:          'ffffe0',
    lime:                 '00ff00',
    limegreen:            '32cd32',
    linen:                'faf0e6',
    magenta:              'ff00ff',
    maroon:               '800000',
    mediumaquamarine:     '66cdaa',
    mediumblue:           '0000cd',
    mediumorchid:         'ba55d3',
    mediumpurple:         '9370d8',
    mediumseagreen:       '3cb371',
    mediumslateblue:      '7b68ee',
    mediumspringgreen:    '00fa9a',
    mediumturquoise:      '48d1cc',
    mediumvioletred:      'c71585',
    midnightblue:         '191970',
    mintcream:            'f5fffa',
    mistyrose:            'ffe4e1',
    moccasin:             'ffe4b5',
    navajowhite:          'ffdead',
    navy:                 '000080',
    oldlace:              'fdf5e6',
    olive:                '808000',
    olivedrab:            '6b8e23',
    orange:               'ffa500',
    orangered:            'ff4500',
    orchid:               'da70d6',
    palegoldenrod:        'eee8aa',
    palegreen:            '98fb98',
    paleturquoise:        'afeeee',
    palevioletred:        'd87093',
    papayawhip:           'ffefd5',
    peachpuff:            'ffdab9',
    peru:                 'cd853f',
    pink:                 'ffc0cb',
    plum:                 'dda0dd',
    powderblue:           'b0e0e6',
    purple:               '800080',
    red:                  'ff0000',
    rosybrown:            'bc8f8f',
    royalblue:            '4169e1',
    saddlebrown:          '8b4513',
    salmon:               'fa8072',
    sandybrown:           'f4a460',
    seagreen:             '2e8b57',
    seashell:             'fff5ee',
    sienna:               'a0522d',
    silver:               'c0c0c0',
    skyblue:              '87ceeb',
    slateblue:            '6a5acd',
    slategray:            '708090',
    snow:                 'fffafa',
    springgreen:          '00ff7f',
    steelblue:            '4682b4',
    tan:                  'd2b48c',
    teal:                 '008080',
    thistle:              'd8bfd8',
    tomato:               'ff6347',
    turquoise:            '40e0d0',
    violet:               'ee82ee',
    violetred:            'd02090',
    wheat:                'f5deb3',
    white:                'ffffff',
    whitesmoke:           'f5f5f5',
    yellow:               'ffff00',
    yellowgreen:          '9acd32'
  };
  
  // Java compatibility
  Color.BLACK      = new Color( 0,   0,   0   ).setImmutable();
  Color.BLUE       = new Color( 0,   0,   255 ).setImmutable();
  Color.CYAN       = new Color( 0,   255, 255 ).setImmutable();
  Color.DARK_GRAY  = new Color( 64,  64,  64  ).setImmutable();
  Color.GRAY       = new Color( 128, 128, 128 ).setImmutable();
  Color.GREEN      = new Color( 0,   255, 0   ).setImmutable();
  Color.LIGHT_GRAY = new Color( 192, 192, 192 ).setImmutable();
  Color.MAGENTA    = new Color( 255, 0,   255 ).setImmutable();
  Color.ORANGE     = new Color( 255, 200, 0   ).setImmutable();
  Color.PINK       = new Color( 255, 175, 175 ).setImmutable();
  Color.RED        = new Color( 255, 0,   0   ).setImmutable();
  Color.WHITE      = new Color( 255, 255, 255 ).setImmutable();
  Color.YELLOW     = new Color( 255, 255, 0   ).setImmutable();

  /**
   * Interpolates between 2 colors in RGBA space. When distance is 0, color1
   * is returned. When distance is 1, color2 is returned. Other values of
   * distance return a color somewhere between color1 and color2. Each color
   * component is interpolated separately.
   *
   * @param {Color} color1
   * @param {Color} color2
   * @param {Number} distance distance between color1 and color2, 0 <= distance <= 1
   * @return {Color}
   */
  Color.interpolateRBGA = function( color1, color2, distance ) {
    if ( distance < 0 || distance > 1 ) {
      throw new Error( 'distance must be between 0 and 1: ' + distance );
    }
    var r = Math.floor( linear( 0, 1, color1.r, color2.r, distance ) );
    var g = Math.floor( linear( 0, 1, color1.g, color2.g, distance ) );
    var b = Math.floor( linear( 0, 1, color1.b, color2.b, distance ) );
    var a = linear( 0, 1, color1.a, color2.a, distance );
    return new Color( r, g, b, a );
  };

  return Color;
} );
