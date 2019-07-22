/* jshint esversion: 6 */

const Module = { TOTAL_MEMORY: 256 * 1024 * 1024 };

importScripts('./ammo.wasm.js');

Ammo().then((Ammo) => {

	const transform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking
	const ITEMS = [];
	const BODIES = [];

	// Bullet-interfacing code
	const configuration = new Ammo.btDefaultCollisionConfiguration();
	const dispatcher = new Ammo.btCollisionDispatcher(configuration);
	const cache = new Ammo.btDbvtBroadphase();
	const solver = new Ammo.btSequentialImpulseConstraintSolver();
	const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, cache, solver, configuration);
	world.setGravity(new Ammo.btVector3(0, -1, 0));

	function remove(data) {
		let body;
		const item = ITEMS.find(x => x.id === data.id);
		const index = ITEMS.indexOf(item);
		if (index !== -1) {
			body = BODIES[index];
			ITEMS.splice(index, 1);
			BODIES.splice(index, 1);
			if (body) {
				world.removeRigidBody(body);
			}
		}
		return body;
	}

	function addBox(data) {
		const mass = data.mass || 0;
		const size = data.size || { x: 1, y: 1, z: 1 };
		const position = data.position || { x: 0, y: 0, z: 0 };
		const quaternion = data.quaternion || { x: 0, y: 0, z: 0, w: 0 };
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
			body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x, linearVelocity.y, linearVelocity.z));
		}
		if (angularVelocity) {
			body.setAngularVelocity(new Ammo.btVector3(angularVelocity.x, angularVelocity.y, angularVelocity.z));
		}
		world.addRigidBody(body);
		ITEMS.push(data);
		BODIES.push(body);
		return body;
	}

	function addSphere(data) {
		const mass = data.mass || 0;
		const radius = data.radius || 1;
		const position = data.position || { x: 0, y: 0, z: 0 };
		const quaternion = data.quaternion || { x: 0, y: 0, z: 0, w: 0 };
		const linearVelocity = data.linearVelocity;
		const angularVelocity = data.angularVelocity;
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		const state = new Ammo.btDefaultMotionState(transform);
		const shape = new Ammo.btSphereShape(radius);
		shape.setMargin(0.05);
		const inertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(mass, inertia);
		const info = new Ammo.btRigidBodyConstructionInfo(mass, state, shape, inertia);
		const body = new Ammo.btRigidBody(info);
		if (linearVelocity) {
			body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x, linearVelocity.y, linearVelocity.z));
		}
		if (angularVelocity) {
			body.setAngularVelocity(new Ammo.btVector3(angularVelocity.x, angularVelocity.y, angularVelocity.z));
		}
		world.addRigidBody(body);
		ITEMS.push(data);
		BODIES.push(body);
		return body;
	}

	function parseActions(event) {
		let body;
		const data = event.data;
		switch (data.action) {
			case 'remove':
				body = remove(data);
				break;
			case 'addBox':
				body = addBox(data);
				break;
			case 'addSphere':
				body = addSphere(data);
				break;
		}
	}

	onmessage = parseActions;

	function stepSimulation(delta) {
		delta = delta || 1;
		world.stepSimulation(delta, 2);
		for (let i = 0; i < ITEMS.length; i++) {
			const item = ITEMS[i];
			const body = BODIES[i];
			body.getMotionState().getWorldTransform(transform);
			const origin = transform.getOrigin();
			item.position.x = origin.x();
			item.position.y = origin.y();
			item.position.z = origin.z();
			const rotation = transform.getRotation();
			item.quaternion.x = rotation.x();
			item.quaternion.y = rotation.y();
			item.quaternion.z = rotation.z();
			item.quaternion.w = rotation.w();
			const velocity = body.getLinearVelocity();
			item.speed = velocity.length();
			item.isActive = body.isActive();
		}
		postMessage(ITEMS);
	}

	function start() {
		let overallFps_ = 0;
		let fps_ = 0;
		let tick = 1;
		let last = Date.now();
		let interval = null;

		function getFPS(delta) {
			const overallStep_ = 1 / tick++;
			overallFps_ = overallStep_ * delta + (1 - overallStep_) * overallFps_;
			const step_ = fps_ > 0 ? Math.min(0.1, delta / 1000) : 0.1; // first run
			fps_ = step_ * delta + (1 - step_) * fps_;
			const fps = Math.round(1000 / fps_);
			const overallFps = Math.round(1000 / overallFps_);
		}

		function loop() {
			const now = Date.now();
			stepSimulation(now - last);
			// getFPS(now - last);
			last = now;
		}

		if (interval) {
			clearInterval(interval);
		}

		interval = setInterval(loop, 1000 / 60);
	}

	start();

});

/*
const groundBody = addBox({
	mass: 0,
	size: { x: 50, y: 50, z: 50 },
	position: { x: 0, y: -56, z: 0 }
});
*/

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
