(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cm = cm;
exports.mm = mm;
exports.deg = deg;
exports.addCube = addCube;
exports.ORIGIN = exports.POINTER_RADIUS = exports.POINT_RADIUS = exports.PANEL_RADIUS = exports.ROOM_RADIUS = exports.TEST_ENABLED = void 0;

/* jshint esversion: 6 */

/* global window, document */
var TEST_ENABLED = false;
exports.TEST_ENABLED = TEST_ENABLED;
var ROOM_RADIUS = 200;
exports.ROOM_RADIUS = ROOM_RADIUS;
var PANEL_RADIUS = 100;
exports.PANEL_RADIUS = PANEL_RADIUS;
var POINT_RADIUS = 99;
exports.POINT_RADIUS = POINT_RADIUS;
var POINTER_RADIUS = 98;
exports.POINTER_RADIUS = POINTER_RADIUS;
var ORIGIN = new THREE.Vector3();
exports.ORIGIN = ORIGIN;

function cm(value) {
  return value / 100;
}

function mm(value) {
  return value / 1000;
}

function deg(value) {
  return Math.PI / 180 * value;
}

function addCube(parent) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  var cube = new THREE.Mesh(geometry, material);
  parent.add(cube);
  return cube;
}

THREE.Euler.prototype.add = function (euler) {
  this.set(this.x + euler.x, this.y + euler.y, this.z + euler.z, this.order);
  return this;
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */

/* global window, document */
var Emittable =
/*#__PURE__*/
function () {
  function Emittable() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Emittable);

    Object.assign(this, options);
    this.events = {};
  }

  _createClass(Emittable, [{
    key: "on",
    value: function on(type, callback) {
      var _this = this;

      var event = this.events[type] = this.events[type] || [];
      event.push(callback);
      return function () {
        _this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      };
    }
  }, {
    key: "off",
    value: function off(type, callback) {
      var event = this.events[type];

      if (event) {
        this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      }
    }
  }, {
    key: "emit",
    value: function emit(type, data) {
      var event = this.events[type];

      if (event) {
        event.forEach(function (callback) {
          // callback.call(this, data);
          callback(data);
        });
      }

      var broadcast = this.events.broadcast;

      if (broadcast) {
        broadcast.forEach(function (callback) {
          callback(type, data);
        });
      }
    }
  }]);

  return Emittable;
}();

exports.default = Emittable;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freezable = _interopRequireDefault(require("./freezable.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EmittableMesh =
/*#__PURE__*/
function (_FreezableMesh) {
  _inherits(EmittableMesh, _FreezableMesh);

  function EmittableMesh(geometry, material) {
    var _this;

    _classCallCheck(this, EmittableMesh);

    geometry = geometry || new THREE.BoxGeometry(5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
      color: 0xff00ff // opacity: 1,
      // transparent: true,

    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmittableMesh).call(this, geometry, material)); // this.renderOrder = 10;

    _this.events = {};
    return _this;
  }

  _createClass(EmittableMesh, [{
    key: "on",
    value: function on(type, callback) {
      var _this2 = this;

      var event = this.events[type] = this.events[type] || [];
      event.push(callback);
      return function () {
        _this2.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      };
    }
  }, {
    key: "off",
    value: function off(type, callback) {
      var event = this.events[type];

      if (event) {
        this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      }
    }
  }, {
    key: "emit",
    value: function emit(type, data) {
      var event = this.events[type];

      if (event) {
        event.forEach(function (callback) {
          // callback.call(this, data);
          callback(data);
        });
      }

      var broadcast = this.events.broadcast;

      if (broadcast) {
        broadcast.forEach(function (callback) {
          callback(type, data);
        });
      }
    }
  }]);

  return EmittableMesh;
}(_freezable.default);

exports.default = EmittableMesh;

},{"./freezable.mesh":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* jshint esversion: 6 */

/* global window, document */
var FreezableMesh =
/*#__PURE__*/
function (_THREE$Mesh) {
  _inherits(FreezableMesh, _THREE$Mesh);

  _createClass(FreezableMesh, [{
    key: "freezed",
    get: function get() {
      return this.freezed_;
    },
    set: function set(freezed) {
      // !!! cycle through freezable and not freezable
      this.freezed_ = freezed;
      this.children.filter(function (x) {
        return x.__lookupGetter__('freezed');
      }).forEach(function (x) {
        return x.freezed = freezed;
      });
    }
  }]);

  function FreezableMesh(geometry, material) {
    var _this;

    _classCallCheck(this, FreezableMesh);

    geometry = geometry || new THREE.BoxGeometry(5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
      color: 0xff00ff // opacity: 1,
      // transparent: true,

    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(FreezableMesh).call(this, geometry, material));
    _this.freezed = false;
    return _this;
  }

  _createClass(FreezableMesh, [{
    key: "freeze",
    value: function freeze() {
      this.freezed = true;
    }
  }, {
    key: "unfreeze",
    value: function unfreeze() {
      this.freezed = false;
    }
  }]);

  return FreezableMesh;
}(THREE.Mesh);

exports.default = FreezableMesh;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emittable = _interopRequireDefault(require("./emittable.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InteractiveMesh =
/*#__PURE__*/
function (_EmittableMesh) {
  _inherits(InteractiveMesh, _EmittableMesh);

  _createClass(InteractiveMesh, null, [{
    key: "hittest",
    value: function hittest(raycaster, down) {
      var items = InteractiveMesh.items.filter(function (x) {
        return !x.freezed;
      });
      var intersections = raycaster.intersectObjects(items);
      var key, hit;
      var hash = {};
      intersections.forEach(function (intersection, i) {
        var object = intersection.object;
        key = object.id;

        if (i === 0 && InteractiveMesh.object != object) {
          InteractiveMesh.object = object;
          hit = object; // haptic feedback
        }

        hash[key] = intersection;
      });
      items.forEach(function (x) {
        var intersection = hash[x.id]; // intersections.find(i => i.object === x);

        x.intersection = intersection;
        x.over = intersection !== undefined;
        x.down = down;
      });
      return hit;
    }
  }]);

  function InteractiveMesh(geometry, material) {
    var _this;

    _classCallCheck(this, InteractiveMesh);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractiveMesh).call(this, geometry, material)); // this.renderOrder = 10;

    InteractiveMesh.items.push(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InteractiveMesh, [{
    key: "over",
    get: function get() {
      return this.over_;
    },
    set: function set(over) {
      if (over) {
        this.emit('hit', this);
      }

      if (this.over_ !== over) {
        this.over_ = over;

        if (over) {
          this.emit('over', this);
        } else {
          this.emit('out', this);
        }
      }
    }
  }, {
    key: "down",
    get: function get() {
      return this.down_;
    },
    set: function set(down) {
      down = down && this.over;

      if (this.down_ !== down) {
        this.down_ = down;

        if (down) {
          this.emit('down', this);
        } else {
          this.emit('up', this);
        }
      }
    }
  }]);

  return InteractiveMesh;
}(_emittable.default);

exports.default = InteractiveMesh;
InteractiveMesh.items = [];

},{"./emittable.mesh":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControllerFragGlsl = void 0;
var ControllerFragGlsl =
/* glsl */
"\n#define MATCAP\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float emissiveIntensity;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tvec4 emissiveColor = vec4( emissive, opacity );\n\t#include <logdepthbuf_fragment>\n\t/* #include <map_fragment> */\n\t#ifdef USE_MAP\n\t\tvec4 texelColor = texture2D( map, vUv );\n\t\ttexelColor = mapTexelToLinear( texelColor );\n\t\tdiffuseColor *= texelColor;\n\t\tdiffuseColor = mix(diffuseColor, emissiveColor, emissiveIntensity);\n\t#endif\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\tvec3 viewDir = normalize( vViewPosition );\n\tvec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n\tvec3 y = cross( viewDir, x );\n\tvec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n\t#ifdef USE_MATCAP\n\t\tvec4 matcapColor = texture2D( matcap, uv );\n\t\tmatcapColor = matcapTexelToLinear( matcapColor );\n\t#else\n\t\tvec4 matcapColor = vec4( 1.0 );\n\t#endif\n\tvec3 outgoingLight = diffuseColor.rgb * (matcapColor.rgb + emissiveIntensity * 0.5); // max(matcapColor.rgb, emissiveColor.rgb);\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n";
exports.ControllerFragGlsl = ControllerFragGlsl;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = require("../../const");

var _gamepads = require("../gamepads");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Controller =
/*#__PURE__*/
function (_THREE$Group) {
  _inherits(Controller, _THREE$Group);

  _createClass(Controller, [{
    key: "active",
    get: function get() {
      return this.active_;
    },
    set: function set(active) {
      if (this.active_ !== active) {
        this.active_ = active;

        if (active) {
          this.add(this.ray);
        } else {
          this.remove(this.ray);
        }
      }
    }
  }]);

  function Controller(parent, gamepad) {
    var _this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Controller);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Controller).call(this));
    _this.ready = false;
    _this.buttons = new Array(10).fill(0).map(function (x) {
      return {
        value: 0
      };
    });
    _this.axis = new Array(2).fill(0).map(function (x) {
      return new THREE.Vector2();
    });
    _this.parent = parent;
    _this.gamepad = gamepad;
    _this.options = options;
    _this.hand = gamepad.hand;

    var model = _this.model = _this.addModel(_this.hand);

    var ray = _this.ray = _this.addRay(_this.hand);

    _this.add(model);

    parent.add(_assertThisInitialized(_this));

    _this.addEvents();

    return _this;
  }

  _createClass(Controller, [{
    key: "addEvents",
    value: function addEvents() {
      this.onActivate = this.onActivate.bind(this);
      this.onDeactivate = this.onDeactivate.bind(this);
      this.onPress = this.onPress.bind(this);
      this.onRelease = this.onRelease.bind(this);
      this.onAxis = this.onAxis.bind(this);
      var gamepad = this.gamepad;
      gamepad.on('activate', this.onActivate);
      gamepad.on('deactivate', this.onDeactivate);
      gamepad.on('press', this.onPress);
      gamepad.on('release', this.onRelease);
      gamepad.on('axis', this.onAxis);
    }
  }, {
    key: "removeEvents",
    value: function removeEvents() {
      var gamepad = this.gamepad;
      gamepad.off('activate', this.onActivate);
      gamepad.off('deactivate', this.onActivate);
      gamepad.off('press', this.onPress);
      gamepad.off('release', this.onRelease);
      gamepad.off('axis', this.onAxis);
    }
  }, {
    key: "onActivate",
    value: function onActivate(gamepad) {
      this.active = true;
    }
  }, {
    key: "onDeactivate",
    value: function onDeactivate(gamepad) {
      this.active = false;
    }
  }, {
    key: "onPress",
    value: function onPress(button) {
      this.press(button.index);
    }
  }, {
    key: "onRelease",
    value: function onRelease(button) {
      this.release(button.index);
    }
  }, {
    key: "onAxis",
    value: function onAxis(axis) {
      this.axis[axis.index] = axis;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeEvents();
      this.gamepad = null;
    }
  }, {
    key: "addModel",
    value: function addModel(hand) {
      var geometry = new THREE.CylinderBufferGeometry((0, _const.cm)(2), (0, _const.cm)(2), (0, _const.cm)(12), 24);
      geometry.rotateX(Math.PI / 2);
      var texture = new THREE.TextureLoader().load('img/matcap.jpg');
      var material = new THREE.MeshMatcapMaterial({
        color: this.hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 0x991111 : 0x111199,
        matcap: texture // transparent: true,
        // opacity: 1,

      });
      var mesh = new THREE.Mesh(geometry, material);
      this.ready = true;
      return mesh;
    }
  }, {
    key: "addRay",
    value: function addRay(hand) {
      var geometry = new THREE.CylinderBufferGeometry((0, _const.mm)(1), (0, _const.mm)(0.5), (0, _const.cm)(30), 5); // 10, 12

      geometry.rotateX(Math.PI / 2);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, -(0, _const.cm)(18.5));
      return mesh;
    }
  }, {
    key: "press",
    value: function press(index) {
      TweenMax.to(this.buttons[index], 0.3, {
        value: 1,
        ease: Power2.easeOut
      });
    }
  }, {
    key: "release",
    value: function release(index) {
      TweenMax.to(this.buttons[index], 0.3, {
        value: 0,
        ease: Power2.easeOut
      });
    }
  }, {
    key: "update",
    value: function update(tick) {}
  }], [{
    key: "getCos",
    value: function getCos(tick) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return Math.cos(i + tick * 0.1);
    }
  }, {
    key: "mixColor",
    value: function mixColor(color, a, b, value) {
      return color.setRGB(a.r + (b.r - a.r) * value, a.g + (b.g - a.g) * value, a.b + (b.b - a.b) * value);
    }
  }, {
    key: "mixUniformColor",
    value: function mixUniformColor(uniform, a, b, value) {
      uniform.value.r = a.r + (b.r - a.r) * value;
      uniform.value.g = a.g + (b.g - a.g) * value;
      uniform.value.b = a.b + (b.b - a.b) * value;
    }
  }]);

  return Controller;
}(THREE.Group); // Controller.clock = new THREE.Clock();
// const clock = this.clock || (this.clock = new THREE.Clock());


exports.default = Controller;

},{"../../const":1,"../gamepads":11}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _controller = _interopRequireDefault(require("./controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OFF = new THREE.Color(0x000000);
var ON = new THREE.Color(0x2196f3);

var HandController =
/*#__PURE__*/
function (_Controller) {
  _inherits(HandController, _Controller);

  function HandController(parent, gamepad) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, HandController);

    return _possibleConstructorReturn(this, _getPrototypeOf(HandController).call(this, parent, gamepad, options));
  }

  _createClass(HandController, [{
    key: "addModel",
    value: function addModel(hand) {
      var _this = this;

      var format = '.fbx'; // '.obj';

      var path = "".concat(HandController.FOLDER, "/").concat(hand, "/").concat(hand, "-animated_");
      var matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg'); // const texture = new THREE.TextureLoader().load(`${path}.jpg`);

      var material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        // 0xccac98,
        // map: texture,
        matcap: matcap,
        // transparent: true,
        // opacity: 1,
        // wireframe: true,
        skinning: true
      });
      var mesh = new THREE.Group();
      var loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
      var i = 0;
      loader.load("".concat(path).concat(format), function (object) {
        var mixer = _this.mixer = new THREE.AnimationMixer(object);
        mixer.timeScale = 2;
        var clip = _this.clip = mixer.clipAction(object.animations[0]);
        clip.setLoop(THREE.LoopOnce);
        clip.clampWhenFinished = true; // clip.paused = true;
        // clip.enable = true;

        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = material.clone(); // child.geometry.scale(0.1, 0.1, 0.1);
          }
        });
        object.scale.set(0.1, 0.1, 0.1);
        mesh.add(object);
        _this.ready = true;
      }, function (xhr) {
        _this.progress = xhr.loaded / xhr.total;
      }, function (error) {
        console.log("HandController.addModel not found ".concat(path).concat(format));
      });
      return mesh;
    }
  }, {
    key: "addRay",
    value: function addRay(hand) {
      var group = new THREE.Group();
      return group;
    }
  }, {
    key: "press",
    value: function press(index) {
      if (this.clip) {
        if (this.clip.paused) {
          this.clip.reset();
        } else {
          this.clip.play();
        }
      }
    }
  }, {
    key: "release",
    value: function release(index) {
      if (this.clip) {
        if (this.clip.paused) {
          this.clip.reset();
        } else {
          this.clip.play();
        }
      }
    }
  }, {
    key: "update",
    value: function update(tick) {
      var clock = this.clock || (this.clock = new THREE.Clock());

      if (this.mixer) {
        var delta = clock.getDelta();
        this.mixer.update(delta);
      }
      /*
      if (this.options.test && this.ready) {
      	const time = clock.getElapsedTime();
      	if (time > 0 && Math.floor(time) % 5 === 0) {
      		if (this.clip.paused) {
      			this.clip.play();
      			// this.clip.play().reset();
      			// console.log(this.clip);
      		}
      	}
      	// this.buttons[1].value = Math.abs(Controller.getCos(tick, 1));
      }
      */

    }
  }]);

  return HandController;
}(_controller.default);

exports.default = HandController;
HandController.FOLDER = "models/hand";

},{"./controller":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = require("../../const");

var _gamepads = require("../gamepads");

var _controller = _interopRequireDefault(require("./controller"));

var _controllerFrag = require("./controller-frag.glsl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OFF = new THREE.Color(0x000000);
var ON = new THREE.Color(0x2196f3);

var OculusQuestController =
/*#__PURE__*/
function (_Controller) {
  _inherits(OculusQuestController, _Controller);

  function OculusQuestController(parent, gamepad) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, OculusQuestController);

    return _possibleConstructorReturn(this, _getPrototypeOf(OculusQuestController).call(this, parent, gamepad, options));
  }

  _createClass(OculusQuestController, [{
    key: "addModel",
    value: function addModel(hand) {
      var _this = this;

      var format = '.fbx'; // '.obj';

      var path = "".concat(OculusQuestController.FOLDER, "/").concat(hand, "/").concat(hand);
      var matcap = new THREE.TextureLoader().load('img/matcap/matcap-04.jpg');
      var texture = new THREE.TextureLoader().load("".concat(path, ".jpg"));
      var material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        map: texture,
        matcap: matcap,
        transparent: true,
        opacity: 1
      });
      var mesh = new THREE.Group();
      var loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
      var i = 0;
      loader.load("".concat(path).concat(format), function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = material.clone();

            child.material.onBeforeCompile = function (shader) {
              // shader.uniforms.emissive = new THREE.Uniform(new THREE.Color(0x000000));
              shader.uniforms.emissive = new THREE.Uniform(ON);
              shader.uniforms.emissiveIntensity = {
                value: 0
              };
              shader.fragmentShader = _controllerFrag.ControllerFragGlsl;
              child.shader = shader;
            };

            child.geometry.rotateX(child.rotation.x);
            child.geometry.rotateY(child.rotation.y);
            child.geometry.rotateZ(child.rotation.z);
            child.rotation.set(0, 0, 0);
            var position = child.position.clone(); // left > 0 joystick, 1 trigger, 2 grip, 3 X, 4 Y
            // right > 0 joystick, 1 trigger, 2 grip, 3 A, 4 B

            switch (child.name) {
              case 'joystick':
                child.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                  var axis = _this.axis[0];
                  child.rotation.set(axis.y * (0, _const.deg)(15), 0, -axis.x * (0, _const.deg)(15));
                  var value = _this.buttons[0].value;
                  child.position.set(position.x, position.y - value * (0, _const.mm)(2), position.z);

                  if (child.shader) {
                    child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                  }
                };

                break;

              case 'trigger':
                child.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                  var value = _this.buttons[1].value;
                  child.rotation.set(-value * (0, _const.deg)(20), 0, 0);

                  if (child.shader) {
                    child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                  }
                };

                break;

              case 'grip':
                var direction = hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 1 : -1;

                child.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                  var value = _this.buttons[2].value;
                  child.position.set(position.x + value * (0, _const.mm)(2) * direction, position.y, position.z);

                  if (child.shader) {
                    child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                  }
                };

                break;

              case 'buttonX':
              case 'buttonA':
                child.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                  var value = _this.buttons[3].value;
                  child.position.set(position.x, position.y - value * (0, _const.mm)(2), position.z);

                  if (child.shader) {
                    child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                  }
                };

                break;

              case 'buttonY':
              case 'buttonB':
                child.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                  var value = _this.buttons[4].value;
                  child.position.set(position.x, position.y - value * (0, _const.mm)(2), position.z);

                  if (child.shader) {
                    child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                  }
                };

                break;

              default:
            }

            i++;
          }
        });
        mesh.add(object);
        _this.ready = true;
      }, function (xhr) {
        _this.progress = xhr.loaded / xhr.total;
      }, function (error) {
        console.log("OculusQuestController.addModel not found ".concat(path).concat(format));
      });
      return mesh;
    }
  }, {
    key: "addRay",
    value: function addRay(hand) {
      var geometry = new THREE.CylinderBufferGeometry((0, _const.mm)(1), (0, _const.mm)(0.5), (0, _const.cm)(30), 5); // 10, 12

      geometry.rotateX(Math.PI / 2);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(this.hand === _gamepads.GAMEPAD_HANDS.RIGHT ? (0, _const.cm)(1) : -(0, _const.cm)(1), 0, -(0, _const.cm)(18.5));
      return mesh;
    }
  }, {
    key: "update",
    value: function update(tick) {
      if (this.options.test && this.ready) {
        this.axis[0].x = _controller.default.getCos(tick, 0);
        this.axis[0].y = _controller.default.getCos(tick, 1);
        this.buttons[1].value = Math.abs(_controller.default.getCos(tick, 1));
        this.buttons[2].value = Math.abs(_controller.default.getCos(tick, 2));
        this.buttons[3].value = Math.abs(_controller.default.getCos(tick, 3));
        this.buttons[4].value = Math.abs(_controller.default.getCos(tick, 4));
      }
    }
  }]);

  return OculusQuestController;
}(_controller.default);

exports.default = OculusQuestController;
OculusQuestController.FOLDER = "models/oculus-quest";

},{"../../const":1,"../gamepads":11,"./controller":7,"./controller-frag.glsl":6}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = require("../const");

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

var _controller = _interopRequireDefault(require("./controller/controller"));

var _handController = _interopRequireDefault(require("./controller/hand-controller"));

var _oculusQuestController = _interopRequireDefault(require("./controller/oculus-quest-controller"));

var _gamepads = _interopRequireWildcard(require("./gamepads"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CONTROLLERS = {
  DEFAULT: _controller.default,
  OCULUS_QUEST: _oculusQuestController.default,
  HAND: _handController.default
};

var Controllers =
/*#__PURE__*/
function (_Emittable) {
  _inherits(Controllers, _Emittable);

  function Controllers(renderer, scene) {
    var _this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Controllers);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Controllers).call(this));
    _this.tick = 0;
    _this.controllers_ = {};
    _this.gamepads_ = {};
    _this.renderer = renderer;
    _this.scene = scene;
    _this.options = Object.assign({
      debug: false,
      test: _const.TEST_ENABLED
    }, options);
    _this.direction = new THREE.Vector3();

    if (_this.options.debug) {
      _this.text = _this.addText_(scene);
    }

    var gamepads = _this.gamepads = _this.addGamepads_();

    _this.addTestController_();

    _this.addEvents();

    return _this;
  }
  /*
  get controller() {
  	return this.controller_;
  }
  	set controller(controller) {
  	if (this.controller_ !== controller) {
  		if (this.controller_) {
  			this.controller_.active = false;
  		}
  		this.controller_ = controller;
  		controller.active = true;
  	}
  }
  */


  _createClass(Controllers, [{
    key: "feedback",
    value: function feedback() {
      var gamepad = this.gamepad;

      if (gamepad) {
        gamepad.feedback();
      }
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      this.gamepads.update(this.tick);
      Object.keys(this.controllers_).forEach(function (x) {
        return _this2.controllers_[x].update(_this2.tick);
      });
      this.tick++;
    }
  }, {
    key: "setRaycaster",
    value: function setRaycaster(raycaster) {
      var controller = this.controller;

      if (controller) {
        var pivot = controller.parent;
        var position = pivot.position;
        var rotation = pivot.getWorldDirection(this.direction).multiplyScalar(-1);
        raycaster.set(position, rotation);
        return raycaster;
      }
    }
  }, {
    key: "addGamepads_",
    value: function addGamepads_() {
      var _this3 = this;

      var gamepads = new _gamepads.default(function (message, object) {
        _this3.log(message, object);
      });
      return gamepads;
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      this.onConnect = this.onConnect.bind(this);
      this.onDisconnect = this.onDisconnect.bind(this);
      this.onActivate = this.onActivate.bind(this);
      this.onPress = this.onPress.bind(this);
      this.onRelease = this.onRelease.bind(this);
      this.onAxis = this.onAxis.bind(this);
      this.onBroadcast = this.onBroadcast.bind(this);
      var gamepads = this.gamepads;
      gamepads.on('connect', this.onConnect);
      gamepads.on('disconnect', this.onDisconnect);
      gamepads.on('activate', this.onActivate);
      gamepads.on('press', this.onPress);
      gamepads.on('release', this.onRelease);
      gamepads.on('axis', this.onAxis);
      gamepads.on('broadcast', this.onBroadcast);
    }
  }, {
    key: "removeEvents",
    value: function removeEvents() {
      var gamepads = this.gamepads;
      gamepads.off('connect', this.onConnect);
      gamepads.off('disconnect', this.onDisconnect);
      gamepads.off('activate', this.onActivate);
      gamepads.off('press', this.onPress);
      gamepads.off('release', this.onRelease);
      gamepads.off('axis', this.onAxis);
      gamepads.off('broadcast', this.onBroadcast);
    }
  }, {
    key: "onConnect",
    value: function onConnect(gamepad) {
      this.log("connect ".concat(gamepad.hand, " ").concat(gamepad.index), gamepad);
      var controller = this.addController_(this.renderer, this.scene, gamepad);
    }
  }, {
    key: "onDisconnect",
    value: function onDisconnect(gamepad) {
      this.log("disconnect ".concat(gamepad.hand, " ").concat(gamepad.index), gamepad);
      this.removeController_(gamepad);
    }
  }, {
    key: "onActivate",
    value: function onActivate(gamepad) {
      this.gamepad = gamepad;
    }
  }, {
    key: "onPress",
    value: function onPress(button) {
      this.log("press ".concat(button.gamepad.hand, " ").concat(button.index), button);
    }
  }, {
    key: "onRelease",
    value: function onRelease(button) {// this.log(`release ${button.gamepad.hand} ${button.index}`, button);
    }
  }, {
    key: "onAxis",
    value: function onAxis(axis) {// this.log(`axis ${axis.gamepad.hand} ${axis.index} { x:${axis.x}, y:${axis.y} }`, axis);
    }
  }, {
    key: "onBroadcast",
    value: function onBroadcast(type, event) {
      this.emit(type, event);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeEvents();
      this.gamepads = null;
    }
  }, {
    key: "addController_",
    value: function addController_(renderer, scene, gamepad) {
      var index = gamepad.index;
      var controller = this.controllers_[index];

      if (!controller) {
        var pivot = renderer.vr.getController(index); // controller = new CONTROLLERS.DEFAULT(pivot, gamepad, this.options);
        // controller = new CONTROLLERS.OCULUS_QUEST(pivot, gamepad, this.options);

        controller = new CONTROLLERS.HAND(pivot, gamepad, this.options);
        this.controllers_[index] = controller;
        scene.add(pivot);
      }

      return controller;
    }
  }, {
    key: "removeController_",
    value: function removeController_(gamepad) {
      var controller = this.controllers_[gamepad.index];

      if (controller) {
        var pivot = controller.parent;
        this.scene.remove(pivot);
        controller.parent.remove(controller);
        delete this.controllers_[gamepad.index];
      }
    }
  }, {
    key: "addTestController_",
    value: function addTestController_() {
      if (this.options.test) {
        var gamepad = new _emittable.default({
          hand: _gamepads.GAMEPAD_HANDS.RIGHT
        }); // const controller = new CONTROLLERS.DEFAULT(this.scene, gamepad, this.options);
        // const controller = new CONTROLLERS.OCULUS_QUEST(this.scene, gamepad, this.options);

        var controller = new CONTROLLERS.HAND(this.scene, gamepad, this.options);
        controller.scale.set(4, 4, 4);
        controller.position.set(0, 1, -2);
        this.controller = controller;
        this.controllers_[0] = controller;
        this.mouse = {
          x: 0,
          y: 0
        };
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      var controller = this.controller;

      if (controller) {
        controller.press(1);
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(event) {
      var controller = this.controller;

      if (controller) {
        controller.release(1);
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var w2 = window.innerWidth / 2;
      var h2 = window.innerHeight / 2;
      this.mouse.x = (event.clientX - w2) / w2;
      this.mouse.y = -(event.clientY - h2) / h2;
      this.updateTest(this.mouse);
    }
  }, {
    key: "updateTest",
    value: function updateTest(mouse) {
      var controller = this.controller;

      if (controller) {
        controller.rotation.y = -mouse.x * Math.PI;
        controller.rotation.x = mouse.y * Math.PI / 2;
      }
    }
  }, {
    key: "log",
    value: function log(message, object) {
      if (this.options.debug) {
        console.log(message, object);
        this.setText(message);
      }
    }
  }, {
    key: "addText_",
    value: function addText_(parent) {
      var _this4 = this;

      var loader = new THREE.FontLoader();
      loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        _this4.font = font;
        var material = new THREE.MeshBasicMaterial({
          color: 0x111111,
          // 0x33c5f6,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide
        });
        _this4.fontMaterial = material;
      });
    }
  }, {
    key: "setText",
    value: function setText(message) {
      if (this.options.debug) {
        message = message || '1';

        if (this.text) {
          this.text.parent.remove(this.text);
          this.text.geometry.dispose();
        }

        if (this.font) {
          var shapes = this.font.generateShapes(message, 5);
          var geometry = new THREE.ShapeBufferGeometry(shapes);
          geometry.computeBoundingBox();
          var x = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
          geometry.translate(x, 0, 0);
          var text = new THREE.Mesh(geometry, this.fontMaterial);
          text.position.set(0, 0, -_const.POINTER_RADIUS);
          this.text = text;
          this.scene.add(text);
        }
      }
    }
  }, {
    key: "gamepad",
    get: function get() {
      return this.gamepad_;
    },
    set: function set(gamepad) {
      if (this.gamepad_ !== gamepad) {
        this.gamepad_ = gamepad;
        this.controller = this.controllers_[gamepad.index];
      }
    }
  }]);

  return Controllers;
}(_emittable.default);

exports.default = Controllers;

},{"../const":1,"../interactive/emittable":2,"./controller/controller":7,"./controller/hand-controller":8,"./controller/oculus-quest-controller":9,"./gamepads":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GamepadAxis = exports.GamepadButton = exports.Gamepad = exports.GAMEPAD_MODELS = exports.GAMEPAD_HANDS = exports.default = exports.SUPPORTED_REGEXP = exports.SUPPORTED_GAMEPADS = void 0;

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SUPPORTED_GAMEPADS = ['Gear VR Controller', 'Daydream Controller', 'Oculus Go Controller', 'OpenVR Gamepad', 'Oculus Touch', 'Spatial Controller'];
exports.SUPPORTED_GAMEPADS = SUPPORTED_GAMEPADS;
var SUPPORTED_REGEXP = new RegExp("^(".concat(SUPPORTED_GAMEPADS.join('|'), ")"), 'i');
exports.SUPPORTED_REGEXP = SUPPORTED_REGEXP;

var Gamepads =
/*#__PURE__*/
function (_Emittable) {
  _inherits(Gamepads, _Emittable);

  _createClass(Gamepads, [{
    key: "gamepads",
    set: function set(gamepads) {
      this.gamepads_ = gamepads;
    },
    get: function get() {
      if (!this.gamepads_) {
        this.gamepads_ = {}; // console.log('gamepads', this.gamepads_);

        var gamepads = Gamepads.get();

        for (var i = 0; i < gamepads.length; i++) {
          this.connect(gamepads[i]);
        }

        this.addListeners();
      }

      return this.gamepads_;
    }
  }], [{
    key: "get",
    value: function get() {
      return _toConsumableArray(typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : []);
    }
  }, {
    key: "isSupported",
    value: function isSupported(id) {
      // console.log(`isSupported|${id}|`);
      return id.match(SUPPORTED_REGEXP);
    }
  }]);

  function Gamepads(log) {
    var _this;

    _classCallCheck(this, Gamepads);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Gamepads).call(this));
    _this.log = log;
    _this.hands = {};

    _this.onConnect = function (event) {
      _this.connect(event.gamepad);
    };

    _this.onDisconnect = function (event) {
      _this.disconnect(event.gamepad);
    };

    _this.onEvent = _this.onEvent.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Gamepads, [{
    key: "connect",
    value: function connect($gamepad) {
      // console.log('connect', $gamepad);
      try {
        // Note: $gamepad === navigator.getGamepads()[$gamepad.index]
        if ($gamepad) {
          var id = $gamepad.id;
          this.log("connect ".concat($gamepad.id, " ").concat(Gamepads.isSupported(id)), $gamepad);

          if (Gamepads.isSupported(id)) {
            var index = $gamepad.index;
            var gamepad = this.gamepads[index] ? this.gamepads[index] : this.gamepads[index] = new Gamepad($gamepad); // console.log(gamepad);

            this.hands[gamepad.hand] = gamepad;
            this.emit('connect', gamepad);
            gamepad.on('broadcast', this.onEvent);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect($gamepad) {
      // console.log('disconnect', $gamepad);
      try {
        // Note: $gamepad === navigator.getGamepads()[$gamepad.index]
        var id = $gamepad.id;

        if (Gamepads.isSupported(id)) {
          var index = $gamepad.index;
          var gamepad = this.gamepads[index] || $gamepad;

          if (gamepad instanceof Gamepad) {
            gamepad.off('broadcast', this.onEvent);
            gamepad.destroy();
          }

          delete this.gamepads[gamepad.index];
          delete this.hands[gamepad.hand];
          this.emit('disconnect', gamepad);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: "onEvent",
    value: function onEvent(type, event) {
      switch (type) {
        case 'press':
          if (this.button !== event) {
            if (this.button) {
              event.gamepad.emit('deactivate', this.button.gamepad);
            }

            this.button = event;
            event.gamepad.emit('activate', event.gamepad);
          }

          break;

        case 'release':
          if (this.button === event) {
            this.button = null; // event.gamepad.emit('deactivate', event.gamepad);
          }

          break;
      }

      this.emit(type, event);
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      window.addEventListener('gamepadconnected', this.onConnect, false);
      window.addEventListener('gamepaddisconnected', this.onDisconnect, false);
    }
  }, {
    key: "removeListeners",
    value: function removeListeners() {
      window.removeEventListener('gamepadconnected', this.onConnect, false);
      window.removeEventListener('gamepaddisconnected', this.onDisconnect, false);
    }
  }, {
    key: "update",
    value: function update() {
      for (var k in this.gamepads) {
        var gamepad = this.gamepads[k];

        if (gamepad) {
          gamepad.update();
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeListeners();

      for (var k in this.gamepads) {
        var gamepad = this.gamepads[k];

        if (gamepad) {
          gamepad.destroy();
        }
      }

      this.gamepads = null;
    }
  }]);

  return Gamepads;
}(_emittable.default);

exports.default = Gamepads;
var GAMEPAD_HANDS = {
  NONE: 'none',
  LEFT: 'left',
  RIGHT: 'right'
};
exports.GAMEPAD_HANDS = GAMEPAD_HANDS;
var GAMEPAD_MODELS = {
  OCULUS_TOUCH: 0
};
exports.GAMEPAD_MODELS = GAMEPAD_MODELS;

var Gamepad =
/*#__PURE__*/
function (_Emittable2) {
  _inherits(Gamepad, _Emittable2);

  function Gamepad(gamepad) {
    var _this2;

    _classCallCheck(this, Gamepad);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Gamepad).call(this));
    _this2.gamepad = gamepad;
    _this2.id = gamepad.id;
    _this2.index = gamepad.index;
    _this2.hand = _this2.getHand();
    _this2.type = _this2.getType();
    _this2.buttons = {};
    _this2.axes = {};
    return _this2;
  }

  _createClass(Gamepad, [{
    key: "getHand",
    value: function getHand() {
      if (this.gamepad.hand === 'left' || this.id.match(/(\sleft)/i)) {
        return GAMEPAD_HANDS.LEFT;
      } else if (this.gamepad.hand === 'right' || this.id.match(/(\sright)/i)) {
        return GAMEPAD_HANDS.RIGHT;
      } else {
        return GAMEPAD_HANDS.NONE;
      }
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.id; // !!!
    }
  }, {
    key: "update",
    value: function update() {
      this.updateButtons();
      this.updateAxes();
    }
  }, {
    key: "updateButtons",
    value: function updateButtons() {
      var _this3 = this;

      this.gamepad.buttons.forEach(function (x, i) {
        var pressed = x.pressed;
        var button = _this3.buttons[i] || (_this3.buttons[i] = new GamepadButton(i, _this3));

        if (button.pressed !== pressed) {
          button.pressed = pressed;

          if (pressed) {
            _this3.emit('press', button);
          } else if (status !== undefined) {
            _this3.emit('release', button);
          }
        }
      });
    }
  }, {
    key: "updateAxes",
    value: function updateAxes() {
      var axes = this.gamepad.axes;

      for (var i = 0; i < axes.length; i += 2) {
        var index = Math.floor(i / 2);
        var axis = this.axes[index] || (this.axes[index] = new GamepadAxis(index, this));
        var x = axes[i];
        var y = axes[i + 1];

        if (axis.x !== x || axis.y !== y) {
          axis.x = x;
          axis.y = y;

          if (Math.abs(x) > Math.abs(y)) {
            var left = x < -0.85;
            var right = x > 0.85;

            if (axis.left !== left) {
              axis.left = left;
              this.emit(left ? 'left' : 'none', axis);
              console.log("".concat(axis.gamepad.hand, " ").concat(axis.gamepad.index, " left ").concat(left));
            }

            if (axis.right !== right) {
              axis.right = right;
              this.emit(right ? 'right' : 'none', axis);
              console.log("".concat(axis.gamepad.hand, " ").concat(axis.gamepad.index, " right ").concat(right));
            }
          } else {
            var up = y < -0.85;
            var down = y > 0.85;

            if (axis.up !== up) {
              axis.up = up;
              this.emit(up ? 'up' : 'none', axis);
              console.log("".concat(axis.gamepad.hand, " ").concat(axis.gamepad.index, " up ").concat(up));
            }

            if (axis.down !== down) {
              axis.down = down;
              this.emit(down ? 'down' : 'none', axis);
              console.log("".concat(axis.gamepad.hand, " ").concat(axis.gamepad.index, " down ").concat(down));
            }
          }

          this.emit('axis', axis);
        }
      }
    }
  }, {
    key: "feedback",
    value: function feedback() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      // !!! care for battery
      var actuators = this.gamepad.hapticActuators;

      if (actuators && actuators.length) {
        return actuators[0].pulse(strength, duration);
      } else {
        return Promise.reject();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.gamepad = null;
    }
  }]);

  return Gamepad;
}(_emittable.default);

exports.Gamepad = Gamepad;

var GamepadButton = function GamepadButton(index, gamepad) {
  _classCallCheck(this, GamepadButton);

  this.index = index;
  this.gamepad = gamepad;
  this.pressed = false;
};

exports.GamepadButton = GamepadButton;

var GamepadAxis =
/*#__PURE__*/
function (_THREE$Vector) {
  _inherits(GamepadAxis, _THREE$Vector);

  function GamepadAxis(index, gamepad) {
    var _this4;

    _classCallCheck(this, GamepadAxis);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(GamepadAxis).call(this));
    _this4.index = index;
    _this4.gamepad = gamepad;
    _this4.left = _this4.right = _this4.up = _this4.down = false;
    return _this4;
  }

  return GamepadAxis;
}(THREE.Vector2);

exports.GamepadAxis = GamepadAxis;

},{"../interactive/emittable":2}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VR = exports.VR_MODE = void 0;

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VR_MODE = {
  NONE: 0,
  VR: 1,
  XR: 2
};
exports.VR_MODE = VR_MODE;

var VR =
/*#__PURE__*/
function (_Emittable) {
  _inherits(VR, _Emittable);

  function VR(renderer, options, onError) {
    var _this;

    _classCallCheck(this, VR);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VR).call(this));

    if (options && options.frameOfReferenceType) {
      renderer.vr.setFrameOfReferenceType(options.frameOfReferenceType);
    }

    if (onError) {
      _this.on('error', onError);
    }

    _this.renderer = renderer;
    _this.options = options;
    _this.onVRDisplayConnect = _this.onVRDisplayConnect.bind(_assertThisInitialized(_this));
    _this.onVRDisplayDisconnect = _this.onVRDisplayDisconnect.bind(_assertThisInitialized(_this));
    _this.onVRDisplayPresentChange = _this.onVRDisplayPresentChange.bind(_assertThisInitialized(_this));
    _this.onVRDisplayActivate = _this.onVRDisplayActivate.bind(_assertThisInitialized(_this));
    _this.onVRMouseEnter = _this.onVRMouseEnter.bind(_assertThisInitialized(_this));
    _this.onVRMouseLeave = _this.onVRMouseLeave.bind(_assertThisInitialized(_this));
    _this.onVRClick = _this.onVRClick.bind(_assertThisInitialized(_this));
    _this.onXRClick = _this.onXRClick.bind(_assertThisInitialized(_this));
    _this.onXRSessionStarted = _this.onXRSessionStarted.bind(_assertThisInitialized(_this));
    _this.onXRSessionEnded = _this.onXRSessionEnded.bind(_assertThisInitialized(_this));
    _this.mode = _this.detectMode();

    _this.initElement();

    return _this;
  }

  _createClass(VR, [{
    key: "detectMode",
    value: function detectMode() {
      var mode = VR_MODE.NONE;

      if ('xr' in navigator) {
        mode = VR_MODE.XR;
      } else if ('getVRDisplays' in navigator) {
        mode = VR_MODE.VR;
      }

      return mode;
    }
  }, {
    key: "initElement",
    value: function initElement() {
      try {
        var element;

        switch (this.mode) {
          case VR_MODE.VR:
            element = this.element = this.addElement('button');
            element.style.display = 'none';
            window.addEventListener('vrdisplayconnect', this.onVRDisplayConnect, false);
            window.addEventListener('vrdisplaydisconnect', this.onVRDisplayDisconnect, false);
            window.addEventListener('vrdisplaypresentchange', this.onVRDisplayPresentChange, false);
            window.addEventListener('vrdisplayactivate', this.onVRDisplayActivate, false);
            this.getVR();
            break;

          case VR_MODE.XR:
            element = this.element = this.addElement('button');
            this.getXR();
            break;

          default:
            element = this.element = this.addElement('a');
            element.style.display = 'block';
            element.style.left = 'calc(50% - 90px)';
            element.style.width = '180px';
            element.style.textDecoration = 'none';
            element.href = 'https://webvr.info';
            element.target = '_blank';
            element.innerHTML = 'WEBVR NOT SUPPORTED';
        }

        this.element = element;
      } catch (error) {
        // console.log(error);
        this.emit('error', error);
      }
    }
  }, {
    key: "addElement",
    value: function addElement(type) {
      var element = document.createElement(type);
      element.style.display = 'none';
      element.style.position = 'absolute';
      element.style.bottom = '20px';
      element.style.padding = '12px 6px';
      element.style.border = '1px solid #fff';
      element.style.borderRadius = '4px';
      element.style.background = 'rgba(0,0,0,0.1)';
      element.style.color = '#fff';
      element.style.font = 'normal 13px sans-serif';
      element.style.textAlign = 'center';
      element.style.opacity = '0.5';
      element.style.outline = 'none';
      element.style.zIndex = '999';
      return element;
    }
  }, {
    key: "getVR",
    value: function getVR() {
      var _this2 = this;

      navigator.getVRDisplays().then(function (displays) {
        // console.log('navigator.getVRDisplays', displays);
        if (displays.length > 0) {
          _this2.setEnterVR(displays[0]);
        } else {
          _this2.setVRNotFound();
        }
      }).catch(function (e) {
        console.log('getVR.error', e);

        _this2.setVRNotFound();
      });
    }
  }, {
    key: "getXR",
    value: function getXR() {
      var _this3 = this;

      navigator.xr.requestDevice().then(function (device) {
        device.supportsSession({
          immersive: true,
          exclusive: true
          /* DEPRECATED */

        }).then(function () {
          _this3.setEnterXR(device);
        }).catch(function () {
          return _this3.setVRNotFound();
        });
      }).catch(function (e) {
        console.log('getXR.error', e);

        _this3.setVRNotFound();
      });
    }
  }, {
    key: "setEnterVR",
    value: function setEnterVR(device) {
      this.device = device;
      this.renderer.vr.setDevice(device);
      this.session = null;
      var element = this.element;
      element.style.display = '';
      element.style.cursor = 'pointer';
      element.style.left = 'calc(50% - 50px)';
      element.style.width = '100px';
      element.textContent = 'ENTER VR';
      element.addEventListener('mouseenter', this.onVRMouseEnter);
      element.addEventListener('mouseleave', this.onVRMouseLeave);
      element.addEventListener('click', this.onVRClick);
    }
  }, {
    key: "setEnterXR",
    value: function setEnterXR(device) {
      this.device = device;
      this.session = null;
      var element = this.element;
      element.style.display = '';
      element.style.cursor = 'pointer';
      element.style.left = 'calc(50% - 50px)';
      element.style.width = '100px';
      element.textContent = 'ENTER XR'; // !!!

      element.addEventListener('mouseenter', this.onVRMouseEnter);
      element.addEventListener('mouseleave', this.onVRMouseLeave);
      element.addEventListener('click', this.onXRClick);
      this.renderer.vr.setDevice(device);
    }
  }, {
    key: "setVRNotFound",
    value: function setVRNotFound() {
      renderer.vr.setDevice(null);
      var element = this.element;
      element.style.display = '';
      element.style.cursor = 'auto';
      element.style.left = 'calc(50% - 75px)';
      element.style.width = '150px';
      element.textContent = 'VR NOT FOUND';
      element.removeEventListener('mouseenter', this.onVRMouseEnter);
      element.removeEventListener('mouseleave', this.onVRMouseLeave);
      element.removeEventListener('click', this.onVRClick);
      element.removeEventListener('click', this.onXRClick);
    } // events

  }, {
    key: "onVRDisplayConnect",
    value: function onVRDisplayConnect(event) {
      this.setEnterVR(event.display);
    }
  }, {
    key: "onVRDisplayDisconnect",
    value: function onVRDisplayDisconnect(event) {
      this.setVRNotFound();
    }
  }, {
    key: "onVRDisplayPresentChange",
    value: function onVRDisplayPresentChange(event) {
      try {
        this.element.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';
        this.session = event.display.isPresenting;
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: "onVRDisplayActivate",
    value: function onVRDisplayActivate(event) {
      var _this4 = this;

      try {
        event.display.requestPresent([{
          source: this.renderer.domElement
        }]).then(function () {
          _this4.emit('presenting');
        }, function (error) {
          console.log(error);

          _this4.emit('error', error);
        });
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: "onVRMouseEnter",
    value: function onVRMouseEnter(event) {
      this.element.style.opacity = '1.0';
    }
  }, {
    key: "onVRMouseLeave",
    value: function onVRMouseLeave(event) {
      this.element.style.opacity = '0.5';
    }
  }, {
    key: "onVRClick",
    value: function onVRClick(event) {
      var _this5 = this;

      try {
        var device = this.device;

        if (device.isPresenting) {
          device.exitPresent();
        } else {
          device.requestPresent([{
            source: this.renderer.domElement
          }]).then(function () {
            _this5.emit('presenting');
          }, function (error) {
            console.log(error);

            _this5.emit('error', error);
          });
        }
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: "onXRClick",
    value: function onXRClick(event) {
      try {
        var device = this.device;

        if (this.session === null) {
          device.requestSession({
            immersive: true,
            exclusive: true
            /* DEPRECATED */

          }).then(this.onXRSessionStarted);
          /*
          if (Tone.context.state !== 'running') {
          	Tone.context.resume();
          }
          */
        } else {
          this.session.end();
        }
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: "onXRSessionStarted",
    value: function onXRSessionStarted(session) {
      try {
        session.addEventListener('end', this.onXRSessionEnded);
        this.renderer.vr.setSession(session);
        this.element.textContent = 'EXIT VR';
        this.session = session;
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: "onXRSessionEnded",
    value: function onXRSessionEnded(event) {
      try {
        this.session.removeEventListener('end', this.onXRSessionEnded);
        this.renderer.vr.setSession(null);
        this.element.textContent = 'ENTER VR';
        this.session = null;
      } catch (error) {
        this.emit('error', error);
      }
    }
  }]);

  return VR;
}(_emittable.default);
/*
VRDisplays[0]: VRDisplay {
	capabilities: VRDisplayCapabilities {
		canPresent: true
		hasExternalDisplay: false
		hasOrientation: true
		hasPosition: true
		maxLayers: 1
	}
	depthFar: 10000
	depthNear: 0.01
	displayId: 1
	displayName: "Oculus Quest"
	isConnected: true
	isPresenting: false
	stageParameters: VRStageParameters {
		sittingToStandingTransform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1.649999976158142, 0, 1]
		sizeX: 0
		sizeZ: 0
	}
}
*/


exports.VR = VR;

},{"../interactive/emittable":2}],13:[function(require,module,exports){
"use strict";

var _const = require("./const");

var _interactive = _interopRequireDefault(require("./interactive/interactive.mesh"));

var _controllers = _interopRequireDefault(require("./vr/controllers"));

var _gamepads = require("./vr/gamepads");

var _vr = require("./vr/vr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var vrui =
/*#__PURE__*/
function () {
  function vrui() {
    _classCallCheck(this, vrui);

    this.tick = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.parallax = {
      x: 0,
      y: 0
    };
    this.size = {
      width: 0,
      height: 0,
      aspect: 0
    };
    this.cameraDirection = new THREE.Vector3();
    this.init();
  }

  _createClass(vrui, [{
    key: "init",
    value: function init() {
      var _this = this;

      var section = this.section = document.querySelector('.vrui');
      var container = this.container = section.querySelector('.vrui__container');
      var debugInfo = this.debugInfo = section.querySelector('.debug__info');
      var debugSave = this.debugSave = section.querySelector('.debug__save');
      var renderer = this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setClearColor(0x666666, 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.vr.enabled = true;
      container.appendChild(renderer.domElement);
      var vr = this.vr = new _vr.VR(renderer, {
        referenceSpaceType: 'local'
      }, function (error) {
        _this.debugInfo.innerHTML = error;
      });
      container.appendChild(vr.element);
      var raycaster = this.raycaster = new THREE.Raycaster();
      var scene = this.scene = new THREE.Scene();
      var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, (0, _const.cm)(176), 0);
      camera.target = new THREE.Vector3(0, (0, _const.cm)(176), -2);
      camera.lookAt(camera.target);
      /*
      const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      scene.add(light);
      */

      var hdr = this.hdr = this.getEnvMap(function (texture, textureData) {});
      var bg = this.bg = this.addBG();
      scene.add(bg);
      var cube0 = this.cube0 = this.addCube(0);
      scene.add(cube0);
      var cube1 = this.cube1 = this.addCube(1);
      scene.add(cube1);

      if (this.vr.mode !== _vr.VR_MODE.NONE || _const.TEST_ENABLED) {
        var controllers = this.controllers = new _controllers.default(renderer, scene, {
          debug: true
        });
        controllers.on('press', function (button) {
          console.log('vrui.press', button.gamepad.hand, button.index);

          switch (button.gamepad.hand) {
            case _gamepads.GAMEPAD_HANDS.LEFT:
              // 0 joystick, 1 trigger, 2 grip, 3 Y, 4 X

              /*
              switch (button.index) {
              	case 1:
              		break;
              }
              */
              break;

            case _gamepads.GAMEPAD_HANDS.RIGHT:
              // 0 joystick, 1 trigger, 2 grip, 3 A, 4 B
              break;
          }
        });
        controllers.on('release', function (button) {
          console.log('vrui.release', button.gamepad.hand, button.index);
        });
        controllers.on('left', function (axis) {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.left', axis.gamepad.hand, axis.index);
            TweenMax.to(cube0.userData.rotation, 0.3, {
              y: cube0.userData.rotation.y - Math.PI / 2,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('right', function (axis) {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.right', axis.gamepad.hand, axis.index);
            TweenMax.to(cube0.userData.rotation, 0.3, {
              y: cube0.userData.rotation.y + Math.PI / 2,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('up', function (axis) {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.up', axis.gamepad.hand, axis.index);
            var s = Math.min(2.0, cube0.userData.scale.x + 0.1);
            TweenMax.to(cube0.userData.scale, 0.3, {
              x: s,
              y: s,
              z: s,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('down', function (axis) {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.down', axis.gamepad.hand, axis.index);
            var s = Math.max(0.1, cube0.userData.scale.x - 0.1);
            TweenMax.to(cube0.userData.scale, 0.3, {
              x: s,
              y: s,
              z: s,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('axis', function (axis) {
          console.log('vrui.axis', axis.gamepad.hand, axis.index);

          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.RIGHT) {
            var s = Math.max(0.1, Math.min(2, cube1.scale.x + axis.y * 0.1));
            cube1.userData.scale.set(s, s, s);
            cube1.userData.rotation.y += axis.x * 0.2;
          }
        });
      }

      this.onWindowResize = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.onWindowResize, false);
    }
  }, {
    key: "addCube",
    value: function addCube(index) {
      var matcap = new THREE.TextureLoader().load('img/matcap/matcap-00.jpg');
      var geometry = new THREE.BoxGeometry((0, _const.cm)(20), (0, _const.cm)(20), (0, _const.cm)(20));
      var material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: matcap
      });
      var cube = new _interactive.default(geometry, material);
      cube.position.set(index === 0 ? -(0, _const.cm)(30) : (0, _const.cm)(30), (0, _const.cm)(136), -2);
      cube.userData = {
        scale: new THREE.Vector3(1, 1, 1),
        rotation: new THREE.Vector3() // position: new THREE.Vector3(),

      };

      cube.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
        cube.scale.set(cube.userData.scale.x, cube.userData.scale.y, cube.userData.scale.z);
        cube.rotation.set(cube.userData.rotation.x, cube.userData.rotation.y, cube.userData.rotation.z);
        /*
        cube.rotation.y += Math.PI / 180 * 5;
        cube.rotation.x += Math.PI / 180 * 1;
        const s = 1 + Math.cos(this.tick * 0.1) * 0.5;
        cube.scale.set(s, s, s);
        */
      };

      cube.on('over', function () {
        cube.material.color.setHex(0xffffff);
      });
      cube.on('out', function () {
        cube.material.color.setHex(0xcccccc);
      });
      cube.on('down', function () {
        cube.material.color.setHex(0x0000ff);
      });
      cube.on('up', function () {
        cube.material.color.setHex(0xcccccc);
      });
      return cube;
    }
  }, {
    key: "addBG",
    value: function addBG() {
      var matcap = new THREE.TextureLoader().load('img/matcap/matcap-10.jpg');
      var geometry = new THREE.Geometry();
      var origin = new THREE.Vector3();
      new Array(300).fill().forEach(function (x) {
        var s = (0, _const.cm)(30) + Math.random() * (0, _const.cm)(0);
        var h = 3.0 + Math.random() * 3.0;
        var r = 5 + Math.random() * 20;
        var a = Math.PI * 2 * Math.random();
        var cubeGeometry = new THREE.BoxGeometry(s, h, s);
        cubeGeometry.translate(Math.cos(a) * r, h / 2, Math.sin(a) * r);
        cubeGeometry.lookAt(origin);
        geometry.merge(cubeGeometry);
      });
      var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
      var material = new THREE.MeshMatcapMaterial({
        color: 0x333333,
        matcap: matcap
      });
      var mesh = new THREE.Mesh(bufferGeometry, material);
      /*
      mesh.onBeforeRender = () => {
      	mesh.rotation.y += 0.001;
      };
      */

      return mesh;
    }
  }, {
    key: "getEnvMap",
    value: function getEnvMap(callback) {
      var _this2 = this;

      var loader = new THREE.TextureLoader().load('img/environment/360_world.jpg', function (source, textureData) {
        source.mapping = THREE.UVMapping;
        var options = {
          resolution: 1024,
          generateMipmaps: true,
          minFilter: THREE.LinearMipMapLinearFilter,
          magFilter: THREE.LinearFilter
        };
        _this2.scene.background = new THREE.CubemapGenerator(_this2.renderer).fromEquirectangular(source, options);
        var cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, options);
        var texture = cubemapGenerator.update(_this2.renderer);
        texture.mapping = THREE.CubeReflectionMapping;
        texture.mapping = THREE.CubeRefractionMapping;
        source.dispose();

        if (typeof callback === 'function') {
          callback(texture);
        }
      });
      return loader;
    }
  }, {
    key: "updateRaycaster",
    value: function updateRaycaster() {
      try {
        var controllers = this.controllers;
        var raycaster = controllers.setRaycaster(this.raycaster);

        if (raycaster) {
          var hit = _interactive.default.hittest(raycaster, controllers.gamepads.button);

          if (hit) {
            controllers.feedback();
            /*
            if (Tone.context.state === 'running') {
            	const feedback = this.feedback = (this.feedback || new Tone.Player('audio/feedback.mp3').toMaster());
            	feedback.start();
            }
            */
          }
        }
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "render",
    value: function render(delta) {
      try {
        if (this.controllers) {
          this.controllers.update();
          this.updateRaycaster();
        }

        var renderer = this.renderer;
        renderer.render(this.scene, this.camera);
        this.tick++;
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      var renderer = this.renderer;
      renderer.setAnimationLoop(function () {
        _this3.render();
      });
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      try {
        var container = this.container,
            renderer = this.renderer,
            camera = this.camera;
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        if (renderer) {
          renderer.setSize(width, height);
        }

        if (camera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }]);

  return vrui;
}();

var tour = new vrui();
tour.animate();

},{"./const":1,"./interactive/interactive.mesh":5,"./vr/controllers":10,"./vr/gamepads":11,"./vr/vr":12}]},{},[13]);
//# sourceMappingURL=vrui.js.map
