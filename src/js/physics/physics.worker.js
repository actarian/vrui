import Emittable from "../interactive/emittable";

export default class PhysicsWorker extends Emittable {

	constructor() {
		super();
		const worker = this.worker = new Worker('worker.wasm.js');
		worker.onmessage = (data) => {
			this.emit('data', data);
		}
		this.emit('init');
	}

	addBox(mesh, size, mass = 0, linearVelocity = null, angularVelocity = null) {
		const data = {
			action: 'addBox',
			id: mesh.id,
			position: mesh.position,
			quaternion: mesh.quaternion,
			size: size,
			mass: mass,
			linearVelocity: linearVelocity,
			angularVelocity: angularVelocity,
		}
		this.worker.postMessage(data);
	}

	remove(mesh) {
		const data = {
			action: 'remove',
			id: mesh.id,
		}
		this.worker.postMessage(data);
	}

	update(delta) {}
}

/*
onmessage = function(event) {
var data = event.data;
if (data.objects.length != NUM) return;
for (var i = 0; i < NUM; i++) {
	var physicsObject = data.objects[i];
	var renderObject = boxes[i];
	renderObject.position[0] = physicsObject[0];
	renderObject.position[1] = physicsObject[1];
	renderObject.position[2] = physicsObject[2];
	quaternion.x = physicsObject[3];
	quaternion.y = physicsObject[4];
	quaternion.z = physicsObject[5];
	quaternion.w = physicsObject[6];
	renderObject.rotation = quaternion.toEuler();
}
currFPS = data.currFPS;
allFPS = data.allFPS;
};

physicsWorker.postMessage(NUM);

}
*/
