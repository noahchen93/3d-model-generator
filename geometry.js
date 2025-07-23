import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { CSG } from 'three/addons/libs/CSG.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

export function generateGeometry(params) {
    switch (params.style) {
        case 'functional-vase': return createVaseGeometry(params);
        case 'bio-chess': return createChessPieceGeometry(params);
        case 'organic-noise': return createOrganicNoiseGeometry(params);
        case 'wild-tube': return createWildTubeGeometry(params);
        case 'random-convex': return createConvexHullGeometry(params);
        default: return new THREE.BoxGeometry(50, 50, 50);
    }
}
