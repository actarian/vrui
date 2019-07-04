(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cm = cm;
exports.mm = mm;
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
    _classCallCheck(this, Emittable);

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
exports.default = void 0;

var _const = require("../const");

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

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

var Controllers =
/*#__PURE__*/
function (_Emittable) {
  _inherits(Controllers, _Emittable);

  function Controllers(renderer, scene, pivot) {
    var _this;

    _classCallCheck(this, Controllers);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Controllers).call(this));
    _this.controllers_ = {};
    _this.gamepads_ = {};
    _this.renderer = renderer;
    _this.scene = scene;
    _this.pivot = pivot;
    _this.controllerDirection = new THREE.Vector3();

    var text = _this.text = _this.addText(pivot);

    var gamepads = _this.gamepads = _this.addGamepads();

    return _this;
  }

  _createClass(Controllers, [{
    key: "addGamepads",
    value: function addGamepads() {
      var _this2 = this;

      var gamepads = this.gamepads = new _gamepads.default(function (text) {
        _this2.setText(text);
      });
      gamepads.on('connect', function (gamepad) {
        // console.log('connect', gamepad);
        _this2.setText("connect ".concat(gamepad.hand, " ").concat(gamepad.index));

        var controller = _this2.addController(_this2.renderer, _this2.scene, gamepad);

        if (gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
          _this2.left = controller;
        } else {
          _this2.right = controller;
        }
      });
      gamepads.on('disconnect', function (gamepad) {
        // console.log('disconnect', gamepad);
        _this2.setText("disconnect ".concat(gamepad.hand, " ").concat(gamepad.index));

        _this2.removeController(gamepad);
      });
      gamepads.on('hand', function (gamepad) {
        _this2.setController(gamepad);
      });
      gamepads.on('press', function (button) {
        // console.log('press', press);
        _this2.setText("press ".concat(button.gamepad.hand, " ").concat(button.index));

        switch (button.gamepad.hand) {
          case _gamepads.GAMEPAD_HANDS.LEFT:
            // 0 trigger, 1 front, 2 side, 3 Y, 4 X
            switch (button.index) {
              case 1:
                break;

              case 2:
                break;

              case 3:
                break;
            }

            break;

          case _gamepads.GAMEPAD_HANDS.RIGHT:
            // 0 trigger, 1 front, 2 side, 3 A, 4 B
            break;
        }
      });
      gamepads.on('release', function (button) {// console.log('release', button);
        // this.setText(`release ${button.gamepad.hand} ${button.index}`);
      });
      gamepads.on('axis', function (axis) {
        // console.log('axis', axis);
        _this2.setText("axis ".concat(axis.gamepad.hand, " ").concat(axis.index, " { x:").concat(axis.x, ", y:").concat(axis.y, " }")); // axisup, axisdown, axisleft, axisright
        // this.menu.next();

      });
      return gamepads;
    }
  }, {
    key: "setController",
    value: function setController(gamepad) {
      var controller = gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT ? this.left : this.right;
      var currentController = this.controller;

      if (currentController !== controller) {
        if (currentController) {
          currentController.remove(currentController.indicator);
        }

        controller.add(controller.indicator);
        this.controller = controller;
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.gamepads.update();
    }
  }, {
    key: "addController",
    value: function addController(renderer, scene, gamepad) {
      var controller = renderer.vr.getController(gamepad.index);

      if (controller) {
        controller.index = gamepad.index;
        var cylinder = controller.cylinder = this.addControllerModel(controller, gamepad.hand);
        scene.add(controller);
        this.controllers_[gamepad.index] = controller;
      }

      return controller;
    }
  }, {
    key: "removeController",
    value: function removeController(gamepad) {
      var controller = this.controllers_[gamepad.index];

      if (controller) {
        controller.parent.remove(controller);
        delete this.controllers_[gamepad.index];
      }
    }
  }, {
    key: "addControllerModel",
    value: function addControllerModel(controller, hand) {
      var mesh = new THREE.Group();
      var texture = new THREE.TextureLoader().load('img/matcap.jpg');
      var material = new THREE.MeshMatcapMaterial({
        color: hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 0x991111 : 0x111199,
        matcap: texture,
        transparent: true,
        opacity: 1
      });
      var loader = new THREE.OBJLoader();
      loader.load(hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 'models/oculus-quest/right/right.obj' : 'models/oculus-quest/left/left.obj', function (object) {
        var x = hand === _gamepads.GAMEPAD_HANDS.RIGHT ? -(0, _const.cm)(1) : (0, _const.cm)(1);
        object.traverse(function (child) {
          // console.log(child);
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.geometry.translate(x, 0, 0);
          }
        });
        mesh.add(object);
      }, function (xhr) {// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, function (error) {
        console.log('An error happened');
      });
      this.addControllerIndicator(controller);
      controller.add(mesh);
      return mesh;
    }
  }, {
    key: "addControllerCylinder",
    value: function addControllerCylinder(controller, hand) {
      var geometry = new THREE.CylinderBufferGeometry((0, _const.cm)(2), (0, _const.cm)(2), (0, _const.cm)(12), 24);
      var texture = new THREE.TextureLoader().load('img/matcap.jpg');
      var material = new THREE.MeshMatcapMaterial({
        color: hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 0x991111 : 0x111199,
        matcap: texture,
        transparent: true,
        opacity: 1
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.geometry.rotateX(Math.PI / 2);
      controller.add(mesh);
      this.addControllerIndicator(controller);
      return mesh;
    }
  }, {
    key: "addControllerIndicator",
    value: function addControllerIndicator(controller) {
      var geometryIndicator = new THREE.CylinderBufferGeometry((0, _const.mm)(2), (0, _const.mm)(1), (0, _const.cm)(30), 5); // 10, 12

      var materialIndicator = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // matcap: texture,
        transparent: true,
        opacity: 0.5
      });
      var indicator = new THREE.Mesh(geometryIndicator, materialIndicator);
      controller.indicator = indicator;
      indicator.geometry.rotateX(Math.PI / 2);
      indicator.position.set(0, 0, -(0, _const.cm)(18.5));
    }
  }, {
    key: "addText",
    value: function addText(parent) {
      var _this3 = this;

      var loader = new THREE.FontLoader();
      loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        _this3.font = font;
        var material = new THREE.MeshBasicMaterial({
          color: 0x111111,
          // 0x33c5f6,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide
        });
        _this3.fontMaterial = material;
      });
    }
  }, {
    key: "setText",
    value: function setText(message) {
      message = message || '1';

      if (this.text) {
        this.text.parent.remove(this.text);
        this.text.geometry.dispose();
      }

      if (this.font) {
        // console.log(this.font.generateShapes);
        var shapes = this.font.generateShapes(message, 5);
        var geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        var x = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(x, 0, 0);
        var text = new THREE.Mesh(geometry, this.fontMaterial);
        text.position.set(0, 0, -_const.POINTER_RADIUS);
        this.text = text;
        this.pivot.add(text);
      }
    }
  }]);

  return Controllers;
}(_emittable.default);

exports.default = Controllers;

},{"../const":1,"../interactive/emittable":2,"./gamepads":7}],7:[function(require,module,exports){
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
        this.gamepads_ = {};
        console.log('gamepads', this.gamepads_);
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

  function Gamepads(setText) {
    var _this;

    _classCallCheck(this, Gamepads);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Gamepads).call(this));
    _this.setText = setText;
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
      console.log('connect', $gamepad);

      try {
        // Note: $gamepad === navigator.getGamepads()[$gamepad.index]
        if ($gamepad) {
          var id = $gamepad.id;
          this.setText("connect ".concat($gamepad.id, " ").concat(Gamepads.isSupported(id)));

          if (Gamepads.isSupported(id)) {
            var index = $gamepad.index;
            var gamepad = this.gamepads[index] ? this.gamepads[index] : this.gamepads[index] = new Gamepad($gamepad);
            console.log(gamepad);
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
      console.log('disconnect', $gamepad);

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
            this.button = event;
            this.emit('hand', event.gamepad);
          }

          break;

        case 'release':
          if (this.button === event) {
            this.button = null; // this.emit('hand', event.gamepad);
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
    value: function destroy() {}
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
    return _this4;
  }

  return GamepadAxis;
}(THREE.Vector2);

exports.GamepadAxis = GamepadAxis;

},{"../interactive/emittable":2}],8:[function(require,module,exports){
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
      console.log(onError);

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
          console.log(this.renderer.domElement);
          device.requestPresent([{
            source: this.renderer.domElement
          }]).then(function () {
            console.log('presenting');

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

},{"../interactive/emittable":2}],9:[function(require,module,exports){
"use strict";

var _interactive = _interopRequireDefault(require("./interactive/interactive.mesh"));

var _controllers = _interopRequireDefault(require("./vr/controllers"));

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

    this.i = 0;
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
      var scene = this.scene = new THREE.Scene();
      var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 10);
      camera.target = new THREE.Vector3();
      var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      var material = new THREE.MeshStandardMaterial({
        color: 0x00ff00
      });
      var cube = this.cube = new _interactive.default(geometry, material);
      cube.position.set(0, 0, -5);
      cube.on('over', function () {
        cube.material.color.setHex(0xff0000);
      });
      cube.on('out', function () {
        cube.material.color.setHex(0x00ff00);
      });
      cube.on('down', function () {
        cube.material.color.setHex(0xffffff);
      });
      cube.on('up', function () {
        cube.material.color.setHex(0x0000ff);
      });
      scene.add(cube);
      var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      scene.add(light);
      var raycaster = this.raycaster = new THREE.Raycaster();
      var renderer = this.renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(0x666666, 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.vr.enabled = true;
      var vr = this.vr = new _vr.VR(renderer, {
        referenceSpaceType: 'local'
      }, function (error) {
        _this.debugInfo.innerHTML = error;
      });
      container.appendChild(vr.element);
      var pivot = new THREE.Group();
      scene.add(pivot);

      if (this.vr.mode !== _vr.VR_MODE.NONE) {
        var controllers = this.controllers = new _controllers.default(renderer, scene, pivot);
      }

      this.container.appendChild(renderer.domElement);
      this.onWindowResize = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.onWindowResize, false);
    }
  }, {
    key: "updateRaycaster",
    value: function updateRaycaster() {
      try {
        var controllers = this.controllers;

        if (controllers) {
          var controller = controllers.controller;

          if (controller) {
            var raycaster = this.raycaster;
            var position = controller.position;
            var rotation = controller.getWorldDirection(controllers.controllerDirection).multiplyScalar(-1);
            raycaster.set(position, rotation);

            var hit = _interactive.default.hittest(raycaster, controllers.gamepads.button);
            /*
            if (hit) {
            	controllers.hapticFeedback();
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
        this.cube.rotation.y += Math.PI / 180 * 5;
        this.cube.rotation.x += Math.PI / 180 * 1;
        var s = 1 + Math.cos(this.i * 0.1) * 0.5;
        this.cube.scale.set(s, s, s);

        if (this.controllers) {
          this.controllers.update();
        }

        this.updateRaycaster();
        var renderer = this.renderer;
        renderer.render(this.scene, this.camera);
        this.i++;
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;

      var renderer = this.renderer;
      renderer.setAnimationLoop(function () {
        _this2.render();
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

},{"./interactive/interactive.mesh":5,"./vr/controllers":6,"./vr/vr":8}]},{},[9]);
//# sourceMappingURL=vrui.js.map
