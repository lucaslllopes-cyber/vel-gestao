export const MOCK_MAPA = {};

// Helper: Gera lotes em formato de grade retangular (grid)
const addQuadra = (startX, startY, lotesIds, cols, lotW, lotH) => {
  lotesIds.forEach((id, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + (col * lotW);
    const y = startY + (row * lotH);
    
    // Deixa margem interna (gap) para não ficarem grudados visualmente
    const gap = 4;
    
    MOCK_MAPA[id] = {
      cx: x + lotW / 2,
      cy: y + lotH / 2,
      pts: `${x + gap},${y + gap} ${x + lotW - gap},${y + gap} ${x + lotW - gap},${y + lotH - gap} ${x + gap},${y + lotH - gap}`
    };
  });
};

// ── EXPANSÃO INCREMENTAL (Bloco 4): Gerador Procedural Escalável ──
// Em vez de hardcodar 75 polígonos, usamos uma geometria matemática para o Mock local.

// Quadra A: 4 lotes (A-1 a A-4) | 2x2
addQuadra(100, 100, ["A-1", "A-2", "A-3", "A-4"], 2, 180, 100);

// Quadra B: 15 lotes (B-5 a B-19) | 5x3
addQuadra(540, 100, Array.from({length: 15}, (_,i) => `B-${i+5}`), 5, 100, 80);

// Quadra C: 7 lotes (C-20 a C-26) | 4x2
addQuadra(100, 360, Array.from({length: 7}, (_,i) => `C-${i+20}`), 4, 90, 80);

// Quadra D: 17 lotes (D-27 a D-43) | 6x3
addQuadra(540, 400, Array.from({length: 17}, (_,i) => `D-${i+27}`), 6, 80, 80);

// Quadra E: 4 lotes (E-44 a E-47) | 2x2
addQuadra(100, 560, Array.from({length: 4}, (_,i) => `E-${i+44}`), 2, 180, 100);

// Quadra F: 28 lotes (F-48 a F-75) | 7x4
addQuadra(540, 680, Array.from({length: 28}, (_,i) => `F-${i+48}`), 7, 70, 70);
