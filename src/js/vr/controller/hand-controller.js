/* jshint esversion: 6 */
/* global window, document */

import { GAMEPAD_HANDS } from '../gamepads';
import Controller from './controller';

export default class HandController extends Controller {

	constructor(parent, gamepad, options = {}) {
		super(parent, gamepad, options);
	}

	addModel(hand) {
		const format = '.fbx';
		const path = `${HandController.FOLDER}/${hand}/${hand}-animated__`;
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
		// const texture = new THREE.TextureLoader().load(`${path}.jpg`);
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			// map: texture,
			matcap: matcap,
			skinning: true,
		});
		const mesh = new THREE.Group();
		const loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
		let i = 0;
		loader.load(`${path}${format}`, (object) => {
			const mixer = this.mixer = new THREE.AnimationMixer(object);
			mixer.timeScale = 2;
			const clip = this.clip = mixer.clipAction(object.animations[0]);
			clip.setLoop(THREE.LoopOnce);
			clip.clampWhenFinished = true;
			object.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material.clone();
					// child.geometry.scale(0.1, 0.1, 0.1);
				}
			});
			// object.scale.set(0.1, 0.1, 0.1);
			object.scale.set(hand === GAMEPAD_HANDS.LEFT ? -1 : 1, 1, 1);
			mesh.add(object);
			this.ready = true;
		}, (xhr) => {
			this.progress = xhr.loaded / xhr.total;
		}, (error) => {
			console.log(`HandController.addModel not found ${path}${format}`);
		});
		return mesh;
	}

	addRay(hand) {
		const group = new THREE.Group();
		return group;
	}

	press(index) {
		if (this.clip) {
			if (this.clip.paused) {
				this.clip.reset();
			} else {
				this.clip.play();
			}
		}
	}

	release(index) {
		if (this.clip) {
			if (this.clip.paused) {
				this.clip.reset();
			} else {
				this.clip.play();
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

HandController.FOLDER = `models/hand`;
