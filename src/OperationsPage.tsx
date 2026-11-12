import { useState } from 'react';
import {
  AlertTriangle, ArrowDown, ArrowUp, Check, Copy,
  FileSpreadsheet, FileText, GripVertical, Link2, Mail, Plus,
  RefreshCw, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles, Trash2,
  UploadCloud, Video, X, type LucideIcon,
} from 'lucide-react';
import type { Lang } from './data';
import { customFields, initialIntegrations, initialJobs, initialStagedImports, type AutomationJob, type Integration, type PipelineStep, type StagedImport } from './workspace-data';

type OpsTab = 'queue' | 'integrations' | 'imports' | 'pipeline';

interface OperationsPageProps {
  lang: Lang;
  steps: PipelineStep[];
  setSteps: (steps: PipelineStep[]) => void;
  existingDealNames: string[];
  onApproveStaged: (item: StagedImport) => void;
  onToast: (message: string) => void;
}

const txt = (lang: Lang, en: string, fr: string) => lang === 'en' ? en : fr;

const jobIcon: Record<AutomationJob['kind'], LucideIcon> = {
  email: Mail, document: FileText, enrichment: Sparkles, extraction: FileSpreadsheet, meeting: Video, reply: Copy,
};

export default function OperationsPage({ lang, steps, setSteps, existingDealNames, onApproveStaged, onToast }: OperationsPageProps) {
  const [tab, setTab] = useState<OpsTab>('queue');
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    try { return JSON.parse(localStorage.getItem('alinea-v2-integrations') || '') as Integration[]; } catch { return initialIntegrations; }
  });
  const [jobs, setJobs] = useState<AutomationJob[]>(() => {
    try { return JSON.parse(localStorage.getItem('alinea-v2-jobs') || '') as AutomationJob[]; } catch { return initialJobs; }
  });
  const [staged, setStaged] = useState<StagedImport[]>(initialStagedImports);
  const [linkValue, setLinkValue] = useState('');
  const [fields, setFields] = useState(customFields);
  const [newField, setNewField] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [stepLabel, setStepLabel] = useState('');

  const saveIntegrations = (next: Integration[]) => {
    setIntegrations(next);
    localStorage.setItem('alinea-v2-integrations', JSON.stringify(next));
  };
  const saveJobs = (next: AutomationJob[]) => {
    setJobs(next);
    localStorage.setItem('alinea-v2-jobs', JSON.stringify(next));
  };
  const activeJobs = jobs.filter((job) => job.status === 'running' || job.status === 'queued').length;

  const toggleIntegration = (id: string) => {
    const next = integrations.map((integration) => integration.id === id ? {
      ...integration,
      status: integration.status === 'connected' ? 'disconnected' as const : 'connected' as const,
      lastSync: integration.status === 'connected' ? integration.lastSync : new Date().toISOString(),
    } : integration);
    saveIntegrations(next);
    onToast(txt(lang, 'Integration status updated.', 'Statut de l’intégration mis à jour.'));
  };
  const syncIntegration = (id: string) => {
    saveIntegrations(integrations.map((integration) => integration.id === id ? { ...integration, lastSync: new Date().toISOString(), status: 'connected' } : integration));
    onToast(txt(lang, 'Connector synced. Sources remained read-only.', 'Connecteur synchronisé. Les sources restent en lecture seule.'));
  };
  const retryJob = (id: string) => {
    saveJobs(jobs.map((job) => job.id === id ? { ...job, status: 'running', attempts: job.attempts + 1 } : job));
    window.setTimeout(() => {
      saveJobs(jobs.map((job) => job.id === id ? { ...job, status: 'complete', duration: '1.9s' } : job));
    }, 1200);
  };

  const importLink = () => {
    if (!linkValue.trim()) return;
    const name = linkValue.split('/').find((part) => part.length > 2)?.replace(/[-_]/g, ' ') || 'Imported prospect';
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const duplicate = existingDealNames.some((dealName) => dealName.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalized);
    setStaged((current) => [{
      id: `staged-${Date.now()}`, fileName: linkValue.slice(0, 46), source: 'link', companyName: name,
      normalizedKey: normalized, hash: Math.random().toString(16).slice(2, 8) + '…' + Math.random().toString(16).slice(2, 6),
      found: 3, confidence: duplicate ? 100 : 84, duplicate, importedAt: new Date().toISOString(),
    }, ...current]);
    setLinkValue('');
    onToast(duplicate
      ? txt(lang, 'Duplicate detected by normalized name. Nothing was created.', 'Doublon détecté par nom normalisé. Aucune création.')
      : txt(lang, 'Link parsed into staging. Review before creating a deal.', 'Lien analysé en zone de préparation. Vérifiez avant de créer un dossier.'));
  };
  const approveStaged = (item: StagedImport) => {
    if (item.duplicate) {
      onToast(txt(lang, 'Duplicate blocked by SHA-256 and normalized name.', 'Doublon bloqué par SHA-256 et nom normalisé.'));
      return;
    }
    onApproveStaged(item);
    setStaged((current) => current.filter((entry) => entry.id !== item.id));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
    onToast(txt(lang, 'Pipeline steps reordered.', 'Étapes du pipeline réorganisées.'));
  };

  const importKind = (kind: StagedImport['source']) => kind === 'pdf' ? <FileText size={16} /> : kind === 'csv' ? <FileSpreadsheet size={16} /> : <Link2 size={16} />;

  const tabs: { id: OpsTab; label: string; count?: number }[] = [
    { id: 'queue', label: txt(lang, 'Worker queue', 'File de traitement'), count: activeJobs },
    { id: 'integrations', label: txt(lang, 'Integrations', 'Intégrations') },
    { id: 'imports', label: txt(lang, 'Intake staging', 'Préparation d’intake'), count: staged.filter((item) => item.duplicate).length },
    { id: 'pipeline', label: txt(lang, 'Pipeline config', 'Configuration pipeline') },
  ];

  return <>
    <div className="page-heading"><div><p className="page-eyebrow">ALINEA OPERATIONS</p><h1>{txt(lang, 'Data operations', 'Opérations de données')}</h1><p className="page-subtitle">{txt(lang, 'Every automated action is visible, idempotent, and human-supervised.', 'Chaque action automatisée est visible, idempotente et supervisée par une personne.')}</p></div><span className="eu-hosting-badge"><ShieldCheck size={15} />{txt(lang, 'EU data residency', 'Données hébergées dans l’UE')}</span></div>
    <div className="ops-kpis">
      <div><span className="ops-kpi-icon"><RefreshCw size={18} /></span><div><small>{txt(lang, 'Jobs today', 'Tâches aujourd’hui')}</small><strong>128</strong><em>{loadText(lang, 'All mutations logged')}</em></div></div>
      <div><span className="ops-kpi-icon"><ShieldCheck size={18} /></span><div><small>{txt(lang, 'Idempotency', 'Idempotence')}</small><strong>100%</strong><em>{loadText(lang, 'No duplicate ingestion')}</em></div></div>
      <div><span className="ops-kpi-icon"><AlertTriangle size={18} /></span><div><small>{txt(lang, 'Awaiting human review', 'En attente humaine')}</small><strong>{staged.filter((item) => !item.duplicate).length + 3}</strong><em>{loadText(lang, 'AI output is never fact')}</em></div></div>
    </div>
    <div className="page-tools ops-tabs"><div className="line-tabs" role="tablist">{tabs.map((item) => <button key={item.id} role="tab" aria-selected={tab === item.id} className={`line-tab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>{item.label}{item.count ? <span className="tab-count">{item.count}</span> : null}</button>)}</div><span className="ops-live"><i />{txt(lang, 'Live worker', 'Worker actif')}</span></div>

    {tab === 'queue' && <div className="ops-two-column">
      <section className="ops-panel"><div className="ops-panel-heading"><div><h2>{txt(lang, 'Background worker queue', 'File de traitement en arrière-plan')}</h2><p>{txt(lang, 'Mail reading, enrichment, extraction, and meeting sync. Retries preserve the same idempotency key.', 'Lecture des courriels, enrichissement, extraction et synchronisation des réunions. Les relances conservent la même clé d’idempotence.')}</p></div><span className="status-badge status-verified">{activeJobs} {txt(lang, 'active', 'actives')}</span></div>
        <div className="job-table"><div className="job-table-head"><span>{txt(lang, 'Job', 'Tâche')}</span><span>{txt(lang, 'Status', 'Statut')}</span><span>{txt(lang, 'Attempts', 'Tentatives')}</span><span>{txt(lang, 'Idempotency key', 'Clé d’idempotence')}</span><span /></div>
          {jobs.map((job) => { const Icon = jobIcon[job.kind]; return <div className="job-row" key={job.id}><span className={`job-icon ${job.kind}`}><Icon size={16} /></span><span className="job-title"><strong>{job.title[lang]}</strong><small>{job.detail[lang]}</small></span><span className={`job-status ${job.status}`}><i />{job.status === 'complete' ? txt(lang, 'Complete', 'Terminée') : job.status === 'running' ? txt(lang, 'Running', 'En cours') : job.status === 'queued' ? txt(lang, 'Queued', 'En file') : txt(lang, 'Failed', 'Échec')}</span><span className="job-meta">{job.attempts}<small>{job.duration}</small></span><code className="job-key">{job.idempotencyKey}</code><button className="icon-button" title={txt(lang, 'Retry with same idempotency key', 'Relancer avec la même clé')} onClick={() => retryJob(job.id)}><RotateCcw size={15} /></button></div>; })}
        </div>
      </section>
      <aside className="ops-aside"><div className="ops-note"><Sparkles size={18} /><div><strong>{txt(lang, 'Claude stays grounded', 'Claude reste ancré')}</strong><p>{txt(lang, 'Claude extracts and enriches, but never publishes a figure. Every claim enters the review queue with its original source excerpt.', 'Claude extrait et enrichit, mais ne publie jamais un chiffre. Chaque donnée entre dans la file de vérification avec son extrait source.')}</p></div></div><div className="ops-note"><ShieldCheck size={18} /><div><strong>{txt(lang, 'Zero model training', 'Aucun entraînement')}</strong><p>{txt(lang, 'Portfolio and deal data are not used to train models. Prompts retain only the minimum context needed to answer.', 'Les données du portefeuille et des transactions ne servent pas à entraîner de modèles. Les requêtes ne conservent que le contexte nécessaire.')}</p></div></div><div className="ops-note"><FileText size={18} /><div><strong>{txt(lang, 'Deduplication', 'Déduplication')}</strong><p>{txt(lang, 'Emails use Internet Message-IDs. Files use SHA-256. Normalised names block duplicate deal creation.', 'Les courriels utilisent les Internet Message-ID. Les fichiers utilisent SHA-256. Les noms normalisés bloquent les doublons.')}</p></div></div></aside>
    </div>}

    {tab === 'integrations' && <div className="integration-grid">{integrations.map((integration) => <article className="integration-card" key={integration.id}><div className="integration-card-top"><span className="integration-mark">{integration.name.charAt(0)}</span><span className={`status-badge ${integration.status === 'connected' ? 'status-verified' : 'status-neutral'}`}><i />{integration.status === 'connected' ? txt(lang, 'Connected', 'Connecté') : txt(lang, 'Disconnected', 'Déconnecté')}</span></div><h3>{integration.name}</h3><p>{integration.description[lang]}</p><div className="integration-detail">{integration.detail[lang]}</div><div className="integration-footer"><span>{integration.lastSync ? `${txt(lang, 'Last sync', 'Dernière sync')} · ${new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(integration.lastSync))}` : txt(lang, 'Not yet connected', 'Pas encore connecté')}</span><div><button className="icon-button" onClick={() => syncIntegration(integration.id)} aria-label={txt(lang, 'Sync now', 'Synchroniser')}><RefreshCw size={15} /></button><button className="text-button" onClick={() => toggleIntegration(integration.id)}>{integration.status === 'connected' ? txt(lang, 'Disconnect', 'Déconnecter') : txt(lang, 'Connect', 'Connecter')}</button></div></div></article>)}</div>}

    {tab === 'imports' && <section className="ops-panel"><div className="ops-panel-heading"><div><h2>{txt(lang, 'Intake staging', 'Zone de préparation d’intake')}</h2><p>{txt(lang, 'PDF, CSV, and shared links are parsed here. Duplicate checks run before any record is created.', 'Les PDF, CSV et liens partagés sont analysés ici. Les contrôles de doublons s’exécutent avant toute création.')}</p></div><span className="status-badge status-pending">{staged.length} {txt(lang, 'staged', 'en attente')}</span></div><div className="link-import"><Link2 size={17} /><input value={linkValue} onChange={(event) => setLinkValue(event.target.value)} placeholder={txt(lang, 'Paste a shared deck or company link…', 'Collez un lien de présentation ou d’entreprise…')} aria-label={txt(lang, 'Shared link', 'Lien partagé')} /><button className="primary-button" onClick={importLink}><UploadCloud size={15} />{txt(lang, 'Parse link', 'Analyser le lien')}</button></div><div className="staged-table"><div className="staged-head"><span>{txt(lang, 'Source', 'Source')}</span><span>{txt(lang, 'Company', 'Entreprise')}</span><span>{txt(lang, 'Signal', 'Signal')}</span><span>{txt(lang, 'Identity', 'Identité')}</span><span /></div>{staged.map((item) => <div className={`staged-row ${item.duplicate ? 'is-duplicate' : ''}`} key={item.id}><span className="staged-source">{importKind(item.source)}<span><strong>{item.fileName}</strong><small>{item.source.toUpperCase()} · {new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(item.importedAt))}</small></span></span><span className="staged-company"><strong>{item.companyName}</strong><small>{item.normalizedKey}</small></span><span className="staged-signal"><strong>{item.confidence}%</strong><small>{item.found} {txt(lang, 'claims found', 'données trouvées')}</small></span><span className="staged-identity">{item.duplicate ? <span className="duplicate-flag"><AlertTriangle size={13} />{txt(lang, 'Duplicate', 'Doublon')}</span> : <code>{item.hash}</code>}</span><span className="staged-actions"><button className="icon-button" aria-label={txt(lang, 'Reject import', 'Rejeter')} onClick={() => setStaged((current) => current.filter((entry) => entry.id !== item.id))}><X size={16} /></button><button className="primary-button small" onClick={() => approveStaged(item)} disabled={item.duplicate}><Check size={14} />{txt(lang, 'Create deal', 'Créer le dossier')}</button></span></div>)}</div></section>}

    {tab === 'pipeline' && <div className="pipeline-config-layout"><section className="ops-panel"><div className="ops-panel-heading"><div><h2>{txt(lang, 'Pipeline statuses', 'Statuts du pipeline')}</h2><p>{txt(lang, 'Rename, reorder, or retire steps. Retired steps remain in historical records.', 'Renommez, réorganisez ou retirez des étapes. Les étapes retirées restent dans l’historique.')}</p></div><SlidersHorizontal size={19} /></div><div className="config-step-list">{steps.map((step, index) => <div className="config-step-row" key={step.id}><GripVertical size={16} className="grip" />{editingStep === step.id ? <input autoFocus value={stepLabel} onChange={(event) => setStepLabel(event.target.value)} onBlur={() => { setSteps(steps.map((entry) => entry.id === step.id ? { ...entry, label: { en: stepLabel, fr: stepLabel } } : entry)); setEditingStep(null); }} onKeyDown={(event) => { if (event.key === 'Enter') (event.target as HTMLInputElement).blur(); }} /> : <button className="config-step-name" onClick={() => { setEditingStep(step.id); setStepLabel(step.label[lang]); }}>{step.label[lang]}<small>{step.reached} {txt(lang, 'reached this step', 'ont atteint cette étape')}</small></button>}<span className={`status-badge ${step.active ? 'status-verified' : 'status-neutral'}`}>{step.active ? txt(lang, 'Active', 'Actif') : txt(lang, 'Retired', 'Retiré')}</span><div className="config-step-actions"><button className="icon-button" onClick={() => moveStep(index, -1)} aria-label={txt(lang, 'Move up', 'Monter')}><ArrowUp size={15} /></button><button className="icon-button" onClick={() => moveStep(index, 1)} aria-label={txt(lang, 'Move down', 'Descendre')}><ArrowDown size={15} /></button><button className="text-button" onClick={() => setSteps(steps.map((entry) => entry.id === step.id ? { ...entry, active: !entry.active } : entry))}>{step.active ? txt(lang, 'Retire', 'Retirer') : txt(lang, 'Restore', 'Restaurer')}</button></div></div>)}</div></section><section className="ops-panel"><div className="ops-panel-heading"><div><h2>{txt(lang, 'Custom fields', 'Champs personnalisés')}</h2><p>{txt(lang, 'Custom fields are validated per type and preserved in every revision.', 'Les champs personnalisés sont validés par type et conservés dans chaque révision.')}</p></div><Plus size={19} /></div><div className="custom-fields-list">{fields.map((field) => <div key={field.id}><span><strong>{field.name[lang]}</strong><small>{field.type}</small></span><button className="icon-button" onClick={() => { setFields(fields.filter((entry) => entry.id !== field.id)); onToast(txt(lang, 'Custom field removed.', 'Champ personnalisé supprimé.')); }} aria-label={txt(lang, 'Delete field', 'Supprimer le champ')}><Trash2 size={15} /></button></div>)}</div><form className="custom-field-form" onSubmit={(event) => { event.preventDefault(); if (!newField.trim()) return; setFields([...fields, { id: `cf-${Date.now()}`, name: { en: newField, fr: newField }, type: newFieldType }]); setNewField(''); onToast(txt(lang, 'Custom field created.', 'Champ personnalisé créé.')); }}><input value={newField} onChange={(event) => setNewField(event.target.value)} placeholder={txt(lang, 'Field name', 'Nom du champ')} /><select value={newFieldType} onChange={(event) => setNewFieldType(event.target.value)}><option value="text">{txt(lang, 'Text', 'Texte')}</option><option value="number">{txt(lang, 'Number', 'Nombre')}</option><option value="date">{txt(lang, 'Date', 'Date')}</option><option value="dropdown">{txt(lang, 'Dropdown', 'Liste')}</option><option value="checkbox">{txt(lang, 'Checkboxes', 'Cases à cocher')}</option><option value="yes_no">{txt(lang, 'Yes / No', 'Oui / Non')}</option></select><button className="primary-button" type="submit"><Plus size={15} />{txt(lang, 'Add field', 'Ajouter')}</button></form></section></div>}
  </>;
}

function loadText(lang: Lang, en: string) {
  return lang === 'en' ? en : en === 'All mutations logged' ? 'Toutes les modifications journalisées' : en === 'No duplicate ingestion' ? 'Aucun doublon ingéré' : 'La sortie IA n’est jamais un fait';
}
