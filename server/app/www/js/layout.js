// Generated by CoffeeScript 1.5.0
(function() {
  var Layout,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Layout = (function() {

    function Layout(container, _style) {
      var extraPerColumn;
      this.container = container;
      this.layoutElement = __bind(this.layoutElement, this);
      this.getOccupancy = __bind(this.getOccupancy, this);
      this.hasVacancy = __bind(this.hasVacancy, this);
      this.addOccupancy = __bind(this.addOccupancy, this);
      this.getVacancies = __bind(this.getVacancies, this);
      this.createLayout = __bind(this.createLayout, this);
      this.style = $.extend({}, _style);
      this.fullWidth = this.container.width() - (this.style.marginLeft + this.style.marginRight);
      this.maxColumns = Math.floor((this.fullWidth + this.style.colSpacing) / (this.style.colWidth + this.style.colSpacing));
      this.occupiedWidth = ((this.maxColumns - 1) * (this.style.colWidth + this.style.colSpacing)) + this.style.colWidth;
      if (this.style.adjustWidth) {
        extraPerColumn = (this.fullWidth - this.occupiedWidth) / this.maxColumns;
        this.style.colWidth += Math.floor((this.style.widthToSpacingRatio / (this.style.widthToSpacingRatio + 1)) * extraPerColumn);
        this.style.colSpacing += Math.floor((1 / (this.style.widthToSpacingRatio + 1)) * extraPerColumn);
      }
      this.colMargin = Math.floor(this.style.colSpacing / 2);
      this.occupancyIndex = [];
      this.createLayout();
    }

    Layout.prototype.createLayout = function() {
      var col, i, _results;
      this.domCols = [];
      i = 0;
      _results = [];
      while (i < this.maxColumns) {
        if (i === 0) {
          col = $('<div class="layout-column" style="float: left; min-height: 1px; margin-left:' + this.style.marginLeft + 'px; margin-right:' + this.colMargin + 'px; width:' + this.style.colWidth + 'px"></div>');
        } else if (i === this.maxColumns - 1) {
          col = $('<div class="layout-column" style="float: left; min-height: 1px; margin-left:' + this.colMargin + 'px; width:' + this.style.colWidth + 'px"></div>');
        } else {
          col = $('<div class="layout-column" style="float: left; min-height: 1px; margin-left:' + this.colMargin + 'px; margin-right:' + this.colMargin + 'px; width:' + this.style.colWidth + 'px"></div>');
        }
        this.domCols.push(col);
        this.container.append(col);
        _results.push(i++);
      }
      return _results;
    };

    Layout.prototype.getVacancies = function(col, height) {
      var colOccupancy, hasItems, item, possibilities, prevListEnd, _i, _len;
      colOccupancy = this.getOccupancy(col);
      possibilities = [];
      prevListEnd = 0;
      for (_i = 0, _len = colOccupancy.length; _i < _len; _i++) {
        item = colOccupancy[_i];
        hasItems = true;
        if ((item.begin - prevListEnd) > height) {
          possibilities.push(prevListEnd + 1);
        }
        prevListEnd = item.end;
      }
      possibilities.push(hasItems ? prevListEnd + 1 : 0);
      return possibilities;
    };

    Layout.prototype.addOccupancy = function(col, elemBegin, height, elem) {
      var colOccupancy, index, item, nextElem, occupancy, prevElem, spacer, _i, _len;
      colOccupancy = this.getOccupancy(col);
      index = 0;
      for (_i = 0, _len = colOccupancy.length; _i < _len; _i++) {
        item = colOccupancy[_i];
        if (elemBegin > item.end) {
          if (item.elem) {
            prevElem = item;
          }
          index++;
        } else {
          if (item.elem) {
            nextElem = item;
            break;
          }
        }
      }
      occupancy = {
        begin: elemBegin,
        end: elemBegin + height
      };
      colOccupancy.splice(index, 0, occupancy);
      if (elem) {
        occupancy.elem = elem;
        if (prevElem) {
          if (prevElem.elem.next().hasClass('layout-spacer')) {
            prevElem.elem.next().remove();
          }
          if (occupancy.begin - prevElem.end > 1) {
            spacer = $("<div class=\"layout-spacer\" style=\"width:" + this.style.colWidth + "px;height:" + (occupancy.begin - prevElem.end - 1) + "px\"></div>");
            spacer.insertAfter(prevElem.elem);
            elem.insertAfter(spacer);
          } else {
            elem.insertAfter(prevElem.elem);
          }
        } else {
          if (this.domCols[col].children().first().hasClass('layout-spacer')) {
            this.domCols[col].children().first().remove();
          }
          if (occupancy.begin > 0) {
            spacer = $("<div class=\"layout-spacer\" style=\"width:" + this.style.colWidth + "px;height:" + (occupancy.begin - 1) + "px\"></div>");
            this.domCols[col].prepend(spacer);
            elem.insertAfter(spacer);
          } else {
            this.domCols[col].prepend(elem);
          }
        }
        if (nextElem) {
          if (nextElem.begin - occupancy.end > 1) {
            spacer = $("<div class=\"layout-spacer\" style=\"width:" + this.style.colWidth + "px;height:" + (nextElem.begin - occupancy.end - 1) + "px\"></div>");
            return spacer.insertAfter(elem);
          }
        }
      }
    };

    Layout.prototype.hasVacancy = function(col, elemBegin, height) {
      var colOccupancy, item, prevEnd, _i, _len;
      colOccupancy = this.getOccupancy(col);
      prevEnd = 0;
      for (_i = 0, _len = colOccupancy.length; _i < _len; _i++) {
        item = colOccupancy[_i];
        if (item.begin >= elemBegin) {
          return (item.begin - prevEnd) >= height;
        }
        prevEnd = item.end;
      }
      return prevEnd <= elemBegin;
    };

    Layout.prototype.getOccupancy = function(col) {
      if (!this.occupancyIndex[col]) {
        this.occupancyIndex[col] = [];
      }
      return this.occupancyIndex[col];
    };

    Layout.prototype.layoutElement = function(elem) {
      var checkingColumn, col, comparer, elemColSize, elemStartCol, firstCol, indexColumn, left, vacancies, vacancy, vacant, _i, _j, _k, _l, _len, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      elem = $(elem);
      elem.addClass('layout-managed');
      elemColSize = parseInt(elem[0].className.match(/cols-(\d+)/)[1]);
      elem.css("width", (elemColSize * this.style.colWidth) + ((elemColSize - 1) * this.style.colSpacing) + "px");
      vacancies = [];
      for (indexColumn = _i = 0, _ref = this.maxColumns - elemColSize; 0 <= _ref ? _i <= _ref : _i >= _ref; indexColumn = 0 <= _ref ? ++_i : --_i) {
        firstCol = 0 > (indexColumn - (elemColSize - 1)) ? 0 : indexColumn - (elemColSize - 1);
        _ref1 = this.getVacancies(indexColumn, elem.outerHeight(true));
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          vacancy = _ref1[_j];
          for (elemStartCol = _k = firstCol; firstCol <= indexColumn ? _k <= indexColumn : _k >= indexColumn; elemStartCol = firstCol <= indexColumn ? ++_k : --_k) {
            vacant = true;
            for (checkingColumn = _l = elemStartCol, _ref2 = elemStartCol + (elemColSize - 1); elemStartCol <= _ref2 ? _l <= _ref2 : _l >= _ref2; checkingColumn = elemStartCol <= _ref2 ? ++_l : --_l) {
              if (indexColumn !== checkingColumn) {
                if (!this.hasVacancy(checkingColumn, vacancy, elem.outerHeight(true))) {
                  vacant = false;
                  break;
                }
              }
            }
            if (vacant) {
              vacancies.push({
                vacancy: vacancy,
                elemStartCol: elemStartCol
              });
              break;
            }
          }
        }
      }
      comparer = function(a, b) {
        if (a.vacancy < b.vacancy) {
          return -1;
        } else if (a.vacancy > b.vacancy) {
          return 1;
        } else {
          return 0;
        }
      };
      vacancies.sort(comparer);
      for (col = _m = _ref3 = vacancies[0].elemStartCol, _ref4 = vacancies[0].elemStartCol + (elemColSize - 1); _ref3 <= _ref4 ? _m <= _ref4 : _m >= _ref4; col = _ref3 <= _ref4 ? ++_m : --_m) {
        this.addOccupancy(col, vacancies[0].vacancy, elem.outerHeight(true), col === vacancies[0].elemStartCol ? elem : void 0);
      }
      left = vacancies[0].elemStartCol * (this.style.colWidth + this.style.leftPadding + this.style.rightPadding + this.style.colSpacing) + this.style.left;
      return elem.css("display", "block");
    };

    return Layout;

  })();

  window.Poe3.Layout = Layout;

}).call(this);
