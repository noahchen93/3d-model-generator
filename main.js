import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { state, updateParams, regenerateSeed, setActiveObject } from './state.js';
import { generateGeometry } from './geometry.js';
import { generateScadGeometry } from './openscad-engine.js';
import { getOrganizerUI, generateOrganizerScadCode } from './organizer-ui.js';

// ... (rest of the file is the same, with the following changes)

function setupUIAndGenerate(paramsToLoad = null) {
    // ... (existing setup logic)

    if (style === 'desktop-organizer') {
        paramsContainer.innerHTML = getOrganizerUI();
    }

    // ... (rest of the setup logic)
}

async function generateModel() {
    // ... (existing model generation logic)

    try {
        if (params.styleSelector === 'desktop-organizer') {
            const scadCode = generateOrganizerScadCode(params);
            geometry = await generateScadGeometry(scadCode);
        } else {
            geometry = generateGeometry(params);
        }

        // ... (rest of the model generation logic)
    } catch (e) {
        // ... (error handling)
    }
}
import { setupUI, applyParamsToUI } from './ui.js';

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const viewport = document.getElementById('viewport');
    camera = new THREE.PerspectiveCamera(75, viewport.clientWidth / viewport.clientHeight, 0.1, 5000);
    camera.position.set(0, 150, 300);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    viewport.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(0.8, 1, 0.5);
    scene.add(directionalLight);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    document.getElementById('generateBtn').addEventListener('click', () => { regenerateSeed(); generateModel(); });
    document.getElementById('saveDesignBtn').addEventListener('click', saveDesign);
    document.getElementById('loadDesignBtn').addEventListener('click', () => document.getElementById('loadDesignInput').click());
    document.getElementById('loadDesignInput').addEventListener('change', loadDesign);
    document.getElementById('downloadBtn').addEventListener('click', downloadSTL);
    window.addEventListener('resize', onWindowResize);
    document.getElementById('styleSelector').addEventListener('change', () => setupUI(null, getUICallbacks()));

    document.getElementById('colorPicker').addEventListener('input', updateMaterial);
    document.getElementById('metalnessSlider').addEventListener('input', (e) => { document.getElementById('metalnessValue').textContent = parseFloat(e.target.value).toFixed(2); updateMaterial(); });
    document.getElementById('roughnessSlider').addEventListener('input', (e) => { document.getElementById('roughnessValue').textContent = parseFloat(e.target.value).toFixed(2); updateMaterial(); });

    setupUI(null, getUICallbacks());
    animate();
}

function getUICallbacks() {
    return {
        onParamChange: generateModel,
        onBaseShapeChange: () => setupUI(getParams(), getUICallbacks())
    };
}

export function getParams() {
    const params = { seed: state.randomSeed };
    document.querySelectorAll('#sidebar input, #sidebar select').forEach(el => {
        if (el.offsetParent !== null || el.type === 'hidden') {
            const key = el.id.replace(/^p_/, '');
            params[key] = el.tagName === 'SELECT' ? el.value : (el.type === 'color' ? el.value : parseFloat(el.value));
        }
    });
    updateParams(params);
    return params;
}

export function generateModel() {
    if (state.activeObject) { scene.remove(state.activeObject); state.activeObject.geometry.dispose(); if(state.activeObject.material) state.activeObject.material.dispose(); }
    const params = getParams();
    let geometry;
    try {
        geometry = generateGeometry(params);
        const material = new THREE.MeshStandardMaterial({ color: params.colorPicker, metalness: params.metalnessSlider, roughness: params.roughnessSlider, side: THREE.DoubleSide });
        setActiveObject(new THREE.Mesh(geometry, material));
        scene.add(state.activeObject);
    } catch (e) {
        console.error("Geometry generation failed:", e);
        setActiveObject(new THREE.Mesh(new THREE.BoxGeometry(50,50,50), new THREE.MeshStandardMaterial({color: 0xff0000})));
        scene.add(state.activeObject);
    }
}

function updateMaterial() {
    if (!state.activeObject || !state.activeObject.material) return;
    const params = getParams();
    state.activeObject.material.color.set(params.colorPicker);
    state.activeObject.material.metalness = params.metalnessSlider;
    state.activeObject.material.roughness = params.roughnessSlider;
}

export function saveDesign() {
    const design = getParams();
    const jsonString = JSON.stringify(design, null, 2);
    const blob = new Blob([jsonString], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-3d-design-${design.style}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function loadDesign(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const params = JSON.parse(e.target.result);
            applyParamsToUI(params);
            setupUI(params, getUICallbacks());
        } catch (err) {
            alert("加载设计文件失败！文件格式可能已损坏。\n" + err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function downloadSTL() {
    if (!state.activeObject) { alert("没有模型可供下载。"); return; }
    const exporter = new STLExporter();
    const result = exporter.parse(state.activeObject, { binary: true });
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gemini-3d-design-${getParams().style}-${Date.now()}.stl`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function onWindowResize() {
    const viewport = document.getElementById('viewport');
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
}

function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }

init();