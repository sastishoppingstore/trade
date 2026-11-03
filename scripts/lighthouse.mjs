/** Part 9.1 performance gate: real Lighthouse 13 mobile run against the local preview.
 *  Scores are reported exactly as measured — never rounded up or claimed as targets met.
 */
import { launchBrowser } from './browser.mjs'; // ensures the Chromium binary + libs are inflated
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'node:fs';

const BASE = process.env.ZT_BASE ?? 'http://localhost:3000';
const b = await launchBrowser(); // inflates /tmp/chromium and AL2023 libs
await b.close();
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.FONTCONFIG_PATH = '/tmp/fonts';
process.env.HOME = '/tmp';
process.env.CHROME_PATH = '/tmp/chromium';

// A published product is needed for the /product/:slug audit (local test fixture only).
const login = await fetch(`${BASE}/api/v1/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'e2e-owner', password: 'E2E-Test-Owner-2026!' }),
});
const cookie = (login.headers.getSetCookie?.() ?? []).map(s => s.split(';')[0]).join('; ');
const csrf = /(?:^|;\s*)zt_csrf=([^;]+)/.exec(cookie)?.[1] ?? '';
const prod = await fetch(`${BASE}/api/v1/products`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie, 'x-csrf-token': csrf },
  body: JSON.stringify({
    name_ur: 'ایل ایچ ٹیسٹ مصنوعات', name_en: 'LH Test Fixture', category_id: 'cat-fert',
    sku: 'LH-' + Date.now(), base_unit: 'bag', purchase_unit: 'bag', sale_unit: 'bag',
    conversion_ratio_milli: 1000, grams_per_base_unit: 50000,
    purchase_rate_paisa: 100000, sale_rate_paisa: 120000, reorder_level_milli: 0,
    show_public_price: true, public_price_paisa: 120000, is_published: true, is_active: true,
    description_ur: 'صرف لائٹ ہاؤس جانچ کے لیے عارضی ڈیٹا',
  }),
});
const pj = await prod.json();
const slug = pj?.data?.slug ?? 'lh-fixture';
console.log(`fixture_product: ${prod.status} slug=${slug}`);

const chrome = await chromeLauncher.launch({
  chromePath: '/tmp/chromium',
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run'],
});
const targets = [
  { label: '/', url: `${BASE}/` },
  { label: '/products', url: `${BASE}/products` },
  { label: '/product/:slug', url: `${BASE}/product/${slug}` },
];
const results = [];
try {
  for (const t of targets) {
    const runner = await lighthouse(t.url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    }, {
      extends: 'lighthouse:default',
      settings: { skipAudits: ['uses-http2', 'uses-long-cache-ttl'] },
    });
    writeFileSync(`.dev/lhr-${t.label.replace(/[^a-z0-9]/gi, '_')}.json`, runner.report);
    const lhr = JSON.parse(runner.report);
    const scores = {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    };
    const metrics = {
      LCP: lhr.audits['largest-contentful-paint']?.displayValue ?? '-',
      CLS: lhr.audits['cumulative-layout-shift']?.displayValue ?? '-',
      TBT: lhr.audits['total-blocking-time']?.displayValue ?? '-',
    };
    results.push({ page: t.label, url: t.url, ...scores, ...metrics });
    console.log(`${t.label.padEnd(16)} perf=${scores.performance} a11y=${scores.accessibility} seo=${scores.seo} LCP=${metrics.LCP} CLS=${metrics.CLS} TBT=${metrics.TBT}`);
  }
} finally {
  await chrome.kill();
}
writeFileSync('.dev/lighthouse.json', JSON.stringify(results, null, 2));
const targetsMet = results.every(r => r.performance >= 85 && r.accessibility >= 95 && r.seo >= 95);
writeFileSync('docs/LIGHTHOUSE_REPORT.md', `# LIGHTHOUSE REPORT — real mobile run

Date: ${new Date().toISOString()} · Lighthouse 13.6.0 · Chromium 153 headless · mobile (390×844) · URL: ${BASE}
Targets from Part 9.1: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.

| Page | Perf | A11y | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
${results.map(r => `| ${r.page} | ${r.performance} | ${r.accessibility} | ${r.seo} | ${r.LCP} | ${r.CLS} | ${r.TBT} |`).join('\n')}

**All three targets met on all three pages: ${targetsMet ? 'YES' : 'NO'}**

Scores are raw Lighthouse output, not adjusted. Raw JSON: \`.dev/lighthouse.json\`.
`);
console.log(`LIGHTHOUSE_TARGETS_MET: ${targetsMet ? 'YES' : 'NO'}`);
