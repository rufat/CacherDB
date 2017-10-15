# CacherDB [![Build Status](https://travis-ci.org/rufatmammadli/CacherDB.svg?branch=master)](https://travis-ci.org/rufatmammadli/CacherDB) [![npm version](https://badge.fury.io/js/cacherdb.svg)](https://badge.fury.io/js/cacherdb)
A simple in-memory cache for Node.js.

## Info
This codebase is cloned from [Tinycache](https://github.com/andyburke/tinycache).
Thanks to Andy Burke.

## Installation

    npm install cacherdb --save

## Usage

```javascript
var CacherDB = require( 'cacherdb' );
var cache = new CacherDB({
    letDuplicate: false, //let to insert same values
    autoSave: true, //save automatically to json file
    file: 'data.json' //file name or location + file name
});

// now just use the cache

cache.put( 'foo', 'bar' );
console.log( cache.get( 'foo' ) );

// that wasn't too interesting, here's the good part

cache.put( 'houdini', 'disapear', 100 ); // Time in ms
console.log( 'Houdini will now ' + cache.get( 'houdini' ) );

setTimeout( function() {
  console.log( 'Houdini is ' + cache.get( 'houdini' ) );
}, 200 );
    
// don't want to allocate separate caches?
// there's also a default shared cache:
var sharedCache = CacherDB.shared;

sharedCache.put( 'foo', 'bar' );

// or you could grab it in a one-liner
var theSharedCache = require( 'cacherdb' ).shared;

theSharedCache.get( 'bloop' );

```

## API

### cache.put( key, value, [time] )

Stores a value to the cache.
If time (in ms) is specified, the value will be automatically removed (via setTimeout).

### cache.get( [key] )

Retreives a value for a given key, or if no key is passed, will return the internal cache object.

### cache.del( key )

Deletes a key, returns a boolean indicating if the key existed and was deleted.

### cache.clear()

Deletes all keys.

### cache.size

The current number of entries in the cache.

### cache.memsize

The approximate size in bytes of the cache (including all objects stored and cache overhead)

This is a rough estimate, using the js-sizeof library.

### cache.hits

The number of cache hits.

### cache.misses

The number of cache misses.

### cache.getAll

Whole data from the library (includes cache memory and storage statistics).

## Contributing
 
* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request.
