export const UI_DEFINITIONS = {
    'functional-vase': {
        params: {
            '形态': {
                'height': { label: '高度', min: 50, max: 300, value: 180 },
                'width': { label: '宽度', min: 20, max: 100, value: 50 },
                'lip': { label: '瓶口', min: 10, max: 80, value: 40 },
                'complexity': { label: '复杂度', min: 3, max: 10, value: 5 }
            }
        }
    },
    'bio-chess': {
        subType: { id: 'p_chessPiece', label: '棋子类型', options: { 'pawn': '兵', 'rook': '车', 'knight': '马', 'bishop': '象', 'queen': '后', 'king': '王' } },
        params: {
            '生物融合': {
                'noiseStr': { label: '噪声强度', min: 0, max: 15, value: 4, step: 0.1 },
                'spikeThr': { label: '异变阈值', min: 0.5, max: 0.95, value: 0.7, step: 0.01 },
                'spikeStr': { label: '异变强度', min: 0, max: 50, value: 15 }
            }
        }
    },
    'organic-noise': {
        params: {
            '有机噪声': {
                'noiseStrength': { label: '噪声强度', min: 1, max: 80, value: 25 },
                'noiseScale': { label: '噪声粒度', min: 0.01, max: 0.5, value: 0.1, step: 0.01 }
            }
        }
    },
    'wild-tube': {
        params: {
            '脑洞曲线': {
                'pathNodes': { label: '路径节点', min: 3, max: 20, value: 10 },
                'radius': { label: '管道半径', min: 1, max: 50, value: 10 },
                'range': { label: '路径范围', min: 50, max: 500, value: 200 }
            }
        }
    },
    'random-convex': {
        params: {
            '随机凸包': {
                'points': { label: '顶点数量', min: 4, max: 300, value: 50 }
            }
        }
    }
};