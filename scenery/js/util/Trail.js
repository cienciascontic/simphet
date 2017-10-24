// Copyright 2002-2013, University of Colorado

/**
 * Represents a trail (path in the graph) from a 'root' node down to a descendant node.
 * In a DAG, or with different views, there can be more than one trail up from a node,
 * even to the same root node!
 *
 * It has an array of nodes, in order from the 'root' down to the last node,
 * a length, and an array of indices such that node_i.children[index_i] === node_{i+1}.
 *
 * The indices can sometimes become stale when nodes are added and removed, so Trails
 * can have their indices updated with reindex(). It's designed to be as fast as possible
 * on Trails that are already indexed accurately.
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';

  var Matrix3 = require( 'DOT/Matrix3' );
  var Transform3 = require( 'DOT/Transform3' );

  var scenery = require( 'SCENERY/scenery' );

  require( 'SCENERY/nodes/Node' );
  // require( 'SCENERY/util/TrailPointer' );

  scenery.Trail = function Trail( nodes ) {
    /*
     * Controls the immutability of the trail.
     * If set to true, add/remove descendant/ancestor should fail if assertions are enabled
     * Use setImmutable() or setMutable() to signal a specific type of protection, so it cannot be changed later
     */
    if ( assert ) {
      // only do this if assertions are enabled, otherwise we won't access it at all
      this.immutable = undefined;
    }

    if ( nodes instanceof Trail ) {
      // copy constructor (takes advantage of already built index information)
      var otherTrail = nodes;

      this.nodes = otherTrail.nodes.slice( 0 );
      this.length = otherTrail.length;
      this.uniqueId = otherTrail.uniqueId;
      this.indices = otherTrail.indices.slice( 0 );
      return;
    }

    this.nodes = [];
    this.length = 0;
    this.uniqueId = '';

    // indices[x] stores the index of nodes[x] in nodes[x-1]'s children
    this.indices = [];

    var trail = this;
    if ( nodes ) {
      if ( nodes instanceof scenery.Node ) {
        var node = nodes;

        // add just a single node in
        trail.addDescendant( node );
      }
      else {
        // process it as an array
        var len = nodes.length;
        for ( var i = 0; i < len; i++ ) {
          trail.addDescendant( nodes[i] );
        }
      }
    }

    phetAllocation && phetAllocation( 'Trail' );
  };
  var Trail = scenery.Trail;

  Trail.prototype = {
    constructor: Trail,

    copy: function() {
      return new Trail( this );
    },

    // convenience function to determine whether this trail will render something
    isPainted: function() {
      return this.lastNode().isPainted();
    },

    // this trail is visible only if all nodes on it are marked as visible
    isVisible: function() {
      var i = this.nodes.length;
      while ( i-- ) {
        if ( !this.nodes[i].isVisible() ) {
          return false;
        }
      }
      return true;
    },

    getOpacity: function() {
      var opacity = 1;
      var i = this.nodes.length;
      while ( i-- ) {
        opacity *= this.nodes[i].getOpacity();
      }
      return opacity;
    },

    // essentially whether this node is visited in the hit-testing operation
    isPickable: function() {
      // it won't be if it or any ancestor is pickable: false, or is invisible
      if ( _.some( this.nodes, function( node ) { return node._pickable === false || node._visible === false; } ) ) { return false; }

      // if there is any listener or pickable: true, it will be pickable
      if ( _.some( this.nodes, function( node ) { return node._pickable === true || node._inputListeners.length > 0; } ) ) { return true; }

      if ( this.lastNode()._subtreePickableCount > 0 ) {
        return true;
      }

      // no listeners or pickable: true, so it will be pruned
      return false;
    },

    get: function( index ) {
      if ( index >= 0 ) {
        return this.nodes[index];
      }
      else {
        // negative index goes from the end of the array
        return this.nodes[this.nodes.length + index];
      }
    },

    slice: function( startIndex, endIndex ) {
      return new Trail( this.nodes.slice( startIndex, endIndex ) );
    },

    subtrailTo: function( node, excludeNode ) {
      return this.slice( 0, _.indexOf( this.nodes, node ) + ( excludeNode ? 0 : 1 ) );
    },

    isEmpty: function() {
      return this.nodes.length === 0;
    },

    getInstance: function() {
      return this.lastNode().getInstanceFromTrail( this );
    },

    // from local to global
    getMatrix: function() {
      // TODO: performance: can we cache this ever? would need the scene to not really change in between
      // this matrix will be modified in place, so always start fresh
      var matrix = Matrix3.identity();

      // from the root up
      var nodes = this.nodes;
      var length = nodes.length;
      for ( var i = 0; i < length; i++ ) {
        matrix.multiplyMatrix( nodes[i]._transform.getMatrix() );
      }
      return matrix;
    },

    // from parent to global
    getParentMatrix: function() {
      // this matrix will be modified in place, so always start fresh
      var matrix = Matrix3.identity();

      // from the root up
      var nodes = this.nodes;
      var length = nodes.length;
      for ( var i = 0; i < length - 1; i++ ) {
        matrix.multiplyMatrix( nodes[i]._transform.getMatrix() );
      }
      return matrix;
    },

    // from local to global
    getTransform: function() {
      return new Transform3( this.getMatrix() );
    },

    // from parent to global
    getParentTransform: function() {
      return new Transform3( this.getParentMatrix() );
    },

    addAncestor: function( node, index ) {
      assert && assert( !this.immutable, 'cannot modify an immutable Trail with addAncestor' );
      assert && assert( node, 'cannot add falsy value to a Trail' );


      if ( this.nodes.length ) {
        var oldRoot = this.nodes[0];
        this.indices.unshift( index === undefined ? _.indexOf( node._children, oldRoot ) : index );
      }
      this.nodes.unshift( node );

      this.length++;
      // accelerated version of this.updateUniqueId()
      this.uniqueId = ( this.uniqueId ? node._id + '-' + this.uniqueId : node._id + '' );
      return this;
    },

    removeAncestor: function() {
      assert && assert( !this.immutable, 'cannot modify an immutable Trail with removeAncestor' );
      assert && assert( this.length > 0, 'cannot remove a Node from an empty trail' );

      this.nodes.shift();
      if ( this.indices.length ) {
        this.indices.shift();
      }

      this.length--;
      this.updateUniqueId();
      return this;
    },

    addDescendant: function( node, index ) {
      assert && assert( !this.immutable, 'cannot modify an immutable Trail with addDescendant' );
      assert && assert( node, 'cannot add falsy value to a Trail' );


      if ( this.nodes.length ) {
        var parent = this.lastNode();
        this.indices.push( index === undefined ? _.indexOf( parent._children, node ) : index );
      }
      this.nodes.push( node );

      this.length++;
      // accelerated version of this.updateUniqueId()
      this.uniqueId = ( this.uniqueId ? this.uniqueId + '-' + node._id : node._id + '' );
      return this;
    },

    removeDescendant: function() {
      assert && assert( !this.immutable, 'cannot modify an immutable Trail with removeDescendant' );
      assert && assert( this.length > 0, 'cannot remove a Node from an empty trail' );

      this.nodes.pop();
      if ( this.indices.length ) {
        this.indices.pop();
      }

      this.length--;
      this.updateUniqueId();
      return this;
    },

    // refreshes the internal index references (important if any children arrays were modified!)
    reindex: function() {
      var length = this.length;
      for ( var i = 1; i < length; i++ ) {
        // only replace indices where they have changed (this was a performance hotspot)
        var currentIndex = this.indices[i - 1];
        var baseNode = this.nodes[i - 1];

        if ( baseNode._children[currentIndex] !== this.nodes[i] ) {
          this.indices[i - 1] = _.indexOf( baseNode._children, this.nodes[i] );
        }
      }
    },

    setImmutable: function() {
      // if assertions are disabled, we hope this is inlined as a no-op
      if ( assert ) {
        assert( this.immutable !== false, 'A trail cannot be made immutable after being flagged as mutable' );
        this.immutable = true;
      }

      // TODO: consider setting mutators to null here instead of the function call check (for performance, and profile the differences)

      return this; // allow chaining
    },

    setMutable: function() {
      // if assertions are disabled, we hope this is inlined as a no-op
      if ( assert ) {
        assert( this.immutable !== true, 'A trail cannot be made mutable after being flagged as immutable' );
        this.immutable = false;
      }

      return this; // allow chaining
    },

    areIndicesValid: function() {
      for ( var i = 1; i < this.length; i++ ) {
        var currentIndex = this.indices[i - 1];
        if ( this.nodes[i - 1]._children[currentIndex] !== this.nodes[i] ) {
          return false;
        }
      }
      return true;
    },

    equals: function( other ) {
      if ( this.length !== other.length ) {
        return false;
      }

      for ( var i = 0; i < this.nodes.length; i++ ) {
        if ( this.nodes[i] !== other.nodes[i] ) {
          return false;
        }
      }

      return true;
    },

    // returns a new Trail from the root up to the parameter node.
    upToNode: function( node ) {
      var nodeIndex = _.indexOf( this.nodes, node );
      assert && assert( nodeIndex >= 0, 'Trail does not contain the node' );
      return this.slice( 0, _.indexOf( this.nodes, node ) + 1 );
    },

    // whether this trail contains the complete 'other' trail, but with added descendants afterwards
    isExtensionOf: function( other, allowSameTrail ) {
      assertSlow && assertSlow( this.areIndicesValid(), 'Trail.compare this.areIndicesValid() failed' );
      assertSlow && assertSlow( other.areIndicesValid(), 'Trail.compare other.areIndicesValid() failed' );

      if ( this.length <= other.length - ( allowSameTrail ? 1 : 0 ) ) {
        return false;
      }

      for ( var i = 0; i < other.nodes.length; i++ ) {
        if ( this.nodes[i] !== other.nodes[i] ) {
          return false;
        }
      }

      return true;
    },

    // a transform from our local coordinate frame to the other trail's local coordinate frame
    getTransformTo: function( otherTrail ) {
      return new Transform3( this.getMatrixTo( otherTrail ) );
    },

    // returns a matrix that transforms a point in our last node's local coordinate frame to the other trail's last node's local coordinate frame
    getMatrixTo: function( otherTrail ) {
      this.reindex();
      otherTrail.reindex();

      var branchIndex = this.getBranchIndexTo( otherTrail );
      var idx;

      var matrix = Matrix3.IDENTITY;

      // walk our transform down, prepending
      for ( idx = this.length - 1; idx >= branchIndex; idx-- ) {
        matrix = this.nodes[idx].getTransform().getMatrix().timesMatrix( matrix );
      }

      // walk our transform up, prepending inverses
      for ( idx = branchIndex; idx < otherTrail.length; idx++ ) {
        matrix = otherTrail.nodes[idx].getTransform().getInverse().timesMatrix( matrix );
      }

      return matrix;
    },

    // the first index that is different between this trail and the other trail
    getBranchIndexTo: function( otherTrail ) {
      assert && assert( this.nodes[0] === otherTrail.nodes[0], 'To get a branch index, the trails must have the same root' );

      var branchIndex;

      for ( branchIndex = 0; branchIndex < Math.min( this.length, otherTrail.length ); branchIndex++ ) {
        if ( this.nodes[branchIndex] !== otherTrail.nodes[branchIndex] ) {
          break;
        }
      }

      return branchIndex;
    },

    // TODO: phase out in favor of get()
    nodeFromTop: function( offset ) {
      return this.nodes[this.length - 1 - offset];
    },

    lastNode: function() {
      return this.nodeFromTop( 0 );
    },

    rootNode: function() {
      return this.nodes[0];
    },

    // returns the previous graph trail in the order of self-rendering
    previous: function() {
      if ( this.nodes.length <= 1 ) {
        return null;
      }

      var top = this.nodeFromTop( 0 );
      var parent = this.nodeFromTop( 1 );

      var parentIndex = _.indexOf( parent._children, top );
      assert && assert( parentIndex !== -1 );
      var arr = this.nodes.slice( 0, this.nodes.length - 1 );
      if ( parentIndex === 0 ) {
        // we were the first child, so give it the trail to the parent
        return new Trail( arr );
      }
      else {
        // previous child
        arr.push( parent._children[parentIndex - 1] );

        // and find its last terminal
        while ( arr[arr.length - 1]._children.length !== 0 ) {
          var last = arr[arr.length - 1];
          arr.push( last._children[last._children.length - 1] );
        }

        return new Trail( arr );
      }
    },

    // like previous(), but keeps moving back until the trail goes to a node with isPainted() === true
    previousPainted: function() {
      var result = this.previous();
      while ( result && !result.isPainted() ) {
        result = result.previous();
      }
      return result;
    },

    // in the order of self-rendering
    next: function() {
      var arr = this.nodes.slice( 0 );

      var top = this.nodeFromTop( 0 );
      if ( top._children.length > 0 ) {
        // if we have children, return the first child
        arr.push( top._children[0] );
        return new Trail( arr );
      }
      else {
        // walk down and attempt to find the next parent
        var depth = this.nodes.length - 1;

        while ( depth > 0 ) {
          var node = this.nodes[depth];
          var parent = this.nodes[depth - 1];

          arr.pop(); // take off the node so we can add the next sibling if it exists

          var index = _.indexOf( parent._children, node );
          if ( index !== parent._children.length - 1 ) {
            // there is another (later) sibling. use that!
            arr.push( parent._children[index + 1] );
            return new Trail( arr );
          }
          else {
            depth--;
          }
        }

        // if we didn't reach a later sibling by now, it doesn't exist
        return null;
      }
    },

    // like next(), but keeps moving back until the trail goes to a node with isPainted() === true
    nextPainted: function() {
      var result = this.next();
      while ( result && !result.isPainted() ) {
        result = result.next();
      }
      return result;
    },

    // calls callback( trail ) for this trail, and each descendant trail. If callback returns true, subtree will be skipped
    eachTrailUnder: function( callback ) {
      // TODO: performance: should be optimized to be much faster, since we don't have to deal with the before/after
      new scenery.TrailPointer( this, true ).eachTrailBetween( new scenery.TrailPointer( this, false ), callback );
    },

    /*
     * Standard Java-style compare. -1 means this trail is before (under) the other trail, 0 means equal, and 1 means this trail is
     * after (on top of) the other trail.
     * A shorter subtrail will compare as -1.
     *
     * Assumes that the Trails are properly indexed. If not, please reindex them!
     *
     * Comparison is for the rendering order, so an ancestor is 'before' a descendant
     */
    compare: function( other ) {
      assert && assert( !this.isEmpty(), 'cannot compare with an empty trail' );
      assert && assert( !other.isEmpty(), 'cannot compare with an empty trail' );
      assert && assert( this.nodes[0] === other.nodes[0], 'for Trail comparison, trails must have the same root node' );
      assertSlow && assertSlow( this.areIndicesValid(), 'Trail.compare this.areIndicesValid() failed on ' + this.toString() );
      assertSlow && assertSlow( other.areIndicesValid(), 'Trail.compare other.areIndicesValid() failed on ' + other.toString() );

      var minNodeIndex = Math.min( this.indices.length, other.indices.length );
      for ( var i = 0; i < minNodeIndex; i++ ) {
        if ( this.indices[i] !== other.indices[i] ) {
          if ( this.indices[i] < other.indices[i] ) {
            return -1;
          }
          else {
            return 1;
          }
        }
      }

      // we scanned through and no nodes were different (one is a subtrail of the other)
      if ( this.nodes.length < other.nodes.length ) {
        return -1;
      }
      else if ( this.nodes.length > other.nodes.length ) {
        return 1;
      }
      else {
        return 0;
      }
    },

    isBefore: function( other ) {
      return this.compare( other ) === -1;
    },

    isAfter: function( other ) {
      return this.compare( other ) === 1;
    },

    localToGlobalPoint: function( point ) {
      // TODO: performance: multiple timesVector2 calls up the chain is probably faster
      return this.getMatrix().timesVector2( point );
    },

    localToGlobalBounds: function( bounds ) {
      return bounds.transformed( this.getMatrix() );
    },

    globalToLocalPoint: function( point ) {
      return this.getTransform().inversePosition2( point );
    },

    globalToLocalBounds: function( bounds ) {
      return this.getTransform().inverseBounds2( bounds );
    },

    parentToGlobalPoint: function( point ) {
      // TODO: performance: multiple timesVector2 calls up the chain is probably faster
      return this.getParentMatrix().timesVector2( point );
    },

    parentToGlobalBounds: function( bounds ) {
      return bounds.transformed( this.getParentMatrix() );
    },

    globalToParentPoint: function( point ) {
      return this.getParentTransform().inversePosition2( point );
    },

    globalToParentBounds: function( bounds ) {
      return this.getParentTransform().inverseBounds2( bounds );
    },

    updateUniqueId: function() {
      // string concatenation is faster, see http://jsperf.com/string-concat-vs-joins
      var result = '';
      var len = this.nodes.length;
      if ( len > 0 ) {
        result += this.nodes[0]._id;
      }
      for ( var i = 1; i < len; i++ ) {
        result += '-' + this.nodes[i]._id;
      }
      this.uniqueId = result;
      // this.uniqueId = _.map( this.nodes, function( node ) { return node.getId(); } ).join( '-' );
    },

    // concatenates the unique IDs of nodes in the trail, so that we can do id-based lookups
    getUniqueId: function() {
      // sanity checks
      if ( assert ) {
        var oldUniqueId = this.uniqueId;
        this.updateUniqueId();
        assert( oldUniqueId === this.uniqueId );
      }
      return this.uniqueId;
    },

    toString: function() {
      this.reindex();
      if ( !this.length ) {
        return 'Empty Trail';
      }
      return '[Trail ' + this.indices.join( '.' ) + ' ' + this.getUniqueId() + ']';
    }
  };

  // like eachTrailBetween, but only fires for painted trails. If callback returns true, subtree will be skipped
  Trail.eachPaintedTrailBetween = function( a, b, callback, excludeEndTrails, scene ) {
    Trail.eachTrailBetween( a, b, function( trail ) {
      if ( trail && trail.isPainted() ) {
        return callback( trail );
      }
    }, excludeEndTrails, scene );
  };

  // global way of iterating across trails. when callback returns true, subtree will be skipped
  Trail.eachTrailBetween = function( a, b, callback, excludeEndTrails, scene ) {
    var aPointer = a ? new scenery.TrailPointer( a.copy(), true ) : new scenery.TrailPointer( new scenery.Trail( scene ), true );
    var bPointer = b ? new scenery.TrailPointer( b.copy(), true ) : new scenery.TrailPointer( new scenery.Trail( scene ), false );

    // if we are excluding endpoints, just bump the pointers towards each other by one step
    if ( excludeEndTrails ) {
      aPointer.nestedForwards();
      bPointer.nestedBackwards();

      // they were adjacent, so no callbacks will be executed
      if ( aPointer.compareNested( bPointer ) === 1 ) {
        return;
      }
    }

    aPointer.depthFirstUntil( bPointer, function( pointer ) {
      if ( pointer.isBefore ) {
        return callback( pointer.trail );
      }
    }, false );
  };

  // The index at which the two trails diverge. If a.length === b.length === branchIndex, the trails are identical
  Trail.branchIndex = function( a, b ) {
    assert && assert( a.nodes[0] === b.nodes[0], 'Branch changes require roots to be the same' );
    var branchIndex;
    var shortestLength = Math.min( a.length, b.length );
    for ( branchIndex = 0; branchIndex < shortestLength; branchIndex++ ) {
      if ( a.nodes[branchIndex] !== b.nodes[branchIndex] ) {
        break;
      }
    }
    return branchIndex;
  };

  // The subtrail from the root that both trails share
  Trail.sharedTrail = function( a, b ) {
    return a.slice( 0, Trail.branchIndex( a, b ) );
  };

  /*
   * Fires subtree(trail) or self(trail) on the callbacks to create disjoint subtrees (trails) that cover exactly the nodes
   * inclusively between a and b in rendering order.
   * We try to consolidate these as much as possible.
   *
   * "a" and "b" are treated like self painted trails in the rendering order
   * 
   *
   * Example tree:
   *   a
   *   - b
   *   --- c
   *   --- d
   *   - e
   *   --- f
   *   ----- g
   *   ----- h
   *   ----- i
   *   --- j
   *   ----- k
   *   - l
   *   - m
   *   --- n
   *
   * spannedSubtrees( a, a ) -> self( a );
   * spannedSubtrees( c, n ) -> subtree( a ); NOTE: if b is painted, that wouldn't work!
   * spannedSubtrees( h, l ) -> subtree( h ); subtree( i ); subtree( j ); self( l );
   * spannedSubtrees( c, i ) -> [b,f] --- wait, include e self?
   */
  Trail.spannedSubtrees = function( a, b ) {
    // assert && assert( a.nodes[0] === b.nodes[0], 'Spanned subtrees for a and b requires that a and b have the same root' );

    // a.reindex();
    // b.reindex();

    // var subtrees = [];

    // var branchIndex = Trail.branchIndex( a, b );
    // assert && assert( branchIndex > 0, 'Branch index should always be > 0' );

    // if ( a.length === branchIndex && b.length === branchIndex ) {
    //   // the two trails are equal
    //   subtrees.push( a );
    // } else {
    //   // find the first place where our start isn't the first child
    //   for ( var before = a.length - 1; before >= branchIndex; before-- ) {
    //     if ( a.indices[before-1] !== 0 ) {
    //       break;
    //     }
    //   }

    //   // find the first place where our end isn't the last child
    //   for ( var after = a.length - 1; after >= branchIndex; after-- ) {
    //     if ( b.indices[after-1] !== b.nodes[after-1]._children.length - 1 ) {
    //       break;
    //     }
    //   }

    //   if ( before < branchIndex && after < branchIndex ) {
    //     // we span the entire tree up to nodes[branchIndex-1], so return only that subtree
    //     subtrees.push( a.slice( 0, branchIndex ) );
    //   } else {
    //     // walk the subtrees down from the start
    //     for ( var ia = before; ia >= branchIndex; ia-- ) {
    //       subtrees.push( a.slice( 0, ia + 1 ) );
    //     }

    //     // walk through the middle
    //     var iStart = a.indices[branchIndex-1];
    //     var iEnd = b.indices[branchIndex-1];
    //     var base = a.slice( 0, branchIndex );
    //     var children = base.lastNode()._children;
    //     for ( var im = iStart; im <= iEnd; im++ ) {
    //       subtrees.push( base.copy().addDescendant( children[im], im ) );
    //     }

    //     // walk the subtrees up to the end
    //     for ( var ib = branchIndex; ib <= after; ib++ ) {
    //       subtrees.push( b.slice( 0, ib + 1 ) );
    //     }
    //   }
    // }

    // return subtrees;
  };

  return Trail;
} );


