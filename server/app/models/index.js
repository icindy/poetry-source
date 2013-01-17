// Generated by CoffeeScript 1.4.0
(function() {
  var Comment, Message, Models, Post, Session, Token, User, UserInfo;

  User = require('./user').User;

  Post = require('./post').Post;

  Comment = require('./comment').Comment;

  Message = require('./message').Message;

  Session = require('./session').Session;

  Token = require('./token').Token;

  UserInfo = require('./userinfo').UserInfo;

  Models = (function() {

    function Models(dbconf) {
      var model, _i, _len, _ref;
      this.dbconf = dbconf;
      this.User = User;
      this.Post = Post;
      this.Comment = Comment;
      this.Message = Message;
      this.Session = Session;
      this.Token = Token;
      this.UserInfo = UserInfo;
      _ref = [User, Post, Comment, Message, Session, Token, UserInfo];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        this.initModel(model);
      }
    }

    Models.prototype.initModel = function(model) {
      model._database = new (require('../common/database')).Database(this.dbconf);
      return model._models = this;
    };

    return Models;

  })();

  exports.Models = Models;

}).call(this);