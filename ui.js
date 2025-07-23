import { UI_DEFINITIONS } from './config.js';

let onParamChange, onBaseShapeChange;

export function setupUI(paramsToLoad, callbacks) {
    onParamChange = callbacks.onParamChange;
    onBaseShapeChange = callbacks.onBaseShapeChange;

    const styleSelector = document.getElementById('styleSelector');
    const subTypeContainer = document.getElementById('subTypeContainer');
    const paramsContainer = document.getElementById('paramsContainer');

    if (paramsToLoad) styleSelector.value = paramsToLoad.style;
    const style = styleSelector.value;
    const definition = UI_DEFINITIONS[style];
    let subTypeHTML = '';
    let paramsHTML = '';

    if (definition.subType) {
        const st = definition.subType;
        subTypeHTML += `<div class="control-row"><label for="${st.id}">${st.label}:</label><select id="${st.id}">`;
        for (const [value, text] of Object.entries(st.options)) subTypeHTML += `<option value="${value}">${text}</option>`;
        subTypeHTML += `</select></div>`;
    }

    if (definition.params) {
        for (const [groupName, groupParams] of Object.entries(definition.params)) {
            paramsHTML += `<div class="control-group"><h3>${groupName}</h3>`;
            for (const [paramId, param] of Object.entries(groupParams)) {
                paramsHTML += `<div class="control-row" id="p_${paramId}_row"><div class="param-slider-label"><span id="p_${paramId}_label">${param.label}</span><span id="p_${paramId}_val">${param.value}</span></div><input type="range" id="p_${paramId}" min="${param.min}" max="${param.max}" value="${param.value}" step="${param.step || 1}"></div>`;
            }
            paramsHTML += `</div>`;
        }
    }

    subTypeContainer.innerHTML = subTypeHTML;
    paramsContainer.innerHTML = paramsHTML + `<div class="control-group"><h3>全局精度</h3><div class="control-row"><div class="param-slider-label"><span>模型精细度</span><span id="p_precision_val">80</span></div><input type="range" id="p_precision" min="10" max="100" value="80" step="1"></div></div>`;
    
    if (paramsToLoad) applyParamsToUI(paramsToLoad);

    document.querySelectorAll('#sidebar input, #sidebar select').forEach(el => {
        el.addEventListener('input', () => {
            const label = document.getElementById(`${el.id}_val`);
            if(label && el.type === 'range') label.textContent = parseFloat(el.value).toFixed(String(el.step).includes('.') ? 2 : 0);
            if (el.id === 'p_baseShape') onBaseShapeChange(); else onParamChange();
        });
    });
    
    if (style === 'storage-container') {
        const shape = document.getElementById('p_baseShape')?.value || 'box';
        document.getElementById('p_dim_z_row').style.display = shape === 'box' ? 'flex' : 'none';
        document.getElementById('p_div_z_row').style.display = shape === 'box' ? 'flex' : 'none';
        document.getElementById('p_dim_x_label').textContent = shape === 'box' ? '长度 (X)' : '直径';
    }

    onParamChange();
}

export function applyParamsToUI(params) {
    document.getElementById('styleSelector').value = params.style;
    for (const key in params) {
        const el = document.getElementById(`p_${key}`) || document.getElementById(key);
        if (el) {
            if (el.type === 'range' || el.type === 'text' || el.type === 'color') {
                el.value = params[key];
            } else if (el.tagName === 'SELECT') {
                el.value = params[key];
            }
            const label = document.getElementById(`p_${key}_val`);
            if(label && el.type === 'range') label.textContent = parseFloat(params[key]).toFixed(String(el.step).includes('.') ? 2 : 0);
        }
    }
}
