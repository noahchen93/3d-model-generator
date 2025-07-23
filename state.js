export const state = {
    currentParams: {},
    randomSeed: Math.random(),
    activeObject: null,
};

export function updateParams(newParams) {
    state.currentParams = newParams;
}

export function regenerateSeed() {
    state.randomSeed = Math.random();
}

export function setActiveObject(object) {
    state.activeObject = object;
}
