/* jshint esversion: 6 */

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BOUNDING_BOX, cm, DEBUG, deg, mm, TEST_ENABLED, TRIGGER_CUBES } from './const';
import RoundBoxGeometry from './geometries/round-box.geometry';
import FreezableGroup from './interactive/freezable.group';
import FreezableMesh from './interactive/freezable.mesh';
import GrabbableGroup from './interactive/grabbable.group';
import InteractiveMesh from './interactive/interactive.mesh';
import Materials from './materials/materials';
// import Physics from './physics/physics';
import PhysicsWorker from './physics/physics.worker';
import Controllers from './vr/controllers';
import { GAMEPAD_HANDS } from './vr/gamepads';
import { VR, VR_MODE } from './vr/vr';

class Vrui {

	constructor() {
		this.tick = 0;
		this.mouse = { x: 0, y: 0 };
		this.clock = new THREE.Clock();
		this.linearVelocity = new THREE.Vector3();
		this.angularVelocity = new THREE.Vector3();
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
		renderer.setClearColor(0xdfdcd5, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.vr.enabled = true;
		container.appendChild(renderer.domElement);

		const vr = this.vr = new VR(renderer, {
			referenceSpaceType: 'local'
		});
		vr.on('error', (error) => {
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

		if (false) {
			const light = new THREE.HemisphereLight(0xffffff, 0x330000, 1.2);
			scene.add(light);
		}

		const controllers = this.controllers = this.addControllers(renderer, vr, scene);

		this.addListeners();

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize, false);

		// const physics = this.physics = new Physics();
		const physics = this.physics = new PhysicsWorker();
		const floor = this.floor = this.addFloor();
		/*
		physics.on('init', () => {
			console.log('init');
			this.addMeshes();
		});
		*/
		setTimeout(() => {
			// const materials = this.materials = this.addMaterials(scene.background);
			const materials = this.materials = new Materials(scene.background);
			/*
			const bg = this.bg = this.addBG();
			scene.add(bg);
			*/
			this.addMeshes();
		}, 1000);

	}

	addFloor() {
		if (this.physics) {
			const floor = new THREE.Group();
			floor.position.y = -1;
			this.physics.addBox(floor, new THREE.Vector3(10, 1, 10));
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
		if (TRIGGER_CUBES) {
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
				camera.target.set(this.mouse.x * cm(40), cm(156) + this.mouse.y * cm(20), -cm(60) + this.mouse.y * cm(20));
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
				debug: DEBUG
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
				if (button.index === 3) {
					this.toothbrush.onRespawn();
				}
			});
			if (TRIGGER_CUBES) {
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
			}
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
		mesh.position.set(index === 0 ? -cm(30) : cm(30), cm(117), -2);
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
		mesh.position.set(index === 0 ? -cm(30) : cm(30), cm(117), -2);
		mesh.userData = {
			scale: new THREE.Vector3(1, 1, 1),
			rotation: new THREE.Vector3(),
		};
		let box;
		if (BOUNDING_BOX) {
			box = new THREE.BoxHelper(mesh, 0x0000ff);
			this.scene.add(box);
		}
		mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
			mesh.scale.set(mesh.userData.scale.x, mesh.userData.scale.y, mesh.userData.scale.z);
			mesh.rotation.set(mesh.userData.rotation.x, mesh.userData.rotation.y, mesh.userData.rotation.z);
			mesh.userData.rotation.y += (0.01 + 0.01 * index);
			mesh.userData.rotation.x += (0.01 + 0.01 * index);
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
		const geometry = new THREE.PlaneGeometry(cm(200), cm(200), 2, 2);
		// geometry.rotateX(Math.PI / 2);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture,
			transparent: true,
			// side: THREE.DoubleSide,
		});
		const mesh = new InteractiveMesh(geometry, material);
		mesh.position.set(0, cm(200), -6);
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
		const size = new THREE.Vector3(cm(40), mm(10), cm(20));
		const geometry = new RoundBoxGeometry(size.x, size.y, size.z, mm(5), 1, 1, 1, 5);
		const mesh = new THREE.Mesh(geometry, this.materials.white);
		mesh.position.set(0, cm(116), cm(-60));
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
			roughness: 0.05,
			/*
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide,
			*/
		});
		const group = new THREE.Group();
		group.position.set(0, cm(-20), cm(-40));
		const path = `models/stand/stand.fbx`;
		const loader = new THREE.FBXLoader();
		loader.load(path, (object) => {
			object.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material;
					child.geometry.rotateX(child.rotation.x);
					child.geometry.rotateY(child.rotation.y);
					child.geometry.rotateZ(child.rotation.z);
					child.rotation.set(0, 0, 0);
				}
			});
			group.add(object);
		}, (xhr) => {
			const progress = xhr.loaded / xhr.total;
		}, (error) => {
			console.log(`model not found ${path}`);
		});
		return group;
	}

	addToothBrush() {
		const mesh = new GrabbableGroup();
		mesh.defaultY = this.stand.position.y + cm(50);
		mesh.position.set(0, mesh.defaultY, cm(-60));
		mesh.rotation.set(0, 0, deg(10));
		const loader = new THREE.FBXLoader(); // new THREE.OBJLoader();
		loader.load(`models/toothbrush/professional-27.fbx`, (object) => {
				object.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						// child.geometry.scale(2.54, 2.54, 2.54);
						switch (child.name) {
							case 'body-primary':
							case 'bubble':
								// child.geometry.computeFaceNormals();
								// child.geometry.computeVertexNormals(true);
								child.material = this.materials.bodyPrimaryClear;
								mesh.body = child;
								break;
							case 'body-secondary':
								// child.geometry.computeFaceNormals();
								// child.geometry.computeVertexNormals(true);
								child.material = this.materials.bodySecondary;
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
					}
					// this.bodies.push(mesh);
				}
			},
			(xhr) => {
				// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			(error) => {
				console.log('An error happened', error);
			});
		mesh.name = 'toothbrush';
		mesh.on('grab', (controller) => {
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
			if (controller.gamepad.hand === GAMEPAD_HANDS.LEFT) {
				mesh.position.set(cm(1), cm(2), cm(0));
				mesh.rotation.set(deg(180), deg(0), deg(115));
			} else {
				mesh.position.set(cm(-1), cm(3), cm(-1));
				mesh.rotation.set(0, deg(10), deg(-60));
			}
			target.add(mesh);
			TweenMax.to(controller.material, 0.4, {
				opacity: 0.0,
				ease: Power2.easeInOut,
			});
		});
		mesh.on('release', (controller) => {
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
				mesh.position.set(0, mesh.defaultY, cm(-60));
				mesh.rotation.set(0, 0, deg(10));
				this.scene.add(mesh);
				if (this.physics) {
					this.physics.addBox(mesh, mesh.userData.size, 1);
					// this.bodies.push(mesh);
				}
			}, 1000);
		};
		mesh.userData.respawn = (data) => {
			if (mesh.position.y < cm(10)) {
				// const linearVelocity = mesh.userData.body.getLinearVelocity();
				// if (linearVelocity.length() < 0.03) {
				if (data && data.speed < 0.03) {
					mesh.onRespawn();
				}
			}
		};
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
		return mesh;
	}

	addToothBrush__() {
		// const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
		const matcap = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
		const geometry = new RoundBoxGeometry(cm(18), mm(6), cm(1), mm(3), 1, 1, 1, 3);
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: matcap,
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide,

		});
		const mesh = new InteractiveMesh(geometry, material);
		mesh.position.set(0, cm(117), cm(-60));
		mesh.name = 'toothbrush';

		const bristlesGeometry = new RoundBoxGeometry(cm(2), mm(12), cm(1), mm(2), 1, 1, 1, 3);
		const bristlesMesh = new THREE.Mesh(bristlesGeometry, material);
		bristlesMesh.position.set(-cm(8), mm(9), 0);
		mesh.add(bristlesMesh);

		mesh.on('grab', (controller) => {
			mesh.userData.speed = 0;
			mesh.falling = false;
			mesh.freeze();
			const target = controller.parent;
			// target.updateMatrixWorld();
			const position = mesh.position.clone(); // new THREE.Vector3();
			mesh.parent.localToWorld(position);
			target.worldToLocal(position);
			mesh.parent.remove(mesh);
			// mesh.position.set(position.x, position.y, position.z);
			if (controller.gamepad.hand === GAMEPAD_HANDS.LEFT) {
				mesh.position.set(cm(1), cm(2), cm(0));
				mesh.rotation.set(deg(180), deg(0), deg(115));
			} else {
				mesh.position.set(cm(-1), cm(3), cm(-1));
				mesh.rotation.set(0, deg(10), deg(-60));
			}
			target.add(mesh);
			TweenMax.to(controller.material, 0.4, {
				opacity: 0.0,
				ease: Power2.easeInOut,
			});
			// console.log('grab', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
			// console.log(target.name);
		});
		mesh.on('release', (controller) => {
			const target = this.scene;
			// target.updateMatrixWorld();
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
			});
			// console.log('release', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2));
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
				mesh.position.set(0, cm(117), cm(-60));
				mesh.rotation.set(0, 0, 0);
				this.scene.add(mesh);
				// console.log('onRespawn.scened');
			}, 1000);
			// console.log('onRespawn');
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
		return mesh;
	}

	checkCameraPosition__() {
		const tick = this.tick;
		const camera = this.camera;
		const controllers = this.controllers;
		const stand = this.stand;
		const toothbrush = this.toothbrush;
		const y = camera.position.y;
		if (y < 1.2 && stand.position.y === cm(116)) {
			stand.position.y = y - cm(40);
			toothbrush.defaultY = stand.position.y + cm(50);
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
				GrabbableGroup.grabtest(controllers);
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
			FreezableMesh.update(renderer, scene, camera, delta, time, tick);
			FreezableGroup.update(renderer, scene, camera, delta, time, tick);
			if (this.controllers) {
				this.controllers.update();
				this.updateRaycaster();
				// this.checkCameraPosition__();
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
