// Generated by CoffeeScript 1.4.0
(function() {
  var Notifications,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Notifications = (function() {

    function Notifications() {
      this.displayBroadcasts = __bind(this.displayBroadcasts, this);

      this.clear = __bind(this.clear, this);

      this.sync = __bind(this.sync, this);
      this.lastSyncTime = 0;
      this.disableSync = false;
      setInterval(this.sync, 60000);
    }

    Notifications.prototype.sync = function() {
      var _this = this;
      if (!this.disableSync) {
        if ((app.isAuthenticated() && !this.showingUserNotifications) || (this.showingUserNotifications && !app.isAuthenticated())) {
          this.clear();
        }
        if (app.isAuthenticated()) {
          this.showingUserNotifications = true;
          return $.get(Poe3.apiUrl("users/" + (app.getUser().id) + "/status?since=" + this.lastSyncTime), function(resp) {
            if ((resp.userid !== app.getUser().id) || (resp.error === 'NO_SESSION')) {
              app.clearCookies();
              app.refreshApp();
            }
            if (resp.messageCount > 0) {
              $('.main-message-alert .msg-count').html(resp.messageCount);
              $('.main-message-alert').show();
            } else {
              $('.main-message-alert').hide();
            }
            _this.lastSyncTime = resp.lastSyncTime;
            return _this.displayBroadcasts(resp.broadcasts);
          });
        } else {
          this.showingUserNotifications = false;
          return $.get(Poe3.apiUrl("users/0/broadcasts?since=" + this.lastSyncTime), function(resp) {
            _this.lastSyncTime = resp.lastSyncTime;
            return _this.displayBroadcasts(resp.broadcasts);
          });
        }
      }
    };

    Notifications.prototype.clear = function() {
      this.lastSyncTime = 0;
      return $('.sidebar .messages').html('\
            <div class="showcase"></div>\
            <div class="notifications"></div>');
    };

    /*
            Showcase:
            1. Just one item, at most.
    
            User broadcasts + Global broadcasts
            1. Comes after showcase.
            2. Ordered by timestamp.
            3. Max 20.
    */


    Notifications.prototype.displayBroadcasts = function(broadcasts) {
      var all, comparer, eMessages, elem, index, item, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _results;
      eMessages = $('.sidebar .messages');
      if ((_ref = broadcasts.showcase) != null ? _ref.length : void 0) {
        eMessages.find('.showcase').show();
        eMessages.find('.showcase').html('');
        this.showMessage(broadcasts.showcase[0], '.showcase', eMessages);
      } else {
        eMessages.find('.showcase').hide();
      }
      all = [].concat((_ref1 = broadcasts.userNotifications) != null ? _ref1 : []);
      all = all.concat((_ref2 = broadcasts.globalNotifications) != null ? _ref2 : []);
      comparer = function(a, b) {
        if (a.timestamp > b.timestamp) {
          return -1;
        } else if (a.timestamp < b.timestamp) {
          return 1;
        } else {
          return 0;
        }
      };
      all.sort(comparer);
      if (all.length > 32) {
        all = all.slice(0, 20);
      }
      _ref3 = all.reverse();
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        item = _ref3[_i];
        this.showMessage(item, ".notifications", eMessages);
      }
      _ref4 = eMessages.find('.notification');
      _results = [];
      for (index = _j = 0, _len1 = _ref4.length; _j < _len1; index = ++_j) {
        elem = _ref4[index];
        if (index > 32) {
          _results.push($(elem).remove());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Notifications.prototype.showMessage = function(item, type, parentElem) {
      var eMsg, html, list, msg, typeElem;
      msg = new Poe3.Message(item);
      html = msg.toHtml('condensed');
      if (html) {
        typeElem = parentElem.find(type);
        list = typeElem.find('ul');
        if (!list.length) {
          list = $('<ul></ul>');
          list.appendTo(typeElem);
        }
        eMsg = $("<li class=\"notification\"></li>");
        eMsg.attr('message-id', msg.id);
        eMsg.prependTo(list);
        eMsg.html(html);
        return Poe3.fixAnchors(eMsg);
      }
    };

    return Notifications;

  })();

  window.Poe3.Notifications = Notifications;

}).call(this);