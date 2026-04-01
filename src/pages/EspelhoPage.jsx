// ─────────────────────────────────────────────────────────────────
// ESPELHO PAGE — visualização real do loteamento no mapa SVG
//
// STATUS: placeholder — implementação futura
//
// Quando implementado, este componente vai:
//   1. Renderizar a imagem da prancha como fundo SVG
//   2. Sobrepor polígonos coloridos por status usando lot.mapa.pts
//   3. Reutilizar <PainelLote modo="flutuante" /> ao clicar em um lote
//   4. Suportar zoom/pan sobre o SVG
//
// Para calibrar os polígonos:
//   - Cada lote tem lot.mapa = { cx, cy, pts } ou null
//   - cx/cy: centro do lote no canvas SVG
//   - pts: string "x1,y1 x2,y2 x3,y3 x4,y4" (pontos do polígono)
//   - Lotes com mapa:null simplesmente não aparecem
// ─────────────────────────────────────────────────────────────────

import { SC } from "../data/constants";
import { MAPA_TERRA_VISTA } from "../data/terravista";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Constantes locais de estilo para as áreas base da planta (Tons Naturais/Premium)
const ESTILOS_AREAS = {
  verde: { fill: "#4ADE80", stroke: "#22C55E", opacidade: 0.45 },
  lazer: { fill: "#38BDF8", stroke: "#0EA5E9", opacidade: 0.45 },
  praca: { fill: "#FBBF24", stroke: "#F59E0B", opacidade: 0.45 },
  reservatorio: { fill: "#60A5FA", stroke: "#3B82F6", opacidade: 0.45 },
};

// Encontra o centro geográfico aproximado de um polígono via sua bounding box
const getAreaCenter = (ptsStr) => {
  const pts = ptsStr.trim().split(/[\s,]+/).map(Number);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    if (pts[i] < minX) minX = pts[i];
    if (pts[i] > maxX) maxX = pts[i];
    if (pts[i + 1] < minY) minY = pts[i + 1];
    if (pts[i + 1] > maxY) maxY = pts[i + 1];
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
};

// Encontra o "topo direito" interior para padronizar os indicadores evitando randomização visual
const getIndicatorPos = (cx, cy, ptsStr) => {
  const pts = ptsStr.trim().split(/[\s,]+/).map(Number);
  let bestX = pts[0], bestY = pts[1];
  let maxScore = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    const x = pts[i];
    const y = pts[i + 1];
    const score = x - y; // maior x e menor y representam top-right no canvas SVG
    if (score > maxScore) {
      maxScore = score;
      bestX = x;
      bestY = y;
    }
  }
  // movemos 25% em direção ao centro para não encostar rigidamente na borda
  const t = 0.25;
  return { x: bestX + (cx - bestX) * t, y: bestY + (cy - bestY) * t };
};

export function EspelhoPage({ lots, filt, sel, setSel }) {
  const geometria = MAPA_TERRA_VISTA.lotes;
  const viewBox = MAPA_TERRA_VISTA.viewBox;
  const ruas = MAPA_TERRA_VISTA.ruas || [];
  const areas = MAPA_TERRA_VISTA.areas || [];

  // Lotes mapeados contidos no mapa SVG definitivo
  const lotesMapeados = lots.filter(l => geometria[l.id]);

  return (
    <div style={{ flex: 1, background: "#F5F7F2", position: "relative", display: "flex", flexDirection: "column", padding: "16px", minHeight: 0 }}>
      
      {/* Header interno do Espelho */}
      <div className="espelho-header" style={{ marginBottom: "16px", paddingLeft: "4px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Planta Geral</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{lotesMapeados.length} lotes mapeados na visualização atual</div>
      </div>

      <style>{`
        .lote-group .status-indicator {
          opacity: 0.55;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .lote-group:hover .status-indicator {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .espelho-container { padding: 8px !important; }
          .espelho-svg-wrapper { padding: 4px !important; }
        }
      `}</style>

      {/* Módulo Estilizado do Mapa (Card Component) */}
      <div className="espelho-container" style={{ 
        flex: 1, 
        background: "#FFFFFF", 
        borderRadius: "12px", 
        border: "1px solid #E5E7EB", 
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 4px 10px -5px rgba(0,0,0,0.02)", 
        position: "relative", 
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Recipiente que restringe o pan/zoom dentro do padding */}
        <div className="espelho-svg-wrapper" style={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: "8px", background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
          <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={6}
        centerOnInit={true}
        centerZoomedOut={true}
        doubleClick={{ step: 0.5 }}
        pinch={{ step: 5 }}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent 
          wrapperStyle={{ width: "100%", height: "100%", touchAction: "none" }}
          contentStyle={{ width: "100%", height: "100%", touchAction: "none" }}
        >
          <svg width="100%" height="100%" viewBox={viewBox} style={{ cursor: "grab", display: "block" }}>
        
        {/* Construção Base 1: Áreas Especiais (Mais ao fundo) */}
        {areas.map((area, idx) => {
          const estilo = ESTILOS_AREAS[area.tipo] || ESTILOS_AREAS.verde;
          const center = getAreaCenter(area.pts);
          let label = "";
          if (area.tipo === "verde") label = "Área Verde";
          else if (area.tipo === "lazer") label = "Área de Lazer";
          else if (area.tipo === "praca") label = "Praça";
          else if (area.tipo === "reservatorio") label = "Reservatório";

          return (
            <g key={`area-${idx}`}>
              <polygon
                points={area.pts}
                fill={estilo.fill}
                stroke={estilo.stroke}
                strokeWidth="0.5"
                style={{
                  opacity: estilo.opacidade,
                  pointerEvents: "none",
                }}
              />
              {/* O Label de Identificação Sutil */}
              {label && (
                <text
                  x={center.x}
                  y={center.y}
                  fill="#9CA3AF"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  paintOrder="stroke fill"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fontSize="2.8"
                  fontWeight="500"
                  opacity="0.8"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        {/* Construção Base 2: Sistema Viário (Estilo planta urbana claro c/ borda unificada) */}
        <g style={{ opacity: 0.9, pointerEvents: "none" }}>
          {/* Camada 1: Todas as Bordas (Isso garante que ruas não pintem bordas em cima de outras ruas ao cruzar) */}
          {ruas.map((rua, idx) => (
            <polyline
              key={`rua-borda-${idx}`}
              points={rua}
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* Camada 2: Todos os Miolos Claros (Desenhados por cima das bordas, fundindo as interseções) */}
          {ruas.map((rua, idx) => (
            <polyline
              key={`rua-miolo-${idx}`}
              points={rua}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Construção Base 3: Polígonos dos Lotes Naturais (Primeiro plano interativo + Correção de Pilha SVG) */}
        {lotesMapeados
          .slice() // impede mutação no array root
          .sort((a, b) => (a.id === sel?.id ? 1 : 0) - (b.id === sel?.id ? 1 : 0))
          .map(lot => {
          const mapaData = geometria[lot.id];
          const isSelected = sel?.id === lot.id;
          const isFiltered = filt.some(f => f.id === lot.id);
          const statusColors = SC[lot.status] || SC.Disponível;
          
          const indPos = getIndicatorPos(mapaData.cx, mapaData.cy, mapaData.pts);

          // Se não estiver no filtro, fica transparente/desativado visualmente
          const opacity = isFiltered ? 1 : 0.15;

          return (
            <g
              key={lot.id}
              className="lote-group"
              onClick={() => { if (isFiltered) setSel(lot); }}
              style={{
                cursor: isFiltered ? "pointer" : "not-allowed",
                opacity: opacity,
                transition: "opacity 0.3s ease"
              }}
            >
              <polygon
                points={mapaData.pts}
                fill={isSelected ? statusColors.bg : "#F9FAFB"}
                stroke={isSelected ? "#1F4E5F" : "#D1D5DB"}
                strokeWidth={isSelected ? 0.8 : 0.4}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                style={{ 
                  transition: "all 0.2s ease-in-out",
                  filter: isSelected ? "drop-shadow(0px 0px 6px rgba(31, 78, 95, 0.5))" : "none"
                }}
              />

              {/* Ponto indicativo do status posicionado no topo-direito */}
              {!isSelected && (
                <circle
                  className="status-indicator"
                  cx={indPos.x}
                  cy={indPos.y}
                  r="1.1"
                  fill={statusColors.bg}
                  style={{ pointerEvents: "none" }}
                />
              )}
              
              {/* Identificação Universal do Lote (Clean View) */}
              <text
                x={mapaData.cx}
                y={mapaData.cy + 1}
                fill={isSelected ? "#111827" : "#A1A1AA"}
                stroke="#ffffff"
                strokeWidth={isSelected ? "0.6" : "0.4"}
                paintOrder="stroke fill"
                strokeLinecap="round"
                strokeLinejoin="round"
                fontSize={isSelected ? "4.5" : "3.6"}
                fontWeight={isSelected ? "500" : "400"}
                opacity={isFiltered ? (isSelected ? 1 : 0.8) : 0.3}
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ pointerEvents: "none", transition: "all 0.2s ease" }}
              >
                {lot.id}
              </text>
            </g>
          );
        })}
      </svg>
        </TransformComponent>
      </TransformWrapper>
      
      {/* Legenda de Status (Bottom/Top Right responsive) */}
      <div className="espelho-legend" style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)", padding: "12px 16px", borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 10 }}>
        <div className="espelho-legend-title" style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
          Legenda
        </div>
        <div className="espelho-legend-items" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(SC).map(([status, colors]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: colors.bg, boxShadow: `0 0 6px ${colors.bg}40` }} />
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{status}</div>
            </div>
          ))}
        </div>
      </div>
      </div> {/* Fim do Recipiente SVG / Pan Zoom */}
      </div> {/* Fim do Módulo Card (Caixa com Padding e Sombra) */}

    </div>
  );
}
