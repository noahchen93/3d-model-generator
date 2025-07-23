import * as THREE from 'three';

const sceneObjects = [];
let activeObject = null;

export function getSceneObjects() {
    return sceneObjects;
}

export function getActiveObject() {
    return activeObject;
}

export function setActiveObject(object, scene) {
    if (activeObject) {
        // Optional: Add visual indication for deselection, like changing material
    }
    activeObject = object;
    // Optional: Add visual indication for selection
}

export function addObject(object, scene) {
    sceneObjects.push(object);
    scene.add(object);
    setActiveObject(object, scene);
}

export function removeObject(object, scene) {
    const index = sceneObjects.indexOf(object);
    if (index > -1) {
        sceneObjects.splice(index, 1);
    }
    scene.remove(object);
    if (activeObject === object) {
        activeObject = null;
    }
}

export function clearScene(scene) {
    while(sceneObjects.length > 0) {
        const obj = sceneObjects.pop();
        scene.remove(obj);
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material) obj.material.dispose();
    }
    activeObject = null;
}
