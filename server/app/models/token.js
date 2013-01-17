// Generated by CoffeeScript 1.4.0
(function() {
  var AppError, BaseModel, Token,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require('./basemodel').BaseModel;

  AppError = require('../common/apperror').AppError;

  Token = (function(_super) {

    __extends(Token, _super);

    function Token() {
      this.validate = __bind(this.validate, this);
      return Token.__super__.constructor.apply(this, arguments);
    }

    /*
            Fields
                - type (string)            
                - key (string)
                - value (string)
    */


    Token._meta = {
      type: Token,
      collection: 'tokens',
      logging: {
        isLogged: false,
        onInsert: 'NEW_USERINFO'
      }
    };

    Token.prototype.validate = function() {
      var errors;
      errors = [];
      if (!this.type) {
        errors.push('Invalid type.');
      }
      if (!this.key) {
        errors.push('Invalid key.');
      }
      if (!this.value) {
        errors.push('Invalid value.');
      }
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    };

    return Token;

  })(BaseModel);

  exports.Token = Token;

}).call(this);