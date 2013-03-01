// Generated by CoffeeScript 1.5.0
(function() {
  var Database, Mongo, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Mongo = require('mongodb');

  utils = require('./utils');

  Database = (function() {

    function Database(conf) {
      this.conf = conf;
      this.ObjectId = __bind(this.ObjectId, this);
      this.incrementCounter = __bind(this.incrementCounter, this);
      this.remove = __bind(this.remove, this);
      this.findOne = __bind(this.findOne, this);
      this.findWithOptions = __bind(this.findWithOptions, this);
      this.find = __bind(this.find, this);
      this.updateAll = __bind(this.updateAll, this);
      this.update = __bind(this.update, this);
      this.insert = __bind(this.insert, this);
      this.execute = __bind(this.execute, this);
      this.getDb = __bind(this.getDb, this);
    }

    Database.prototype.getDb = function(cb) {
      var client,
        _this = this;
      if (this.db == null) {
        client = new Mongo.Db(this.conf.name, new Mongo.Server(this.conf.host, this.conf.port, {}), {
          safe: true
        });
        return client.open(function(err, db) {
          _this.db = db;
          return cb(err, _this.db);
        });
      } else {
        return cb(null, this.db);
      }
    };

    Database.prototype.execute = function(task) {
      var _this = this;
      return this.getDb(function(err, db) {
        try {
          return task(db, function(err) {});
        } catch (e) {
          return utils.dumpError(e);
        }
      });
    };

    Database.prototype.insert = function(collectionName, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          return collection.insert(document, {
            safe: true
          }, function(e, r) {
            if (typeof cb === "function") {
              cb(e, r != null ? r[0] : void 0);
            }
            return completionCallback(e);
          });
        });
      });
    };

    Database.prototype.update = function(collectionName, params, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          return collection.update(params, document, {
            safe: true,
            multi: false
          }, function(e, r) {
            if (typeof cb === "function") {
              cb(e, r);
            }
            return completionCallback(e);
          });
        });
      });
    };

    Database.prototype.updateAll = function(collectionName, params, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          return collection.update(params, document, {
            safe: true,
            multi: true
          }, function(e, r) {
            if (typeof cb === "function") {
              cb(e, r);
            }
            return completionCallback(e);
          });
        });
      });
    };

    Database.prototype.find = function(collectionName, query, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          var cursor;
          cursor = collection.find(query);
          if (typeof cb === "function") {
            cb(err, cursor);
          }
          return completionCallback(err);
        });
      });
    };

    Database.prototype.findWithOptions = function(collectionName, query, options, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          var cursor;
          cursor = collection.find(query, options);
          if (typeof cb === "function") {
            cb(err, cursor);
          }
          return completionCallback(err);
        });
      });
    };

    Database.prototype.findOne = function(collectionName, query, cb) {
      var _this = this;
      return this.find(collectionName, query, function(err, cursor) {
        return cursor.nextObject(function(err, item) {
          return typeof cb === "function" ? cb(err, item) : void 0;
        });
      });
    };

    Database.prototype.remove = function(collectionName, params, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection(collectionName, function(err, collection) {
          return collection.remove(params, {
            safe: true
          }, function(e, r) {
            if (typeof cb === "function") {
              cb(e, r);
            }
            return completionCallback(e);
          });
        });
      });
    };

    Database.prototype.incrementCounter = function(key, cb) {
      var _this = this;
      return this.execute(function(db, completionCallback) {
        return db.collection('_counters', function(err, collection) {
          return collection.findAndModify({
            key: key
          }, {}, {
            $inc: {
              value: 1
            }
          }, {}, function(e, kvp) {
            if (typeof cb === "function") {
              cb(e, kvp.value);
            }
            return completionCallback(e);
          });
        });
      });
    };

    Database.prototype.ObjectId = function(id) {
      if (id) {
        if (typeof id === "string") {
          return new Mongo.ObjectID(id);
        } else {
          return id;
        }
      } else {
        return new Mongo.ObjectID();
      }
    };

    return Database;

  })();

  exports.Database = Database;

}).call(this);
