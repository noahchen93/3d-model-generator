export function getOrganizerUI() {
    return `
        <div class="control-group"><h3>容器尺寸</h3>
            <div class="control-row"><div class="param-slider-label"><span>长度 (X)</span><span id="p_length_val">100</span></div><input type="range" id="p_length" min="20" max="300" value="100" step="1"></div>
            <div class="control-row"><div class="param-slider-label"><span>宽度 (Y)</span><span id="p_width_val">100</span></div><input type="range" id="p_width" min="20" max="300" value="100" step="1"></div>
            <div class="control-row"><div class="param-slider-label"><span>高度 (Z)</span><span id="p_height_val">50</span></div><input type="range" id="p_height" min="10" max="100" value="50" step="1"></div>
        </div>
        <div class="control-group"><h3>结构参数</h3>
            <div class="control-row"><div class="param-slider-label"><span>壁厚</span><span id="p_wall_val">3</span></div><input type="range" id="p_wall" min="1" max="20" value="3" step="0.5"></div>
            <div class="control-row"><div class="param-slider-label"><span>X向隔断</span><span id="p_divX_val">1</span></div><input type="range" id="p_divX" min="0" max="10" value="1" step="1"></div>
            <div class="control-row"><div class="param-slider-label"><span>Y向隔断</span><span id="p_divY_val">1</span></div><input type="range" id="p_divY" min="0" max="10" value="1" step="1"></div>
        </div>
    `;
}

export function generateOrganizerScadCode(params) {
    const { length, width, height, wall, divX, divY } = params;

    let scad = `
        difference() {
            cube([${length}, ${width}, ${height}]);
            translate([${wall}, ${wall}, 0]) cube([${length} - ${wall * 2}, ${width} - ${wall * 2}, ${height}]);
        }
    `;

    if (divX > 0) {
        const spacingX = (width - wall) / (divX + 1);
        for (let i = 1; i <= divX; i++) {
            scad += `
                translate([${wall}, ${i * spacingX}, 0]) cube([${length} - ${wall * 2}, ${wall}, ${height}]);
            `;
        }
    }

    if (divY > 0) {
        const spacingY = (length - wall) / (divY + 1);
        for (let i = 1; i <= divY; i++) {
            scad += `
                translate([${i * spacingY}, ${wall}, 0]) cube([${wall}, ${width} - ${wall * 2}, ${height}]);
            `;
        }
    }

    return scad;
}
