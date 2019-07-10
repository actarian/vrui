/* jshint esversion: 6 */
/* global window, document */

import { POINTER_RADIUS, TEST_ENABLED } from '../const';
import Emittable from '../interactive/emittable';
// import Controller from './controller/controller';
import OculusQuestController from './controller/oculus-quest-controller';
// import HandController from './controller/hand-controller';
import Gamepads, { GAMEPAD_HANDS } from './gamepads';

export default class Controllers extends Emittable {

	constructor(renderer, scene) {
		super();
		this.tick = 0;
		this.controllers_ = {};
		this.gamepads_ = {};
		this.renderer = renderer;
		this.scene = scene;
		this.direction = new THREE.Vector3();
		const text = this.text = this.addText_(scene);
		const gamepads = this.gamepads = this.addGamepads_();
		this.addTestController_();
	}

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
		const gamepads = this.gamepads = new Gamepads((text) => {
			this.setText(text);
		});
		gamepads.on('connect', (gamepad) => {
			// console.log('connect', gamepad);
			this.setText(`connect ${gamepad.hand} ${gamepad.index}`);
			const controller = this.addController_(this.renderer, this.scene, gamepad);
			if (gamepad.hand === GAMEPAD_HANDS.LEFT) {
				this.left = controller;
			} else {
				this.right = controller;
			}
		});
		gamepads.on('disconnect', (gamepad) => {
			// console.log('disconnect', gamepad);
			this.setText(`disconnect ${gamepad.hand} ${gamepad.index}`);
			this.removeController_(gamepad);
		});
		gamepads.on('hand', (gamepad) => {
			this.gamepad = gamepad;
		});
		gamepads.on('press', (button) => {
			// console.log('press', press);
			this.setText(`press ${button.gamepad.hand} ${button.index}`);
			switch (button.gamepad.hand) {
				case GAMEPAD_HANDS.LEFT:
					// 0 joystick, 1 trigger, 2 grip, 3 Y, 4 X
					/*
					switch (button.index) {
						case 1:
							break;
						case 2:
							break;
						case 3:
							break;
					}
					*/
					break;
				case GAMEPAD_HANDS.RIGHT:
					// 0 joystick, 1 trigger, 2 grip, 3 A, 4 B
					break;
			}
			const controller = this.controllers_[button.gamepad.index];
			if (controller) {
				controller.press(button.index);
			}
		});
		gamepads.on('release', (button) => {
			// console.log('release', button);
			// this.setText(`release ${button.gamepad.hand} ${button.index}`);
			const controller = this.controllers_[button.gamepad.index];
			if (controller) {
				controller.release(button.index);
			}
		});
		gamepads.on('axis', (axis) => {
			// console.log('axis', axis);
			// this.setText(`axis ${axis.gamepad.hand} ${axis.index} { x:${axis.x}, y:${axis.y} }`);
			const controller = this.controllers_[axis.gamepad.index];
			if (controller) {
				controller.axis[axis.index] = axis;
			}
		});
		gamepads.on('broadcast', (type, event) => {
			this.emit(type, event);
		});
		return gamepads;
	}

	addController_(renderer, scene, gamepad) {
		const index = gamepad.index;
		let controller = this.controllers_[index];
		if (!controller) {
			const pivot = renderer.vr.getController(index);
			controller = new OculusQuestController(pivot, gamepad.hand);
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
		if (TEST_ENABLED) {
			// const controller = new Controller(this.scene, GAMEPAD_HANDS.RIGHT);
			const controller = new OculusQuestController(this.scene, GAMEPAD_HANDS.RIGHT);
			// const controller = new HandController(this.scene, GAMEPAD_HANDS.RIGHT);
			// controller.scale.set(15, 15, 15);
			controller.position.set(0, 1, -2);
			this.controller = controller;
			this.controllers_[0] = controller;
			this.mouse = { x: 0, y: 0 };
			this.onMouseMove = this.onMouseMove.bind(this);
			window.addEventListener('mousemove', this.onMouseMove);
		}
	}

	onMouseMove(event) {
		try {
			const w2 = window.innerWidth / 2;
			const h2 = window.innerHeight / 2;
			this.mouse.x = (event.clientX - w2) / w2;
			this.mouse.y = -(event.clientY - h2) / h2;
			this.updateTest(this.mouse);
		} catch (error) {

		}
	}

	updateTest(mouse) {
		const controller = this.controller;
		if (controller) {
			controller.rotation.y = -mouse.x * Math.PI;
			controller.rotation.x = mouse.y * Math.PI / 2;
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
		message = message || '1';
		if (this.text) {
			this.text.parent.remove(this.text);
			this.text.geometry.dispose();
		}
		if (this.font) {
			// console.log(this.font.generateShapes);
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
