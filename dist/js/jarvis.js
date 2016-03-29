(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.util = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Util = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Private TransitionEnd Helpers
     * ------------------------------------------------------------------------
     */

    var transition = false;

    var TransitionEndEvent = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    // shoutout AngusCroll (https://goo.gl/pxwQGp)
    function toType(obj) {
      return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }

    function isElement(obj) {
      return (obj[0] || obj).nodeType;
    }

    function getSpecialTransitionEndEvent() {
      return {
        bindType: transition.end,
        delegateType: transition.end,
        handle: function handle(event) {
          if ($(event.target).is(this)) {
            return event.handleObj.handler.apply(this, arguments);
          }
        }
      };
    }

    function transitionEndTest() {
      if (window.QUnit) {
        return false;
      }

      var el = document.createElement('bootstrap');

      for (var name in TransitionEndEvent) {
        if (el.style[name] !== undefined) {
          return { end: TransitionEndEvent[name] };
        }
      }

      return false;
    }

    function transitionEndEmulator(duration) {
      var _this = this;

      var called = false;

      $(this).one(Util.TRANSITION_END, function () {
        called = true;
      });

      setTimeout(function () {
        if (!called) {
          Util.triggerTransitionEnd(_this);
        }
      }, duration);

      return this;
    }

    function setTransitionEndSupport() {
      transition = transitionEndTest();

      $.fn.emulateTransitionEnd = transitionEndEmulator;

      if (Util.supportsTransitionEnd()) {
        $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
      }
    }

    /**
     * --------------------------------------------------------------------------
     * Public Util Api
     * --------------------------------------------------------------------------
     */

    var Util = {

      TRANSITION_END: 'bsTransitionEnd',

      getUID: function getUID(prefix) {
        do {
          /* eslint-disable no-bitwise */
          prefix += ~ ~(Math.random() * 1000000); // "~~" acts like a faster Math.floor() here
          /* eslint-enable no-bitwise */
        } while (document.getElementById(prefix));
        return prefix;
      },
      getSelectorFromElement: function getSelectorFromElement(element) {
        var selector = element.getAttribute('data-target');

        if (!selector) {
          selector = element.getAttribute('href') || '';
          selector = /^#[a-z]/i.test(selector) ? selector : null;
        }

        return selector;
      },
      reflow: function reflow(element) {
        new Function('bs', 'return bs')(element.offsetHeight);
      },
      triggerTransitionEnd: function triggerTransitionEnd(element) {
        $(element).trigger(transition.end);
      },
      supportsTransitionEnd: function supportsTransitionEnd() {
        return Boolean(transition);
      },
      typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
        for (var property in configTypes) {
          if (configTypes.hasOwnProperty(property)) {
            var expectedTypes = configTypes[property];
            var value = config[property];
            var valueType = undefined;

            if (value && isElement(value)) {
              valueType = 'element';
            } else {
              valueType = toType(value);
            }

            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
            }
          }
        }
      }
    };

    setTransitionEndSupport();

    return Util;
  }(jQuery);

  exports.default = Util;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.modalAdapter = mod.exports;
  }
})(this, function () {
  'use strict';

  // Modal adpater for AJAX loading modal

  $(document).on('click', '[data-toggle="modal"]', function (e) {
    e.preventDefault();
    var $this = $(e.currentTarget),
        url = $this.attr('href'),
        id = $this.attr('data-target').slice(1);

    if (url.indexOf('#') === 0) {
      $(url).modal('open');
    } else {
      var params = $this.attr('data-form-params');
      var data = params ? $('#' + params).serialize() : {};

      $.get(url, data, function (data) {
        $('<div class="modal fade" id="' + id + '" role="dialog" aria-hidden="true">' + data + '</div>').modal().on('hidden.bs.modal', function (e) {
          return $(e.currentTarget).remove();
        }).on('shown.bs.modal', function () {
          return $this.trigger('shown.modal');
        });
      });
    }
  }).off('click.bs.modal.data-api');
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './util'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./util'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.util);
    global.accordion = mod.exports;
  }
})(this, function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _util2 = _interopRequireDefault(_util);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Accordion = function ($) {

    var NAME = 'accordion';
    var VERSION = '0.0.1'; // eslint-disable-line no-unused-vars
    var DATA_KEY = 'jar.accordion';
    var EVENT_KEY = '.' + EVENT_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME]; // eslint-disable-line no-unused-vars
    var TRANSITION_DURATION = 600;

    var Event = {
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      CLICK: 'click' + EVENT_KEY,
      LOAD: 'load' + EVENT_KEY
    };

    var ClassName = {
      ACTIVE: 'active',
      IN: 'in',
      COLLAPSE: 'collapse',
      COLLAPSED: 'collapsed',
      COLLAPSING: 'collapsing'
    };

    var Dimension = {
      WIDTH: 'width',
      HEIGHT: 'height'
    };

    var Selector = {
      DATA_TOGGLE: '[data-toggle="accordion"]'
    };

    var Accordion = function () {
      function Accordion(element, options) {
        _classCallCheck(this, Accordion);

        // eslint-disable-line no-unused-vars
        this._element = $(element);
        // this._bellows = this._getBellows()

        this._isTransitioning = false;

        this._addEventListeners();
      }

      _createClass(Accordion, [{
        key: 'toggle',
        value: function toggle(event) {
          event.preventDefault();
          var $target = this._getTargetFromElement(event.currentTarget);
          $target.hasClass(ClassName.IN) ? this.hide($target) : this.show($target);
        }
      }, {
        key: 'show',
        value: function show($target) {
          var _this = this;

          if (this._isTransitioning || $target.hasClass(ClassName.IN)) {
            return;
          }

          var $actives = undefined,
              $activesTarget = undefined;
          // eslint-disable-next-line no-unused-vars
          var selector = '.' + ClassName.ACTIVE + ' [data-parent="#' + this._element[0].id + '"]';
          $actives = this._element.find('.' + ClassName.ACTIVE + ' [data-parent="#' + this._element[0].id + '"]');
          if ($actives.length) {
            $activesTarget = this._getTargetFromElement($actives[0]);
            if ($activesTarget && $activesTarget.length && $activesTarget.hasClass(ClassName.COLLAPSING)) {
              return;
            }
          }

          var event = $.Event(Event.SHOW, { _relatedTarget: $target[0] });
          this._element.trigger(event);
          if (event.isDefaultPrevented()) {
            return;
          }

          if ($actives.length) {
            this.hide($activesTarget);
          }

          var dimension = this._getDimension($target);
          var targetId = $target.attr('id');

          $target.removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING).css(dimension, 0).attr('aria-expanded', true);

          $('[data-parent="#' + this._element[0].id + '"][data-target="#' + targetId + '"],\n        [data-parent="#' + this._element[0].id + '"][href="#' + targetId + '"]').removeClass(ClassName.COLLAPSED).attr('aria-expanded', true).parentsUntil(this._element).addClass(ClassName.ACTIVE);

          this._isTransitioning = true;

          var complete = function complete() {
            $target.removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.IN).css(dimension, '');

            _this._isTransitioning = false;
            _this._element.trigger($.Event(Event.SHOWN, { _relatedTarget: $target[0] }));
          };

          if (!_util2.default.supportsTransitionEnd()) {
            return complete();
          }

          var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
          var scrollSize = 'scroll' + capitalizedDimension;

          $target.one(_util2.default.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);

          $target.css(dimension, $target[0][scrollSize] + 'px');
        }
      }, {
        key: 'hide',
        value: function hide($target) {
          var _this2 = this;

          if (this._isTransitioning || !$target.hasClass(ClassName.IN)) {
            return;
          }

          var event = $.Event(Event.HIDE, { _relatedTarget: $target[0] });
          this._element.trigger(event);
          if (event.isDefaultPrevented()) {
            return;
          }

          var dimension = this._getDimension($target);
          var offsetDimension = dimension === Dimension.WIDTH ? 'offsetWidth' : 'offsetHeight';
          var targetId = $target.attr('id');

          $target.css(dimension, $target[0][offsetDimension] + 'px');

          _util2.default.reflow($target[0]);

          $target.addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.IN).attr('aria-expanded', false);

          $('[data-parent="#' + this._element[0].id + '"][data-target="#' + targetId + '"],\n        [data-parent="#' + this._element[0].id + '"][href="#' + targetId + '"]').addClass(ClassName.COLLAPSED).attr('aria-expanded', false).parentsUntil(this._element).removeClass(ClassName.ACTIVE);

          this._isTransitioning = true;

          var complete = function complete() {
            _this2._isTransitioning = false;
            $target.removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE);

            _this2._element.trigger($.Event(Event.HIDDEN, { _relatedTarget: $target[0] }));
          };

          $target.css(dimension, 0);

          if (!_util2.default.supportsTransitionEnd()) {
            return complete();
          }

          $target.one(_util2.default.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
        }
      }, {
        key: '_addEventListeners',
        value: function _addEventListeners() {
          this._element.on(Event.CLICK, '[data-parent="#' + this._element[0].id + '"]', $.proxy(this.toggle, this));
        }
      }, {
        key: '_getDimension',
        value: function _getDimension($element) {
          var hasWidth = $element.hasClass(Dimension.WIDTH);
          return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
        }
      }, {
        key: '_getBellows',
        value: function _getBellows() {
          var selector = '[data-parent="#' + this._element[0].id + '"]';
          return $(selector, '#' + this._element[0].id);
        }
      }, {
        key: '_getTargetFromElement',
        value: function _getTargetFromElement(element) {
          var selector = _util2.default.getSelectorFromElement(element);
          return selector ? $(selector) : null;
        }
      }], [{
        key: '_plugin',
        value: function _plugin(option) {
          return this.each(function () {
            var $this = $(this);
            var data = $this.data(DATA_KEY);
            var options = $.extend({}, Accordion.Default, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);

            if (!data) $this.data(DATA_KEY, data = new Accordion(this, options));
          });
        }
      }, {
        key: 'Default',
        get: function get() {}
      }]);

      return Accordion;
    }();

    $(window).on(Event.LOAD, function () {
      $(Selector.DATA_TOGGLE).each(function () {
        var $accordion = $(this);
        Accordion._plugin.call($accordion, $accordion.data());
      });
    });

    return Accordion;
  }(jQuery);

  exports.default = Accordion;
});