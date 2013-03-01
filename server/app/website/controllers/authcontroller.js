// Generated by CoffeeScript 1.5.0
(function() {
  var AppError, AuthController, OAuth, conf, controller, https, models, oa, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  https = require('https');

  conf = require('../../conf');

  models = new (require('../../models')).Models(conf.db);

  controller = require('./controller');

  utils = require('../../common/utils');

  AppError = require('../../common/apperror').AppError;

  OAuth = require('oauth').OAuth;

  oa = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", conf.auth.twitter.TWITTER_CONSUMER_KEY, conf.auth.twitter.TWITTER_SECRET, "1.0", conf.auth.twitter.TWITTER_CALLBACK, "HMAC-SHA1");

  AuthController = (function(_super) {

    __extends(AuthController, _super);

    function AuthController() {
      this.parseTwitterUserDetails = __bind(this.parseTwitterUserDetails, this);
      this.twitterCallback = __bind(this.twitterCallback, this);
      this.twitter = __bind(this.twitter, this);
      AuthController.__super__.constructor.apply(this, arguments);
    }

    AuthController.prototype.twitter = function(req, res, text) {
      var _this = this;
      return oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        var oauth, oauthProcessKey, token;
        if (error) {
          console.log(error);
          return res.send("Error in authenticating");
        } else {
          oauthProcessKey = utils.uniqueId(24);
          oauth = {
            token: oauth_token,
            token_secret: oauth_token_secret
          };
          token = new models.Token({
            type: 'oauth-process-key',
            key: oauthProcessKey,
            value: oauth
          });
          return token.save({
            user: req.user
          }, function(err, token) {
            if (!err) {
              res.cookie('oauth_process_key', oauthProcessKey);
              return res.send("                            <html>                                <script type=\"text/javascript\">                                    window.location.href = \"https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token + "\";                                </script>                                <body></body>                            </html>");
            } else {
              return next(err);
            }
          });
        }
      });
    };

    AuthController.prototype.twitterCallback = function(req, res, next) {
      var _this = this;
      return models.Token.get({
        type: 'oauth-process-key',
        key: req.cookies.oauth_process_key
      }, {}, function(err, token) {
        var oauth;
        if (!err) {
          if (token) {
            oauth = token.value;
            oauth.verifier = req.query.oauth_verifier;
            return oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, accessToken, accessTokenSecret, results) {
              var response;
              if (error) {
                console.log(error);
                return res.send("Could not connect to Twitter.");
              } else {
                console.log("Twitter: authenticated " + results.screen_name);
                response = '';
                return https.get("https://api.twitter.com/1/users/lookup.json?screen_name=" + results.screen_name, function(_res) {
                  _res.on('data', function(d) {
                    return response += d;
                  });
                  return _res.on('end', function() {
                    var resp, userDetails;
                    resp = JSON.parse(response);
                    if (resp.length && (resp[0] != null)) {
                      userDetails = _this.parseTwitterUserDetails(resp[0]);
                      return models.User.getOrCreateUser(userDetails, 'tw', accessToken, function(err, _user, _session) {
                        res.clearCookie("oauth_process_key");
                        res.cookie("userid", _user._id.toString());
                        res.cookie("domain", "tw");
                        res.cookie("username", _user.username);
                        res.cookie("fullName", _user.name);
                        res.cookie("passkey", _session.passkey);
                        return res.send('\
                                                <html>\
                                                    <script type="text/javascript">\
                                                        window.location.href = "/";\
                                                    </script>\
                                                    <body></body>\
                                                </html>');
                      });
                    } else {
                      console.log(response);
                      return res.send("Invalid response.");
                    }
                  });
                });
              }
            });
          } else {
            console.log("No token");
            return res.send("Could not connect to Twitter.");
          }
        } else {
          return next(err);
        }
      });
    };

    AuthController.prototype.parseTwitterUserDetails = function(userDetails) {
      var _ref, _ref1, _ref2;
      return {
        domainid: (_ref = userDetails.id) != null ? _ref : '',
        username: userDetails.screen_name,
        name: (_ref1 = userDetails.name) != null ? _ref1 : userDetails.screen_name,
        location: (_ref2 = userDetails.location) != null ? _ref2 : '',
        email: "twitteruser@poe3.com",
        picture: "https://api.twitter.com/1/users/profile_image?screen_name=" + userDetails.screen_name + "&size=bigger",
        thumbnail: "https://api.twitter.com/1/users/profile_image?screen_name=" + userDetails.screen_name + "&size=normal"
      };
    };

    return AuthController;

  })(controller.Controller);

  exports.AuthController = AuthController;

}).call(this);
