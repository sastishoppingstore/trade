/** PUBLIC WEBSITE — PUB-01..09. All data comes from /api/v1/public/* (no internal fields). */
import React, { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGet, api } from './api.js';
import { useApp } from './app-state.js';
import { Button, TextField, CheckField, AsyncView, Chip, Skeleton } from './components.js';
import { formatPKR, BUSINESS_PROFILE } from '@zt/shared';

const CATEGORY_ICONS: Record<string, string> = {
  FERT: '🌱', PEST: '🧪', CHOK: '🌾', WAND: '🐄', CEM: '🏗️', SEED: '🌰',
  OTHR: '🧰', GRAINS: '🌾', WHEAT: '🌾', RICE: '🍚', SESAME: '🫘', MILLET: '🌾',
  MAIZE: '🌽', MOONG: '🫛', MUSTARD: '🌼',
};

function Header({ business }: { business: any }) {
  const { lang, setLang, t } = useApp();
  const [open, setOpen] = useState(false);
  const b = business ?? BUSINESS_PROFILE;
  const nav = [['/', t('home')], ['/products', t('products')], ['/about', t('about')], ['/contact', t('contact')]];
  return <header className="pub-header">
    <Link to="/" className="brand"><img src="/icons/icon-192.png" alt="" width={40} height={40} /><span>{b.name_ur ?? BUSINESS_PROFILE.name_ur}</span></Link>
    <nav className="pub-nav" aria-label="مرکزی روابط">
      {nav.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
    </nav>
    <div className="row" style={{ gap: 8 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')} aria-label="Language">
        {lang === 'ur' ? 'EN' : 'UR'}
      </button>
      <a className="btn btn-wa btn-sm" href={b.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer">💬 {t('whatsapp')}</a>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>☰</button>
    </div>
    {open && <div className="card" style={{ position: 'absolute', insetInlineEnd: 8, top: 62, zIndex: 40, minWidth: 190 }}>
      {nav.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px' }}>{label}</Link>)}
      <Link to="/enquiry" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px' }}>{t('enquiry')}</Link>
      <Link to="/erp" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px' }}>ERP / کھاتہ</Link>
    </div>}
  </header>;
}

function Footer({ business }: { business: any }) {
  const b = business ?? BUSINESS_PROFILE;
  return <footer className="pub-footer"><div className="cols">
    <div><h3>{b.name_ur ?? BUSINESS_PROFILE.name_ur}</h3>
      <p>{b.location_ur ?? BUSINESS_PROFILE.location_ur}</p>
      <p className="small">{b.name_en ?? BUSINESS_PROFILE.name_en}</p></div>
    <div><h3>{'رابطہ'}</h3>
      <p><a className="num" href={`tel:${(b.phone1 ?? BUSINESS_PROFILE.phone1).replace(/-/g, '')}`}>{b.phone1 ?? BUSINESS_PROFILE.phone1}</a></p>
      <p><a className="num" href={`tel:${(b.phone2 ?? BUSINESS_PROFILE.phone2).replace(/-/g, '')}`}>{b.phone2 ?? BUSINESS_PROFILE.phone2}</a></p>
      <p><a href={b.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer">واٹس ایپ 1</a> · <a href={b.whatsapp2 ?? BUSINESS_PROFILE.whatsapp2} target="_blank" rel="noreferrer">واٹس ایپ 2</a></p></div>
    <div><h3>{'فوری روابط'}</h3>
      <div className="link-list"><Link to="/products">مصنوعات</Link><Link to="/enquiry">پوچھ گچھ</Link>
        <Link to="/privacy">رازداری</Link><Link to="/terms">شرائط</Link><Link to="/erp">کھاتہ (ERP)</Link></div></div>
  </div><p className="small center" style={{ marginBlockStart: 28 }}>© {b.name_ur ?? BUSINESS_PROFILE.name_ur} {new Date().getFullYear()}</p></footer>;
}

function WaButton({ business }: { business: any }) {
  return <a className="float-wa" href={business?.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer" aria-label="واٹس ایپ">💬</a>;
}

function ProductCard({ p }: { p: any }) {
  const { t } = useApp();
  const img = p.images?.[0];
  return <Link to={`/product/${p.slug}`} className="product-card" aria-label={p.name_ur}>
    <div className="thumb">{img ? <img loading="lazy" src={img.url} alt={img.alt_ur || p.name_ur} width={300} height={300} /> : '📦'}</div>
    <div className="body">
      <Chip tone="gray">{p.category_ur}</Chip>
      <div className="name">{p.name_ur}</div>
      {p.brand_ur && <div className="small">{p.brand_ur}</div>}
      <div className="small">پیک / یونٹ: {p.base_unit}</div>
      <StatusBadge availability={p.availability} />
      <div className="price">{p.show_public_price ? formatPKR(p.public_price_paisa) : t('contactForPrice')}</div>
      <span className="btn btn-secondary btn-sm">{t('details')}</span>
    </div>
  </Link>;
}
function StatusBadge({ availability }: { availability: string }) {
  const { t } = useApp();
  return <Chip tone={availability === 'AVAILABLE' ? 'success' : availability === 'CALL' ? 'info' : 'gray'}>
    {availability === 'AVAILABLE' ? t('available') : availability === 'CALL' ? t('callUs') : t('outOfStock')}</Chip>;
}

function Home() {
  const { t } = useApp();
  const { data, isLoading, error, refetch } = useGet<any>('public-home', '/api/v1/public/home');
  const b = data?.business;
  return <AsyncView loading={isLoading} error={error} retry={() => refetch()}>
    <section className="pub-hero" style={data?.banners?.[0]?.image_r2_key ? { backgroundImage: `url(/media/${data.banners[0].image_r2_key})` } : undefined}>
      <div className="inner">
        <h1 className="h-nastaliq">{b?.name_ur ?? BUSINESS_PROFILE.name_ur}</h1>
        <p className="tagline">{data?.hero_tagline || b?.location_ur || BUSINESS_PROFILE.location_ur}</p>
        <div className="btn-row"><Link className="btn btn-primary" to="/products">🌿 {t('viewProducts')}</Link>
          <a className="btn btn-wa" href={b?.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer">💬 {t('contactWhatsapp')}</a></div>
      </div>
    </section>
    <div className="info-strip">
      <div>📍 {b?.location_ur ?? BUSINESS_PROFILE.location_ur}</div>
      <div>📞 <a className="num" href={`tel:${(b?.phone1 ?? BUSINESS_PROFILE.phone1).replace(/-/g, '')}`}>{b?.phone1 ?? BUSINESS_PROFILE.phone1}</a> ·
        <a className="num" href={`tel:${(b?.phone2 ?? BUSINESS_PROFILE.phone2).replace(/-/g, '')}`}>{b?.phone2 ?? BUSINESS_PROFILE.phone2}</a></div>
      <div>{data?.opening_hours ? `🕒 ${typeof data.opening_hours === 'string' ? data.opening_hours : JSON.stringify(data.opening_hours)}` : ''}</div>
    </div>
    <div className="pub-container">
      {data?.catalogue_empty && <div className="notice info" style={{ marginBlockStart: 24 }}>{t('emptyProducts')} — <a href={b?.whatsapp1}>{t('askWhatsapp')}</a></div>}
      <section className="section"><h2>{t('categories')}</h2>
        <div className="tile-grid">{(data?.categories ?? []).filter((c: any) => !c.parent_id).map((c: any) =>
          <Link key={c.id} className="tile" to={`/category/${c.slug}`}>
            <span className="ico" aria-hidden="true">{CATEGORY_ICONS[c.code] ?? '📦'}</span>
            <strong>{c.name_ur}</strong><span className="small">{c.name_en}</span>
            <span className="count">{c.product_count} مصنوعات</span>
          </Link>)}</div>
      </section>
      {!!data?.featured?.length && <section className="section"><div className="section-title"><h2>{t('featured')}</h2><Link to="/products">مزید ›</Link></div>
        <div className="products-grid">{data.featured.slice(0, 8).map((p: any) => <ProductCard key={p.id} p={p} />)}</div></section>}
      {!!data?.new_arrivals?.length && <section className="section"><div className="section-title"><h2>{t('newProducts')}</h2></div>
        <div className="products-grid">{data.new_arrivals.slice(0, 8).map((p: any) => <ProductCard key={p.id} p={p} />)}</div></section>}
      {!!data?.announcements?.length && <section className="section"><h2>{t('announcements')}</h2>
        {data.announcements.map((a: any) => <div className="card" key={a.id} style={{ marginBlockEnd: 8 }}>
          <strong>{a.title_ur}</strong><div className="small num">{a.publish_at}</div><p>{a.body_ur}</p></div>)}</section>}
      <section className="section"><div className="card"><h3>رابطہ اور نقشہ</h3>
        <p>{b?.location_ur}</p>
        <a className="btn btn-secondary btn-sm" target="_blank" rel="noreferrer"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('مقصود چوک لیہ پنجاب پاکستان')}`}>نقشہ دیکھیں</a></div></section>
    </div>
  </AsyncView>;
}

function Products({ categorySlug }: { categorySlug?: string }) {
  const { t } = useApp();
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);
  const [q, setQ] = useState(qs.get('q') ?? '');
  const [debounced, setDebounced] = useState(q);
  const [sort, setSort] = useState(qs.get('sort') ?? 'new');
  const [cat, setCat] = useState(categorySlug ?? qs.get('category') ?? '');
  const [cursor, setCursor] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [first, setFirst] = useState(true);
  const categories = useGet<any[]>('public-categories', '/api/v1/public/categories');
  useEffect(() => { const x = setTimeout(() => setDebounced(q), 300); return () => clearTimeout(x); }, [q]);
  useEffect(() => { setCat(categorySlug ?? qs.get('category') ?? ''); }, [categorySlug]);
  const path = `/api/v1/public/products?q=${encodeURIComponent(debounced)}&sort=${sort}&category=${encodeURIComponent(cat)}&limit=12${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
  const { data, isLoading, error, refetch } = useGet<any>('public-products', path);
  useEffect(() => {
    setRows([]); setCursor(null); setFirst(true);
  }, [debounced, sort, cat]);
  useEffect(() => { if (data?.rows) { setRows((r) => first ? data.rows : [...r, ...data.rows]); setFirst(false); } }, [data]);
  const { data: home } = useGet<any>('public-home', '/api/v1/public/home');
  const activeCat = categories.data?.find((c: any) => c.slug === cat);
  return <div className="pub-container">
    <nav className="small" aria-label="Breadcrumb"><Link to="/">ہوم</Link> › <Link to="/products">{t('allProducts')}</Link> {activeCat && `› ${activeCat.name_ur}`}</nav>
    <h1>{activeCat?.name_ur ?? t('allProducts')}</h1>
    <div className="catalogue-layout">
      <aside className="filters card"><h3>{t('filter')}</h3>
        <TextField label={t('search')} value={q} onChange={setQ} placeholder="نام، برانڈ، SKU" />
        <div className="field"><label>زمرہ</label><select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">تمام</option>{(categories.data ?? []).map((c: any) => <option key={c.id} value={c.slug}>{c.name_ur}</option>)}
        </select></div>
        <div className="field"><label>{t('sort')}</label><select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">نیا</option><option value="name">نام</option><option value="featured">نمایاں</option><option value="price">قیمت</option>
        </select></div>
        <a className="btn btn-secondary btn-sm btn-block no-print" href={`/api/v1/public/products?q=${encodeURIComponent(q)}`} target="_blank" rel="noreferrer">API ڈیٹا</a>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="toolbar">
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="تلاش…" aria-label="تلاش" />
          <Button variant="secondary" size="sm" onClick={() => setSort(sort === 'new' ? 'name' : 'new')}>{t('filter')}</Button>
          {home?.business && <a className="btn btn-wa btn-sm" href={home.business.whatsapp1} target="_blank" rel="noreferrer">{t('askWhatsapp')}</a>}
        </div>
        <AsyncView loading={isLoading && !rows.length} error={error} retry={() => refetch()} empty={!rows.length}>
          <div className="small" style={{ marginBlockEnd: 10 }}>{rows.length} نتائج</div>
          <div className="products-grid">{rows.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          {data?.next_cursor && <div className="center" style={{ marginBlock: 24 }}>
            <Button variant="secondary" onClick={() => setCursor(data.next_cursor)}>{t('loadMore')}</Button></div>}
        </AsyncView>
        {!rows.length && !isLoading && <EmptyForProducts whatsapp={home?.business?.whatsapp1} />}
      </div>
    </div>
  </div>;
}
function EmptyForProducts({ whatsapp }: { whatsapp?: string }) {
  const { t } = useApp();
  return <div className="empty"><div className="icon">🔎</div><p>{t('emptyProducts')}</p>
    <a className="btn btn-wa" href={whatsapp ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer">{t('askWhatsapp')}</a></div>;
}

function ProductDetail() {
  const { slug } = useParams();
  const { t, toast } = useApp();
  const { data, isLoading, error, refetch } = useGet<any>('public-product', `/api/v1/public/product/${slug}`);
  const [main, setMain] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const p = data?.product;
  const b = useGet<any>('public-home', '/api/v1/public/home').data?.business;
  return <div className="pub-container">
    <AsyncView loading={isLoading} error={error} retry={() => refetch()}>
      {p && <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          <div className="gallery"><div className="main">{p.images?.length ?
            <img src={p.images[main]?.url} alt={p.images[main]?.alt_ur || p.name_ur} width={600} height={600} /> : '📦'}</div>
            <div className="thumbs">{p.images?.map((i: any, idx: number) => <img key={i.id} src={i.url} alt={i.alt_ur}
              width={64} height={64} onClick={() => setMain(idx)} style={{ cursor: 'pointer' }} />)}</div></div>
          <div>
            <h1>{p.name_ur}</h1><div className="small">{p.name_en} · {p.brand_ur}</div>
            <div className="row"><Chip>{p.category_ur}</Chip><StatusBadge availability={p.availability} /></div>
            <h2 className="price" style={{ marginBlock: 16 }}>{p.show_public_price ? formatPKR(p.public_price_paisa) : t('contactForPrice')}</h2>
            <div className="btn-row">
              <a className="btn btn-wa" target="_blank" rel="noreferrer"
                href={`${b?.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1}?text=${encodeURIComponent(`السلام علیکم، مجھے ${p.name_ur} کے بارے میں معلومات چاہئیں: ${window.location.href}`)}`}>
                💬 {t('askWhatsapp')}</a>
              <Button variant="secondary" onClick={() => { setItems([...items, { product_id: p.id, unit: p.base_unit }]); toast('پوچھ گچھ کی فہرست میں شامل ہو گیا'); }}>+ پوچھ گچھ کی فہرست</Button>
            </div>
            {items.length > 0 && <div className="card" style={{ marginBlockStart: 16 }}><strong>پوچھ گچھ کی فہرست</strong>
              <p className="small">{items.length} مصنوعات</p><Link className="btn btn-primary btn-sm" to="/enquiry" state={{ items }}>فارم کھولیں</Link></div>}
            <div className="card" style={{ marginBlockStart: 16 }}><h3>تفصیل</h3>
              <div dangerouslySetInnerHTML={{ __html: p.description_ur || '' }} /></div>
          </div>
        </div>
        {!!data?.related?.length && <section className="section"><h2>متعلقہ مصنوعات</h2>
          <div className="products-grid">{data.related.map((r: any) => <ProductCard key={r.id} p={r} />)}</div></section>}
      </div>}
    </AsyncView>
  </div>;
}

function Enquiry() {
  const { t, toast } = useApp();
  const loc = useLocation();
  const started = useRef(Date.now());
  const [name, setName] = useState(''), [mobile, setMobile] = useState(''), [city, setCity] = useState('');
  const [message, setMessage] = useState(''), [consent, setConsent] = useState(false), [honeypot, setHoneypot] = useState('');
  const [items, setItems] = useState<any[]>((loc.state as any)?.items ?? []);
  const [busy, setBusy] = useState(false), [ref, setRef] = useState(''), [errors, setErrors] = useState<Record<string, string>>({});
  const submit = async () => {
    setBusy(true); setErrors({});
    try {
      const r = await api<any>('/api/v1/public/enquiry', { method: 'POST', body: {
        customer_name: name, mobile, city, message, consent, honeypot,
        elapsed_ms: Date.now() - started.current, items,
      } });
      setRef(r.reference); toast('پیغام بھیج دیا گیا');
    } catch (e: any) { setErrors(e.field_errors ?? { _: e.message_ur }); }
    finally { setBusy(false); }
  };
  if (ref) return <div className="pub-container"><div className="card center" style={{ padding: 48 }}>
    <h2>✅ ہم جلد رابطہ کریں گے</h2><p>حوالہ نمبر: <strong className="num">{ref}</strong></p>
    <p className="small">یہ صرف پوچھ گچھ ہے — کوئی ادائیگی یا اسٹاک تبدیلی نہیں ہوئی۔</p>
    <Link className="btn btn-primary" to="/">ہوم</Link></div></div>;
  return <div className="pub-container" style={{ maxWidth: 640 }}>
    <h1>{t('enquiry')}</h1>
    <div className="card">
      <TextField label="نام" value={name} onChange={setName} required error={errors.customer_name} />
      <TextField label="موبائل" value={mobile} onChange={setMobile} placeholder="03XX-XXXXXXX" required error={errors.mobile} inputMode="tel" />
      <TextField label="شہر / گاؤں / پتہ" value={city} onChange={setCity} required error={errors.city} />
      <div className="field"><label>مصنوعات</label>
        {items.map((i, idx) => <div className="row" key={idx}><span className="chip">{i.unit ?? 'مصنوعات'}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setItems(items.filter((_, j) => j !== idx))}>✕</button></div>)}
        <Link className="btn btn-secondary btn-sm" to="/products">+ مصنوعات شامل کریں</Link></div>
      <div className="field"><label>پیغام</label><textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
      <div className="sr-only"><label>خالی چھوڑیں<input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label></div>
      <CheckField label={<span>{t('consent')} — {t('privacyNotice')}: آپ کی معلومات صرف رابطے کے لیے استعمال ہوں گی۔</span>}
        checked={consent} onChange={setConsent} />
      {errors._ && <div className="err">⚠ {errors._}</div>}
      <Button onClick={submit} loading={busy} disabled={!consent || !name || !mobile || !city}>{t('send')}</Button>
    </div>
  </div>;
}

function CmsPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data, isLoading, error, refetch } = useGet<any>('page', `/api/v1/public/pages/${slug}`);
  const { data: home } = useGet<any>('public-home', '/api/v1/public/home');
  const b = home?.business;
  if (slug === 'contact') return <div className="pub-container" style={{ maxWidth: 720 }}>
    <h1>رابطہ</h1><div className="card">
      <p>📍 {b?.location_ur ?? BUSINESS_PROFILE.location_ur}</p>
      <p>📞 <a className="num" href={`tel:${(b?.phone1 ?? BUSINESS_PROFILE.phone1).replace(/-/g, '')}`}>{b?.phone1 ?? BUSINESS_PROFILE.phone1}</a></p>
      <p>📞 <a className="num" href={`tel:${(b?.phone2 ?? BUSINESS_PROFILE.phone2).replace(/-/g, '')}`}>{b?.phone2 ?? BUSINESS_PROFILE.phone2}</a></p>
      <div className="btn-row"><a className="btn btn-wa" href={b?.whatsapp1 ?? BUSINESS_PROFILE.whatsapp1} target="_blank" rel="noreferrer">واٹس ایپ 1</a>
        <a className="btn btn-wa" href={b?.whatsapp2 ?? BUSINESS_PROFILE.whatsapp2} target="_blank" rel="noreferrer">واٹس ایپ 2</a></div>
      {home?.opening_hours && <p>🕒 {String(home.opening_hours)}</p>}
      <Link className="btn btn-primary" to="/enquiry">پیغام بھیجیں</Link></div></div>;
  return <div className="pub-container" style={{ maxWidth: 760 }}><AsyncView loading={isLoading} error={error} retry={() => refetch()}>
    <h1>{data?.title_ur ?? fallbackTitle}</h1>
    {error ? <div className="notice">یہ صفحہ مالک کے جائزے کے بعد شائع ہوگا۔</div> :
      <div className="card" dangerouslySetInnerHTML={{ __html: data?.body_ur ?? '' }} />}
  </AsyncView></div>;
}

function NotFound() {
  return <div className="pub-container center" style={{ padding: 64 }}><h1>۴۰۴</h1><p>صفحہ نہیں ملا</p><Link className="btn btn-primary" to="/">ہوم</Link></div>;
}

export function PublicApp() {
  const { data } = useGet<any>('public-home', '/api/v1/public/home');
  const b = data?.business;
  return <>
    <Header business={b} />
    <main id="main"><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/category/:slug" element={<CategoryRoute />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/enquiry" element={<Enquiry />} />
      <Route path="/about" element={<CmsPage slug="about" fallbackTitle="ہمارے بارے میں" />} />
      <Route path="/contact" element={<CmsPage slug="contact" fallbackTitle="رابطہ" />} />
      <Route path="/privacy" element={<CmsPage slug="privacy" fallbackTitle="رازداری کی پالیسی" />} />
      <Route path="/terms" element={<CmsPage slug="terms" fallbackTitle="شرائط" />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <Footer business={b} /><WaButton business={b} />
  </>;
}
function CategoryRoute() { const { slug } = useParams(); return <Products categorySlug={slug} />; }
