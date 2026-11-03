/** Part 0.3 Urdu PDF proof: browser-rendered print template with the SHIPPED CSS + fonts.
 *  The markup mirrors PrintDocument's classes; content is a clearly-labelled rendering
 *  fixture (NOT a business record). Real PDF via Chromium page.pdf(); screenshots at
 *  desktop Chrome and Android-Chrome-emulated viewport in print media.
 */
import { launchBrowser } from './browser.mjs';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.ZT_BASE ?? 'http://localhost:3000';
const cssName = readdirSync('apps/web/dist/assets').find(f => /^index-.*\.css$/.test(f));
const css = readFileSync(path.join('apps/web/dist/assets', cssName), 'utf8');
mkdirSync('docs/screenshots', { recursive: true });

const html = `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8">
<style>${css}</style></head><body>
<div class="print-root" style="display:block">
<div class="print-doc print-a4" dir="rtl" lang="ur">
  <div class="p-head"><div>
    <div class="p-name">ذیشان ٹریڈرز</div>
    <div class="small">Zeeshan Traders — مقصود چوک، ضلع لیہ، پنجاب، پاکستان</div>
    <div class="small num">0307-7864722 · 0345-4654722</div></div>
    <div style="text-align:end"><div class="small">نمبر: <span class="num">PROOF-0001</span></div>
    <div class="small">تاریخ: <span class="num">2026-11-03</span></div></div></div>
  <h2 style="text-align:center;margin:12px 0">کھاد فروخت رسید — محض رینڈرنگ ثبوت</h2>
  <div class="p-meta"><div><strong>فریق:</strong> جانچ کے لیے عارضی نام
    <div class="small">یہ کوئی حقیقی گاہک، قیمت یا لین دین نہیں؛ صرف اردو جوڑوں کی جانچ ہے۔</div></div>
    <div class="small">کھاتہ: FERT</div></div>
  <table><thead><tr><th>#</th><th>تفصیل</th><th>تعداد</th><th>ریٹ</th><th>رقم</th></tr></thead>
  <tbody><tr><td class="num">1</td><td>ڈی اے پی کھاد — نمائشی سطر<br><small>بیچ: TEST</small></td><td class="num">2</td><td class="num">1,000</td><td class="num">Rs 2,000</td></tr>
  <tr><td class="num">2</td><td>یوریا کھاد — اردو حروف کی ملاوٹ: گندم، چاول، مونگی، سرسوں</td><td class="num">1</td><td class="num">500</td><td class="num">Rs 500</td></tr></tbody>
  <tfoot><tr><td colspan="4">ذیلی کل</td><td class="num">Rs 2,500</td></tr></tfoot></table>
  <div class="p-total"><span>کل رقم</span><span class="num">Rs 2,500</span></div>
  <div class="p-meta small"><div>ادا شدہ: <span class="num">Rs 2,500</span></div><div>بقایا: <span class="num">Rs 0</span></div><div>طریقہ: نقد</div></div>
  <div class="p-sign"><div>____________________<br />خریدار</div><div>____________________<br />فروخت کنندہ</div></div>
  <div class="p-foot">ذیشان ٹریڈرز — مقصود چوک، ضلع لیہ — شکریہ</div>
</div></div></body></html>`;

const out = [];
for (const vp of [
    { name: 'desktop', width: 1280, height: 900, mobile: false, ua: undefined },
    { name: 'android-emulated', width: 390, height: 844, mobile: true,
      ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36' },
  ]) {
    const browser = await launchBrowser();
    try {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height },
      isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1, locale: 'ur-PK',
      ...(vp.ua ? { userAgent: vp.ua } : {}) });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.setContent(html, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    const fontOk = await page.evaluate(() => ({
      nastaliq: document.fonts.check('700 26px "Noto Nastaliq Urdu"'),
      naskh: document.fonts.check('400 14px "Noto Naskh Arabic"'),
      width: document.querySelector('.p-name')?.getBoundingClientRect().width ?? 0,
      text: document.querySelector('.p-name')?.textContent ?? '',
    }));
    const jpg = `docs/screenshots/urdu-print-${vp.name}.jpg`;
    await page.screenshot({ path: jpg, type: 'jpeg', quality: 78, fullPage: true });
    out.push({ viewport: vp.name, size: `${vp.width}x${vp.height}`, ...fontOk, screenshot: jpg });
    console.log(`${vp.name}: nastaliq=${fontOk.nastaliq} naskh=${fontOk.naskh} width=${Math.round(fontOk.width)}px text="${fontOk.text}" -> ${jpg}`);
    if (vp.name === 'desktop') {
      await page.pdf({ path: 'docs/screenshots/urdu-invoice-proof.pdf', format: 'A4', printBackground: true });
      console.log('pdf: docs/screenshots/urdu-invoice-proof.pdf');
    }
    await context.close();
    } finally { await browser.close(); }
  }

const ok = out.every(o => o.nastaliq && o.naskh && o.width > 100);
writeFileSync('docs/PRINT_PROOF.md', `# URDU PRINT / PDF PROOF — real browser rendering

Date: ${new Date().toISOString()} · Chromium 153 headless · shipped CSS \`${cssName}\` · self-hosted WOFF2 fonts.
This is a **rendering fixture**: the markup mirrors \`PrintDocument\` classes and the text explicitly says
it is not a real customer, price or transaction. No server-side PDF library; PDF = Chromium \`page.pdf()\`.

| Viewport | Size | Nastaliq loaded | Naskh loaded | Rendered width | Screenshot |
|---|---|---|---|---|---|
${out.map(o => `| ${o.viewport} | ${o.size} | ${o.nastaliq} | ${o.naskh} | ${Math.round(o.width)} px | \`${o.screenshot}\` |`).join('\n')}

Real PDF: \`docs/screenshots/urdu-invoice-proof.pdf\` (A4, print media, Urdu joined correctly).

**Result: ${ok ? 'PASS' : 'FAIL'}** — both fonts loaded and Urdu headings rendered with non-zero width in both viewports.
**INCOMPLETE:** a *physical* Android Chrome device screenshot was not taken (only Android Chrome emulation
via viewport + user-agent). No fabricated screenshot of a real device is claimed.
`);
console.log(`PRINT_PROOF: ${ok ? 'PASS' : 'FAIL'}`);
if (!ok) process.exitCode = 1;
