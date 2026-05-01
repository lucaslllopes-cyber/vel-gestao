const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const PRINTS_DIR = path.join(__dirname, '..', 'docs', 'apresentacao-corretores', 'prints');

if (!fs.existsSync(PRINTS_DIR)) {
  fs.mkdirSync(PRINTS_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Capturando tela de login...');
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: path.join(PRINTS_DIR, '01_login.png') });

  console.log('Fazendo login...');
  await page.fill('input[placeholder="Usuário"]', 'corretor1');
  await page.fill('input[type="password"]', 'corretor123');
  await page.click('button:has-text("Entrar")');

  console.log('Aguardando carregamento do sistema...');
  await page.waitForSelector('text=🗺️ Espelho');
  
  // Navigate to Espelho
  await page.click('text=🗺️ Espelho');
  await page.waitForTimeout(2000); // Wait for SVG to render
  
  console.log('Capturando tela do Espelho...');
  await page.screenshot({ path: path.join(PRINTS_DIR, '02_espelho.png') });

  console.log('Selecionando um lote (A-1)...');
  // Try to find a lot on the SVG. Lotes have text with their ID.
  await page.waitForSelector('text=A-1');
  await page.click('text=A-1', { force: true });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(PRINTS_DIR, '03_espelho_selecionado.png') });

  console.log('Capturando detalhes do lote...');
  // The painel should be open now.
  await page.screenshot({ path: path.join(PRINTS_DIR, '04_detalhes_lote.png') });

  console.log('Testando filtros de status (Disponível)...');
  await page.click('button:has-text("Disponível")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(PRINTS_DIR, '05_filtros_status.png') });

  console.log('Testando filtros por quadra (A)...');
  await page.click('button:has-text("QA")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(PRINTS_DIR, '06_filtros_quadra.png') });

  // Mobile views
  console.log('Capturando versões mobile...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  await mobilePage.goto(BASE_URL);
  await mobilePage.waitForLoadState('networkidle');
  
  // Login on mobile
  await mobilePage.fill('input[placeholder="Usuário"]', 'corretor1');
  await mobilePage.fill('input[type="password"]', 'corretor123');
  await mobilePage.click('button:has-text("Entrar")');
  
  console.log('Aguardando espelho no mobile...');
  await mobilePage.waitForSelector('svg');
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: path.join(PRINTS_DIR, '07_mobile_espelho.png') });

  console.log('Selecionando lote no mobile...');
  await mobilePage.click('text=A-1', { force: true });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(PRINTS_DIR, '08_mobile_detalhes.png') });

  await browser.close();
  console.log('Screenshots capturados com sucesso!');
}

capture().catch(err => {
  console.error('Erro ao capturar screenshots:', err);
  process.exit(1);
});
