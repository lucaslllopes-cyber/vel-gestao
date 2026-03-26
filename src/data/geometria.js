// ───────────────────────────────────────────────────────────────────
// GEOMETRIA REAL DO LOTEAMENTO (CONTRATO TÉCNICO E DOCUMENTAÇÃO)
// 
// Este arquivo é o repositório permanente da geometria oficial do mapa.
// Ele desacopla o polígono estático dos dados de negócio (Status/Preço).
// 
// COMO SUBSTITUIR O MOCK PELO MAPA REAL (Substituição Incremental):
// O componente 'EspelhoPage' sempre prioriza este arquivo. Se um lote 
// estiver declarado aqui, ele substitui automaticamente o desenho Mock. 
// Você pode mapear e subir 1 lote por vez, sem parar o sistema.
// ───────────────────────────────────────────────────────────────────

export const MAPA_CONFIG = {
  // viewBox: Define a escala e o sistema de coordenadas de todo o SVG.
  // Função: Diz ao navegador a proporção real do "papel" do desenho.
  // Instrução: Deve ser copiado diretamente da tag <svg viewBox="..."> 
  // do arquivo exportado pela engenharia (AutoCAD/Illustrator/Figma).
  viewBox: "0 0 1100 1000",
};

// GEOMETRIA_LOTES: Dicionário definitivo associando IDs aos SVGs.
//
// EXPLICAÇÃO DOS CAMPOS OBRIGATÓRIOS:
// - chave (ex: "A-1") : ID idêntico ao código comercial do backend.
// - pts (string)      : A sequência de coordenadas "x,y" do polígono.
//                       Copiada do atributo 'points' da tag <polygon>.
// - cx (number)       : Coordenada X exata do centro (ou centro de massa) 
//                       do lote. Usado para fixar o rótulo ("A-1").
// - cy (number)       : Coordenada Y exata do centro do lote.
//
// EXEMPLO PRÁTICO DE IMPLEMENTAÇÃO REAL:
/*
export const GEOMETRIA_LOTES = {
  "A-1": { 
    cx: 200, 
    cy: 150, 
    pts: "100,100 300,100 300,200 100,200" 
  },
  "A-2": { 
    cx: 400, 
    cy: 150, 
    pts: "300,100 500,100 500,200 300,200" 
  }
};
*/

export const GEOMETRIA_LOTES = {};
