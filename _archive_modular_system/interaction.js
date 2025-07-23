import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { getSceneObjects, setActiveObject } from './sceneManager.js';

let transformControls;
let camera, renderer, scene;

export function initInteraction(cam, rend, scn, orbitControls) {
    camera = cam;
    renderer = rend;
    scene = scn;

    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value;
    });
    scene.add(transformControls);

    renderer.domElement.addEventListener('click', onCanvasClick, false);
}

function onCanvasClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(getSceneObjects(), true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        setActiveObject(object, scene);
        transformControls.attach(object);
    } else {
        transformControls.detach();
        setActiveObject(null, scene);
    }
}

export function getTransformControls() {
    return transformControls;
}
