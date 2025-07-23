import * as THREE from 'three';

export function getConnectorPoints(object) {
    const points = [];
    const geometry = object.geometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    // Add points for each face of the bounding box
    points.push(new THREE.Vector3(box.max.x, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2));
    points.push(new THREE.Vector3(box.min.x, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2));
    points.push(new THREE.Vector3((box.max.x + box.min.x) / 2, box.max.y, (box.max.z + box.min.z) / 2));
    points.push(new THREE.Vector3((box.max.x + box.min.x) / 2, box.min.y, (box.max.z + box.min.z) / 2));
    points.push(new THREE.Vector3((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, box.max.z));
    points.push(new THREE.Vector3((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, box.min.z));

    return points;
}

export function snapObjects(objectA, objectB, pointA, pointB) {
    const worldPointA = objectA.localToWorld(pointA.clone());
    const worldPointB = objectB.localToWorld(pointB.clone());

    const offset = worldPointA.sub(worldPointB);
    objectB.position.add(offset);
}
