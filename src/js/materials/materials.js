/* jshint esversion: 6 */

export default class Materials {

	constructor(texture) {
		/*
		const texture = new THREE.loader().load('img/matcap.jpg');
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: texture,
			transparent: true,
			opacity: 1,
		});
		*/
		// const texture = this.getEnvMap();
		const white = this.white = this.getWhite();
		const bodyPrimaryClear = this.bodyPrimaryClear = this.getBodyPrimaryClear(texture);
		const logoSilver = this.logoSilver = this.getLogoSilver(texture);
		const bodySecondary = this.bodySecondary = this.getBodySecondary(texture);
		const bristlesPrimary = this.bristlesPrimary = this.getBristlesPrimary();
		const bristlesSecondary = this.bristlesSecondary = this.getBristlesSecondary();
	}

	getWhite() {
		let material;
		if (false) {
			const matcap = new THREE.TextureLoader().load('img/matcap/matcap-06.jpg');
			material = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				matcap: matcap,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				roughness: 0.2,
				metalness: 0.2,
			});
		}
		return material;
	}

	getBodyPrimaryClear(texture) {
		let material;
		if (true) {
			texture = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
			material = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				matcap: texture,
				transparent: true,
				opacity: 0.4,
				alphaTest: 0.2,
				side: THREE.DoubleSide,
			});
		} else {
			material = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				envMap: texture,
				transparent: true,
				refractionRatio: 0.6,
				reflectivity: 0.8,
				opacity: 0.25,
				alphaTest: 0.2,
				/*
				refractionRatio: 0.99,
				reflectivity: 0.99,
				opacity: 0.5,
				*/
				side: THREE.DoubleSide,
				// blending: THREE.AdditiveBlending,
			});
		}
		// material.vertexTangents = true;
		return material;
	}

	getBodySecondary(texture) {
		let material;
		if (true) {
			texture = new THREE.TextureLoader().load('img/matcap/matcap-11.png');
			material = new THREE.MeshMatcapMaterial({
				color: 0xe11e26,
				matcap: texture,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0xe11e26,
				// emissive: 0x4f0300,
				roughness: 0.2,
				metalness: 0.2,
				// envMap: texture,
				// envMapIntensity: 0.4,
				// The refractionRatio must have value in the range 0 to 1.
				// The default value, very close to 1, give almost invisible glass.
				// refractionRatio: 0,
				// side: THREE.DoubleSide,
			});
		}
		return material;
	}

	getBristlesPrimary(texture) {
		let material;
		if (true) {
			texture = new THREE.TextureLoader().load('img/matcap/matcap-02.jpg');
			material = new THREE.MeshMatcapMaterial({
				color: 0x024c99,
				matcap: texture,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0x024c99, // 0x1f45c0,
				// emissive: 0x333333,
				// map: lightMap,
				// normalMap: lightMap,
				// metalnessMap: lightMap,
				roughness: 0.9,
				metalness: 0.0,
			});
		}
		return material;
	}

	getBristlesSecondary(texture) {
		// const lightMap = new THREE.TextureLoader().load('img/scalare-33-bristlesSecondary-lightmap.jpg');
		let material;
		if (true) {
			texture = new THREE.TextureLoader().load('img/matcap/matcap-02.jpg');
			material = new THREE.MeshMatcapMaterial({
				color: 0x15b29a,
				matcap: texture,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0x15b29a, // 0x1aac4e,
				// emissive: 0x333333,
				// map: lightMap,
				// normalMap: lightMap,
				// metalnessMap: lightMap,
				roughness: 0.9,
				metalness: 0.0,
			});
		}
		return material;
	}

	getLogoSilver() {
		const texture = new THREE.TextureLoader().load('img/models/toothbrush-logo.png');
		let material;
		if (true) {
			const matcap = new THREE.TextureLoader().load('img/matcap/matcap-00.jpg');
			material = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				map: texture,
				matcap: matcap,
				transparent: true,
				alphaTest: 0.1,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				map: texture,
				transparent: true,
				roughness: 0.15,
				metalness: 0.9,
				// envMap: texture,
				// side: THREE.DoubleSide,
				//
				// opacity: 1,
				// alphaTest: 0.1,
			});
		}
		return material;
	}

}
