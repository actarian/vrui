const Module = { TOTAL_MEMORY: 256 * 1024 * 1024 };

importScripts('./ammo.wasm.js');

const SIZE = { x: 1, y: 1, z: 1 };
const VECTOR = { x: 0, y: 0, z: 0 };
const QUATERNION = { x: 0, y: 0, z: 0, w: 0 };
const NUMRANGE = [];
const OBJECTS = [];
const BODIES = [];
let NUM = 0;

Ammo().then((Ammo) => {

	// Bullet-interfacing code
	const configuration = new Ammo.btDefaultCollisionConfiguration();
	const dispatcher = new Ammo.btCollisionDispatcher(configuration);
	const cache = new Ammo.btDbvtBroadphase();
	const solver = new Ammo.btSequentialImpulseConstraintSolver();
	const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, cache, solver, configuration);
	world.setGravity(new Ammo.btVector3(0, -10, 0));

	function addBox(data) {
		const mass = data.mass || 0;
		const size = data.size || SIZE;
		const position = data.position || VECTOR;
		const quaternion = data.quaternion || QUATERNION;
		const linearVelocity = data.linearVelocity;
		const angularVelocity = data.angularVelocity;
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		const state = new Ammo.btDefaultMotionState(transform);
		const shape = new Ammo.btBoxShape(new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5));
		// const shape = new Ammo.btSphereShape(radius);
		shape.setMargin(0.05);
		const inertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(mass, inertia);
		const info = new Ammo.btRigidBodyConstructionInfo(mass, state, shape, inertia);
		const body = new Ammo.btRigidBody(info);
		if (linearVelocity) {
			body.setLinearVelocity(linearVelocity);
		}
		if (angularVelocity) {
			body.setAngularVelocity(angularVelocity);
		}
		world.addRigidBody(body);
		BODIES.push(body);
		// data.body = body;
		// OBJECTS.push(data);
		return body;
	}

	function removeBody(data) {

	}

	/*
	const groundBody = addBox({
		mass: 0,
		size: { x: 50, y: 50, z: 50 },
		position: { x: 0, y: -56, z: 0 }
	});
	*/

	const transform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking

	function readBulletObject(i, object) {
		const body = BODIES[i];
		body.getMotionState().getWorldTransform(transform);
		const origin = transform.getOrigin();
		object[0] = origin.x();
		object[1] = origin.y();
		object[2] = origin.z();
		const rotation = transform.getRotation();
		object[3] = rotation.x();
		object[4] = rotation.y();
		object[5] = rotation.z();
		object[6] = rotation.w();
		object.active = body.isActive();
	}

	/*
	const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));

	function resetPositions() {
		const side = Math.ceil(Math.pow(NUM, 1 / 3));
		let i = 1;
		for (let x = 0; x < side; x++) {
			for (let y = 0; y < side; y++) {
				for (let z = 0; z < side; z++) {
					if (i == BODIES.length) break;
					const body = BODIES[i++];
					const origin = body.getWorldTransform().getOrigin();
					origin.setX((x - side / 2) * (2.2 + Math.random()));
					origin.setY(y * (3 + Math.random()));
					origin.setZ((z - side / 2) * (2.2 + Math.random()) - side - 3);
					body.activate();
					const rotation = body.getWorldTransform().getRotation();
					rotation.setX(1);
					rotation.setY(0);
					rotation.setZ(0);
					rotation.setW(1);
				}
			}
		}
	}
	function startUp() {
		NUMRANGE.forEach(function(i) {
			const startTransform = new Ammo.btTransform();
			startTransform.setIdentity();
			const mass = 1;
			const inertia = new Ammo.btVector3(0, 0, 0);
			boxShape.calculateLocalInertia(mass, inertia);
			const state = new Ammo.btDefaultMotionState(startTransform);
			const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, state, boxShape, inertia);
			const body = new Ammo.btRigidBody(rbInfo);
			world.addRigidBody(body);
			BODIES.push(body);
		});
		resetPositions();
	}

	let nextTimeToRestart = 0;
	function timeToRestart() { // restart if at least one is inactive - the scene is starting to get boring
		if (nextTimeToRestart) {
			if (Date.now() >= nextTimeToRestart) {
				nextTimeToRestart = 0;
				return true;
			}
			return false;
		}
		for (let i = 1; i <= NUM; i++) {
			const body = BODIES[i];
			if (!body.isActive()) {
				nextTimeToRestart = Date.now() + 1000; // add another second after first is inactive
				break;
			}
		}
		return false;
	}
	*/

	let meanDt = 0,
		meanDt2 = 0,
		frame = 1;

	function simulate(dt) {
		dt = dt || 1;

		world.stepSimulation(dt, 2);

		let alpha;
		if (meanDt > 0) {
			alpha = Math.min(0.1, dt / 1000);
		} else {
			alpha = 0.1; // first run
		}
		meanDt = alpha * dt + (1 - alpha) * meanDt;

		const alpha2 = 1 / frame++;
		meanDt2 = alpha2 * dt + (1 - alpha2) * meanDt2;

		const data = { objects: [], currFPS: Math.round(1000 / meanDt), allFPS: Math.round(1000 / meanDt2) };
		// Read bullet data into JS objects
		for (let i = 0; i < NUM; i++) {
			const object = [];
			readBulletObject(i + 1, object);
			data.objects[i] = object;
		}
		postMessage(data);
		// if (timeToRestart()) resetPositions();
	}

	let interval = null;

	onmessage = function(event) {
		NUM = event.data;
		NUMRANGE.length = 0;
		while (NUMRANGE.length < NUM) NUMRANGE.push(NUMRANGE.length + 1);
		frame = 1;
		meanDt = meanDt2 = 0;
		startUp();
		const last = Date.now();

		function mainLoop() {
			const now = Date.now();
			simulate(now - last);
			last = now;
		}
		if (interval) clearInterval(interval);
		interval = setInterval(mainLoop, 1000 / 60);
	}

});
