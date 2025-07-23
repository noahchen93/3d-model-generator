import * as THREE from 'three';

export function createPegboardGeometry(width, height, holeRadius, holeSpacing) {
    const board = new THREE.BoxGeometry(width, 5, height);
    // We will use CSG for this in the final version, for now, this is a placeholder
    return board;
}

export function createHookGeometry(pegLength, pegRadius, hookRadius) {
    const geometries = [];
    const peg = new THREE.CylinderGeometry(pegRadius, pegRadius, pegLength, 16);
    peg.rotateX(Math.PI / 2);
    peg.translate(0, 0, pegLength/2);
    geometries.push(peg);

    const hook = new THREE.TorusGeometry(hookRadius, pegRadius, 16, 100);
    hook.translate(0, hookRadius, 0);
    geometries.push(hook);

    // This is a placeholder, we will use BufferGeometryUtils.mergeGeometries in the final version
    return peg;
}
