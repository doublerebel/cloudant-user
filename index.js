// Generated by IcedCoffeeScript 1.7.1-e
(function() {
  var CloudantUser, cradle, crypto, iced, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  cradle = require("cradle");

  crypto = require("crypto");

  CloudantUser = (function() {
    CloudantUser.prototype.defaultRoles = ["_default", "_reader", "_creator", "_writer"];

    function CloudantUser(server, adminuser) {
      var _ref, _ref1;
      this.server = server;
      this.adminuser = adminuser;
      if (!((_ref = this.server) != null ? _ref.host : void 0)) {
        throw new Error("server.host required");
      }
      if (!((_ref1 = this.adminuser) != null ? _ref1.name : void 0)) {
        throw new Error("adminuser.name required");
      }
      cradle.setup({
        host: this.server.host,
        port: this.server.port || 80,
        cache: false,
        timeout: 5000
      });
      this.connect();
    }

    CloudantUser.prototype.couchUser = function(name) {
      return "org.couchdb.user:" + name;
    };

    CloudantUser.prototype.connect = function() {
      this.conn = new cradle.Connection({
        secure: this.server.secure != null ? this.server.secure : true,
        auth: {
          username: this.adminuser.name,
          password: this.adminuser.pass
        }
      });
      return this.db = this.conn.database("_users");
    };

    CloudantUser.prototype.create = function() {
      var cb, doc, err, hashAndSalt, name, password, roles, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      name = arguments[0], password = arguments[1], roles = 4 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2, []), cb = arguments[_i++];
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/charles/source/cloudant-user/index.coffee",
            funcname: "CloudantUser.create"
          });
          _this.exists(name, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return doc = arguments[1];
              };
            })(),
            lineno: 36
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (doc !== false) {
            return cb(err || {
              error: "user_exists"
            });
          }
          if (!roles.length) {
            roles = _this.defaultRoles;
          }
          hashAndSalt = _this.generatePasswordHash(password);
          return _this.db.save(_this.couchUser(name), {
            name: name,
            password_sha: hashAndSalt[0],
            salt: hashAndSalt[1],
            password_scheme: "simple",
            type: "user",
            roles: roles
          }, cb);
        };
      })(this));
    };

    CloudantUser.prototype.get = function(name, callback) {
      return this.db.get(this.couchUser(name), callback);
    };

    CloudantUser.prototype.exists = function(name, cb) {
      var doc, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/charles/source/cloudant-user/src/index.coffee",
            funcname: "CloudantUser.exists"
          });
          _this.db.get(_this.couchUser(name), __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return doc = arguments[1];
              };
            })(),
            lineno: 54
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if ((typeof err !== "undefined" && err !== null ? err.error : void 0) === "not_found") {
            return cb(err, false);
          } else if (doc) {
            return cb(null, doc);
          } else {
            return cb(err);
          }
        };
      })(this));
    };

    CloudantUser.prototype.update = function(name, props, autocb) {
      var hashAndSalt, password;
      if (!props) {
        autocb({
          error: "properties for user required"
        });
        return;
      }
      password = props.password;
      if (password) {
        delete props.password;
        hashAndSalt = this.generatePasswordHash(password);
        props.password_sha = hashAndSalt[0];
        props.salt = hashAndSalt[1];
        props.password_scheme = "simple";
      }
      autocb(this.db.merge(this.couchUser(name), props, autocb));
      return;
    };

    CloudantUser.prototype.remove = function(name, callback) {
      return this.db.remove(name, callback);
    };

    CloudantUser.prototype.generatePasswordHash = function(password) {
      var hash, salt;
      salt = (crypto.randomBytes(16)).toString("hex");
      hash = crypto.createHash("sha1");
      hash.update(password + salt);
      return [hash.digest("hex"), salt];
    };

    return CloudantUser;

  })();

  module.exports = CloudantUser;

}).call(this);
