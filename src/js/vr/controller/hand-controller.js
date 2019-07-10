/* jshint esversion: 6 */
/* global window, document */

import { TEST_ENABLED } from '../../const';
import Controller from './controller';

const OFF = new THREE.Color(0x000000);
const ON = new THREE.Color(0x2196f3);

export default class HandController extends Controller {

	constructor(parent, hand) {
		super(parent, hand);
	}

	addModel(hand) {
		const format = '.fbx'; // '.obj';
		const path = `${HandController.FOLDER}/${hand}/${hand}-animated`;
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
		// const texture = new THREE.TextureLoader().load(`${path}.jpg`);
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff, // 0xccac98,
			// map: texture,
			matcap: matcap,
			// transparent: true,
			// opacity: 1,
			// wireframe: true,
		});
		const mesh = new THREE.Group();
		const loader = format === '.fbx' ? new THREE.FBXLoader() : new THREE.OBJLoader();
		let i = 0;
		loader.load(`${path}${format}`, (object) => {
			const mixer = this.mixer = new THREE.AnimationMixer(object);
			const action = this.action = mixer.clipAction(object.animations[0]);
			object.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material.clone();
					child.geometry.scale(0.1, 0.1, 0.1);
					const position = child.position.clone();
					console.log(child);
					// left > 0 joystick, 1 trigger, 2 grip, 3 X, 4 Y
					// right > 0 joystick, 1 trigger, 2 grip, 3 A, 4 B
				}
			});
			mesh.add(object);
			setTimeout(() => {
				// this.action.play();
			}, 2000);
			this.ready = true;
		}, (xhr) => {
			this.progress = xhr.loaded / xhr.total;
		}, (error) => {
			console.log(`HandController.addModel not found ${path}.obj`);
		});
		return mesh;
	}

	addRay(hand) {
		const group = new THREE.Group();
		return group;
		/*
		const geometry = new THREE.CylinderBufferGeometry(mm(1), mm(0.5), cm(30), 5); // 10, 12
		geometry.rotateX(Math.PI / 2);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.5,
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(this.hand === GAMEPAD_HANDS.RIGHT ? cm(1) : -cm(1), 0, -cm(18.5));
		return mesh;
		*/
	}

	update(tick) {
		if (this.mixer) {
			const clock = this.clock || (this.clock = new THREE.Clock());
			const delta = clock.getDelta();
			this.mixer.update(delta);
		}
		this.test(tick);
	}

	test(tick) {
		if (TEST_ENABLED && this.ready) {
			this.axis[0].x = Controller.getCos(tick, 0);
			this.axis[0].y = Controller.getCos(tick, 1);
			this.buttons[1].value = Math.abs(Controller.getCos(tick, 1));
			this.buttons[2].value = Math.abs(Controller.getCos(tick, 2));
			this.buttons[3].value = Math.abs(Controller.getCos(tick, 3));
			this.buttons[4].value = Math.abs(Controller.getCos(tick, 4));
		}
	}

}

HandController.FOLDER = `models/hand`;
