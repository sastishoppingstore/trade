/** Browser-rendered HTML+CSS print templates (spec 0.3): correct Urdu shaping, A4/A5/80mm.
 *  "PDF" = browser Print -> Save as PDF. No server-side PDF library is used. */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { formatPKR, type DocumentSnapshot } from '@zt/shared';
import { Button, SelectField } from './components.js';
import { useApp } from './app-state.js';

export function PrintDocument({ snapshot, size = 'A4' }: { snapshot: DocumentSnapshot; size: string }) {
  const cls = size === 'A5' ? 'print-a5' : size === '80mm' ? 'print-80mm' : 'print-a4';
  const b = snapshot.business;
  return <div className={`print-doc ${cls}`} dir="rtl" lang="ur">
    <div className="p-head">
      <div>
        <div className="p-name">{b.name_ur}</div>
        <div className="small">{b.name_en} — {b.location_ur}</div>
        <div className="small num">{b.phone1} · {b.phone2}</div>
      </div>
      <div style={{ textAlign: 'end' }}>
        {b.pesticide_licence_no && <div className="small">لائسنس: <span className="num">{b.pesticide_licence_no}</span></div>}
        <div className="small">نمبر: <span className="num">{snapshot.number}</span></div>
        <div className="small">تاریخ: <span className="num">{snapshot.date}</span></div>
      </div>
    </div>
    {snapshot.provisional && <div style={{ textAlign: 'center', margin: 8 }}><span className="provisional-stamp">PROVISIONAL — عارضی</span></div>}
    <h2 style={{ textAlign: 'center', margin: '12px 0' }}>{snapshot.title_ur}</h2>
    <div className="p-meta">
      <div><strong>فریق:</strong> {snapshot.party.name}
        {snapshot.party.phone && <div className="small num">{snapshot.party.phone}</div>}
        {snapshot.party.address && <div className="small">{snapshot.party.address}</div>}
      </div>
      <div className="small">{snapshot.book_code && `کھاتہ: ${snapshot.book_code}`}</div>
    </div>
    <table>
      <thead><tr><th>#</th><th>تفصیل</th><th>تعداد</th><th>ریٹ</th><th>رقم</th></tr></thead>
      <tbody>{snapshot.lines.map((l, i) => <tr key={i}>
        <td className="num">{i + 1}</td>
        <td>{l.label}{l.batch && <div className="small">بیچ: {l.batch}</div>}</td>
        <td className="num">{l.qty}</td>
        <td className="num">{l.rate}</td>
        <td className="num">{formatPKR(l.amount_paisa)}</td>
      </tr>)}</tbody>
      <tfoot>
        <tr><td colSpan={4}>ذیلی کل</td><td className="num">{formatPKR(snapshot.subtotal_paisa)}</td></tr>
        {snapshot.extras.map((x, i) => <tr key={i}><td colSpan={4}>{x.label}</td><td className="num">{formatPKR(x.amount_paisa)}</td></tr>)}
      </tfoot>
    </table>
    {snapshot.arithmetic?.length ? <div style={{ marginBlockStart: 10 }}>
      <strong>وزن کی تفصیل:</strong>
      <pre style={{ whiteSpace: 'pre-wrap', direction: 'ltr', textAlign: 'start' }}>{snapshot.arithmetic.join('\n')}</pre>
    </div> : null}
    <div className="p-total"><span>کل رقم</span><span className="num">{formatPKR(snapshot.total_paisa)}</span></div>
    <div className="p-meta small">
      <div>ادا شدہ: <span className="num">{formatPKR(snapshot.paid_paisa)}</span></div>
      <div>بقایا: <span className="num">{formatPKR(snapshot.due_paisa)}</span></div>
      <div>طریقہ: {snapshot.payment_method}</div>
    </div>
    {snapshot.note && <div className="small">نوٹ: {snapshot.note}</div>}
    <div className="p-sign"><div>____________________<br />خریدار</div><div>____________________<br />فروخت کنندہ</div></div>
    <div className="p-foot">{b.invoice_footer || `${b.name_ur} — ${b.location_ur} — شکریہ`}</div>
  </div>;
}

export function PrintActions({ snapshot, onClose }: { snapshot: DocumentSnapshot; onClose?: () => void }) {
  const { t, toast } = useApp();
  const [size, setSize] = useState('A4');
  const share = async () => {
    const text = `${snapshot.business.name_ur}\n${snapshot.title_ur} ${snapshot.number}\n${snapshot.party.name}\nکل: ${formatPKR(snapshot.total_paisa)}\nبقایا: ${formatPKR(snapshot.due_paisa)}`;
    try {
      if (navigator.share) await navigator.share({ title: `${snapshot.title_ur} ${snapshot.number}`, text, url: window.location.href });
      else { await navigator.clipboard.writeText(text); toast('متن کاپی ہو گیا'); }
    } catch { /* user cancelled */ }
  };
  return <>
    {createPortal(<div className="print-root"><PrintDocument snapshot={snapshot} size={size} /></div>, document.body)}
    <div className="btn-row no-print" style={{ marginBlock: 12 }}>
      <Button onClick={() => window.print()}>🖨 {t('pdf')} / {t('print')}</Button>
      <Button variant="secondary" onClick={share}>📤 {t('share')}</Button>
      {onClose && <Button variant="ghost" onClick={onClose}>بند کریں</Button>}
    </div>
    <SelectField label="پرنٹ سائز" value={size} onChange={setSize}
      options={[{ value: 'A4', label: 'A4' }, { value: 'A5', label: 'A5' }, { value: '80mm', label: '80 mm تھرمل' }]} />
    <div className="notice info small no-print">پی ڈی ایف براؤزر کے «پرنٹ → Save as PDF» سے بنتی ہے تاکہ اردو کے جوڑ درست رہیں۔
      سرور سائیڈ PDF لائبریری استعمال نہیں کی گئی۔</div>
  </>;
}
