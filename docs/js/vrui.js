(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cm = cm;
exports.mm = mm;
exports.deg = deg;
exports.addCube = addCube;
exports.ORIGIN = exports.POINTER_RADIUS = exports.POINT_RADIUS = exports.PANEL_RADIUS = exports.ROOM_RADIUS = exports.TRIGGER_CUBES = exports.BOUNDING_BOX = exports.TEST_ENABLED = exports.DEBUG = void 0;

/* jshint esversion: 6 */
const DEBUG = false;
exports.DEBUG = DEBUG;
const TEST_ENABLED = false;
exports.TEST_ENABLED = TEST_ENABLED;
const BOUNDING_BOX = false;
exports.BOUNDING_BOX = BOUNDING_BOX;
const TRIGGER_CUBES = false;
exports.TRIGGER_CUBES = TRIGGER_CUBES;
const ROOM_RADIUS = 200;
exports.ROOM_RADIUS = ROOM_RADIUS;
const PANEL_RADIUS = 100;
exports.PANEL_RADIUS = PANEL_RADIUS;
const POINT_RADIUS = 99;
exports.POINT_RADIUS = POINT_RADIUS;
const POINTER_RADIUS = 98;
exports.POINTER_RADIUS = POINTER_RADIUS;
const ORIGIN = new THREE.Vector3();
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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  const cube = new THREE.Mesh(geometry, material);
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
exports.default = RoundBoxGeometry;

/* jshint esversion: 6 */
function RoundBoxGeometry(width, height, depth, radius, widthSegments, heightSegments, depthSegments, radiusSegments) {
  width = width || 1;
  height = height || 1;
  depth = depth || 1;
  const minimum = Math.min(Math.min(width, height), depth);
  radius = radius || minimum * 0.25;
  radius = radius > minimum * 0.5 ? minimum * 0.5 : radius;
  widthSegments = Math.floor(widthSegments) || 1;
  heightSegments = Math.floor(heightSegments) || 1;
  depthSegments = Math.floor(depthSegments) || 1;
  radiusSegments = Math.floor(radiusSegments) || 1;
  const fullGeometry = new THREE.BufferGeometry();
  const fullPosition = [];
  const fullUvs = [];
  const fullIndex = [];
  let fullIndexStart = 0;
  let groupStart = 0;
  RoundBoxGeometryBendPlane_(width, height, radius, widthSegments, heightSegments, radiusSegments, depth * 0.5, 'y', 0, 0);
  RoundBoxGeometryBendPlane_(width, height, radius, widthSegments, heightSegments, radiusSegments, depth * 0.5, 'y', Math.PI, 1);
  RoundBoxGeometryBendPlane_(depth, height, radius, depthSegments, heightSegments, radiusSegments, width * 0.5, 'y', Math.PI * 0.5, 2);
  RoundBoxGeometryBendPlane_(depth, height, radius, depthSegments, heightSegments, radiusSegments, width * 0.5, 'y', Math.PI * -0.5, 3);
  RoundBoxGeometryBendPlane_(width, depth, radius, widthSegments, depthSegments, radiusSegments, height * 0.5, 'x', Math.PI * -0.5, 4);
  RoundBoxGeometryBendPlane_(width, depth, radius, widthSegments, depthSegments, radiusSegments, height * 0.5, 'x', Math.PI * 0.5, 5);
  fullGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(fullPosition), 3));
  fullGeometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(fullUvs), 2));
  fullGeometry.setIndex(fullIndex);
  fullGeometry.computeVertexNormals();
  return fullGeometry;

  function RoundBoxGeometryBendPlane_(width, height, radius, widthSegments, heightSegments, smoothness, offset, axis, angle, materialIndex) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const widthChunk = width / (widthSegments + smoothness * 2);
    const heightChunk = height / (heightSegments + smoothness * 2);
    const planeGeom = new THREE.PlaneBufferGeometry(width, height, widthSegments + smoothness * 2, heightSegments + smoothness * 2);
    const v = new THREE.Vector3(); // current vertex

    const cv = new THREE.Vector3(); // control vertex for bending

    const cd = new THREE.Vector3(); // vector for distance

    const position = planeGeom.attributes.position;
    const uv = planeGeom.attributes.uv;
    const widthShrinkLimit = widthChunk * smoothness;
    const widthShrinkRatio = radius / widthShrinkLimit;
    const heightShrinkLimit = heightChunk * smoothness;
    const heightShrinkRatio = radius / heightShrinkLimit;
    const widthInflateRatio = (halfWidth - radius) / (halfWidth - widthShrinkLimit);
    const heightInflateRatio = (halfHeight - radius) / (halfHeight - heightShrinkLimit);

    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);

      if (Math.abs(v.x) >= halfWidth - widthShrinkLimit) {
        v.setX((halfWidth - (halfWidth - Math.abs(v.x)) * widthShrinkRatio) * Math.sign(v.x));
      } else {
        v.x *= widthInflateRatio;
      } // lr


      if (Math.abs(v.y) >= halfHeight - heightShrinkLimit) {
        v.setY((halfHeight - (halfHeight - Math.abs(v.y)) * heightShrinkRatio) * Math.sign(v.y));
      } else {
        v.y *= heightInflateRatio;
      } // tb
      //re-calculation of uvs


      uv.setXY(i, (v.x - -halfWidth) / width, 1 - (halfHeight - v.y) / height); // bending

      const widthExceeds = Math.abs(v.x) >= halfWidth - radius;
      const heightExceeds = Math.abs(v.y) >= halfHeight - radius;

      if (widthExceeds || heightExceeds) {
        cv.set(widthExceeds ? (halfWidth - radius) * Math.sign(v.x) : v.x, heightExceeds ? (halfHeight - radius) * Math.sign(v.y) : v.y, -radius);
        cd.subVectors(v, cv).normalize();
        v.copy(cv).addScaledVector(cd, radius);
      }

      position.setXYZ(i, v.x, v.y, v.z);
    }

    planeGeom.translate(0, 0, offset);

    switch (axis) {
      case 'y':
        planeGeom.rotateY(angle);
        break;

      case 'x':
        planeGeom.rotateX(angle);
    } // merge positions


    position.array.forEach(function (p) {
      fullPosition.push(p);
    }); // merge uvs

    uv.array.forEach(function (u) {
      fullUvs.push(u);
    }); // merge indices

    planeGeom.index.array.forEach(function (a) {
      fullIndex.push(a + fullIndexStart);
    });
    fullIndexStart += position.count; // set the groups

    fullGeometry.addGroup(groupStart, planeGeom.index.count, materialIndex);
    groupStart += planeGeom.index.count;
  }
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freezable = _interopRequireDefault(require("./freezable.group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class EmittableGroup extends _freezable.default {
  constructor() {
    super();
    this.events = {};
  }

  on(type, callback) {
    const event = this.events[type] = this.events[type] || [];
    event.push(callback);
    return () => {
      this.events[type] = event.filter(x => x !== callback);
    };
  }

  off(type, callback) {
    const event = this.events[type];

    if (event) {
      this.events[type] = event.filter(x => x !== callback);
    }
  }

  emit(type, data) {
    const event = this.events[type];

    if (event) {
      event.forEach(callback => {
        // callback.call(this, data);
        callback(data);
      });
    }

    const broadcast = this.events.broadcast;

    if (broadcast) {
      broadcast.forEach(callback => {
        callback(type, data);
      });
    }
  }

}

exports.default = EmittableGroup;

},{"./freezable.group":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* jshint esversion: 6 */
class Emittable {
  constructor(options = {}) {
    Object.assign(this, options);
    this.events = {};
  }

  on(type, callback) {
    const event = this.events[type] = this.events[type] || [];
    event.push(callback);
    return () => {
      this.events[type] = event.filter(x => x !== callback);
    };
  }

  off(type, callback) {
    const event = this.events[type];

    if (event) {
      this.events[type] = event.filter(x => x !== callback);
    }
  }

  emit(type, data) {
    const event = this.events[type];

    if (event) {
      event.forEach(callback => {
        // callback.call(this, data);
        callback(data);
      });
    }

    const broadcast = this.events.broadcast;

    if (broadcast) {
      broadcast.forEach(callback => {
        callback(type, data);
      });
    }
  }

}

exports.default = Emittable;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freezable = _interopRequireDefault(require("./freezable.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class EmittableMesh extends _freezable.default {
  constructor(geometry, material) {
    geometry = geometry || new THREE.BoxGeometry(5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
      color: 0xff00ff // opacity: 1,
      // transparent: true,

    });
    super(geometry, material); // this.renderOrder = 10;

    this.events = {};
  }

  on(type, callback) {
    const event = this.events[type] = this.events[type] || [];
    event.push(callback);
    return () => {
      this.events[type] = event.filter(x => x !== callback);
    };
  }

  off(type, callback) {
    const event = this.events[type];

    if (event) {
      this.events[type] = event.filter(x => x !== callback);
    }
  }

  emit(type, data) {
    const event = this.events[type];

    if (event) {
      event.forEach(callback => {
        // callback.call(this, data);
        callback(data);
      });
    }

    const broadcast = this.events.broadcast;

    if (broadcast) {
      broadcast.forEach(callback => {
        callback(type, data);
      });
    }
  }

}

exports.default = EmittableMesh;

},{"./freezable.mesh":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* jshint esversion: 6 */
class FreezableGroup extends THREE.Group {
  static update(renderer, scene, camera, delta, time, tick) {
    FreezableGroup.items.forEach(x => {
      if (x.parent) {
        x.onUpdate(renderer, scene, camera, x, delta, time, tick);
      }
    });
  }

  get freezed() {
    return this.freezed_;
  }

  set freezed(freezed) {
    // !!! cycle through freezable and not freezable
    this.freezed_ = freezed;
    this.children.filter(x => x.__lookupGetter__('freezed')).forEach(x => x.freezed = freezed);
  }

  constructor() {
    super();
    this.freezed = false;
    FreezableGroup.items.push(this);
  }

  freeze() {
    this.freezed = true;
  }

  unfreeze() {
    this.freezed = false;
  }

  onUpdate(renderer, scene, camera, object, delta, tick) {// noop
  }

}

exports.default = FreezableGroup;
FreezableGroup.items = [];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* jshint esversion: 6 */
class FreezableMesh extends THREE.Mesh {
  static update(renderer, scene, camera, delta, time, tick) {
    FreezableMesh.items.forEach(x => {
      if (x.parent) {
        x.onUpdate(renderer, scene, camera, x, delta, time, tick);
      }
    });
  }

  get freezed() {
    return this.freezed_;
  }

  set freezed(freezed) {
    // !!! cycle through freezable and not freezable
    this.freezed_ = freezed;
    this.children.filter(x => x.__lookupGetter__('freezed')).forEach(x => x.freezed = freezed);
  }

  constructor(geometry, material) {
    geometry = geometry || new THREE.BoxGeometry(5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
      color: 0xff00ff // opacity: 1,
      // transparent: true,

    });
    super(geometry, material);
    this.freezed = false;
    FreezableMesh.items.push(this);
  }

  freeze() {
    this.freezed = true;
  }

  unfreeze() {
    this.freezed = false;
  }

  onUpdate(renderer, scene, camera, object, delta, tick) {// noop
  }

}

exports.default = FreezableMesh;
FreezableMesh.items = [];

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emittable = _interopRequireDefault(require("./emittable.group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class GrabbableGroup extends _emittable.default {
  static grabtest(controllers) {
    const down = controllers.gamepads.button;
    const controller = controllers.controller;
    const items = GrabbableGroup.items.filter(x => !x.freezed);
    let grabbedItem;

    if (controller && down && down.index === 2) {
      const controllerPosition = controller.parent.position;
      items.reduce((p, x, i) => {
        const distance = x.position.distanceTo(controllerPosition);

        if (distance <= 0.1) {
          if (distance < p) {
            grabbedItem = x;
            return distance;
          } else {
            return p;
          }
        }

        return p;
      }, Number.POSITIVE_INFINITY);
    } else {
      GrabbableGroup.items.filter(x => x.grab).forEach(x => x.grab = undefined);
    }

    items.forEach(x => {
      x.grab = x === grabbedItem ? controller : undefined;
    });
    return grabbedItem;
  }

  constructor() {
    super();
    GrabbableGroup.items.push(this);
  }

  get grab() {
    return this.grab_;
  }

  set grab(grab) {
    if (this.grab_ !== grab) {
      const grab_ = this.grab_;
      this.grab_ = grab;

      if (grab) {
        this.emit('grab', grab);
      } else {
        this.emit('release', grab_);
      }
    }
  }

}

exports.default = GrabbableGroup;
GrabbableGroup.items = [];
GrabbableGroup.center = new THREE.Vector3();

},{"./emittable.group":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emittable = _interopRequireDefault(require("./emittable.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class InteractiveMesh extends _emittable.default {
  static hittest(raycaster, down, controller) {
    const items = InteractiveMesh.items.filter(x => !x.freezed);
    let grabbedItem;

    if (controller && down && down.index === 2) {
      const controllerPosition = controller.parent.position;
      const controllerBox = controller.updateBoundingBox(); // const controllerBoxCenter = controllerBox.getCenter(this.center);
      // console.log(controllerBoxCenter.x, controllerBoxCenter.y, controllerBoxCenter.z);

      items.reduce((p, x, i) => {
        const distance = x.position.distanceTo(controllerPosition); // const intersect = controllerBox.intersectsBox(x.updateBoundingBox());

        if (distance <= 0.1) {
          // intersect) {
          // const center = x.box.getCenter(this.center);
          // const distance = controllerBox.distanceToPoint(center);
          // console.log(distance);
          // console.log(center, intersect, distance, p);
          if (distance < p) {
            grabbedItem = x;
            return distance;
          } else {
            return p;
          }
        }

        return p;
      }, Number.POSITIVE_INFINITY); // const origin = raycaster.origin;
      // console.log(controllerBox, down);
    } else {
      InteractiveMesh.items.filter(x => x.grab).forEach(x => x.grab = undefined);
    }

    if (grabbedItem) {
      // console.log(grabbedItem);
      items.forEach(x => {
        x.grab = x === grabbedItem ? controller : undefined;
      });
      return grabbedItem;
    } else {
      const intersections = raycaster.intersectObjects(items);
      let key, hit;
      const hash = {};
      intersections.forEach((intersection, i) => {
        const object = intersection.object;
        key = object.id;

        if (i === 0 && InteractiveMesh.object != object) {
          InteractiveMesh.object = object;
          hit = object; // haptic feedback
        }

        hash[key] = intersection;
      });
      items.forEach(x => {
        const intersection = hash[x.id]; // intersections.find(i => i.object === x);

        x.intersection = intersection;
        x.over = intersection !== undefined;
        x.down = down;
      });
      return hit;
    }
  }

  constructor(geometry, material) {
    super(geometry, material);
    geometry.computeBoundingBox();
    this.box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()); // this.renderOrder = 10;

    InteractiveMesh.items.push(this);
  }

  updateBoundingBox() {
    // In the animation loop, to keep the bounding box updated after move/rotate/scale operations
    this.updateMatrixWorld(true);
    this.box.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld); // console.log('updateBoundingBox', this.box);

    return this.box;
  }

  get grab() {
    return this.grab_;
  }

  set grab(grab) {
    if (this.grab_ !== grab) {
      const grab_ = this.grab_;
      this.grab_ = grab;

      if (grab) {
        this.emit('grab', grab);
      } else {
        this.emit('release', grab_);
      }
    }
  }

  get over() {
    return this.over_;
  }

  set over(over) {
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

  get down() {
    return this.down_;
  }

  set down(down) {
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

}

exports.default = InteractiveMesh;
InteractiveMesh.items = [];
InteractiveMesh.center = new THREE.Vector3();

},{"./emittable.mesh":5}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* jshint esversion: 6 */
class Materials {
  constructor(texture) {
    /*
    const texture = new THREE.loader().load('img/matcap.jpg');
    const material = new THREE.MeshMatcapMaterial({
    	color: 0xffffff,
    	matcap: texture,
    	transparent: true,
    	opacity: 1,
    });
    */
    // const texture = this.getEnvMap();
    const white = this.white = this.getWhite();
    const bodyPrimaryClear = this.bodyPrimaryClear = this.getBodyPrimaryClear(texture);
    const logoSilver = this.logoSilver = this.getLogoSilver(texture);
    const bodySecondary = this.bodySecondary = this.getBodySecondary(texture);
    const bristlesPrimary = this.bristlesPrimary = this.getBristlesPrimary();
    const bristlesSecondary = this.bristlesSecondary = this.getBristlesSecondary();
  }

  getWhite() {
    let material;

    if (false) {
      const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
      material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: matcap
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x333333,
        roughness: 0.2,
        metalness: 0.2
      });
    }

    return material;
  }

  getBodyPrimaryClear(texture) {
    let material;

    if (true) {
      texture = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
      material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: texture,
        transparent: true,
        opacity: 0.4,
        alphaTest: 0.2,
        side: THREE.DoubleSide
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: texture,
        transparent: true,
        refractionRatio: 0.6,
        reflectivity: 0.8,
        opacity: 0.25,
        alphaTest: 0.2,

        /*
        refractionRatio: 0.99,
        reflectivity: 0.99,
        opacity: 0.5,
        */
        side: THREE.DoubleSide // blending: THREE.AdditiveBlending,

      });
    } // material.vertexTangents = true;


    return material;
  }

  getBodySecondary(texture) {
    let material;

    if (true) {
      texture = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
      material = new THREE.MeshMatcapMaterial({
        color: 0xe11e26,
        matcap: texture
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0xe11e26,
        // emissive: 0x4f0300,
        roughness: 0.2,
        metalness: 0.2 // envMap: texture,
        // envMapIntensity: 0.4,
        // The refractionRatio must have value in the range 0 to 1.
        // The default value, very close to 1, give almost invisible glass.
        // refractionRatio: 0,
        // side: THREE.DoubleSide,

      });
    }

    return material;
  }

  getBristlesPrimary(texture) {
    let material;

    if (true) {
      texture = new THREE.TextureLoader().load('img/matcap/matcap-02.jpg');
      material = new THREE.MeshMatcapMaterial({
        color: 0x024c99,
        matcap: texture
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0x024c99,
        // 0x1f45c0,
        // emissive: 0x333333,
        // map: lightMap,
        // normalMap: lightMap,
        // metalnessMap: lightMap,
        roughness: 0.9,
        metalness: 0.0
      });
    }

    return material;
  }

  getBristlesSecondary(texture) {
    // const lightMap = new THREE.TextureLoader().load('img/scalare-33-bristlesSecondary-lightmap.jpg');
    let material;

    if (true) {
      texture = new THREE.TextureLoader().load('img/matcap/matcap-02.jpg');
      material = new THREE.MeshMatcapMaterial({
        color: 0x15b29a,
        matcap: texture
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0x15b29a,
        // 0x1aac4e,
        // emissive: 0x333333,
        // map: lightMap,
        // normalMap: lightMap,
        // metalnessMap: lightMap,
        roughness: 0.9,
        metalness: 0.0
      });
    }

    return material;
  }

  getLogoSilver() {
    const texture = new THREE.TextureLoader().load('img/models/toothbrush-logo.png');
    let material;

    if (true) {
      const matcap = new THREE.TextureLoader().load('img/matcap/matcap-00.jpg');
      material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        map: texture,
        matcap: matcap,
        transparent: true,
        alphaTest: 0.1
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
        roughness: 0.15,
        metalness: 0.9 // envMap: texture,
        // side: THREE.DoubleSide,
        //
        // opacity: 1,
        // alphaTest: 0.1,

      });
    }

    return material;
  }

}

exports.default = Materials;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class PhysicsWorker extends _emittable.default {
  constructor() {
    super();
    this.meshes = {};
    this.data = {
      action: 'stepSimulation',
      delta: 0
    };
    const worker = this.worker = new Worker('./js/worker.wasm.js');
    const debugInfo = document.querySelector('.debug__info');

    worker.onmessage = event => {
      const items = event.data;

      if (items) {
        // debugInfo.innerHTML = items.fps;
        const meshes = this.meshes;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const mesh = meshes[item.id];

          if (mesh && !mesh.freezed) {
            mesh.position.set(item.position.x, item.position.y, item.position.z);
            mesh.quaternion.set(item.quaternion.x, item.quaternion.y, item.quaternion.z, item.quaternion.w);

            if (mesh.userData.respawn) {
              mesh.userData.respawn(item);
            }
            /*
            if (item.isActive) {
            	console.log(item);
            }
            */

          }
        }
      }

      this.emit('items', items);
    };

    this.emit('init');
  }

  update(delta) {// noop

    /*
    this.data.delta = delta;
    this.worker.postMessage(this.data);
    */
  }

  remove(mesh) {
    if (this.meshes[mesh.id]) {
      const data = {
        action: 'remove',
        id: mesh.id
      };
      delete this.meshes[mesh.id];
      this.worker.postMessage(data);
    }
  }

  addBox(mesh, size, mass, linearVelocity, angularVelocity) {
    const data = {
      action: 'addBox',
      id: mesh.id,
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      },
      quaternion: {
        x: mesh.quaternion.x,
        y: mesh.quaternion.y,
        z: mesh.quaternion.z,
        w: mesh.quaternion.w
      },
      size: size,
      mass: mass,
      linearVelocity: linearVelocity,
      angularVelocity: angularVelocity
    };
    this.worker.postMessage(data);
    this.meshes[mesh.id] = mesh;
  }

  addSphere(mesh, radius, mass, linearVelocity, angularVelocity) {
    const data = {
      action: 'addSphere',
      id: mesh.id,
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      },
      quaternion: {
        x: mesh.quaternion.x,
        y: mesh.quaternion.y,
        z: mesh.quaternion.z,
        w: mesh.quaternion.w
      },
      radius: radius,
      mass: mass,
      linearVelocity: linearVelocity,
      angularVelocity: angularVelocity
    };
    this.worker.postMessage(data);
    this.meshes[mesh.id] = mesh;
  }

}
/*
onmessage = function(event) {
var data = event.data;
if (data.objects.length != NUM) return;
for (var i = 0; i < NUM; i++) {
	var physicsObject = data.objects[i];
	var renderObject = boxes[i];
	renderObject.position[0] = physicsObject[0];
	renderObject.position[1] = physicsObject[1];
	renderObject.position[2] = physicsObject[2];
	quaternion.x = physicsObject[3];
	quaternion.y = physicsObject[4];
	quaternion.z = physicsObject[5];
	quaternion.w = physicsObject[6];
	renderObject.rotation = quaternion.toEuler();
}
currFPS = data.currFPS;
allFPS = data.allFPS;
};

physicsWorker.postMessage(NUM);

}
*/


exports.default = PhysicsWorker;

},{"../interactive/emittable":4}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControllerFragGlsl = void 0;
const ControllerFragGlsl =
/* glsl */
`
#define MATCAP
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float emissiveIntensity;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	vec4 emissiveColor = vec4( emissive, opacity );
	#include <logdepthbuf_fragment>
	/* #include <map_fragment> */
	#ifdef USE_MAP
		vec4 texelColor = texture2D( map, vUv );
		texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
		diffuseColor = mix(diffuseColor, emissiveColor, emissiveIntensity);
	#endif
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * (matcapColor.rgb + emissiveIntensity * 0.5); // max(matcapColor.rgb, emissiveColor.rgb);
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
`;
exports.ControllerFragGlsl = ControllerFragGlsl;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = require("../../const");

var _emittable = _interopRequireDefault(require("../../interactive/emittable.group"));

var _gamepads = require("../gamepads");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class Controller extends _emittable.default {
  get ready() {
    return this.ready_;
  }

  set ready(ready) {
    if (this.ready_ !== ready) {
      this.ready_ = ready;

      if (ready) {
        this.emit('ready', this);
      }
    }
  }

  get active() {
    return this.active_;
  }

  set active(active) {
    if (this.active_ !== active) {
      this.active_ = active;

      if (active) {
        this.add(this.ray);
      } else {
        this.remove(this.ray);
      }
    }
  }

  constructor(parent, gamepad, options = {}) {
    super(); // this.ready = false;

    this.buttons = new Array(10).fill(0).map(x => {
      return {
        value: 0
      };
    });
    this.axis = new Array(2).fill(0).map(x => new THREE.Vector2());
    this.linearVelocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3();
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.parent = parent;
    this.gamepad = gamepad;
    this.options = options;
    this.hand = gamepad.hand;
    const model = this.model = this.addModel(this.hand);
    const ray = this.ray = this.addRay(this.hand);
    this.add(model);
    parent.add(this);
    this.addEvents();
  }

  updateBoundingBox() {
    // In the animation loop, to keep the bounding box updated after move/rotate/scale operations
    this.parent.updateMatrixWorld(true);
    this.box.copy(this.boundingBox).applyMatrix4(this.parent.matrixWorld); // console.log('updateBoundingBox', this.box);

    return this.box;
  }

  updateVelocity() {
    let previousPosition = this.previousPosition_;

    if (previousPosition) {
      this.linearVelocity.subVectors(this.parent.position, previousPosition);
    } else {
      previousPosition = this.previousPosition_ = new THREE.Vector3();
    }

    previousPosition.copy(this.parent.position);
    let previousRotation = this.previousRotation_;

    if (previousRotation) {
      this.angularVelocity.subVectors(this.parent.rotation, previousRotation);
    } else {
      previousRotation = this.previousRotation_ = new THREE.Vector3();
    }

    previousRotation.copy(this.parent.rotation);
  }

  addEvents() {
    this.onActivate = this.onActivate.bind(this);
    this.onDeactivate = this.onDeactivate.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.onAxis = this.onAxis.bind(this);
    const gamepad = this.gamepad;
    gamepad.on('activate', this.onActivate);
    gamepad.on('deactivate', this.onDeactivate);
    gamepad.on('press', this.onPress);
    gamepad.on('release', this.onRelease);
    gamepad.on('axis', this.onAxis);
  }

  removeEvents() {
    const gamepad = this.gamepad;
    gamepad.off('activate', this.onActivate);
    gamepad.off('deactivate', this.onActivate);
    gamepad.off('press', this.onPress);
    gamepad.off('release', this.onRelease);
    gamepad.off('axis', this.onAxis);
  }

  onActivate(gamepad) {
    this.active = true;
  }

  onDeactivate(gamepad) {
    this.active = false;
  }

  onPress(button) {
    this.press(button.index);
  }

  onRelease(button) {
    this.release(button.index);
  }

  onAxis(axis) {
    this.axis[axis.index] = axis;
  }

  destroy() {
    this.removeEvents();
    this.gamepad = null;
  }

  addModel(hand) {
    const geometry = new THREE.CylinderBufferGeometry((0, _const.cm)(2), (0, _const.cm)(2), (0, _const.cm)(12), 24);
    geometry.rotateX(Math.PI / 2);
    const texture = new THREE.TextureLoader().load('img/matcap.jpg');
    const material = new THREE.MeshMatcapMaterial({
      color: this.hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 0x991111 : 0x111199,
      matcap: texture // transparent: true,
      // opacity: 1,

    });
    const mesh = new THREE.Mesh(geometry, material); // geometry.computeBoundingBox();

    this.boundingBox.setFromObject(mesh);
    this.ready = true;
    return mesh;
  }

  addRay(hand) {
    const geometry = new THREE.CylinderBufferGeometry((0, _const.mm)(1), (0, _const.mm)(0.5), (0, _const.cm)(30), 5); // 10, 12

    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -(0, _const.cm)(18.5));
    return mesh;
  }

  press(index) {
    TweenMax.to(this.buttons[index], 0.3, {
      value: 1,
      ease: Power2.easeOut
    });
  }

  release(index) {
    TweenMax.to(this.buttons[index], 0.3, {
      value: 0,
      ease: Power2.easeOut
    });
  }

  update(tick) {}

  static getCos(tick, i = 0) {
    return Math.cos(i + tick * 0.1);
  }

  static mixColor(color, a, b, value) {
    return color.setRGB(a.r + (b.r - a.r) * value, a.g + (b.g - a.g) * value, a.b + (b.b - a.b) * value);
  }

  static mixUniformColor(uniform, a, b, value) {
    uniform.value.r = a.r + (b.r - a.r) * value;
    uniform.value.g = a.g + (b.g - a.g) * value;
    uniform.value.b = a.b + (b.b - a.b) * value;
  }

} // Controller.clock = new THREE.Clock();
// const clock = this.clock || (this.clock = new THREE.Clock());


exports.default = Controller;

},{"../../const":1,"../../interactive/emittable.group":3,"../gamepads":17}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = require("../../const");

var _gamepads = require("../gamepads");

var _controller = _interopRequireDefault(require("./controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
class HandController extends _controller.default {
  constructor(parent, gamepad, options = {}) {
    super(parent, gamepad, options);
  }

  addModel(hand) {
    const format = '.fbx';
    const path = `${HandController.FOLDER}/${hand}/${hand}-animated`;
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
    const material = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: matcap,
      alphaTest: 0.1,
      transparent: true,
      opacity: 1,
      skinning: true,
      side: THREE.BackSide
    });
    /*
    const texture = new THREE.TextureLoader().load(`${path}.jpg`);
    const material = new THREE.MeshStandardMaterial({
    	color: 0xffffff,
    	// map: texture,
    	// matcap: matcap,
    	alphaTest: 0.1,
    	transparent: true,
    	opacity: 1,
    	skinning: true,
    	side: THREE.DoubleSide,
    });
    */

    const mesh = new THREE.Group();
    const loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
    let i = 0;
    loader.load(`${path}${format}`, object => {
      const mixer = this.mixer = new THREE.AnimationMixer(object);
      mixer.timeScale = 2;
      const grabClip = this.grabClip = mixer.clipAction(object.animations[0]);
      grabClip.setLoop(THREE.LoopOnce);
      grabClip.clampWhenFinished = true;
      const releaseClip = this.releaseClip = mixer.clipAction(object.animations[1]);
      releaseClip.setLoop(THREE.LoopOnce);
      releaseClip.clampWhenFinished = true;
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material; // child.material = material.clone();
          // child.geometry.scale(0.1, 0.1, 0.1);
          // child.geometry.computeBoundingBox();
        }
      }); // object.scale.set(0.1, 0.1, 0.1);
      // const s = hand === GAMEPAD_HANDS.LEFT ? 0.045 : 0.045;

      const s = 1;
      object.scale.set(hand === _gamepads.GAMEPAD_HANDS.LEFT ? -s : s, s, s);
      mesh.add(object);
      this.material = material;
      this.boundingBox.setFromObject(object);
      this.skeleton = new THREE.SkeletonHelper(object);
      this.ready = true;
    }, xhr => {
      this.progress = xhr.loaded / xhr.total;
    }, error => {
      console.log(error);
      console.log(`HandController.addModel not found ${path}${format}`);
    });
    return mesh;
  }

  addRay(hand) {
    if (_const.TEST_ENABLED) {
      const geometry = new THREE.CylinderBufferGeometry((0, _const.mm)(4), (0, _const.mm)(4), 30, 3);
      geometry.rotateX(Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, -15);
      return mesh;
    } else {
      const group = new THREE.Group();
      return group;
    }
  }

  press(index) {
    if (index === 2) {
      if (this.releaseClip) {
        this.releaseClip.stop();
      }

      if (this.grabClip) {
        if (this.grabClip.paused) {
          this.grabClip.reset();
        } else {
          this.grabClip.play();
        }
      }
    }
  }

  release(index) {
    if (index === 2) {
      if (this.grabClip) {
        this.grabClip.stop();
      }

      if (this.releaseClip) {
        if (this.releaseClip.paused) {
          this.releaseClip.reset();
        } else {
          this.releaseClip.play();
        }
      }
    }
  }

  update(tick) {
    const clock = this.clock || (this.clock = new THREE.Clock());

    if (this.mixer) {
      const delta = clock.getDelta();
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

}

exports.default = HandController;
HandController.FOLDER = `models/hand`;

},{"../../const":1,"../gamepads":17,"./controller":13}],15:[function(require,module,exports){
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

/* jshint esversion: 6 */
const OFF = new THREE.Color(0x000000);
const ON = new THREE.Color(0x2196f3);

class OculusQuestController extends _controller.default {
  constructor(parent, gamepad, options = {}) {
    super(parent, gamepad, options);
  }

  addModel(hand) {
    const format = '.fbx'; // '.obj';

    const path = `${OculusQuestController.FOLDER}/${hand}/${hand}`;
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-04.jpg');
    const texture = new THREE.TextureLoader().load(`${path}.jpg`);
    const material = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      map: texture,
      matcap: matcap,
      transparent: true,
      opacity: 1
    });
    const mesh = new THREE.Group();
    const loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
    let i = 0;
    loader.load(`${path}${format}`, object => {
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material.clone();

          child.material.onBeforeCompile = shader => {
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
          const position = child.position.clone(); // left > 0 joystick, 1 trigger, 2 grip, 3 X, 4 Y
          // right > 0 joystick, 1 trigger, 2 grip, 3 A, 4 B

          switch (child.name) {
            case 'joystick':
              child.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const axis = this.axis[0];
                child.rotation.set(axis.y * (0, _const.deg)(15), 0, -axis.x * (0, _const.deg)(15));
                const value = this.buttons[0].value;
                child.position.set(position.x, position.y - value * (0, _const.mm)(2), position.z);

                if (child.shader) {
                  child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                }
              };

              break;

            case 'trigger':
              child.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const value = this.buttons[1].value;
                child.rotation.set(-value * (0, _const.deg)(20), 0, 0);

                if (child.shader) {
                  child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                }
              };

              break;

            case 'grip':
              const direction = hand === _gamepads.GAMEPAD_HANDS.RIGHT ? 1 : -1;

              child.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const value = this.buttons[2].value;
                child.position.set(position.x + value * (0, _const.mm)(2) * direction, position.y, position.z);

                if (child.shader) {
                  child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                }
              };

              break;

            case 'buttonX':
            case 'buttonA':
              child.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const value = this.buttons[3].value;
                child.position.set(position.x, position.y - value * (0, _const.mm)(2), position.z);

                if (child.shader) {
                  child.shader.uniforms.emissiveIntensity.value = value; // Controller.mixUniformColor(child.shader.uniforms.emissive, OFF, ON, value);
                }
              };

              break;

            case 'buttonY':
            case 'buttonB':
              child.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const value = this.buttons[4].value;
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
      }); // child.geometry.computeBoundingBox();

      this.boundingBox.setFromObject(object);
      mesh.add(object);
      this.ready = true;
    }, xhr => {
      this.progress = xhr.loaded / xhr.total;
    }, error => {
      console.log(`OculusQuestController.addModel not found ${path}${format}`);
    });
    return mesh;
  }

  addRay(hand) {
    const geometry = new THREE.CylinderBufferGeometry((0, _const.mm)(1), (0, _const.mm)(0.5), (0, _const.cm)(30), 5); // 10, 12

    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.hand === _gamepads.GAMEPAD_HANDS.RIGHT ? (0, _const.cm)(1) : -(0, _const.cm)(1), 0, -(0, _const.cm)(18.5));
    return mesh;
  }

  update(tick) {
    if (this.options.test && this.ready) {
      this.axis[0].x = _controller.default.getCos(tick, 0);
      this.axis[0].y = _controller.default.getCos(tick, 1);
      this.buttons[1].value = Math.abs(_controller.default.getCos(tick, 1));
      this.buttons[2].value = Math.abs(_controller.default.getCos(tick, 2));
      this.buttons[3].value = Math.abs(_controller.default.getCos(tick, 3));
      this.buttons[4].value = Math.abs(_controller.default.getCos(tick, 4));
    }
  }

}

exports.default = OculusQuestController;
OculusQuestController.FOLDER = `models/oculus-quest`;

},{"../../const":1,"../gamepads":17,"./controller":13,"./controller-frag.glsl":12}],16:[function(require,module,exports){
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

/* jshint esversion: 6 */
const CONTROLLERS = {
  DEFAULT: _controller.default,
  OCULUS_QUEST: _oculusQuestController.default,
  HAND: _handController.default
};

class Controllers extends _emittable.default {
  constructor(renderer, scene, options = {}) {
    super();
    this.tick = 0;
    this.controllers_ = {};
    this.gamepads_ = {};
    this.renderer = renderer;
    this.scene = scene;
    this.options = Object.assign({
      debug: false,
      test: _const.TEST_ENABLED
    }, options);
    this.direction = new THREE.Vector3();

    if (this.options.debug) {
      this.text = this.addText_(scene);
    }

    const gamepads = this.gamepads = this.addGamepads_();
    this.addTestController_();
    this.addEvents();
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


  get gamepad() {
    return this.gamepad_;
  }

  set gamepad(gamepad) {
    if (this.gamepad_ !== gamepad) {
      this.gamepad_ = gamepad;
      this.controller = this.controllers_[gamepad.index];
    }
  }

  feedback() {
    const gamepad = this.gamepad;

    if (gamepad) {
      gamepad.feedback();
    }
  }

  update() {
    this.gamepads.update(this.tick);
    Object.keys(this.controllers_).forEach(x => {
      const controller = this.controllers_[x];
      controller.update(this.tick);
      controller.updateVelocity();
    });
    this.tick++;
  }

  setRaycaster(raycaster) {
    const controller = this.controller;

    if (controller) {
      const pivot = controller.parent;
      const position = pivot.position;
      const rotation = pivot.getWorldDirection(this.direction).multiplyScalar(-1);
      raycaster.set(position, rotation);
      return raycaster;
    }
  }

  addGamepads_() {
    const gamepads = new _gamepads.default((message, object) => {
      this.log(message, object);
    });
    return gamepads;
  }

  addEvents() {
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.onAxis = this.onAxis.bind(this);
    this.onBroadcast = this.onBroadcast.bind(this);
    const gamepads = this.gamepads;
    gamepads.on('connect', this.onConnect);
    gamepads.on('disconnect', this.onDisconnect);
    gamepads.on('activate', this.onActivate);
    /*
    gamepads.on('press', this.onPress);
    gamepads.on('release', this.onRelease);
    gamepads.on('axis', this.onAxis);
    */

    gamepads.on('broadcast', this.onBroadcast);
  }

  removeEvents() {
    const gamepads = this.gamepads;
    gamepads.off('connect', this.onConnect);
    gamepads.off('disconnect', this.onDisconnect);
    gamepads.off('activate', this.onActivate);
    /*
    gamepads.off('press', this.onPress);
    gamepads.off('release', this.onRelease);
    gamepads.off('axis', this.onAxis);
    */

    gamepads.off('broadcast', this.onBroadcast);
  }

  onConnect(gamepad) {
    this.log(`connect ${gamepad.hand} ${gamepad.index}`, gamepad);
    const controller = this.addController_(this.renderer, this.scene, gamepad);
  }

  onDisconnect(gamepad) {
    this.log(`disconnect ${gamepad.hand} ${gamepad.index}`, gamepad);
    this.removeController_(gamepad);
  }

  onActivate(gamepad) {
    this.gamepad = gamepad;
  }

  onPress(button) {
    this.log(`press ${button.gamepad.hand} ${button.index}`, button);
  }

  onRelease(button) {// this.log(`release ${button.gamepad.hand} ${button.index}`, button);
  }

  onAxis(axis) {// this.log(`axis ${axis.gamepad.hand} ${axis.index} { x:${axis.x}, y:${axis.y} }`, axis);
  }

  onBroadcast(type, event) {
    this.emit(type, event);
  }

  destroy() {
    this.removeEvents();
    this.gamepads = null;
  }

  addController_(renderer, scene, gamepad) {
    const index = gamepad.index;
    let controller = this.controllers_[index];

    if (!controller) {
      const pivot = renderer.vr.getController(index); // controller = new CONTROLLERS.DEFAULT(pivot, gamepad, this.options);
      // controller = new CONTROLLERS.OCULUS_QUEST(pivot, gamepad, this.options);

      controller = new CONTROLLERS.HAND(pivot, gamepad, this.options);
      this.controllers_[index] = controller;
      scene.add(pivot);
    }

    return controller;
  }

  removeController_(gamepad) {
    const controller = this.controllers_[gamepad.index];

    if (controller) {
      const pivot = controller.parent;
      this.scene.remove(pivot);
      controller.parent.remove(controller);
      delete this.controllers_[gamepad.index];
    }
  }

  addTestController_() {
    if (this.options.test) {
      const gamepad = new _gamepads.Gamepad({
        id: 'Test Left',
        index: 0
      });
      const pivot = new THREE.Group();
      pivot.name = 'Controller Pivot'; // const controller = new CONTROLLERS.DEFAULT(pivot, gamepad, this.options);
      // const controller = new CONTROLLERS.OCULUS_QUEST(pivot, gamepad, this.options);

      const controller = new CONTROLLERS.HAND(pivot, gamepad, this.options);
      controller.on('ready', () => {
        if (_const.BOUNDING_BOX) {
          this.box = new THREE.BoxHelper(controller.skeleton || controller.model, 0xff0000);
          this.scene.add(this.box);
        }
      });
      pivot.position.set(0, (0, _const.cm)(117), -(0, _const.cm)(60));
      this.scene.add(pivot);
      this.controllers_[0] = controller;
      this.controller = controller;
      controller.active = true;
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

  updateTest(mouse) {
    const controller = this.controller;

    if (controller) {
      controller.parent.rotation.y = -mouse.x * Math.PI;
      controller.parent.rotation.x = mouse.y * Math.PI / 2;
      controller.parent.position.x = mouse.x * (0, _const.cm)(10);
      controller.parent.position.y = (0, _const.cm)(147) + mouse.y * (0, _const.cm)(100);
    }

    const box = this.box;

    if (box) {
      box.update();
    }
  }

  onMouseDown(event) {
    const controller = this.controller;

    if (controller) {
      const button = controller.button || (controller.button = new _gamepads.GamepadButton(2, controller.gamepad));
      controller.press(button.index);
      this.gamepads.onEvent('press', button);
    }
  }

  onMouseUp(event) {
    const controller = this.controller;

    if (controller) {
      const button = controller.button;
      controller.release(button.index);
      this.gamepads.onEvent('release', button);
    }
  }

  onMouseMove(event) {
    const w2 = window.innerWidth / 2;
    const h2 = window.innerHeight / 2;
    this.mouse.x = (event.clientX - w2) / w2;
    this.mouse.y = -(event.clientY - h2) / h2;
    this.updateTest(this.mouse);
  }

  log(message, object) {
    if (this.options.debug) {
      console.log(message, object);
      this.setText(message);
    }
  }

  addText_(parent) {
    const loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', font => {
      this.font = font;
      const material = new THREE.MeshBasicMaterial({
        color: 0x111111,
        // 0x33c5f6,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      });
      this.fontMaterial = material;
    });
  }

  setText(message) {
    if (this.options.debug) {
      message = message || '1';

      if (this.text) {
        this.text.parent.remove(this.text);
        this.text.geometry.dispose();
      }

      if (this.font) {
        const shapes = this.font.generateShapes(message, 5);
        const geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        const x = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(x, 0, 0);
        const text = new THREE.Mesh(geometry, this.fontMaterial);
        text.position.set(0, 0, -_const.POINTER_RADIUS);
        this.text = text;
        this.scene.add(text);
      }
    }
  }

}

exports.default = Controllers;

},{"../const":1,"../interactive/emittable":4,"./controller/controller":13,"./controller/hand-controller":14,"./controller/oculus-quest-controller":15,"./gamepads":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GamepadAxis = exports.GamepadButton = exports.Gamepad = exports.GAMEPAD_MODELS = exports.GAMEPAD_HANDS = exports.default = exports.SUPPORTED_REGEXP = exports.SUPPORTED_GAMEPADS = void 0;

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
const SUPPORTED_GAMEPADS = ['Gear VR Controller', 'Daydream Controller', 'Oculus Go Controller', 'OpenVR Gamepad', 'Oculus Touch', 'Spatial Controller'];
exports.SUPPORTED_GAMEPADS = SUPPORTED_GAMEPADS;
const SUPPORTED_REGEXP = new RegExp(`^(${SUPPORTED_GAMEPADS.join('|')})`, 'i');
exports.SUPPORTED_REGEXP = SUPPORTED_REGEXP;

class Gamepads extends _emittable.default {
  static get() {
    return [...(typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [])];
  }

  static isSupported(id) {
    // console.log(`isSupported|${id}|`);
    return id.match(SUPPORTED_REGEXP);
  }

  set gamepads(gamepads) {
    this.gamepads_ = gamepads;
  }

  get gamepads() {
    if (!this.gamepads_) {
      this.gamepads_ = {}; // console.log('gamepads', this.gamepads_);

      const gamepads = Gamepads.get();

      for (let i = 0; i < gamepads.length; i++) {
        this.connect(gamepads[i]);
      }

      this.addListeners();
    }

    return this.gamepads_;
  }

  constructor(log) {
    super();
    this.log = log;
    this.hands = {};

    this.onConnect = event => {
      this.connect(event.gamepad);
    };

    this.onDisconnect = event => {
      this.disconnect(event.gamepad);
    };

    this.onEvent = this.onEvent.bind(this);
  }

  connect($gamepad) {
    // console.log('connect', $gamepad);
    try {
      // Note: $gamepad === navigator.getGamepads()[$gamepad.index]
      if ($gamepad) {
        const id = $gamepad.id;
        this.log(`connect ${$gamepad.id} ${Gamepads.isSupported(id)}`, $gamepad);

        if (Gamepads.isSupported(id)) {
          const index = $gamepad.index;
          const gamepad = this.gamepads[index] ? this.gamepads[index] : this.gamepads[index] = new Gamepad($gamepad); // console.log(gamepad);

          this.hands[gamepad.hand] = gamepad;
          this.emit('connect', gamepad);
          gamepad.on('broadcast', this.onEvent);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  disconnect($gamepad) {
    // console.log('disconnect', $gamepad);
    try {
      // Note: $gamepad === navigator.getGamepads()[$gamepad.index]
      const id = $gamepad.id;

      if (Gamepads.isSupported(id)) {
        const index = $gamepad.index;
        const gamepad = this.gamepads[index] || $gamepad;

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

  onEvent(type, event) {
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

  addListeners() {
    window.addEventListener('gamepadconnected', this.onConnect, false);
    window.addEventListener('gamepaddisconnected', this.onDisconnect, false);
  }

  removeListeners() {
    window.removeEventListener('gamepadconnected', this.onConnect, false);
    window.removeEventListener('gamepaddisconnected', this.onDisconnect, false);
  }

  update() {
    for (let k in this.gamepads) {
      const gamepad = this.gamepads[k];

      if (gamepad) {
        gamepad.update();
      }
    }
  }

  destroy() {
    this.removeListeners();

    for (let k in this.gamepads) {
      const gamepad = this.gamepads[k];

      if (gamepad) {
        gamepad.destroy();
      }
    }

    this.gamepads = null;
  }

}

exports.default = Gamepads;
const GAMEPAD_HANDS = {
  NONE: 'none',
  LEFT: 'left',
  RIGHT: 'right'
};
exports.GAMEPAD_HANDS = GAMEPAD_HANDS;
const GAMEPAD_MODELS = {
  OCULUS_TOUCH: 0
};
exports.GAMEPAD_MODELS = GAMEPAD_MODELS;

class Gamepad extends _emittable.default {
  constructor(gamepad) {
    super();
    this.gamepad = gamepad;
    this.id = gamepad.id;
    this.index = gamepad.index;
    this.hand = this.getHand();
    this.type = this.getType();
    this.buttons = {};
    this.axes = {};
  }

  getHand() {
    if (this.gamepad.hand === 'left' || this.id.match(/(\sleft)/i)) {
      return GAMEPAD_HANDS.LEFT;
    } else if (this.gamepad.hand === 'right' || this.id.match(/(\sright)/i)) {
      return GAMEPAD_HANDS.RIGHT;
    } else {
      return GAMEPAD_HANDS.NONE;
    }
  }

  getType() {
    return this.id; // !!!
  }

  update() {
    this.updateButtons();
    this.updateAxes();
  }

  updateButtons() {
    this.gamepad.buttons.forEach((x, i) => {
      const pressed = x.pressed;
      const button = this.buttons[i] || (this.buttons[i] = new GamepadButton(i, this));

      if (button.pressed !== pressed) {
        button.pressed = pressed;

        if (pressed) {
          this.emit('press', button);
        } else if (status !== undefined) {
          this.emit('release', button);
        }
      }
    });
  }

  updateAxes() {
    const axes = this.gamepad.axes;

    for (let i = 0; i < axes.length; i += 2) {
      const index = Math.floor(i / 2);
      const axis = this.axes[index] || (this.axes[index] = new GamepadAxis(index, this));
      const x = axes[i];
      const y = axes[i + 1];

      if (axis.x !== x || axis.y !== y) {
        axis.x = x;
        axis.y = y;

        if (Math.abs(x) > Math.abs(y)) {
          const left = x < -0.85;
          const right = x > 0.85;

          if (axis.left !== left) {
            axis.left = left;
            this.emit(left ? 'left' : 'none', axis);
            console.log(`${axis.gamepad.hand} ${axis.gamepad.index} left ${left}`);
          }

          if (axis.right !== right) {
            axis.right = right;
            this.emit(right ? 'right' : 'none', axis);
            console.log(`${axis.gamepad.hand} ${axis.gamepad.index} right ${right}`);
          }
        } else {
          const up = y < -0.85;
          const down = y > 0.85;

          if (axis.up !== up) {
            axis.up = up;
            this.emit(up ? 'up' : 'none', axis);
            console.log(`${axis.gamepad.hand} ${axis.gamepad.index} up ${up}`);
          }

          if (axis.down !== down) {
            axis.down = down;
            this.emit(down ? 'down' : 'none', axis);
            console.log(`${axis.gamepad.hand} ${axis.gamepad.index} down ${down}`);
          }
        }

        this.emit('axis', axis);
      }
    }
  }

  feedback(strength = 0.1, duration = 50) {
    // !!! care for battery
    return;
    const actuators = this.gamepad.hapticActuators;

    if (actuators && actuators.length) {
      return actuators[0].pulse(strength, duration);
    } else {
      return Promise.reject();
    }
  }

  destroy() {
    this.gamepad = null;
  }

}

exports.Gamepad = Gamepad;

class GamepadButton {
  constructor(index, gamepad) {
    this.index = index;
    this.gamepad = gamepad;
    this.pressed = false;
  }

}

exports.GamepadButton = GamepadButton;

class GamepadAxis extends THREE.Vector2 {
  constructor(index, gamepad) {
    super();
    this.index = index;
    this.gamepad = gamepad;
    this.left = this.right = this.up = this.down = false;
  }

}

exports.GamepadAxis = GamepadAxis;

},{"../interactive/emittable":4}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VR = exports.VR_MODE = void 0;

var _emittable = _interopRequireDefault(require("../interactive/emittable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
const VR_MODE = {
  NONE: 0,
  VR: 1,
  XR: 2
};
exports.VR_MODE = VR_MODE;

class VR extends _emittable.default {
  constructor(renderer, options) {
    super();

    if (options && options.frameOfReferenceType) {
      renderer.vr.setFrameOfReferenceType(options.frameOfReferenceType);
    }

    this.renderer = renderer;
    this.options = options;
    this.onVRDisplayConnect = this.onVRDisplayConnect.bind(this);
    this.onVRDisplayDisconnect = this.onVRDisplayDisconnect.bind(this);
    this.onVRDisplayPresentChange = this.onVRDisplayPresentChange.bind(this);
    this.onVRDisplayActivate = this.onVRDisplayActivate.bind(this);
    this.onVRMouseEnter = this.onVRMouseEnter.bind(this);
    this.onVRMouseLeave = this.onVRMouseLeave.bind(this);
    this.onVRClick = this.onVRClick.bind(this);
    this.onXRClick = this.onXRClick.bind(this);
    this.onXRSessionStarted = this.onXRSessionStarted.bind(this);
    this.onXRSessionEnded = this.onXRSessionEnded.bind(this);
    this.mode = this.detectMode();
    this.initElement();
  }

  detectMode() {
    let mode = VR_MODE.NONE;

    if ('xr' in navigator) {
      mode = VR_MODE.XR;
    } else if ('getVRDisplays' in navigator) {
      mode = VR_MODE.VR;
    }

    return mode;
  }

  initElement() {
    try {
      let element;

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

  addElement(type) {
    const element = document.createElement(type);
    element.style.display = 'none';
    element.style.position = 'absolute';
    element.style.bottom = '20px';
    element.style.padding = '12px 6px';
    element.style.background = 'rgba(0,0,0,0.1)';
    element.style.border = '1px solid #fff';
    element.style.opacity = '0.5';
    element.style.borderRadius = '4px';
    element.style.background = '#E91E63';
    element.style.border = 'none';
    element.style.opacity = '1';
    element.style.borderRadius = '20px';
    element.style.color = '#fff';
    element.style.font = 'normal 13px sans-serif';
    element.style.textAlign = 'center';
    element.style.outline = 'none';
    element.style.zIndex = '999';
    return element;
  }

  getVR() {
    navigator.getVRDisplays().then(displays => {
      // console.log('navigator.getVRDisplays', displays);
      if (displays.length > 0) {
        this.setEnterVR(displays[0]);
      } else {
        this.setVRNotFound();
      }
    }).catch(e => {
      console.log('getVR.error', e);
      this.setVRNotFound();
    });
  }

  getXR() {
    navigator.xr.requestDevice().then(device => {
      device.supportsSession({
        immersive: true,
        exclusive: true
        /* DEPRECATED */

      }).then(() => {
        this.setEnterXR(device);
      }).catch(() => this.setVRNotFound());
    }).catch(e => {
      console.log('getXR.error', e);
      this.setVRNotFound();
    });
  }

  setEnterVR(device) {
    this.device = device;
    this.renderer.vr.setDevice(device);
    this.session = null;
    const element = this.element;
    element.style.display = '';
    element.style.cursor = 'pointer';
    element.style.left = 'calc(50% - 50px)';
    element.style.width = '100px';
    element.textContent = 'ENTER VR';
    element.addEventListener('mouseenter', this.onVRMouseEnter);
    element.addEventListener('mouseleave', this.onVRMouseLeave);
    element.addEventListener('click', this.onVRClick);
  }

  setEnterXR(device) {
    this.device = device;
    this.session = null;
    const element = this.element;
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

  setVRNotFound() {
    this.renderer.vr.setDevice(null);
    const element = this.element;
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


  onVRDisplayConnect(event) {
    this.setEnterVR(event.display);
  }

  onVRDisplayDisconnect(event) {
    this.setVRNotFound();
  }

  onVRDisplayPresentChange(event) {
    try {
      const isPresenting = event.display.isPresenting;
      this.session = isPresenting;

      if (isPresenting) {
        this.element.textContent = 'EXIT VR';
        this.emit('presenting');
      } else {
        this.element.textContent = 'ENTER VR';
        this.emit('exit');
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

  onVRDisplayActivate(event) {
    try {
      event.display.requestPresent([{
        source: this.renderer.domElement
      }]).then(() => {
        this.emit('presenting');
      }, error => {
        console.log(error);
        this.emit('error', error);
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  onVRMouseEnter(event) {
    this.element.style.opacity = '1.0';
  }

  onVRMouseLeave(event) {
    this.element.style.opacity = '0.5';
  }

  onVRClick(event) {
    try {
      const device = this.device;

      if (device.isPresenting) {
        device.exitPresent();
      } else {
        device.requestPresent([{
          source: this.renderer.domElement
        }]).then(() => {
          this.emit('presenting');
        }, error => {
          console.log(error);
          this.emit('error', error);
        });
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

  onXRClick(event) {
    try {
      const device = this.device;

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

  onXRSessionStarted(session) {
    try {
      session.addEventListener('end', this.onXRSessionEnded);
      this.renderer.vr.setSession(session);
      this.session = session;
      this.element.textContent = 'EXIT VR';
      this.emit('presenting');
    } catch (error) {
      this.emit('error', error);
    }
  }

  onXRSessionEnded(event) {
    try {
      this.session.removeEventListener('end', this.onXRSessionEnded);
      this.renderer.vr.setSession(null);
      this.session = null;
      this.element.textContent = 'ENTER VR';
      this.emit('exit');
    } catch (error) {
      this.emit('error', error);
    }
  }

}
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

},{"../interactive/emittable":4}],19:[function(require,module,exports){
"use strict";

var _const = require("./const");

var _roundBox = _interopRequireDefault(require("./geometries/round-box.geometry"));

var _freezable = _interopRequireDefault(require("./interactive/freezable.group"));

var _freezable2 = _interopRequireDefault(require("./interactive/freezable.mesh"));

var _grabbable = _interopRequireDefault(require("./interactive/grabbable.group"));

var _interactive = _interopRequireDefault(require("./interactive/interactive.mesh"));

var _materials = _interopRequireDefault(require("./materials/materials"));

var _physics = _interopRequireDefault(require("./physics/physics.worker"));

var _controllers = _interopRequireDefault(require("./vr/controllers"));

var _gamepads = require("./vr/gamepads");

var _vr = require("./vr/vr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import Physics from './physics/physics';
class Vrui {
  constructor() {
    this.tick = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.clock = new THREE.Clock();
    this.linearVelocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3(); // this.size = { width: 0, height: 0, aspect: 0 };
    // this.cameraDirection = new THREE.Vector3();
    //

    const section = this.section = document.querySelector('.vrui');
    const container = this.container = section.querySelector('.vrui__container');
    const debugInfo = this.debugInfo = section.querySelector('.debug__info');
    const debugSave = this.debugSave = section.querySelector('.debug__save');
    const renderer = this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColor(0xdfdcd5, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    renderer.vr.enabled = true;
    container.appendChild(renderer.domElement);
    const vr = this.vr = new _vr.VR(renderer, {
      referenceSpaceType: 'local'
    });
    vr.on('error', error => {
      this.debugInfo.innerHTML = error;
    });
    container.appendChild(vr.element);
    const raycaster = this.raycaster = new THREE.Raycaster();
    const scene = this.scene = new THREE.Scene();
    scene.name = 'Scene'; // const texture = this.addSceneBackground(renderer, scene, (texture, textureData) => {});

    this.addSceneBackground(renderer, scene);
    const camera = this.camera = this.addCamera();
    scene.add(camera);

    if (true) {
      // const light = new THREE.HemisphereLight(0xffffff, 0x330000, 1.2);
      const light = new THREE.DirectionalLight(0xffffff, 1, 100);
      light.position.set(0, 3, 0);
      light.castShadow = true;
      scene.add(light);
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.radius = 1.25;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 100;
      /*
      const helper = new THREE.CameraHelper(light.shadow.camera);
      scene.add(helper);
      */
    }

    const controllers = this.controllers = this.addControllers(renderer, vr, scene);
    this.addListeners();
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize, false); // const physics = this.physics = new Physics();

    const physics = this.physics = new _physics.default();
    const floor = this.floor = this.addFloor();
    scene.add(floor);
    /*
    physics.on('init', () => {
    	console.log('init');
    	this.addMeshes();
    });
    */

    setTimeout(() => {
      // const materials = this.materials = this.addMaterials(scene.background);
      const materials = this.materials = new _materials.default(scene.background);
      /*
      const bg = this.bg = this.addBG();
      scene.add(bg);
      */

      this.addMeshes();
    }, 1000);
  }

  addFloor() {
    if (this.physics) {
      const geometry = new THREE.PlaneGeometry(40, 40);
      geometry.rotateX((0, _const.deg)(-90));
      const material = new THREE.ShadowMaterial();
      material.opacity = 0.5;
      const floor = new THREE.Mesh(geometry, material);
      floor.position.y = 0.0;
      floor.receiveShadow = true;
      /*
      const floor = new THREE.Group();
      floor.position.y = -0.1;
      */

      this.physics.addBox(floor, new THREE.Vector3(40, (0, _const.cm)(1), 40));
      return floor;
    }
  }

  updateVelocity(controller) {
    if (controller) {
      this.linearVelocity.copy(controller.linearVelocity).multiplyScalar(40);
      this.angularVelocity.copy(controller.angularVelocity).multiplyScalar(10);
    }
  }

  addMeshes() {
    const scene = this.scene;
    /*
    const banner = this.banner = this.addBanner();
    scene.add(banner);
    */

    if (_const.TRIGGER_CUBES) {
      const cube0 = this.cube0 = this.addRoundedCube(0);
      scene.add(cube0);
      const cube1 = this.cube1 = this.addRoundedCube(1);
      scene.add(cube1);
    }

    const stand = this.stand = this.addStand();
    scene.add(stand);
    const toothbrush = this.toothbrush = this.addToothBrush();
    scene.add(toothbrush);
  }

  addListeners() {
    if (this.vr.mode === _vr.VR_MODE.NONE) {
      this.onMouseDown = this.onMouseDown.bind(this);
      window.addEventListener('mousedown', this.onMouseDown);
      this.onMouseUp = this.onMouseUp.bind(this);
      window.addEventListener('mouseup', this.onMouseUp);
      this.onMouseMove = this.onMouseMove.bind(this);
      window.addEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseDown(event) {}

  onMouseUp(event) {}

  onMouseMove(event) {
    const w2 = window.innerWidth / 2;
    const h2 = window.innerHeight / 2;
    this.mouse.x = (event.clientX - w2) / w2;
    this.mouse.y = -(event.clientY - h2) / h2;
  }

  onWindowResize(event) {
    try {
      const container = this.container,
            renderer = this.renderer,
            camera = this.camera;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

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

  addCamera() {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, (0, _const.cm)(1), 500);
    camera.position.set(0, (0, _const.cm)(176), (0, _const.cm)(20));
    camera.target = new THREE.Vector3(0, (0, _const.cm)(156), -(0, _const.cm)(60));

    camera.onBeforeRender = (renderer, scene) => {
      if (this.vr.mode === _vr.VR_MODE.NONE) {
        // camera.position.z = Math.cos(this.tick * 0.1) * 1;
        camera.target.set(this.mouse.x * (0, _const.cm)(40), (0, _const.cm)(156) + this.mouse.y * (0, _const.cm)(20), -(0, _const.cm)(60) + this.mouse.y * (0, _const.cm)(20));
        camera.lookAt(camera.target);
      }
    };

    return camera;
  }

  addControllers(renderer, vr, scene) {
    if (vr.mode !== _vr.VR_MODE.NONE || _const.TEST_ENABLED) {
      const cube0 = this.cube0;
      const cube1 = this.cube1;
      const controllers = new _controllers.default(renderer, scene, {
        debug: _const.DEBUG
      });
      controllers.on('press', button => {
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

        if (button.index === 3) {
          this.toothbrush.onRespawn();
        }
      });

      if (_const.TRIGGER_CUBES) {
        controllers.on('release', button => {
          console.log('vrui.release', button.gamepad.hand, button.index);
        });
        controllers.on('left', axis => {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.left', axis.gamepad.hand, axis.index);
            TweenMax.to(cube0.userData.rotation, 0.3, {
              y: cube0.userData.rotation.y - Math.PI / 2,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('right', axis => {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.right', axis.gamepad.hand, axis.index);
            TweenMax.to(cube0.userData.rotation, 0.3, {
              y: cube0.userData.rotation.y + Math.PI / 2,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('up', axis => {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.up', axis.gamepad.hand, axis.index);
            const s = Math.min(2.0, cube0.userData.scale.x + 0.1);
            TweenMax.to(cube0.userData.scale, 0.3, {
              x: s,
              y: s,
              z: s,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('down', axis => {
          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
            console.log('vrui.down', axis.gamepad.hand, axis.index);
            const s = Math.max(0.1, cube0.userData.scale.x - 0.1);
            TweenMax.to(cube0.userData.scale, 0.3, {
              x: s,
              y: s,
              z: s,
              ease: Power2.easeInOut
            });
          }
        });
        controllers.on('axis', axis => {
          console.log('vrui.axis', axis.gamepad.hand, axis.index);

          if (axis.gamepad.hand === _gamepads.GAMEPAD_HANDS.RIGHT) {
            const s = Math.max(0.1, Math.min(2, cube1.scale.x + axis.y * 0.1));
            cube1.userData.scale.set(s, s, s);
            cube1.userData.rotation.y += axis.x * 0.2;
          }
        });
      }

      return controllers;
    }
  }

  addCube(index) {
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-00.jpg');
    const geometry = new THREE.BoxGeometry((0, _const.cm)(20), (0, _const.cm)(20), (0, _const.cm)(20));
    const material = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: matcap
    });
    const mesh = new _interactive.default(geometry, material);
    mesh.position.set(index === 0 ? -(0, _const.cm)(30) : (0, _const.cm)(30), (0, _const.cm)(117), -2);
    mesh.userData = {
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Vector3() // position: new THREE.Vector3(),

    };

    mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      mesh.scale.set(mesh.userData.scale.x, mesh.userData.scale.y, mesh.userData.scale.z);
      mesh.rotation.set(mesh.userData.rotation.x, mesh.userData.rotation.y, mesh.userData.rotation.z);
      /*
      mesh.rotation.y += Math.PI / 180 * 5;
      mesh.rotation.x += Math.PI / 180 * 1;
      const s = 1 + Math.cos(this.tick * 0.1) * 0.5;
      mesh.scale.set(s, s, s);
      */
    };

    mesh.on('over', () => {
      mesh.material.color.setHex(0xff0000);
    });
    mesh.on('out', () => {
      mesh.material.color.setHex(0x00ff00);
    });
    mesh.on('down', () => {
      mesh.material.color.setHex(0x0000ff);
    });
    mesh.on('up', () => {
      mesh.material.color.setHex(0xcccccc);
    });
    return mesh;
  }

  addRoundedCube(index) {
    // const matcap = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
    const geometry = new _roundBox.default((0, _const.cm)(20), (0, _const.cm)(20), (0, _const.cm)(20), (0, _const.cm)(4), 1, 1, 1, 3);
    const material = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: matcap
      /*
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      */

    });
    const mesh = new _interactive.default(geometry, material);
    mesh.position.set(index === 0 ? -(0, _const.cm)(30) : (0, _const.cm)(30), (0, _const.cm)(117), -2);
    mesh.userData = {
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Vector3()
    };
    let box;

    if (_const.BOUNDING_BOX) {
      box = new THREE.BoxHelper(mesh, 0x0000ff);
      this.scene.add(box);
    }

    mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      mesh.scale.set(mesh.userData.scale.x, mesh.userData.scale.y, mesh.userData.scale.z);
      mesh.rotation.set(mesh.userData.rotation.x, mesh.userData.rotation.y, mesh.userData.rotation.z);
      mesh.userData.rotation.y += 0.01 + 0.01 * index;
      mesh.userData.rotation.x += 0.01 + 0.01 * index;

      if (box) {
        box.update();
      }
    };

    mesh.on('over', () => {
      mesh.material.color.setHex(0xff0000);
    });
    mesh.on('out', () => {
      mesh.material.color.setHex(0x00ff00);
    });
    mesh.on('down', () => {
      mesh.material.color.setHex(0x0000ff);
    });
    mesh.on('up', () => {
      mesh.material.color.setHex(0xffffff);
    });
    return mesh;
  }

  addBanner() {
    const texture = new THREE.TextureLoader().load('img/banners/professional-27.png');
    const geometry = new THREE.PlaneGeometry((0, _const.cm)(200), (0, _const.cm)(200), 2, 2); // geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      transparent: true // side: THREE.DoubleSide,

    });
    const mesh = new _interactive.default(geometry, material);
    mesh.position.set(0, (0, _const.cm)(200), -6);
    mesh.on('over', () => {
      // mesh.material.opacity = 0.5;
      TweenMax.to(mesh.material, 0.4, {
        opacity: 0.8,
        ease: Power2.easeInOut
      });
    });
    mesh.on('out', () => {
      // mesh.material.opacity = 1;
      TweenMax.to(mesh.material, 0.4, {
        opacity: 1.0,
        ease: Power2.easeInOut
      });
    });
    return mesh;
  }

  addStand() {
    const size = new THREE.Vector3((0, _const.cm)(40), (0, _const.mm)(10), (0, _const.cm)(20));
    const geometry = new _roundBox.default(size.x, size.y, size.z, (0, _const.mm)(5), 1, 1, 1, 5);
    const mesh = new THREE.Mesh(geometry, this.materials.white);
    mesh.receiveShadow = true;
    mesh.position.set(0, (0, _const.cm)(116), (0, _const.cm)(-60));

    if (this.physics) {
      this.physics.addBox(mesh, size);
    }

    return mesh;
  }

  addStand__() {
    // const matcap = new THREE.TextureLoader().load('img/matcap/matcap-12.jpg');
    // const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-01.jpg');
    /*
    const material = new THREE.MeshMatcapMaterial({
    	color: 0xffffff,
    	matcap: matcap,
    });
    */

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.05
      /*
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      */

    });
    const group = new THREE.Group();
    group.position.set(0, (0, _const.cm)(-20), (0, _const.cm)(-40));
    const path = `models/stand/stand.fbx`;
    const loader = new THREE.FBXLoader();
    loader.load(path, object => {
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
          child.geometry.rotateX(child.rotation.x);
          child.geometry.rotateY(child.rotation.y);
          child.geometry.rotateZ(child.rotation.z);
          child.rotation.set(0, 0, 0);
        }
      });
      group.add(object);
    }, xhr => {
      const progress = xhr.loaded / xhr.total;
    }, error => {
      console.log(`model not found ${path}`);
    });
    return group;
  }

  addToothBrush() {
    const mesh = new _grabbable.default();
    mesh.defaultY = this.stand.position.y + (0, _const.cm)(50);
    mesh.position.set(0, mesh.defaultY, (0, _const.cm)(-60));
    mesh.rotation.set(0, 0, (0, _const.deg)(10));
    const loader = new THREE.FBXLoader(); // new THREE.OBJLoader();

    loader.load(`models/toothbrush/professional-27.fbx`, object => {
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          // child.geometry.scale(2.54, 2.54, 2.54);
          switch (child.name) {
            case 'body-primary':
            case 'bubble':
              // child.geometry.computeFaceNormals();
              // child.geometry.computeVertexNormals(true);
              child.material = this.materials.bodyPrimaryClear;
              child.castShadow = true;
              mesh.body = child;
              break;

            case 'body-secondary':
              // child.geometry.computeFaceNormals();
              // child.geometry.computeVertexNormals(true);
              child.material = this.materials.bodySecondary;
              child.castShadow = true;
              mesh.color = child;
              break;

            case 'bristles-primary':
              child.material = this.materials.bristlesPrimary;
              break;

            case 'bristles-secondary':
              child.material = this.materials.bristlesSecondary;
              break;

            case 'logo':
              child.material = this.materials.logoSilver;
              mesh.logo = child;
              break;
          }
        }
      });
      mesh.add(object);

      if (this.physics) {
        const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        box.setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        mesh.userData.size = size;

        if (this.physics) {
          this.physics.addBox(mesh, size, 1);
        } // this.bodies.push(mesh);

      }
    }, xhr => {// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, error => {
      console.log('An error happened', error);
    });
    mesh.name = 'toothbrush';
    mesh.on('grab', controller => {
      if (this.physics) {
        this.physics.remove(mesh);
      }

      mesh.userData.speed = 0;
      mesh.falling = false;
      mesh.freeze();
      const target = controller.parent;
      const position = mesh.position.clone();
      mesh.parent.localToWorld(position);
      target.worldToLocal(position);
      mesh.parent.remove(mesh);

      if (controller.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
        mesh.position.set((0, _const.cm)(1), (0, _const.cm)(2), (0, _const.cm)(0));
        mesh.rotation.set((0, _const.deg)(180), (0, _const.deg)(0), (0, _const.deg)(115));
      } else {
        mesh.position.set((0, _const.cm)(-1), (0, _const.cm)(3), (0, _const.cm)(-1));
        mesh.rotation.set(0, (0, _const.deg)(10), (0, _const.deg)(-60));
      }

      target.add(mesh);
      TweenMax.to(controller.material, 0.4, {
        opacity: 0.0,
        ease: Power2.easeInOut
      });
    });
    mesh.on('release', controller => {
      const target = this.scene;
      const position = mesh.position.clone(); // new THREE.Vector3();

      const quaternion = mesh.parent.quaternion.clone();
      mesh.parent.localToWorld(position);
      target.worldToLocal(position);
      mesh.parent.remove(mesh);
      mesh.position.set(0, 0, 0);
      mesh.quaternion.premultiply(quaternion);
      mesh.position.set(position.x, position.y, position.z);
      target.add(mesh);
      mesh.unfreeze();
      TweenMax.to(controller.material, 0.4, {
        opacity: 1.0,
        ease: Power2.easeInOut
      });

      if (this.physics) {
        if (_const.TEST_ENABLED) {
          this.linearVelocity.z -= 1;
        }

        this.physics.addBox(mesh, mesh.userData.size, 1, this.linearVelocity, this.angularVelocity);
        /*
        this.bodies.push(mesh);
        body.setCollisionFlags(1); // 0 is static 1 dynamic 2 kinematic and state to 4:
        body.setActivationState(1); // never sleep
        */
      } else {
        mesh.falling = true;
      }
    });

    mesh.onRespawn = () => {
      if (this.physics) {
        this.physics.remove(mesh);
      }

      mesh.parent.remove(mesh);
      setTimeout(() => {
        mesh.position.set(0, mesh.defaultY, (0, _const.cm)(-60));
        mesh.rotation.set(0, 0, (0, _const.deg)(10));
        this.scene.add(mesh);

        if (this.physics) {
          this.physics.addBox(mesh, mesh.userData.size, 1); // this.bodies.push(mesh);
        }
      }, 1000);
    };

    mesh.userData.respawn = data => {
      if (mesh.position.y < (0, _const.cm)(30)) {
        // const linearVelocity = mesh.userData.body.getLinearVelocity();
        // if (linearVelocity.length() < 0.03) {
        if (data && data.speed < 0.03) {
          mesh.onRespawn();
        }
      }
    };
    /*
    const onRespawn = () => {
    	mesh.parent.remove(mesh);
    	mesh.falling = false;
    	setTimeout(() => {
    		mesh.position.set(0, mesh.defaultY, cm(-60));
    		mesh.rotation.set(0, 0, 0);
    		this.scene.add(mesh);
    	}, 1000);
    };
    const onFallDown = () => {
    	if (mesh.falling) {
    		const speed = mesh.userData.speed || mm(0.1);
    		let tx = mesh.position.x;
    		let ty = mesh.position.y;
    		let tz = mesh.position.z;
    		let rx = mesh.rotation.x;
    		let ry = mesh.rotation.y;
    		let rz = mesh.rotation.z;
    		ty -= speed;
    		rx += (0 - rx) / 1000 * speed;
    		ry += (0 - ry) / 1000 * speed;
    		rz += deg(0.05) * speed;
    		mesh.position.set(tx, ty, tz);
    		mesh.rotation.set(rx, ry, rz);
    		mesh.userData.speed = speed * 1.1;
    		if (ty < cm(-30)) {
    			onRespawn();
    		}
    	}
    };
    */

    /*
    let box;
    if (BOUNDING_BOX) {
    	box = new THREE.BoxHelper(mesh, 0x0000ff);
    	this.scene.add(box);
    }
    mesh.onUpdate = (renderer, scene, camera, object, delta, time, tick) => {
    	if (box && !mesh.freezed) {
    		box.update();
    	}
    	onFallDown();
    };
    */


    return mesh;
  }

  addToothBrush__() {
    // const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
    const geometry = new _roundBox.default((0, _const.cm)(18), (0, _const.mm)(6), (0, _const.cm)(1), (0, _const.mm)(3), 1, 1, 1, 3);
    const material = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: matcap,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const mesh = new _interactive.default(geometry, material);
    mesh.position.set(0, (0, _const.cm)(117), (0, _const.cm)(-60));
    mesh.name = 'toothbrush';
    const bristlesGeometry = new _roundBox.default((0, _const.cm)(2), (0, _const.mm)(12), (0, _const.cm)(1), (0, _const.mm)(2), 1, 1, 1, 3);
    const bristlesMesh = new THREE.Mesh(bristlesGeometry, material);
    bristlesMesh.position.set(-(0, _const.cm)(8), (0, _const.mm)(9), 0);
    mesh.add(bristlesMesh);
    mesh.on('grab', controller => {
      mesh.userData.speed = 0;
      mesh.falling = false;
      mesh.freeze();
      const target = controller.parent; // target.updateMatrixWorld();

      const position = mesh.position.clone(); // new THREE.Vector3();

      mesh.parent.localToWorld(position);
      target.worldToLocal(position);
      mesh.parent.remove(mesh); // mesh.position.set(position.x, position.y, position.z);

      if (controller.gamepad.hand === _gamepads.GAMEPAD_HANDS.LEFT) {
        mesh.position.set((0, _const.cm)(1), (0, _const.cm)(2), (0, _const.cm)(0));
        mesh.rotation.set((0, _const.deg)(180), (0, _const.deg)(0), (0, _const.deg)(115));
      } else {
        mesh.position.set((0, _const.cm)(-1), (0, _const.cm)(3), (0, _const.cm)(-1));
        mesh.rotation.set(0, (0, _const.deg)(10), (0, _const.deg)(-60));
      }

      target.add(mesh);
      TweenMax.to(controller.material, 0.4, {
        opacity: 0.0,
        ease: Power2.easeInOut
      }); // console.log('grab', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
      // console.log(target.name);
    });
    mesh.on('release', controller => {
      const target = this.scene; // target.updateMatrixWorld();
      // mesh.parent.updateMatrixWorld();

      const position = mesh.position.clone(); // new THREE.Vector3();

      const quaternion = mesh.parent.quaternion.clone();
      mesh.parent.localToWorld(position);
      target.worldToLocal(position);
      mesh.parent.remove(mesh);
      mesh.position.set(0, 0, 0);
      mesh.quaternion.premultiply(quaternion);
      mesh.position.set(position.x, position.y, position.z);
      target.add(mesh);
      mesh.unfreeze();
      mesh.falling = true;
      TweenMax.to(controller.material, 0.4, {
        opacity: 1.0,
        ease: Power2.easeInOut
      }); // console.log('release', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
      // console.log(target.name);
    });
    /*
    mesh.userData = {
    	scale: new THREE.Vector3(1, 1, 1),
    	rotation: new THREE.Vector3(),
    };
    mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
    	mesh.scale.set(mesh.userData.scale.x, mesh.userData.scale.y, mesh.userData.scale.z);
    	mesh.rotation.set(mesh.userData.rotation.x, mesh.userData.rotation.y, mesh.userData.rotation.z);
    	mesh.userData.rotation.y += (0.01 + 0.01 * index);
    	mesh.userData.rotation.x += (0.01 + 0.01 * index);
    };
    */

    const onRespawn = () => {
      mesh.parent.remove(mesh);
      mesh.falling = false;
      setTimeout(() => {
        mesh.position.set(0, (0, _const.cm)(117), (0, _const.cm)(-60));
        mesh.rotation.set(0, 0, 0);
        this.scene.add(mesh); // console.log('onRespawn.scened');
      }, 1000); // console.log('onRespawn');
    };
    /*
    const onFallDown = () => {
    	if (mesh.falling) {
    		const speed = mesh.userData.speed || mm(0.1);
    		let tx = mesh.position.x;
    		let ty = mesh.position.y;
    		let tz = mesh.position.z;
    		let rx = mesh.rotation.x;
    		let ry = mesh.rotation.y;
    		let rz = mesh.rotation.z;
    		ty -= speed;
    		rx += (0 - rx) / 1000 * speed;
    		ry += (0 - ry) / 1000 * speed;
    		rz += deg(0.05) * speed;
    		mesh.position.set(tx, ty, tz);
    		mesh.rotation.set(rx, ry, rz);
    		mesh.userData.speed = speed * 1.1;
    		if (ty < cm(-30)) {
    			onRespawn();
    		}
    	}
    };
    */


    let box;

    if (_const.BOUNDING_BOX) {
      box = new THREE.BoxHelper(mesh, 0x0000ff);
      this.scene.add(box);
    }

    mesh.onUpdate = (renderer, scene, camera, object, delta, time, tick) => {
      if (box && !mesh.freezed) {
        box.update();
      } // onFallDown();

    };

    return mesh;
  }

  checkCameraPosition__() {
    const tick = this.tick;
    const camera = this.camera;
    const controllers = this.controllers;
    const stand = this.stand;
    const toothbrush = this.toothbrush;
    const y = camera.position.y;

    if (y < 1.2 && stand.position.y === (0, _const.cm)(116)) {
      stand.position.y = y - (0, _const.cm)(40);
      toothbrush.defaultY = stand.position.y + (0, _const.cm)(50);
      toothbrush.position.y = toothbrush.defaultY;
    }

    if (tick % 120 === 0 && controllers) {
      controllers.setText(`camera ${y.toFixed(3)}`);
    }
  }

  addBG() {
    const matcap = new THREE.TextureLoader().load('img/matcap/matcap-10.jpg');
    const geometry = new THREE.Geometry();
    const origin = new THREE.Vector3();
    new Array(300).fill().forEach(x => {
      const s = (0, _const.cm)(30) + Math.random() * (0, _const.cm)(0);
      const h = 3.0 + Math.random() * 3.0;
      const r = 5 + Math.random() * 20;
      const a = Math.PI * 2 * Math.random(); // const cubeGeometry = new THREE.BoxGeometry(s, h, s);

      const cubeBufferGeometry = new _roundBox.default(s, h, s, (0, _const.cm)(4), 1, 1, 1, 3);
      const cubeGeometry = new THREE.Geometry().fromBufferGeometry(cubeBufferGeometry);
      cubeGeometry.translate(Math.cos(a) * r, h / 2, Math.sin(a) * r);
      cubeGeometry.lookAt(origin);
      geometry.merge(cubeGeometry);
    });
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    const material = new THREE.MeshMatcapMaterial({
      color: 0x333333,
      matcap: matcap
    });
    const mesh = new THREE.Mesh(bufferGeometry, material);
    /*
    mesh.onBeforeRender = () => {
    	mesh.rotation.y += 0.001;
    };
    */

    return mesh;
  }

  addSceneBackground(renderer, scene, callback) {
    const loader = new THREE.TextureLoader().load('img/environment/equirectangular.jpg', (source, textureData) => {
      // const loader = new THREE.TextureLoader().load('img/environment/360_world.jpg', (source, textureData) => {
      source.mapping = THREE.UVMapping;
      const options = {
        resolution: 1024,
        generateMipmaps: true,
        minFilter: THREE.LinearMipMapLinearFilter,
        magFilter: THREE.LinearFilter
      };
      scene.background = new THREE.CubemapGenerator(renderer).fromEquirectangular(source, options);

      if (typeof callback === 'function') {
        const cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, options);
        const texture = cubemapGenerator.update(renderer);
        texture.mapping = THREE.CubeReflectionMapping;
        texture.mapping = THREE.CubeRefractionMapping;
        source.dispose();
        callback(texture);
      }
    });
    return loader;
  }

  updateRaycaster() {
    try {
      const controllers = this.controllers;
      const raycaster = controllers.setRaycaster(this.raycaster);

      if (raycaster) {
        const hit = _interactive.default.hittest(raycaster, controllers.gamepads.button, controllers.controller);

        if (hit) {
          controllers.feedback();
          /*
          if (Tone.context.state === 'running') {
          	const feedback = this.feedback = (this.feedback || new Tone.Player('audio/feedback.mp3').toMaster());
          	feedback.start();
          }
          */
        }

        _grabbable.default.grabtest(controllers);
      }
    } catch (error) {
      this.debugInfo.innerHTML = error;
    }
  }

  render() {
    try {
      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();
      const tick = Math.floor(time * 60);

      if (this.physics) {
        this.physics.update(delta);
      }

      const renderer = this.renderer;
      const scene = this.scene;
      const camera = this.camera;

      _freezable2.default.update(renderer, scene, camera, delta, time, tick);

      _freezable.default.update(renderer, scene, camera, delta, time, tick);

      if (this.controllers) {
        this.controllers.update();
        this.updateRaycaster(); // this.checkCameraPosition__();

        if (this.physics) {
          this.updateVelocity(this.controllers.controller);
        }
      }

      camera.onBeforeRender(renderer, scene);
      renderer.render(scene, camera);
      this.delta = delta;
      this.time = time;
      this.tick = tick;
    } catch (error) {
      this.debugInfo.innerHTML = error;
    }
  }

  animate() {
    const renderer = this.renderer;
    renderer.setAnimationLoop(() => {
      this.render();
    });
  }

}

const instance = new Vrui();
instance.animate();

},{"./const":1,"./geometries/round-box.geometry":2,"./interactive/freezable.group":6,"./interactive/freezable.mesh":7,"./interactive/grabbable.group":8,"./interactive/interactive.mesh":9,"./materials/materials":10,"./physics/physics.worker":11,"./vr/controllers":16,"./vr/gamepads":17,"./vr/vr":18}]},{},[19]);
//# sourceMappingURL=vrui.js.map
