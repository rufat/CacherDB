'use strict';

let sizeof = require( 'js-sizeof' ),
    fs     = require('fs');

let RefreshDB = function(object) {
    if(object.allData._options.data.autoSave) {
        fs.writeFile(object.dbLocation, JSON.stringify(object.allData), (err) => {
            if (err) throw err;
        });
    }
};

let CacherDB = function(opts) {
    let self = this;
    self._cache = {};
    self._timeouts = {};
    self._hits = 0;
    self._misses = 0;
    self._size = 0;
    if(typeof opts != 'undefined') {
        self._options = {loaded: true, data: opts};
    } else {
        self._options = {loaded: false, data: null};
    }
    return self;
};

CacherDB.prototype = {
    get size() {
        return this._size;
    },
    get memsize() {
        return sizeof( this._cache );
    },
    get hits() {
        return this._hits;
    },
    get misses() {
        return this._misses;
    }
};

CacherDB.prototype.put = function( key, value, time ) {
    let self = this;

    if ( self._timeouts[ key ] ) {
        clearTimeout( self._timeouts[ key ] );
        delete self._timeouts[ key ];
    }

    if(self._options.letDuplicate) {
        self._cache[ key ].push(value);
    } else {
        if(typeof self._cache[ key ] != 'undefined') {
            if(typeof self._cache[ key ] == 'object') {
                self._cache[ key ].push(value);
            } else {
                let oldVal = self._cache[ key ];
                self._cache[ key ] = [];
                self._cache[ key ].push(oldVal);
                self._cache[ key ].push(value);
            }
        } else {
            self._cache[ key ] = [];
            self._cache[ key ].push(value);
        }
    }

    if ( !isNaN( time ) ) {
        self._timeouts[ key ] = setTimeout( self.del.bind( self, key ), time );
    }

    ++self._size;
    if(self._options.loaded) RefreshDB({dbLocation: self._options.data.file.toString(), allData: self})
};

CacherDB.prototype.del = function( key ) {
    let self = this;

    clearTimeout( self._timeouts[ key ] );
    delete self._timeouts[ key ];

    if ( !( key in self._cache )  ) {
        return false;
    }

    delete self._cache[ key ];
    --self._size;
    if(self._options.loaded) RefreshDB({dbLocation: self._options.data.file.toString(), allData: self})
    return true;
};

CacherDB.prototype.clear = function() {
    let self = this;

    for ( let key in self._timeouts ) {
        clearTimeout( self._timeouts[ key ] );
    }

    self._cache = {};
    self._timeouts = {};
    self._size = 0;
    if(self._options.loaded) RefreshDB({dbLocation: self._options.data.file.toString(), allData: self})
};

CacherDB.prototype.get = function( key ) {
    let self = this;

    if ( typeof key === 'undefined' ) {
        return self._cache;
    }

    if ( !( key in self._cache ) ) {
        ++self._misses;
        return null;
    }

    ++self._hits;
    return self._cache[ key ];
};

CacherDB.prototype.getAll = function() {
    return this;
};

CacherDB.shared = new CacherDB();

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = CacherDB;
}
else if ( typeof define === 'function' && define.amd ) {
    define( [], function() {
        return CacherDB;
    } );
}
else {
    window.CacherDB = CacherDB;
}