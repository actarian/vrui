/* jshint esversion: 6 */
/* global window, document, TweenMax, THREE */

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Power2, TweenMax } from 'gsap';
import { cm, TEST_ENABLED } from './const';
import InteractiveMesh from './interactive/interactive.mesh';
import Controllers from './vr/controllers';
import { GAMEPAD_HANDS } from './vr/gamepads';
import { VR, VR_MODE } from './vr/vr';

class vrui {

	constructor() {
		this.tick = 0;
		this.mouse = { x: 0, y: 0 };
		this.parallax = { x: 0, y: 0 };
		this.size = { width: 0, height: 0, aspect: 0 };
		this.cameraDirection = new THREE.Vector3();
		this.init();
	}

	init() {
		const section = this.section = document.querySelector('.vrui');
		const container = this.container = section.querySelector('.vrui__container');
		const debugInfo = this.debugInfo = section.querySelector('.debug__info');
		const debugSave = this.debugSave = section.querySelector('.debug__save');

		const renderer = this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		renderer.setClearColor(0x666666, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.vr.enabled = true;
		container.appendChild(renderer.domElement);

		const vr = this.vr = new VR(renderer, { referenceSpaceType: 'local' }, (error) => {
			this.debugInfo.innerHTML = error;
		});
		container.appendChild(vr.element);

		const raycaster = this.raycaster = new THREE.Raycaster();

		const scene = this.scene = new THREE.Scene();

		const camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, cm(176), 0);
		camera.target = new THREE.Vector3(0, cm(176), -2);
		camera.lookAt(camera.target);

		const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
		scene.add(light);

		/*
		const bg = this.bg = this.addBG();
		scene.add(bg);
		*/

		const cube0 = this.cube0 = this.addCube(0);
		scene.add(cube0);

		const cube1 = this.cube1 = this.addCube(1);
		scene.add(cube1);

		if (this.vr.mode !== VR_MODE.NONE || TEST_ENABLED) {
			const controllers = this.controllers = new Controllers(renderer, scene);
			controllers.on('press', (button) => {
				console.log('controllers.press', button.gamepad.hand, button.index);
				switch (button.gamepad.hand) {
					case GAMEPAD_HANDS.LEFT:
						// 0 joystick, 1 trigger, 2 grip, 3 Y, 4 X
						/*
						switch (button.index) {
							case 1:
								break;
						}
						*/
						break;
					case GAMEPAD_HANDS.RIGHT:
						// 0 joystick, 1 trigger, 2 grip, 3 A, 4 B
						break;
				}
			});
			controllers.on('release', (button) => {
				console.log('controllers.release', button.gamepad.hand, button.index);
			});
			controllers.on('left', (axis) => {
				console.log('controllers.left', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					TweenMax.to(cube0.userData.rotation, 0.3, {
						x: cube0.userData.rotation.x - Math.PI / 2,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('right', (axis) => {
				console.log('controllers.right', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					TweenMax.to(cube0.userData.rotation, 0.3, {
						x: cube0.userData.rotation.x + Math.PI / 2,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('up', (axis) => {
				console.log('controllers.up', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					const s = Math.min(2.0, cube0.userData.scale.x + 0.1);
					TweenMax.to(cube0.userData.scale, 0.3, {
						x: s,
						y: s,
						z: s,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('down', (axis) => {
				console.log('controllers.down', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					const s = Math.max(0.1, cube0.userData.scale.x - 0.1);
					TweenMax.to(cube0.userData.scale, 0.3, {
						x: s,
						y: s,
						z: s,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('axis', (axis) => {
				console.log('controllers.axis', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.RIGHT) {
					const s = Math.max(0.1, Math.min(2, cube1.scale.x + axis.y));
					cube1.userData.scale.set(s, s, s);
					cube1.userData.rotation.x += axis.x;
				}
			});
		}

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize, false);
	}

	addCube(index) {
		const geometry = new THREE.BoxGeometry(cm(20), cm(20), cm(20));
		const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
		const cube = new InteractiveMesh(geometry, material);
		cube.position.set(index === 0 ? -cm(30) : cm(30), cm(136), -2);
		cube.userData = {
			scale: new THREE.Vector3(1, 1, 1),
			rotation: new THREE.Vector3(),
			// position: new THREE.Vector3(),
		};
		cube.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
			cube.scale.set(cube.userData.scale.x, cube.userData.scale.y, cube.userData.scale.z);
			cube.rotation.set(cube.userData.rotation.x, cube.userData.rotation.y, cube.userData.rotation.z);
			/*
			cube.rotation.y += Math.PI / 180 * 5;
			cube.rotation.x += Math.PI / 180 * 1;
			const s = 1 + Math.cos(this.tick * 0.1) * 0.5;
			cube.scale.set(s, s, s);
			*/
		};
		cube.on('over', () => {
			cube.material.color.setHex(0xffffff);
		});
		cube.on('out', () => {
			cube.material.color.setHex(0xcccccc);
		});
		cube.on('down', () => {
			cube.material.color.setHex(0x0000ff);
		});
		cube.on('up', () => {
			cube.material.color.setHex(0xcccccc);
		});
		return cube;
	}

	addBG() {
		const geometry = new THREE.Geometry();
		const origin = new THREE.Vector3();
		new Array(100).fill().forEach(x => {
			const s = 1.0 + Math.random() * 5.0;
			const h = 1.0 + Math.random() * 5.0;
			const r = 5 + Math.random() * 5;
			const a = Math.PI * 2 * Math.random();
			const cubeGeometry = new THREE.BoxGeometry(s, h, s);
			geometry.translate(Math.cos(a) * r, 0, Math.sin(a) * r);
			// geometry.lookAt(origin);
			geometry.merge(cubeGeometry);
		});
		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		const material = new THREE.MeshBasicMaterial({
			color: 0xcccccc
		});
		const mesh = new THREE.Mesh(bufferGeometry, material);
		return mesh;
	}

	updateRaycaster() {
		try {
			const controllers = this.controllers;
			const raycaster = controllers.setRaycaster(this.raycaster);
			if (raycaster) {
				const hit = InteractiveMesh.hittest(raycaster, controllers.gamepads.button);
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

	render(delta) {
		try {
			if (this.controllers) {
				this.controllers.update();
				this.updateRaycaster();
			}
			const renderer = this.renderer;
			renderer.render(this.scene, this.camera);
			this.tick++;
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

	onWindowResize() {
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

}

const tour = new vrui();
tour.animate();
