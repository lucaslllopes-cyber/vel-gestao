const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PRINTS_DIR = path.join(__dirname, '..', 'docs', 'apresentacao-corretores', 'prints');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo.png');
const OUTPUT_PDF = path.join(__dirname, '..', 'docs', 'apresentacao-corretores', 'apresentacao_uso_sistema_terra_vista.pdf');

function toBase64(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Aviso: Arquivo não encontrado: ${filePath}`);
    return '';
  }
  const bitmap = fs.readFileSync(filePath);
  return `data:image/png;base64,${bitmap.toString('base64')}`;
}

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Lendo template HTML...');
  let html = fs.readFileSync(path.join(__dirname, 'presentation.html'), 'utf8');

  console.log('Convertendo imagens para base64...');
  html = html.replace(/LOGO_PATH/g, toBase64(LOGO_PATH));
  html = html.replace(/PRINT_01/g, toBase64(path.join(PRINTS_DIR, '01_login.png')));
  html = html.replace(/PRINT_02/g, toBase64(path.join(PRINTS_DIR, '02_espelho.png')));
  html = html.replace(/PRINT_03/g, toBase64(path.join(PRINTS_DIR, '03_espelho_selecionado.png')));
  html = html.replace(/PRINT_04/g, toBase64(path.join(PRINTS_DIR, '04_detalhes_lote.png')));
  html = html.replace(/PRINT_05/g, toBase64(path.join(PRINTS_DIR, '05_filtros_status.png')));
  html = html.replace(/PRINT_06/g, toBase64(path.join(PRINTS_DIR, '06_filtros_quadra.png')));
  html = html.replace(/PRINT_07/g, toBase64(path.join(PRINTS_DIR, '07_mobile_espelho.png')));
  html = html.replace(/PRINT_08/g, toBase64(path.join(PRINTS_DIR, '08_mobile_detalhes.png')));

  console.log('Gerando PDF...');
  await page.setContent(html);
  await page.waitForLoadState('networkidle');
  
  // PDF options
  await page.pdf({
    path: OUTPUT_PDF,
    width: '1000px',
    height: '700px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log(`PDF gerado com sucesso em: ${OUTPUT_PDF}`);
}

generate().catch(err => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});
