/* jshint esversion: 6 */
/* global window, document */

import { POINTER_RADIUS, TEST_ENABLED } from '../const';
import Emittable from '../interactive/emittable';
import Controller from './controller/controller';
import HandController from './controller/hand-controller';
import OculusQuestController from './controller/oculus-quest-controller';
import Gamepads, { GAMEPAD_HANDS } from './gamepads';

const CONTROLLERS = {
	DEFAULT: Controller,
	OCULUS_QUEST: OculusQuestController,
	HAND: HandController,
};

export default class Controllers extends Emittable {

	constructor(renderer, scene, options = {}) {
		super();
		this.tick = 0;
		this.controllers_ = {};
		this.gamepads_ = {};
		this.renderer = renderer;
		this.scene = scene;
		this.options = Object.assign({
			debug: false,
			test: TEST_ENABLED,
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
		Object.keys(this.controllers_).forEach(x => this.controllers_[x].update(this.tick));
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
		const gamepads = new Gamepads((message, object) => {
			this.log(message, object);
		});
		return gamepads;
	}

	addEvents() {
		const gamepads = this.gamepads;
		gamepads.on('connect', this.onConnect);
		gamepads.on('disconnect', this.onDisconnect);
		gamepads.on('activate', this.onActivate);
		gamepads.on('press', this.onPress);
		gamepads.on('release', this.onRelease);
		gamepads.on('axis', this.onAxis);
		gamepads.on('broadcast', this.onBroadcast);
	}
	removeEvents() {
		const gamepads = this.gamepads;
		gamepads.off('connect', this.onConnect);
		gamepads.off('disconnect', this.onDisconnect);
		gamepads.off('activate', this.onActivate);
		gamepads.off('press', this.onPress);
		gamepads.off('release', this.onRelease);
		gamepads.off('axis', this.onAxis);
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
	onRelease(button) {
		// this.log(`release ${button.gamepad.hand} ${button.index}`, button);
	}
	onAxis(axis) {
		// this.log(`axis ${axis.gamepad.hand} ${axis.index} { x:${axis.x}, y:${axis.y} }`, axis);
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
			const pivot = renderer.vr.getController(index);
			// controller = new CONTROLLERS.DEFAULT(pivot, gamepad, this.options);
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
			const gamepad = new Emittable({ hand: GAMEPAD_HANDS.RIGHT });
			// const controller = new CONTROLLERS.DEFAULT(this.scene, gamepad, this.options);
			// const controller = new CONTROLLERS.OCULUS_QUEST(this.scene, gamepad, this.options);
			const controller = new CONTROLLERS.HAND(this.scene, gamepad, this.options);
			controller.scale.set(4, 4, 4);
			controller.position.set(0, 1, -2);
			this.controller = controller;
			this.controllers_[0] = controller;
			this.mouse = { x: 0, y: 0 };
			this.onMouseUp = this.onMouseUp.bind(this);
			this.onMouseDown = this.onMouseDown.bind(this);
			this.onMouseMove = this.onMouseMove.bind(this);
			window.addEventListener('mousedown', this.onMouseDown);
			window.addEventListener('mouseup', this.onMouseUp);
			window.addEventListener('mousemove', this.onMouseMove);
		}
	}

	onMouseDown(event) {
		const controller = this.controller;
		if (controller) {
			controller.press(1);
		}
	}

	onMouseUp(event) {
		const controller = this.controller;
		if (controller) {
			controller.release(1);
		}
	}

	onMouseMove(event) {
		const w2 = window.innerWidth / 2;
		const h2 = window.innerHeight / 2;
		this.mouse.x = (event.clientX - w2) / w2;
		this.mouse.y = -(event.clientY - h2) / h2;
		this.updateTest(this.mouse);
	}

	updateTest(mouse) {
		const controller = this.controller;
		if (controller) {
			controller.rotation.y = -mouse.x * Math.PI;
			controller.rotation.x = mouse.y * Math.PI / 2;
		}
	}

	log(message, object) {
		if (this.options.debug) {
			console.log(message, object);
			this.setText(message);
		}
	}

	addText_(parent) {
		const loader = new THREE.FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
			this.font = font;
			const material = new THREE.MeshBasicMaterial({
				color: 0x111111, // 0x33c5f6,
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
				text.position.set(0, 0, -POINTER_RADIUS);
				this.text = text;
				this.scene.add(text);
			}
		}
	}

}
