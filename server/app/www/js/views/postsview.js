// Generated by CoffeeScript 1.5.0
(function() {
  var PostsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PostsView = (function(_super) {

    __extends(PostsView, _super);

    function PostsView(params) {
      var _base, _ref;
      this.params = params != null ? params : {};
      this.updatePost = __bind(this.updatePost, this);
      this.getPostByUID = __bind(this.getPostByUID, this);
      this.resizeOnRefresh = __bind(this.resizeOnRefresh, this);
      this.applyFilter = __bind(this.applyFilter, this);
      this.attachEvents = __bind(this.attachEvents, this);
      this.fetch = __bind(this.fetch, this);
      this.onNextPage = __bind(this.onNextPage, this);
      this.onPreviousPage = __bind(this.onPreviousPage, this);
      this.switchPage = __bind(this.switchPage, this);
      this.setupPaging = __bind(this.setupPaging, this);
      this.loadCategory = __bind(this.loadCategory, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      if ((_ref = (_base = this.params).category) == null) {
        _base.category = 'all';
      }
      if (['haiku', 'six-word-story', 'quote', 'free-verse'].indexOf(this.params.category) > -1) {
        this.params.type = this.params.category;
        this.params.category = 'all';
      }
      if (this.params.category === 'text') {
        this.params.attachmentType = '';
        this.params.category = 'all';
      }
      if (['all', 'open', 'popular'].indexOf(this.params.category) > -1) {
        if (this.params.subCategory) {
          if (['haiku', 'six-word-story', 'quote', 'free-verse'].indexOf(this.params.subCategory) > -1) {
            this.params.type = this.params.subCategory;
          }
          if (this.params.subCategory === 'text') {
            this.params.attachmentType = '';
          }
        }
      }
      this.tagPrefix = this.params.category === 'open' ? "/posts/open" : "/posts";
      this.pageNumber = 1;
      this.pageSize = 50;
      PostsView.__super__.constructor.call(this, {
        model: new Poe3.Posts
      });
    }

    PostsView.prototype.initialize = function() {
      $('#content').html(this.el);
      $(this.el).html(this.template({}));
      if (this.params.type) {
        $('.posts-view .filter .active .prefix').html('<span class="anchor cancel-filter"><i class="icon-circle-arrow-left"></i></span>');
        $('.posts-view .filter .active i.icon-filter').hide();
        $('.posts-view .filter .active a.type').html(this.params.type);
      } else if (this.params.attachmentType != null) {
        $('.posts-view .filter .active .prefix').html('<span class="anchor cancel-filter"><i class="icon-circle-arrow-left"></i></span>');
        $('.posts-view .filter .active i.icon-filter').hide();
        $('.posts-view .filter .active a.type').html('text');
      }
      this.attachEvents();
      this.onRenderComplete('#content');
      return this.loadCategory();
    };

    PostsView.prototype.render = function(posts) {
      switch (this.params.category) {
        case 'all':
          this.setTitle("All poems");
          break;
        case 'open':
          this.setTitle("Open poems");
          break;
        case 'popular':
          this.setTitle("Popular poems");
      }
      posts = posts.toArray();
      this.postListView = new Poe3.PostListView('#content .page-content', this.tagPrefix, posts);
      return this.postListView.render();
    };

    PostsView.prototype.loadCategory = function() {
      var _this = this;
      $('.posts-view .std-menu ul span.tag').remove();
      $('.posts-view .std-menu li a').removeClass('selected');
      if (this.params.tag) {
        $(".posts-view .std-menu li span." + this.params.category).append('<span class="tag selected"> #' + this.params.tag + '</span>');
      }
      $(".posts-view .std-menu li span." + this.params.category + " a").addClass('selected');
      return this.fetch({}, {}, function(posts) {
        if (posts.length > _this.pageSize) {
          _this.setupPaging();
          return _this.switchPage(posts, 1, 'forward');
        } else {
          return _this.render(posts);
        }
      });
    };

    PostsView.prototype.setupPaging = function() {
      var _this = this;
      $('.posts-view .paginator').html('\
            <ul>\
                <li class="prev">\
                    <i class="icon-chevron-left"></i>\
                    <a href="#">Prev</a>\
                </li>\
                <li class="page-number">\
                    Page 1\
                </li>\
                <li class="next">\
                    <a href="#">Next</a>\
                    <i class="icon-chevron-right"></i>\
                </li>\
            </ul>');
      $(document).bindNew('click', '.posts-view .paginator .prev, .paginator .prev a', function() {
        return _this.onPreviousPage();
      });
      $(document).bindNew('click', '.posts-view .paginator .next, .paginator .next a', function() {
        return _this.onNextPage();
      });
      $('.posts-view .paginator.top').fadeIn(1000);
      return setTimeout((function() {
        $(".paginator-border-bottom").css('border-top', '1px solid #222');
        return $('.posts-view .paginator.bottom').fadeIn(1000);
      }), 3000);
    };

    PostsView.prototype.switchPage = function(posts, pageNum, fetchDirection) {
      var hasMore,
        _this = this;
      this.pageNumber = pageNum;
      hasMore = posts.length > this.pageSize;
      if (hasMore) {
        if (fetchDirection === 'forward' || pageNum === 1) {
          posts.pop();
        } else {
          posts.shift();
        }
      }
      if (!hasMore && fetchDirection === 'back' && this.pageNumber > 1) {
        return this.fetch({}, {}, function(posts) {
          return _this.switchPage(posts, 1, 'forward');
        });
      } else {
        this.hasNext = fetchDirection === 'back' || (fetchDirection === 'forward' && hasMore);
        $('.posts-view .paginator .page-number').html("Page " + this.pageNumber);
        $('.posts-view .paginator .prev')[this.pageNumber > 1 ? 'removeClass' : 'addClass']('disabled');
        $('.posts-view .paginator .next')[this.hasNext ? 'removeClass' : 'addClass']('disabled');
        return this.render(posts);
      }
    };

    PostsView.prototype.onPreviousPage = function() {
      var pageNum, params,
        _this = this;
      params = {};
      if (this.pageNumber > 1) {
        if (this.pageNumber > 2) {
          if (this.params.category !== 'open') {
            params.after = this.model.at(0).get('publishedAt');
          }
          params.minuid = this.model.at(0).get('uid');
        }
        pageNum = this.pageNumber - 1;
        (function(pageNum) {
          return _this.fetch(params, {}, function(posts) {
            return _this.switchPage(posts, pageNum, 'back');
          });
        })(pageNum);
      }
      return false;
    };

    PostsView.prototype.onNextPage = function() {
      var pageNum, params,
        _this = this;
      if (this.hasNext) {
        params = {};
        if (this.params.category !== 'open') {
          params.before = this.model.at(this.model.length - 1).get('publishedAt');
        }
        params.maxuid = this.model.at(this.model.length - 1).get('uid');
        pageNum = this.pageNumber + 1;
        (function(pageNum) {
          return _this.fetch(params, {}, function(posts) {
            return _this.switchPage(posts, pageNum, 'forward');
          });
        })(pageNum);
      }
      return false;
    };

    PostsView.prototype.fetch = function(data, apiInfo, onLoad) {
      data.limit = this.pageSize + 1;
      data.category = this.params.category;
      if (this.params.tag) {
        data.tag = this.params.tag;
      }
      if (this.params.type) {
        data.type = this.params.type;
      }
      if (this.params.attachmentType != null) {
        data.attachmentType = this.params.attachmentType;
      }
      return this.model.fetch({
        data: data,
        success: onLoad
      });
    };

    PostsView.prototype.attachEvents = function() {
      var self,
        _this = this;
      self = this;
      $(document).bindNew('click', '.posts-view .filter a.type', function() {
        $('.posts-view .filter .active').hide();
        $('.posts-view .filter .select').show();
        return false;
      });
      $(document).bindNew('click', '.posts-view .filter .select a', function() {
        var filter;
        filter = $(this).attr('class');
        self.applyFilter(filter);
        return false;
      });
      return $(document).bindNew('click', '.posts-view .filter .cancel-filter', function() {
        _this.applyFilter('all');
        return false;
      });
    };

    PostsView.prototype.applyFilter = function(filter) {
      if (this.params.category === 'all') {
        if (this.params.tag) {
          if (filter === 'all') {
            return app.navigate("/posts/tagged/" + this.params.tag, true);
          } else {
            return app.navigate("/posts/" + filter + "/tagged/" + this.params.tag, true);
          }
        } else {
          if (filter === 'all') {
            return app.navigate("/posts", true);
          } else {
            return app.navigate("/posts/" + filter, true);
          }
        }
      } else {
        if (this.params.tag) {
          if (filter === 'all') {
            return app.navigate("/posts/" + this.params.category + "/tagged/" + this.params.tag, true);
          } else {
            return app.navigate("/posts/" + this.params.category + "/" + filter + "/tagged/" + this.params.tag, true);
          }
        } else {
          if (filter === 'all') {
            return app.navigate("/posts/" + this.params.category, true);
          } else {
            return app.navigate("/posts/" + this.params.category + "/" + filter, true);
          }
        }
      }
    };

    PostsView.prototype.resizeOnRefresh = function() {
      return true;
    };

    PostsView.prototype.getPostByUID = function(uid) {
      return this.postListView.getPostByUID(uid);
    };

    PostsView.prototype.updatePost = function(post) {
      return this.postListView.updatePost(post);
    };

    return PostsView;

  })(Poe3.PageView);

  window.Poe3.PostsView = PostsView;

}).call(this);
