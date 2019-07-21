import { cm } from '../const';
import Emittable from '../interactive/emittable';

export default class Physics extends Emittable {

	constructor() {
		super();
		// this.bodies = [];
		this.meshes = [];
		Ammo().then(() => {
			this.linearVelocity = new Ammo.btVector3(0, 0, 0);
			this.angularVelocity = new Ammo.btVector3(0, 0, 0);
			this.transform = new Ammo.btTransform();
			this.world = this.addWorld();
			this.floor = this.addFloor();
			// console.log('Ammo');
			// this.emit('init', this);
		});
	}

	addWorld() {
		const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		const overlappingPairCache = new Ammo.btDbvtBroadphase();
		const solver = new Ammo.btSequentialImpulseConstraintSolver();
		const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		world.setGravity(new Ammo.btVector3(0, -1, 0));
		return world;
	}

	addFloor() {
		const floor = new THREE.Group();
		floor.position.y = cm(-20);
		this.addBox(floor, new THREE.Vector3(10, cm(40), 10));
		return floor;
	}

	update(delta) {
		const transform = this.transform;
		const world = this.world;
		world.stepSimulation(delta, 10);
		const meshes = this.meshes;
		for (let i = 0; i < meshes.length; i++) {
			const mesh = meshes[i];
			if (!mesh.freezed) {
				const body = mesh.userData.body;
				const state = body.getMotionState();
				if (state) {
					state.getWorldTransform(transform);
					const p = transform.getOrigin();
					const q = transform.getRotation();
					mesh.position.set(p.x(), p.y(), p.z());
					mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
					if (mesh.userData.respawn) {
						mesh.userData.respawn();
					}
				}
			}
		}
	}

	velocity(controller) {
		if (controller) {
			this.linearVelocity.setX(controller.linearVelocity.x * 10);
			this.linearVelocity.setY(controller.linearVelocity.y * 10);
			this.linearVelocity.setZ(controller.linearVelocity.z * 10);
			this.angularVelocity.setX(controller.angularVelocity.x * 10);
			this.angularVelocity.setY(controller.angularVelocity.y * 10);
			this.angularVelocity.setZ(controller.angularVelocity.z * 10);
			// console.log(controller.linearVelocity.x, controller.linearVelocity.y, controller.angularVelocity.x, controller.angularVelocity.y);
		}
	}

	remove(mesh) {
		const index = this.meshes.indexOf(mesh);
		if (index !== -1) {
			this.meshes.splice(index, 1);
			const body = mesh.userData.body;
			if (body) {
				this.world.removeRigidBody(body);
			}
		}
	}

	addBox(mesh, size, mass = 0, linearVelocity = null, angularVelocity = null) {
		const position = mesh.position;
		const quaternion = mesh.quaternion;
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		const state = new Ammo.btDefaultMotionState(transform);
		const shape = new Ammo.btBoxShape(new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5));
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
		this.world.addRigidBody(body);
		mesh.userData.body = body;
		this.meshes.push(mesh);
		return body;
	}

	addSphere(mesh, radius, mass = 1, linearVelocity = null, angularVelocity = null) {
		const position = mesh.position;
		const quaternion = mesh.quaternion;
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		const state = new Ammo.btDefaultMotionState(transform);
		const sphere = new Ammo.btSphereShape(radius);
		sphere.setMargin(0.05);
		const inertia = new Ammo.btVector3(0, 0, 0);
		sphere.calculateLocalInertia(mass, inertia);
		const info = new Ammo.btRigidBodyConstructionInfo(mass, state, sphere, inertia);
		const body = new Ammo.btRigidBody(info);
		if (linearVelocity) {
			body.setLinearVelocity(linearVelocity);
		}
		if (angularVelocity) {
			body.setAngularVelocity(angularVelocity);
		}
		this.world.addRigidBody(body);
		mesh.userData.body = body;
		this.meshes.push(mesh);
		return body;
	}

}
