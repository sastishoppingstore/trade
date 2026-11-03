# FEATURE CHECKLIST — live copy of `GET /api/v1/features`

Generated from the running Worker on 2026-11-03. The same data powers `/erp/status`. COMPLETE = real + persisted + working; PARTIAL = working but narrowed; INCOMPLETE = not built / not verified. An unfinished feature is NEVER reported as COMPLETE.

| ID | اسکرین / خصوصیت | English | State | نوٹ |
|---|---|---|---|---|
| PUB-01 | ہوم | Home | ✅ **COMPLETE** |  |
| PUB-02 | تمام مصنوعات / زمرہ | Products & category | ✅ **COMPLETE** |  |
| PUB-03 | پروڈکٹ کارڈ | Product card | ✅ **COMPLETE** |  |
| PUB-04 | پروڈکٹ تفصیل | Product detail | ✅ **COMPLETE** |  |
| PUB-05 | پوچھ گچھ | Enquiry | ✅ **COMPLETE** | ہنی پاٹ، ٹائم ٹریپ، ریٹ لمٹ، رضامندی |
| PUB-06 | ہمارے بارے میں | About | 🟡 **PARTIAL** | CMS صفحہ موجود مگر مالک کے جائزے تک شائع نہیں |
| PUB-07 | رابطہ | Contact | ✅ **COMPLETE** | صرف مالک کے دیے گئے فون / پتہ / wa.me |
| PUB-08 | رازداری / شرائط | Privacy / terms | 🟡 **PARTIAL** | قانونی متن مالک کے جائزے کے بغیر درج نہیں کیا گیا |
| PUB-09 | 404 / sitemap / robots | 404 + SEO files | ✅ **COMPLETE** |  |
| ERP-01 | سیٹ اپ وزرڈ | Setup wizard | ✅ **COMPLETE** | من کی تصدیق، ابتدائی بیلنس، ریگولیٹری اختیاری |
| ERP-02 | لاگ ان | Login | 🟡 **PARTIAL** | PBKDF2 + سیشن + CSRF + ریٹ لمٹ + PIN آف لائن ان لاک؛ WebAuthn پاس کی INCOMPLETE |
| ERP-03 | ڈیش بورڈ | Dashboard | ✅ **COMPLETE** |  |
| ERP-04 | تیز اندراج | Quick entry | 🟡 **PARTIAL** | تیز فارم کام کرتا ہے؛ عالمی سرچ انڈیکس INCOMPLETE |
| ERP-05 | مصنوعات فہرست | Products list | ✅ **COMPLETE** |  |
| ERP-06 | مصنوعات فارم | Product form | 🟡 **PARTIAL** | تمام ٹیبز محفوظ؛ production R2 بائنڈنگ INCOMPLETE |
| ERP-07 | CSV درآمد | CSV import | ✅ **COMPLETE** |  |
| ERP-08 | زمرے / برانڈز / یونٹس | Catalogue admin | 🟡 **PARTIAL** | فہرست + نیا اندراج؛ ترمیم/آرکائیو UI باقی |
| ERP-09 | کھاد ہب | Fertilizer hub | ✅ **COMPLETE** |  |
| ERP-10 | کھاد خرید | Fertilizer purchase | ✅ **COMPLETE** |  |
| ERP-11 | کھاد فروخت | Fertilizer sale | ✅ **COMPLETE** |  |
| ERP-12 | پیسٹی سائیڈ | Pesticide module | 🟡 **PARTIAL** | رجسٹر/ایکسپائری بلاک/لازمی خریدار؛ قرنطینہ ورک فلو UI باقی |
| ERP-13 | دیگر سامان (5 کتابیں) | Five goods modules | ✅ **COMPLETE** |  |
| ERP-14 | اجناس ہب | Grains hub | ✅ **COMPLETE** |  |
| ERP-15 | فصل صفحہ | Crop page | ✅ **COMPLETE** |  |
| ERP-16 | اجناس خرید (وزن) | Grain purchase | ✅ **COMPLETE** |  |
| ERP-17 | اجناس فروخت | Grain sale | ✅ **COMPLETE** |  |
| ERP-18 | فریق | Parties | 🟡 **PARTIAL** | فہرست + نیا فریق؛ ترمیم/آرکائیو UI باقی |
| ERP-19 | فریق کھاتہ | Party khata | ✅ **COMPLETE** |  |
| ERP-20 | کھاتہ سینٹر | Khata centre | ✅ **COMPLETE** |  |
| ERP-21 | رسیدیں / ادائیگیاں | Receipts & payments | 🟡 **PARTIAL** | AUTO/ADVANCE کام؛ MANUAL الاٹمنٹ UI باقی |
| ERP-22 | رقم اکاؤنٹس | Money accounts | ✅ **COMPLETE** |  |
| ERP-23 | ٹرانسفر | Transfer | ✅ **COMPLETE** |  |
| ERP-24 | واپسی | Returns | 🟡 **PARTIAL** | ریورس پوسٹنگ؛ لائن چننے والا UI باقی |
| ERP-25 | اخراجات | Expenses | ✅ **COMPLETE** |  |
| ERP-26 | ملازمین / تنخواہ | Employees & payroll | 🟡 **PARTIAL** | تنخواہ رن؛ ایڈوانس فارم الگ UI باقی |
| ERP-27 | انوینٹری | Inventory | ✅ **COMPLETE** |  |
| ERP-28 | ویب سائٹ CMS | Website CMS | 🟡 **PARTIAL** | صفحات/اعلانات؛ بینر امیج اپ لوڈ R2 پر منحصر |
| ERP-29 | پوچھ گچھ ان باکس | Enquiries inbox | 🟡 **PARTIAL** | منظوری/مسترد/کوٹیشن؛ براہِ راست Sale کنورژن UI باقی |
| ERP-30 | دستاویزات سینٹر | Documents centre | 🟡 **PARTIAL** | JSON سنیپ شاٹ + براؤزر پرنٹ؛ bulk statement pack INCOMPLETE |
| ERP-31 | رپورٹس | Reports | 🟡 **PARTIAL** | 12 رپورٹس؛ مکمل گیلری اور شیڈولڈ ای میل INCOMPLETE |
| ERP-32 | اکاؤنٹنگ | Accounting | ✅ **COMPLETE** |  |
| ERP-33 | صارفین و کردار | Users & roles | 🟡 **PARTIAL** | RBAC + ڈیوائس ریووک؛ پاس کی UI INCOMPLETE |
| ERP-34 | سنک سینٹر | Sync centre | ✅ **COMPLETE** |  |
| ERP-35 | بیک اپ | Backup | 🟡 **PARTIAL** | انکرپٹڈ ایکسپورٹ + لاگ؛ staging بحالی ٹیسٹ INCOMPLETE |
| ERP-36 | ترتیبات | Settings | ✅ **COMPLETE** |  |
| ERP-37 | آڈٹ لاگ | Audit log | ✅ **COMPLETE** |  |
| ERP-38 | 403/404/آف لائن | Error states | 🟡 **PARTIAL** | 403/404/آف لائن بینر؛ الگ آف لائن صفحہ اور بصری ٹیسٹ باقی |
| P8-OFFLINE | PWA / آؤٹ باکس | PWA outbox | ✅ **COMPLETE** | SW + Dexie + 4 sync triggers + role-scoped cache wipe |
| P8-PIN | PIN کیش انکرپشن | PIN-derived AES-GCM cache | ✅ **COMPLETE** | PBKDF2 310,000 → AES-256-GCM؛ 4 یونٹ ٹیسٹ پاس؛ براؤزر E2E ابھی نہیں |
| P8-PASSKEYS | WebAuthn پاس کی | WebAuthn passkeys | ❌ **INCOMPLETE** | سرور 501 INCOMPLETE_PASSKEYS واپس کرتا ہے |
| P8-TURNSTILE | Turnstile | Turnstile | ❌ **INCOMPLETE** |  |
| P8-R2 | پرائیویٹ R2 | Private R2 | 🟡 **PARTIAL** | لوکل اپ لوڈ/میڈیا کام؛ production binding تعیناتی پر |
| P8-CACHE-PURGE | ایج کیش پیورج | Edge cache purge | 🟡 **PARTIAL** | مقامی memoryCache صاف؛ Cloudflare keys ٹریکنگ باقی |
| P9-QUERY-PLAN | EXPLAIN QUERY PLAN | Query-plan CI gate | ✅ **COMPLETE** | 15/15 ہاٹ کوئری انڈیکس استعمال کرتی ہیں؛ CI ورک فلو شامل |
| P9-VISUAL | Playwright بصری ریگریشن | Visual regression | ❌ **INCOMPLETE** |  |
| P9-LIGHTHOUSE | Lighthouse | Lighthouse | ❌ **INCOMPLETE** |  |
| P9-A11Y | a11y / 360–1280 | Accessibility & breakpoints | 🟡 **PARTIAL** | منطقی خواص + لیبلز؛ خودکار axe/بصری ٹیسٹ باقی |
| P11-DOCS | دستاویزات / CSV / OpenAPI | Docs, CSV templates, OpenAPI | ✅ **COMPLETE** |  |
| P12-RESTORE | Staging بحالی ٹیسٹ | Staging restore test | 🟡 **PARTIAL** | مقامی staging-همسر DB پر 1032 قطاریں بحال + integrity PASS؛ حقیقی Cloudflare staging رن باقی |
| P12-DEPLOY | Cloudflare تعیناتی | Cloudflare deploy | ❌ **INCOMPLETE** | Cloudflare اکاؤنٹ / ڈومین تک رسائی نہیں ملی |

**Totals:** {"COMPLETE":33,"PARTIAL":22,"INCOMPLETE":5} — 60 tracked items.

Full acceptance mapping: `docs/ACCEPTANCE.md`. Known gaps: `docs/KNOWN_LIMITATIONS.md`.
