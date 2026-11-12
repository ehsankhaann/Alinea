import { useState, type FormEvent } from 'react';
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, FileCheck2,
  FileText, Info, LogOut, MessageSquareText, Plus, Send, ShieldCheck, Sparkles,
  UploadCloud, type LucideIcon,
} from 'lucide-react';
import type { Company, Lang } from './data';
import { initialDueRequests, type DueRequest } from './workspace-data';

interface FounderSubmission {
  period: string;
  arr: string;
  growth: string;
  cash: string;
  notes: string;
  fileName: string | null;
}

interface FounderPortalProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  company: Company;
  founderName: string;
  onSignOut: () => void;
  onSubmit: (submission: FounderSubmission, requestId: string | null) => void;
}

const txt = (lang: Lang, en: string, fr: string) => lang === 'en' ? en : fr;

function BrandMark() {
  return <div className="brand-logo"><svg className="brand-symbol" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M3.5 27.5 14.3 5.5h5.3L8.8 27.5H3.5ZM14.6 27.5 25.4 5.5h5.3L19.9 27.5h-5.3Z" fill="currentColor" /><circle cx="29" cy="26" r="2.5" fill="currentColor" /></svg><span>alinea<span className="brand-period">.</span></span></div>;
}

export default function FounderPortal({ lang, setLang, company, founderName, onSignOut, onSubmit }: FounderPortalProps) {
  const [requests, setRequests] = useState<DueRequest[]>(() => {
    try { return JSON.parse(localStorage.getItem('alinea-v2-founder-requests') || '') as DueRequest[]; } catch { return initialDueRequests; }
  });
  const [tab, setTab] = useState<'overview' | 'report' | 'requests' | 'files'>('overview');
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [period, setPeriod] = useState(company.period[lang]);
  const [arr, setArr] = useState('');
  const [growth, setGrowth] = useState('');
  const [cash, setCash] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const saveRequests = (next: DueRequest[]) => {
    setRequests(next);
    localStorage.setItem('alinea-v2-founder-requests', JSON.stringify(next));
  };

  const startRequest = (request: DueRequest) => {
    setActiveRequest(request.id);
    setTab('report');
    setSubmitted(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!arr.trim() || !growth.trim() || !notes.trim()) {
      setError(txt(lang, 'Please complete ARR, growth, and the operating update.', 'Veuillez renseigner le RRA, la croissance et le point opérationnel.'));
      return;
    }
    setError('');
    onSubmit({ period, arr, growth, cash, notes, fileName: file?.name ?? null }, activeRequest);
    if (activeRequest) {
      saveRequests(requests.map((request) => request.id === activeRequest ? { ...request, status: 'submitted' } : request));
    }
    setSubmitted(true);
    setArr(''); setGrowth(''); setCash(''); setNotes(''); setFile(null);
  };

  const metrics = [
    { label: txt(lang, 'Reported ARR', 'RRA déclaré'), value: company.verified.arr ?? txt(lang, 'Missing', 'Manquant'), verified: Boolean(company.verified.arr) },
    { label: txt(lang, 'Growth', 'Croissance'), value: company.verified.growth ?? txt(lang, 'Missing', 'Manquant'), verified: Boolean(company.verified.growth) },
    { label: txt(lang, 'Gross margin', 'Marge brute'), value: company.verified.margin ?? txt(lang, 'Missing', 'Manquant'), verified: Boolean(company.verified.margin) },
    { label: txt(lang, 'Net burn', 'Consommation nette'), value: company.verified.burn ?? txt(lang, 'Missing', 'Manquant'), verified: Boolean(company.verified.burn) },
  ];

  const openRequests = requests.filter((request) => request.status !== 'complete');

  return <div className="founder-shell">
    <header className="founder-topbar"><BrandMark /><span className="founder-scope"><ShieldCheck size={13} />{txt(lang, 'Secure founder portal', 'Portail fondateur sécurisé')}</span><div className="founder-top-actions"><div className="topbar-language"><button className={lang === 'en' ? 'selected' : ''} onClick={() => setLang('en')}>EN</button><span>/</span><button className={lang === 'fr' ? 'selected' : ''} onClick={() => setLang('fr')}>FR</button></div><button className="secondary-button" onClick={onSignOut}><LogOut size={15} />{txt(lang, 'Sign out', 'Se déconnecter')}</button></div></header>
    <div className="founder-layout">
      <aside className="founder-sidebar"><div className="founder-company"><span className="company-mark company-mark-large" style={{ background: company.brand, color: company.ink }}>{company.initials}</span><div><small>{txt(lang, 'YOUR COMPANY', 'VOTRE ENTREPRISE')}</small><strong>{company.name}</strong><span>{company.website}</span></div></div><nav className="founder-nav">{(['overview', 'report', 'requests', 'files'] as const).map((id) => { const Icon: LucideIcon = id === 'overview' ? FileCheck2 : id === 'report' ? Send : id === 'requests' ? MessageSquareText : FileText; const labels = { overview: txt(lang, 'Company home', 'Accueil entreprise'), report: txt(lang, 'Submit report', 'Transmettre un rapport'), requests: txt(lang, 'Firm requests', 'Demandes du cabinet'), files: txt(lang, 'My files', 'Mes fichiers') }; return <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => { setTab(id); setSubmitted(false); }}><Icon size={18} strokeWidth={1.8} /><span>{labels[id]}</span>{id === 'requests' && openRequests.length > 0 && <small className="nav-count review-nav-count">{openRequests.length}</small>}</button>; })}</nav><div className="founder-security"><ShieldCheck size={17} /><div><strong>{txt(lang, 'Isolated access', 'Accès isolé')}</strong><p>{txt(lang, 'You can only see Canopy records and requests addressed to you.', 'Vous ne voyez que les dossiers Canopy et les demandes qui vous sont adressées.')}</p></div></div><div className="founder-account"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80" alt="" /><div><strong>{founderName}</strong><small>{txt(lang, 'Founder & CEO', 'Fondatrice et directrice générale')}</small></div></div></aside>
      <main className="founder-main">
        <div className="founder-heading"><div><p className="page-eyebrow">{company.period[lang]} · {txt(lang, 'REPORTING PORTAL', 'PORTAIL DE REPORTING')}</p><h1>{tab === 'overview' ? txt(lang, 'Welcome, Sophie.', 'Bienvenue, Sophie.') : tab === 'report' ? txt(lang, 'Submit a report', 'Transmettre un rapport') : tab === 'requests' ? txt(lang, 'Requests from Alinea', 'Demandes d’Alinea') : txt(lang, 'Your files', 'Vos fichiers')}</h1><p className="page-subtitle">{tab === 'overview' ? txt(lang, 'Share verified company updates directly with your investment team.', 'Partagez des mises à jour vérifiées directement avec votre équipe d’investissement.') : tab === 'report' ? txt(lang, 'Submitted figures enter the firm’s review queue before they count as fact.', 'Les chiffres transmis entrent dans la file de vérification du cabinet avant d’être considérés comme des faits.') : tab === 'requests' ? txt(lang, 'Specific information requests from your investment team.', 'Demandes d’informations précises de votre équipe d’investissement.') : txt(lang, 'Documents shared with Alinea and any source files you submitted.', 'Documents partagés avec Alinea et fichiers sources transmis.')}</p></div>{tab === 'overview' && <button className="primary-button" onClick={() => { setTab('report'); setActiveRequest(null); }}><Plus size={16} />{txt(lang, 'New report', 'Nouveau rapport')}</button>}</div>

        {submitted && <div className="founder-success"><span><CheckCircle2 size={19} /></span><div><strong>{txt(lang, 'Report received', 'Rapport reçu')}</strong><p>{txt(lang, 'Your submission is queued for human review. It will not appear as verified until a reviewer accepts it.', 'Votre transmission est en file de vérification humaine. Elle n’apparaîtra comme vérifiée qu’après acceptation.')}</p></div><button className="text-button" onClick={() => setSubmitted(false)}>{txt(lang, 'Dismiss', 'Fermer')}</button></div>}

        {tab === 'overview' && <>
          <div className="founder-metrics">{metrics.map((metric) => <div key={metric.label}><small>{metric.label}</small><strong className={metric.verified ? '' : 'missing-value'}>{metric.value}</strong><span>{metric.verified ? <><Check size={12} />{txt(lang, 'Verified by Alinea', 'Vérifié par Alinea')}</> : <>{txt(lang, 'Not yet reported', 'Pas encore déclaré')}</>}</span></div>)}</div>
          <div className="founder-grid">
            <section className="founder-card"><div className="founder-card-head"><h2>{txt(lang, 'Reporting status', 'Statut du reporting')}</h2><span className={`status-badge ${company.reportingStatus === 'overdue' ? 'status-rejected' : company.reportingStatus === 'complete' ? 'status-verified' : 'status-pending'}`}>{company.reportingStatus === 'overdue' ? txt(lang, 'Overdue', 'En retard') : company.reportingStatus === 'complete' ? txt(lang, 'Complete', 'Complet') : txt(lang, 'Due soon', 'Bientôt dû')}</span></div><div className="founder-period"><span className="meeting-date-tile"><strong>{new Date(company.dueDate).getDate()}</strong><small>{new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).format(new Date(company.dueDate)).toUpperCase()}</small></span><div><strong>{company.period[lang]} {txt(lang, 'report', 'rapport')}</strong><p>{txt(lang, 'Due', 'Échéance')} · {new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'long' }).format(new Date(company.dueDate))}</p><span>{txt(lang, 'Quarterly reporting · due 15 days post-period', 'Reporting trimestriel · dû 15 jours après la période')}</span></div><button className="secondary-button" onClick={() => { setTab('report'); setActiveRequest(null); }}>{txt(lang, 'Start update', 'Commencer')}<ArrowRight size={15} /></button></div><div className="completeness-row"><span>{txt(lang, 'Your current record completeness', 'Complétude actuelle de votre dossier')}</span><strong>{company.completeness}%</strong></div><div className="progress-track"><span style={{ width: `${company.completeness}%` }} /></div><p className="founder-hint"><Info size={14} />{txt(lang, 'Missing values are never shown as zero. Nothing is published without review.', 'Les valeurs manquantes ne sont jamais affichées comme zéro. Rien n’est publié sans vérification.')}</p></section>
            <section className="founder-card"><div className="founder-card-head"><h2>{txt(lang, 'Open requests', 'Demandes ouvertes')}</h2><button className="subtle-link" onClick={() => setTab('requests')}>{txt(lang, 'View all', 'Tout voir')}<ArrowRight size={14} /></button></div><div className="founder-request-list">{openRequests.slice(0, 3).map((request) => <button key={request.id} onClick={() => startRequest(request)}><span className={`request-icon ${request.status}`}><FileCheck2 size={17} /></span><span><strong>{request.title[lang]}</strong><small>{txt(lang, 'Due', 'Échéance')} {new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(request.dueDate))} · {request.requestedBy}</small></span><ChevronRight size={16} /></button>)}</div><button className="secondary-button full-width-button" onClick={() => setTab('requests')}>{txt(lang, 'Answer a request', 'Répondre à une demande')}</button></section>
          </div>
          <section className="founder-guidance"><span><Sparkles size={20} /></span><div><strong>{txt(lang, 'What makes a strong update?', 'Qu’est-ce qu’une bonne mise à jour ?')}</strong><p>{txt(lang, 'Lead with revenue, growth, runway, and the two or three decisions your board should understand. Attach the underlying report so our team can verify each figure against its source.', 'Commencez par les revenus, la croissance, l’autonomie et les deux ou trois décisions que votre conseil doit comprendre. Joignez le rapport sous-jacent pour que notre équipe vérifie chaque chiffre à sa source.')}</p></div></section>
        </>}

        {tab === 'report' && <div className="founder-report-layout"><form className="founder-card founder-report-form" onSubmit={submit}>{activeRequest && <div className="founder-request-context"><FileCheck2 size={17} /><div><strong>{requests.find((request) => request.id === activeRequest)?.title[lang]}</strong><span>{txt(lang, 'Responding to an Alinea request', 'Réponse à une demande Alinea')}</span></div><button type="button" className="text-button" onClick={() => setActiveRequest(null)}>{txt(lang, 'Clear', 'Effacer')}</button></div>}<div className="founder-form-heading"><span className="founder-step">01</span><div><h2>{txt(lang, 'Operating period', 'Période opérationnelle')}</h2><p>{txt(lang, 'Choose the reporting period for this update.', 'Choisissez la période de cette mise à jour.')}</p></div></div><div className="form-grid"><div className="form-field"><label htmlFor="founder-period">{txt(lang, 'Reporting period', 'Période de reporting')}</label><input id="founder-period" value={period} onChange={(event) => setPeriod(event.target.value)} required /></div><div className="form-field"><label htmlFor="founder-cash">{txt(lang, 'Cash balance (€)', 'Trésorerie (€)')}</label><input id="founder-cash" value={cash} onChange={(event) => setCash(event.target.value)} placeholder="e.g. 3,200,000" /></div></div><div className="founder-form-heading"><span className="founder-step">02</span><div><h2>{txt(lang, 'Headline metrics', 'Indicateurs clés')}</h2><p>{txt(lang, 'Leave a field blank if unreported. Blank is stored as Missing.', 'Laissez vide si une donnée n’est pas disponible. Une valeur vide est enregistrée comme manquante.')}</p></div></div><div className="form-grid"><div className="form-field"><label htmlFor="founder-arr">{txt(lang, 'Annual recurring revenue', 'Revenu annuel récurrent')}</label><input id="founder-arr" value={arr} onChange={(event) => setArr(event.target.value)} placeholder="e.g. €9.1M" /></div><div className="form-field"><label htmlFor="founder-growth">{txt(lang, 'Year-over-year growth', 'Croissance annuelle')}</label><input id="founder-growth" value={growth} onChange={(event) => setGrowth(event.target.value)} placeholder="e.g. 42%" /></div></div><div className="form-field"><label htmlFor="founder-notes">{txt(lang, 'Operating update', 'Point opérationnel')}</label><textarea id="founder-notes" rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={txt(lang, 'What changed, what you need, and what comes next…', 'Ce qui a changé, ce dont vous avez besoin et la suite…')} /></div><div className="form-field"><label>{txt(lang, 'Source document', 'Document source')}</label><label className="founder-file-upload"><UploadCloud size={20} /><span><strong>{file?.name ?? txt(lang, 'Attach the underlying report', 'Joindre le rapport sous-jacent')}</strong><small>{txt(lang, 'PDF or XLSX · used to verify figures', 'PDF ou XLSX · utilisé pour vérifier les chiffres')}</small></span><input type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label></div>{error && <p className="login-error">{error}</p>}<div className="founder-form-footer"><p><ShieldCheck size={14} />{txt(lang, 'Submitted to a human review queue. Original values are preserved.', 'Transmis à une file de vérification humaine. Les valeurs d’origine sont conservées.')}</p><button className="primary-button" type="submit"><Send size={16} />{txt(lang, 'Submit for review', 'Transmettre pour vérification')}</button></div></form><aside className="founder-report-aside"><div className="founder-card"><h3>{txt(lang, 'Before you submit', 'Avant de transmettre')}</h3><ul><li><Check size={14} />{txt(lang, 'Figures match the attached report', 'Les chiffres correspondent au rapport joint')}</li><li><Check size={14} />{txt(lang, 'Period is clearly identified', 'La période est clairement identifiée')}</li><li><Check size={14} />{txt(lang, 'Unreported fields are left blank', 'Les champs non renseignés restent vides')}</li><li><Check size={14} />{txt(lang, 'Board context is reflected in the update', 'Le contexte du conseil est reflété')}</li></ul></div><div className="founder-review-note"><Clock3 size={18} /><div><strong>{txt(lang, 'What happens next?', 'Et ensuite ?')}</strong><p>{txt(lang, 'A reviewer checks your report against its source. They may ask a follow-up before accepting or correcting a figure. You will see verified figures here.', 'Un vérificateur contrôle votre rapport à sa source. Il peut poser une question avant d’accepter ou de corriger un chiffre. Les chiffres vérifiés apparaîtront ici.')}</p></div></div></aside></div>}

        {tab === 'requests' && <div className="founder-request-grid">{requests.map((request) => <article className="founder-card request-card" key={request.id}><div className="request-card-top"><span className={`request-icon ${request.status}`}><FileCheck2 size={18} /></span><span className={`status-badge ${request.status === 'open' ? 'status-pending' : 'status-verified'}`}>{request.status === 'open' ? txt(lang, 'Open', 'Ouverte') : request.status === 'submitted' ? txt(lang, 'Submitted', 'Transmise') : txt(lang, 'Complete', 'Terminée')}</span></div><h3>{request.title[lang]}</h3><p>{request.detail[lang]}</p><div className="request-meta"><span><CalendarDays size={14} />{txt(lang, 'Due', 'Échéance')} {new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'medium' }).format(new Date(request.dueDate))}</span><span>{request.requestedBy}</span></div><button className="secondary-button" onClick={() => startRequest(request)}>{request.status === 'open' ? txt(lang, 'Respond', 'Répondre') : txt(lang, 'Update response', 'Actualiser la réponse')}<ArrowRight size={15} /></button></article>)}</div>}

        {tab === 'files' && <div className="founder-file-table"><div className="founder-card"><h2>{txt(lang, 'Submitted sources', 'Sources transmises')}</h2><div className="founder-file-row"><span className="file-icon"><FileText size={18} /></span><div><strong>Canopy Q2 financial report</strong><small>PDF · 2.4 MB · {txt(lang, 'Submitted by Sophie Chen', 'Transmis par Sophie Chen')}</small></div><span className="status-badge status-verified">{txt(lang, 'Filed', 'Classé')}</span><button className="text-button" onClick={() => window.alert(txt(lang, 'This demo opens the filed source summary in the main workspace.', 'Cette démo ouvre le résumé de la source classée dans l’espace principal.'))}>{txt(lang, 'Open', 'Ouvrir')}</button></div><div className="founder-file-row"><span className="file-icon"><FileText size={18} /></span><div><strong>FY2027 operating plan</strong><small>XLSX · 1.2 MB · {txt(lang, 'Submitted by Sophie Chen', 'Transmis par Sophie Chen')}</small></div><span className="status-badge status-pending">{txt(lang, 'In review', 'En vérification')}</span><button className="text-button" onClick={() => window.alert(txt(lang, 'This demo opens the filed source summary in the main workspace.', 'Cette démo ouvre le résumé de la source classée dans l’espace principal.'))}>{txt(lang, 'Open', 'Ouvrir')}</button></div><div className="founder-file-row"><span className="file-icon"><FileText size={18} /></span><div><strong>Customer concentration schedule</strong><small>PDF · 480 KB · {txt(lang, 'Submitted by Sophie Chen', 'Transmis par Sophie Chen')}</small></div><span className="status-badge status-verified">{txt(lang, 'Filed', 'Classé')}</span><button className="text-button" onClick={() => window.alert(txt(lang, 'This demo opens the filed source summary in the main workspace.', 'Cette démo ouvre le résumé de la source classée dans l’espace principal.'))}>{txt(lang, 'Open', 'Ouvrir')}</button></div></div></div>}
      </main>
    </div>
  </div>;
}
