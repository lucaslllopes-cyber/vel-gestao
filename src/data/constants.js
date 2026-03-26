// ─────────────────────────────────────────────────────────────────
// DADOS E CONSTANTES GLOBAIS — Terra Vista
// ─────────────────────────────────────────────────────────────────

// Schema do lote:
//   id           — ex: "A-1"
//   q            — quadra: "A"–"F"
//   n            — número do lote
//   status       — "Disponível" | "Reservado" | "Vendido"
//   area         — m²
//   valor        — R$ preço de tabela
//   comprador    — nome ou null
//   reservado_em  — ISO string ou null
//   reservado_ate — ISO string ou null
//   reservado_por — login do usuário ou null
//   mapa         — { cx, cy, pts } para o futuro Espelho SVG, ou null

export const LOTS_SEED = [
  { id:"A-1",  q:"A", n:1,  status:"Disponível", area:851.13, valor:134052.98, comprador:null, mapa:null },
  { id:"A-2",  q:"A", n:2,  status:"Disponível", area:513.54, valor:79727.09,  comprador:null, mapa:null },
  { id:"A-3",  q:"A", n:3,  status:"Vendido",    area:522.97, valor:89309.75,  comprador:"Evandro Luis de Souza Hipólito", mapa:null },
  { id:"A-4",  q:"A", n:4,  status:"Vendido",    area:532.40, valor:79000.48,  comprador:"Maicon Gomes da Fonseca", mapa:null },
  { id:"B-5",  q:"B", n:5,  status:"Vendido",    area:593.80, valor:86000.00,  comprador:"Lucas Eduardo Ramos", mapa:null },
  { id:"B-6",  q:"B", n:6,  status:"Vendido",    area:603.26, valor:81440.10,  comprador:"Valdir Fagundes", mapa:null },
  { id:"B-7",  q:"B", n:7,  status:"Disponível", area:612.78, valor:82725.30,  comprador:null, mapa:null },
  { id:"B-8",  q:"B", n:8,  status:"Vendido",    area:622.15, valor:83990.25,  comprador:"Estenio Vinicius Zanetti", mapa:null },
  { id:"B-9",  q:"B", n:9,  status:"Disponível", area:631.01, valor:97964.30,  comprador:null, mapa:null },
  { id:"B-10", q:"B", n:10, status:"Disponível", area:639.82, valor:99332.06,  comprador:null, mapa:null },
  { id:"B-11", q:"B", n:11, status:"Disponível", area:648.63, valor:100699.81, comprador:null, mapa:null },
  { id:"B-12", q:"B", n:12, status:"Disponível", area:656.69, valor:101951.12, comprador:null, mapa:null },
  { id:"B-13", q:"B", n:13, status:"Disponível", area:663.77, valor:103050.29, comprador:null, mapa:null },
  { id:"B-14", q:"B", n:14, status:"Disponível", area:670.85, valor:113205.94, comprador:null, mapa:null },
  { id:"B-15", q:"B", n:15, status:"Disponível", area:679.23, valor:114620.06, comprador:null, mapa:null },
  { id:"B-16", q:"B", n:16, status:"Disponível", area:688.66, valor:116211.38, comprador:null, mapa:null },
  { id:"B-17", q:"B", n:17, status:"Vendido",    area:698.09, valor:129599.75, comprador:"João Batista Santana", mapa:null },
  { id:"B-18", q:"B", n:18, status:"Vendido",    area:707.51, valor:131332.71, comprador:"Andreia Aparecida de Jesus Lício", mapa:null },
  { id:"B-19", q:"B", n:19, status:"Disponível", area:716.94, valor:120983.63, comprador:null, mapa:null },
  { id:"C-20", q:"C", n:20, status:"Disponível", area:500.10, valor:138627.72, comprador:null, mapa:null },
  { id:"C-21", q:"C", n:21, status:"Disponível", area:460.53, valor:109421.93, comprador:null, mapa:null },
  { id:"C-22", q:"C", n:22, status:"Disponível", area:439.26, valor:104368.18, comprador:null, mapa:null },
  { id:"C-23", q:"C", n:23, status:"Disponível", area:417.99, valor:99314.42,  comprador:null, mapa:null },
  { id:"C-24", q:"C", n:24, status:"Disponível", area:396.72, valor:94260.67,  comprador:null, mapa:null },
  { id:"C-25", q:"C", n:25, status:"Disponível", area:358.62, valor:85208.11,  comprador:null, mapa:null },
  { id:"C-26", q:"C", n:26, status:"Disponível", area:408.54, valor:113247.29, comprador:null, mapa:null },
  { id:"D-27", q:"D", n:27, status:"Vendido",    area:333.71, valor:120900.00, comprador:"Evandro Luis de Souza Hipólito", mapa:null },
  { id:"D-28", q:"D", n:28, status:"Vendido",    area:349.74, valor:121040.00, comprador:"Carlos Henrique D'Ambrosio", mapa:null },
  { id:"D-29", q:"D", n:29, status:"Vendido",    area:354.27, valor:102667.45, comprador:"Elder do Carmo e Silva", mapa:null },
  { id:"D-30", q:"D", n:30, status:"Vendido",    area:356.93, valor:103438.31, comprador:"Tatiane Aparecida de Assis Soares", mapa:null },
  { id:"D-31", q:"D", n:31, status:"Vendido",    area:361.85, valor:114000.00, comprador:"Tatiane Aparecida de Assis Soares", mapa:null },
  { id:"D-32", q:"D", n:32, status:"Disponível", area:366.77, valor:106289.95, comprador:null, mapa:null },
  { id:"D-33", q:"D", n:33, status:"Disponível", area:371.60, valor:107689.68, comprador:null, mapa:null },
  { id:"D-34", q:"D", n:34, status:"Disponível", area:375.83, valor:108915.53, comprador:null, mapa:null },
  { id:"D-35", q:"D", n:35, status:"Disponível", area:379.95, valor:110109.51, comprador:null, mapa:null },
  { id:"D-36", q:"D", n:36, status:"Disponível", area:383.89, valor:111251.32, comprador:null, mapa:null },
  { id:"D-37", q:"D", n:37, status:"Disponível", area:387.35, valor:112254.03, comprador:null, mapa:null },
  { id:"D-38", q:"D", n:38, status:"Disponível", area:390.47, valor:113158.21, comprador:null, mapa:null },
  { id:"D-39", q:"D", n:39, status:"Vendido",    area:391.65, valor:131891.36, comprador:"Wagner Cardoso Zanetti", mapa:null },
  { id:"D-40", q:"D", n:40, status:"Vendido",    area:392.51, valor:113749.40, comprador:"Nelson Leonardo Paiva", mapa:null },
  { id:"D-41", q:"D", n:41, status:"Disponível", area:389.44, valor:112859.71, comprador:null, mapa:null },
  { id:"D-42", q:"D", n:42, status:"Disponível", area:356.36, valor:103273.13, comprador:null, mapa:null },
  { id:"D-43", q:"D", n:43, status:"Disponível", area:689.37, valor:160537.04, comprador:null, mapa:null },
  { id:"E-44", q:"E", n:44, status:"Disponível", area:597.18, valor:108000.00, comprador:null, mapa:null },
  { id:"E-45", q:"E", n:45, status:"Disponível", area:330.93, valor:72000.00,  comprador:null, mapa:null },
  { id:"E-46", q:"E", n:46, status:"Vendido",    area:309.66, valor:75874.45,  comprador:"Márcia Alessandra Miguel", mapa:null },
  { id:"E-47", q:"E", n:47, status:"Disponível", area:466.02, valor:114186.56, comprador:null, mapa:null },
  { id:"F-48", q:"F", n:48, status:"Disponível", area:523.21, valor:102418.36, comprador:null, mapa:null },
  { id:"F-49", q:"F", n:49, status:"Disponível", area:523.21, valor:102418.36, comprador:null, mapa:null },
  { id:"F-50", q:"F", n:50, status:"Vendido",    area:523.21, valor:112659.75, comprador:"Paulo Henrique Lucas", mapa:null },
  { id:"F-51", q:"F", n:51, status:"Disponível", area:523.21, valor:102418.36, comprador:null, mapa:null },
  { id:"F-52", q:"F", n:52, status:"Vendido",    area:523.21, valor:112200.75, comprador:"Israel Aparecido Ferreira", mapa:null },
  { id:"F-53", q:"F", n:53, status:"Vendido",    area:509.07, valor:110001.50, comprador:"Raqueline Ribeiro de Freitas", mapa:null },
  { id:"F-54", q:"F", n:54, status:"Vendido",    area:501.59, valor:110001.50, comprador:"Ana Ruth Ribeiro de Freitas", mapa:null },
  { id:"F-55", q:"F", n:55, status:"Vendido",    area:503.78, valor:109999.76, comprador:"Deusiane Oliveira Canuto", mapa:null },
  { id:"F-56", q:"F", n:56, status:"Disponível", area:505.97, valor:97905.20,  comprador:null, mapa:null },
  { id:"F-57", q:"F", n:57, status:"Disponível", area:508.16, valor:98328.96,  comprador:null, mapa:null },
  { id:"F-58", q:"F", n:58, status:"Disponível", area:510.35, valor:98752.73,  comprador:null, mapa:null },
  { id:"F-59", q:"F", n:59, status:"Disponível", area:512.55, valor:99178.43,  comprador:null, mapa:null },
  { id:"F-60", q:"F", n:60, status:"Disponível", area:514.74, valor:99602.19,  comprador:null, mapa:null },
  { id:"F-61", q:"F", n:61, status:"Disponível", area:516.93, valor:97699.77,  comprador:null, mapa:null },
  { id:"F-62", q:"F", n:62, status:"Disponível", area:519.12, valor:98113.68,  comprador:null, mapa:null },
  { id:"F-63", q:"F", n:63, status:"Disponível", area:521.32, valor:98529.48,  comprador:null, mapa:null },
  { id:"F-64", q:"F", n:64, status:"Disponível", area:523.51, valor:98943.39,  comprador:null, mapa:null },
  { id:"F-65", q:"F", n:65, status:"Disponível", area:525.70, valor:99357.30,  comprador:null, mapa:null },
  { id:"F-66", q:"F", n:66, status:"Vendido",    area:527.89, valor:110000.00, comprador:"Antonio José Monchiero Junior", mapa:null },
  { id:"F-67", q:"F", n:67, status:"Vendido",    area:528.57, valor:110000.00, comprador:"Antonio José Monchiero Junior", mapa:null },
  { id:"F-68", q:"F", n:68, status:"Vendido",    area:525.66, valor:110001.50, comprador:"Alice Campos Garcia", mapa:null },
  { id:"F-69", q:"F", n:69, status:"Vendido",    area:522.61, valor:98773.29,  comprador:"Fábio Henrique Sales de Freitas", mapa:null },
  { id:"F-70", q:"F", n:70, status:"Disponível", area:519.55, valor:98194.95,  comprador:null, mapa:null },
  { id:"F-71", q:"F", n:71, status:"Vendido",    area:516.50, valor:97618.50,  comprador:"Eduardo Luiz de Paula", mapa:null },
  { id:"F-72", q:"F", n:72, status:"Vendido",    area:513.45, valor:87000.00,  comprador:"Juan Rodrigues de Paula", mapa:null },
  { id:"F-73", q:"F", n:73, status:"Vendido",    area:510.39, valor:109111.00, comprador:"Flávio Moura Ferreira", mapa:null },
  { id:"F-74", q:"F", n:74, status:"Vendido",    area:507.34, valor:108470.00, comprador:"Flávio Moura Ferreira", mapa:null },
  { id:"F-75", q:"F", n:75, status:"Disponível", area:856.43, valor:134887.73, comprador:null, mapa:null },
];

// Configurações comerciais — editáveis pelo admin na aba Config
export const DEFAULT_CFG = {
  entrada_min_pct: 10,      // % mínima de entrada (inclui 8% VEL)
  taxa_am:         0.8,     // taxa mensal (%) para SACOC e Price >24x
  tabelas:         ["SACOC", "PRICE"],
  anuais_qtd:      5,       // parcelas anuais sugeridas
  anuais_val:      2000,    // valor R$ por parcela anual
  reserva_horas:   48,      // prazo de reserva em horas
};

// Usuários (auth local — substituir por Firebase Auth em produção)
// ATENÇÃO: senhas em texto claro — adequado apenas para demo/local
export const USERS = {
  admin:     { pw: "terravista2025", role: "admin",    nome: "Gestão Terra Vista" },
  corretor1: { pw: "corretor123",    role: "corretor", nome: "Corretor — VEL" },
};

export const QUADRAS = ["A", "B", "C", "D", "E", "F"];

// Cores por status
export const SC = {
  Disponível: { bg: "#4ADE80", dim: "#14532D" },
  Vendido:    { bg: "#F87171", dim: "#7F1D1D" },
  Reservado:  { bg: "#FBBF24", dim: "#78350F" },
};
