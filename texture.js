import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function applyTexture(object, imageUrl) {
    const texture = textureLoader.load(imageUrl, () => {
        // The render loop will automatically update the view
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    object.material.map = texture;
    object.material.needsUpdate = true;
}

export function applyDecal(object, imageUrl, position, normal) {
    const decalMaterial = new THREE.MeshPhongMaterial({
        specular: 0x444444,
        map: textureLoader.load(imageUrl),
        shininess: 30,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
    });

    const decalSize = new THREE.Vector3(20, 20, 20);
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), decalMaterial);
    decal.scale.set(20, 20, 20);
    decal.position.copy(position);
    decal.lookAt(position.clone().add(normal));
    object.add(decal);
}
