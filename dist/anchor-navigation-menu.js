/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  // desiredOffset - page offset to scroll to
  // speed - duration of the scroll per 1000px

  function __ANIMATE_SCROLL_TO(desiredOffset) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (desiredOffset instanceof HTMLElement) {
      if (userOptions.element && userOptions.element instanceof HTMLElement) {
        desiredOffset = desiredOffset.getBoundingClientRect().top + userOptions.element.scrollTop - userOptions.element.getBoundingClientRect().top;
      } else {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        desiredOffset = scrollTop + desiredOffset.getBoundingClientRect().top;
      }
    }

    var options = {
      speed: 500,
      minDuration: 250,
      maxDuration: 1500,
      cancelOnUserAction: true,
      element: window,
      onComplete: undefined
    };

    var optionsKeys = Object.keys(options);

    // Override default options
    for (var i = 0; i < optionsKeys.length; i++) {
      var key = optionsKeys[i];

      if (typeof userOptions[key] !== 'undefined') {
        options[key] = userOptions[key];
      }
    }

    options.isWindow = options.element === window;

    var initialScrollPosition = null;
    var maxScroll = null;

    if (options.isWindow) {
      // get cross browser scroll position
      initialScrollPosition = window.scrollY || document.documentElement.scrollTop;
      // cross browser document height minus window height
      maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;
    } else {
      // DOM element
      initialScrollPosition = options.element.scrollTop;
      maxScroll = options.element.scrollHeight - options.element.clientHeight;
    }

    // If the scroll position is greater than maximum available scroll
    if (desiredOffset > maxScroll) {
      desiredOffset = maxScroll;
    }

    // Calculate diff to scroll
    var diff = desiredOffset - initialScrollPosition;

    // Do nothing if the page is already there
    if (diff === 0) {
      // Execute callback if there is any
      if (options.onComplete && typeof options.onComplete === 'function') {
        options.onComplete();
      }

      return;
    }

    // Calculate duration of the scroll
    var duration = Math.abs(Math.round(diff / 1000 * options.speed));

    // Set minimum and maximum duration
    if (duration < options.minDuration) {
      duration = options.minDuration;
    } else if (duration > options.maxDuration) {
      duration = options.maxDuration;
    }

    var startingTime = Date.now();

    // Request animation frame ID
    var requestID = null;

    // Method handler
    var handleUserEvent = null;

    if (options.cancelOnUserAction) {
      // Set handler to cancel scroll on user action
      handleUserEvent = function handleUserEvent() {
        removeListeners();
        cancelAnimationFrame(requestID);
      };
      window.addEventListener('keydown', handleUserEvent);
      window.addEventListener('mousedown', handleUserEvent);
    } else {
      // Set handler to prevent user actions while scroll is active
      handleUserEvent = function handleUserEvent(e) {
        e.preventDefault();
      };
      window.addEventListener('scroll', handleUserEvent);
    }

    window.addEventListener('wheel', handleUserEvent);
    window.addEventListener('touchstart', handleUserEvent);

    var removeListeners = function removeListeners() {
      window.removeEventListener('wheel', handleUserEvent);
      window.removeEventListener('touchstart', handleUserEvent);

      if (options.cancelOnUserAction) {
        window.removeEventListener('keydown', handleUserEvent);
        window.removeEventListener('mousedown', handleUserEvent);
      } else {
        window.removeEventListener('scroll', handleUserEvent);
      }
    };

    var step = function step() {
      var timeDiff = Date.now() - startingTime;
      var t = timeDiff / duration - 1;
      var easing = t * t * t + 1;
      var scrollPosition = Math.round(initialScrollPosition + diff * easing);

      if (timeDiff < duration && scrollPosition !== desiredOffset) {
        // If scroll didn't reach desired offset or time is not elapsed
        // Scroll to a new position
        // And request a new step

        if (options.isWindow) {
          options.element.scrollTo(0, scrollPosition);
        } else {
          options.element.scrollTop = scrollPosition;
        }

        requestID = requestAnimationFrame(step);
      } else {
        // If the time elapsed or we reached the desired offset
        // Set scroll to the desired offset (when rounding made it to be off a pixel or two)
        // Clear animation frame to be sure
        if (options.isWindow) {
          options.element.scrollTo(0, desiredOffset);
        } else {
          options.element.scrollTop = desiredOffset;
        }
        cancelAnimationFrame(requestID);

        // Remove listeners
        removeListeners();

        // Animation is complete, execute callback if there is any
        if (options.onComplete && typeof options.onComplete === 'function') {
          options.onComplete();
        }
      }
    };

    // Start animating scroll
    requestID = requestAnimationFrame(step);
  }

  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = __ANIMATE_SCROLL_TO;
      exports = module.exports;
    }
    exports.default = __ANIMATE_SCROLL_TO;
  } else {}
}).call(undefined);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/animated-scroll-to/animated-scroll-to.js
var animated_scroll_to = __webpack_require__(0);
var animated_scroll_to_default = /*#__PURE__*/__webpack_require__.n(animated_scroll_to);

// CONCATENATED MODULE: ./src/js/default-settings.js
/* harmony default export */ var default_settings = ({
  animationDuration: 233,
  activeClass: 'active',
  linksSelector: '.scroll'
});
// CONCATENATED MODULE: ./src/js/utils.js
function isHidden(anchor) {
  var _anchor$getBoundingCl = anchor.getBoundingClientRect(),
      x = _anchor$getBoundingCl.x,
      y = _anchor$getBoundingCl.y,
      width = _anchor$getBoundingCl.width,
      height = _anchor$getBoundingCl.height;

  return !(x + y + width + height);
}
// CONCATENATED MODULE: ./src/js/anchor-navigation-menu.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var anchor_navigation_menu_AnchorNavigation = function () {
  function AnchorNavigation() {
    var _this = this;

    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AnchorNavigation);

    this.settings = _extends({}, default_settings, settings);
    this._targetsPositions = new WeakMap();
    this._anchors = [];

    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._mapAnchorToSectionPosition = this._mapAnchorToSectionPosition.bind(this);
    this._setCurrentHighlight = this._setCurrentHighlight.bind(this);

    window.addEventListener('resize', function () {
      _this._targetsPositions = new WeakMap();
      _this._anchors.forEach(_this._mapAnchorToSectionPosition);
      _this._setCurrentHighlight();
    });
  }

  _createClass(AnchorNavigation, [{
    key: '_toggleHighlight',
    value: function _toggleHighlight(anchor) {
      var _this2 = this;

      if (anchor && isHidden(anchor)) {
        return;
      }
      this._anchors.forEach(function (anchor) {
        return anchor.classList.remove(_this2.settings.activeClass);
      });
      if (anchor && anchor.classList) {
        anchor.classList.add(this.settings.activeClass);
      }
    }
  }, {
    key: 'onAnchorClick',
    value: function onAnchorClick(e) {
      e.preventDefault();
      var anchor = e.currentTarget;
      // this is needed since the href attr might have more than just the hash
      var targetAnchor = anchor.getAttribute('href').split("#")[1];
      var elementToScroll = document.getElementById(targetAnchor);
      if (!elementToScroll) {
        return;
      }
      animated_scroll_to_default()(elementToScroll, {
        minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration,
        onComplete: function onComplete() {
          anchor.blur();
        }
      });
    }
  }, {
    key: '_mapAnchorToSectionPosition',
    value: function _mapAnchorToSectionPosition(anchor) {
      // this is needed since the href attr might have more than just the hash
      var targetAnchor = anchor.getAttribute('href').split("#")[1];
      var elementToScroll = document.getElementById(targetAnchor);
      this._targetsPositions.set(anchor, elementToScroll.getBoundingClientRect().top + (window.scrollY || window.pageYOffset));
    }
  }, {
    key: '_setCurrentHighlight',
    value: function _setCurrentHighlight() {
      var _this3 = this;

      this._anchors.forEach(function (anchor) {
        var anchorTargetPosition = _this3._targetsPositions.get(anchor);
        if (anchorTargetPosition <= (window.scrollY || window.pageYOffset)) {
          _this3._toggleHighlight(anchor);
        }
      });
    }
  }, {
    key: '_setupHighlights',
    value: function _setupHighlights() {
      this._targetsPositions = new WeakMap();
      this._anchors.forEach(this._mapAnchorToSectionPosition);
      window.addEventListener('scroll', this._setCurrentHighlight, { passive: true });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this4 = this;

      this._anchors = [].concat(_toConsumableArray(document.querySelectorAll(this.settings.linksSelector)));
      this._anchors.forEach(function (anchor) {
        return anchor.addEventListener('click', _this4.onAnchorClick);
      });
      this._setupHighlights();
      this._setCurrentHighlight();
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this5 = this;

      if (this._anchors && this._anchors.length) {
        this._anchors.forEach(function (anchor) {
          return anchor.removeEventListener('click', _this5.onAnchorClick);
        });
        this._toggleHighlight();
      }
      window.removeEventListener('scroll', this._setCurrentHighlight, { passive: true });
      this._targetsPositions = null;
      this._anchors = null;
    }
  }]);

  return AnchorNavigation;
}();

/* harmony default export */ var anchor_navigation_menu = (anchor_navigation_menu_AnchorNavigation);
// CONCATENATED MODULE: ./src/js/index.js

window.AnchorNavigation = anchor_navigation_menu;
/* harmony default export */ var js = __webpack_exports__["default"] = (anchor_navigation_menu);

/***/ })
/******/ ]);