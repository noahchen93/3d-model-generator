import { scad_model } from 'https://unpkg.com/openscad@0.0.6/dist/index.js';

let isEngineReady = false;

// This is a placeholder for the engine's initialization.
// The actual library loads asynchronously.
async function initializeEngine() {
    // The library is loaded via the import, so we can consider it ready.
    isEngineReady = true;
    console.log("OpenSCAD engine initialized.");
}

export async function generateScadGeometry(scadCode) {
    if (!isEngineReady) {
        await initializeEngine();
    }

    try {
        const model = await scad_model(scadCode);
        const geometry = model.geometry;
        return geometry;
    } catch (error) {
        console.error("Error generating SCAD geometry:", error);
        throw error;
    }
}
