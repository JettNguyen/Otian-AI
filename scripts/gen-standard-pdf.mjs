// PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE can point to an existing local installation.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = new URL('../', import.meta.url);
const source = fs.readFileSync(new URL('standard/index.html', root), 'utf8');
const main = source.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0].replace(/<!--([\s\S]*?)-->/g, '');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="https://otianai.com/standard/"><title>The Otian Standard</title><style>
    body { font: 10.5pt/1.5 Arial, sans-serif; color: #182220; }
    h1 { font-size: 32pt; line-height: 1.15; margin: 20px 0; }
    h2 { font-size: 17pt; line-height: 1.3; margin-top: 28px; break-after: avoid; }
    h3 { break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
    a { color: #215b4d; text-decoration: underline; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border-bottom: 1px solid #ccd5d1; text-align: left; padding: 8px; }
    .section-label { text-transform: uppercase; letter-spacing: .12em; font-size: 9pt; color: #215b4d; }
    .page-hero { padding: 24px 0; border-bottom: 2px solid #215b4d; }
    .std-toc { break-after: page; } .std-toc ul { columns: 2; font-size: 9pt; }
    .std-toc li { margin: 7px 0; break-inside: avoid; }
    .sr-only { display: none; }
  </style></head><body>${main}</body></html>`);
  await page.pdf({ path: new URL('assets/Otian-Standard.pdf', root).pathname, format: 'A4', printBackground: true,
    margin: { top: '20mm', bottom: '22mm', left: '20mm', right: '20mm' }, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;margin:0 20mm;font-size:8px;color:#596760;display:flex;justify-content:space-between"><span>OTIAN AI · THE OTIAN STANDARD · SEPTEMBER 14, 2026</span><span class="pageNumber"></span></div>' });
  const mainHash = createHash('sha256').update(main).digest('hex');
  const pdfHash = createHash('sha256').update(fs.readFileSync(new URL('assets/Otian-Standard.pdf', root))).digest('hex');
  fs.writeFileSync(new URL('scripts/standard-pdf-source.json', root), JSON.stringify({ mainHash, pdfHash }, null, 2) + '\n');
  console.log('Generated Standard PDF from the canonical webpage.');
} finally { await browser.close(); }
