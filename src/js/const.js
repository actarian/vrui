/* jshint esversion: 6 */

export const DEBUG = false;
export const TEST_ENABLED = false;
export const BOUNDING_BOX = false;
export const TRIGGER_CUBES = false;
export const ROOM_RADIUS = 200;
export const PANEL_RADIUS = 100;
export const POINT_RADIUS = 99;
export const POINTER_RADIUS = 98;
export const ORIGIN = new THREE.Vector3();

export function cm(value) {
	return value / 100;
}

export function mm(value) {
	return value / 1000;
}

export function deg(value) {
	return Math.PI / 180 * value;
}

export function addCube(parent) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	parent.add(cube);
	return cube;
}

THREE.Euler.prototype.add = function(euler) {
	this.set(this.x + euler.x, this.y + euler.y, this.z + euler.z, this.order);
	return this;
};
