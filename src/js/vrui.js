/* jshint esversion: 6 */

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { cm, mm, TEST_ENABLED } from './const';
import RoundBoxGeometry from './geometries/round-box.geometry';
import InteractiveMesh from './interactive/interactive.mesh';
import Controllers from './vr/controllers';
import { GAMEPAD_HANDS } from './vr/gamepads';
import { VR, VR_MODE } from './vr/vr';

class Vrui {

	constructor() {
		this.tick = 0;
		this.mouse = { x: 0, y: 0 };
		// this.size = { width: 0, height: 0, aspect: 0 };
		// this.cameraDirection = new THREE.Vector3();
		//
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
		scene.name = 'Scene';
		// const texture = this.addSceneBackground(renderer, scene, (texture, textureData) => {});
		this.addSceneBackground(renderer, scene);

		const camera = this.camera = this.addCamera();
		scene.add(camera);

		/*
		const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
		scene.add(light);
		*/

		/*
		const bg = this.bg = this.addBG();
		scene.add(bg);
		*/

		const cube0 = this.cube0 = this.addRoundedCube(0);
		scene.add(cube0);

		const cube1 = this.cube1 = this.addRoundedCube(1);
		scene.add(cube1);

		const toothbrush = this.toothbrush = this.addToothBrush();
		scene.add(toothbrush);

		const controllers = this.controllers = this.addControllers(renderer, vr, scene);

		this.addListeners();

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize, false);

	}

	addListeners() {
		if (this.vr.mode === VR_MODE.NONE) {
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
		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, cm(1), 500);
		camera.position.set(0, cm(176), cm(20));
		camera.target = new THREE.Vector3(0, cm(156), -cm(60));
		camera.onBeforeRender = (renderer, scene) => {
			if (this.vr.mode === VR_MODE.NONE) {
				// camera.position.z = Math.cos(this.tick * 0.1) * 1;
				camera.target.set(this.mouse.x * cm(40), cm(156) + this.mouse.y * cm(10), -cm(60) + this.mouse.y * cm(10));
				camera.lookAt(camera.target);
			}
		};
		return camera;
	}

	addControllers(renderer, vr, scene) {
		if (vr.mode !== VR_MODE.NONE || TEST_ENABLED) {
			const cube0 = this.cube0;
			const cube1 = this.cube1;
			const controllers = new Controllers(renderer, scene, {
				debug: true
			});
			controllers.on('press', (button) => {
				console.log('vrui.press', button.gamepad.hand, button.index);
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
				console.log('vrui.release', button.gamepad.hand, button.index);
			});
			controllers.on('left', (axis) => {
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					console.log('vrui.left', axis.gamepad.hand, axis.index);
					TweenMax.to(cube0.userData.rotation, 0.3, {
						y: cube0.userData.rotation.y - Math.PI / 2,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('right', (axis) => {
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
					console.log('vrui.right', axis.gamepad.hand, axis.index);
					TweenMax.to(cube0.userData.rotation, 0.3, {
						y: cube0.userData.rotation.y + Math.PI / 2,
						ease: Power2.easeInOut
					});
				}
			});
			controllers.on('up', (axis) => {
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
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
			controllers.on('down', (axis) => {
				if (axis.gamepad.hand === GAMEPAD_HANDS.LEFT) {
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
			controllers.on('axis', (axis) => {
				console.log('vrui.axis', axis.gamepad.hand, axis.index);
				if (axis.gamepad.hand === GAMEPAD_HANDS.RIGHT) {
					const s = Math.max(0.1, Math.min(2, cube1.scale.x + axis.y * 0.1));
					cube1.userData.scale.set(s, s, s);
					cube1.userData.rotation.y += axis.x * 0.2;
				}
			});
			return controllers;
		}
	}

	addCube(index) {
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-00.jpg');
		const geometry = new THREE.BoxGeometry(cm(20), cm(20), cm(20));
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: matcap,
		});
		const mesh = new InteractiveMesh(geometry, material);
		mesh.position.set(index === 0 ? -cm(30) : cm(30), cm(136), -2);
		mesh.userData = {
			scale: new THREE.Vector3(1, 1, 1),
			rotation: new THREE.Vector3(),
			// position: new THREE.Vector3(),
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
		const geometry = new RoundBoxGeometry(cm(20), cm(20), cm(20), cm(4), 1, 1, 1, 3);
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: matcap,
			/*
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide,
			*/
		});
		const mesh = new InteractiveMesh(geometry, material);
		mesh.position.set(index === 0 ? -cm(30) : cm(30), cm(136), -2);
		mesh.userData = {
			scale: new THREE.Vector3(1, 1, 1),
			rotation: new THREE.Vector3(),
		};
		const box = new THREE.BoxHelper(mesh, 0x0000ff);
		this.scene.add(box);
		mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
			mesh.scale.set(mesh.userData.scale.x, mesh.userData.scale.y, mesh.userData.scale.z);
			mesh.rotation.set(mesh.userData.rotation.x, mesh.userData.rotation.y, mesh.userData.rotation.z);
			mesh.userData.rotation.y += (0.01 + 0.01 * index);
			mesh.userData.rotation.x += (0.01 + 0.01 * index);
			box.update();
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

	addToothBrush() {
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
		const geometry = new RoundBoxGeometry(cm(18), mm(6), cm(1), mm(3), 1, 1, 1, 3);
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: matcap,
			/*
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide,
			*/
		});
		const mesh = new InteractiveMesh(geometry, material);
		mesh.position.set(0, cm(136), -cm(40));
		mesh.name = 'toothbrush';
		mesh.on('grab', (controller) => {
			mesh.freeze();
			const target = controller.parent;
			// target.updateMatrixWorld();
			const position = mesh.position.clone(); // new THREE.Vector3();
			mesh.parent.localToWorld(position);
			target.worldToLocal(position);
			mesh.parent.remove(mesh);
			mesh.position.set(0, 0, 0);
			target.add(mesh);
			console.log('grab', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
			console.log(target.name);
		});
		mesh.on('release', (controller) => {
			const target = this.scene;
			// target.updateMatrixWorld();
			const position = mesh.position.clone(); // new THREE.Vector3();
			mesh.parent.localToWorld(position);
			target.worldToLocal(position);
			mesh.parent.remove(mesh);
			mesh.position.set(position);
			target.add(mesh);
			mesh.unfreeze();
			console.log('release', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
			console.log(target.name);
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
		const box = new THREE.BoxHelper(mesh, 0x0000ff);
		this.scene.add(box);
		/*
		mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
			if (!mesh.freezed) {
				box.update();
			}
		};
		*/
		return mesh;
	}

	addBG() {
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-10.jpg');
		const geometry = new THREE.Geometry();
		const origin = new THREE.Vector3();
		new Array(300).fill().forEach(x => {
			const s = cm(30) + Math.random() * cm(0);
			const h = 3.0 + Math.random() * 3.0;
			const r = 5 + Math.random() * 20;
			const a = Math.PI * 2 * Math.random();
			// const cubeGeometry = new THREE.BoxGeometry(s, h, s);
			const cubeBufferGeometry = new RoundBoxGeometry(s, h, s, cm(4),
				1, 1, 1, 3);
			const cubeGeometry = new THREE.Geometry().fromBufferGeometry(cubeBufferGeometry);
			cubeGeometry.translate(Math.cos(a) * r, h / 2, Math.sin(a) * r);
			cubeGeometry.lookAt(origin);
			geometry.merge(cubeGeometry);
		});
		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		const material = new THREE.MeshMatcapMaterial({
			color: 0x333333,
			matcap: matcap,
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
				const hit = InteractiveMesh.hittest(raycaster, controllers.gamepads.button, controllers.controller);
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
			const scene = this.scene;
			const camera = this.camera;
			camera.onBeforeRender(renderer, scene);
			renderer.render(scene, camera);
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

}

const instance = new Vrui();
instance.animate();
