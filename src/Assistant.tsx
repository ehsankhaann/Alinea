import { useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, FileText, MessageSquareText, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { Company, Deal, DocumentRecord, Lang } from './data';

interface AssistantProps {
  lang: Lang;
  companies: Company[];
  deals: Deal[];
  documents: DocumentRecord[];
  onOpenDocument: (id: string) => void;
}

interface Answer {
  id: number;
  question: string;
  body: string;
  sources: { id: string; label: string }[];
}

const txt = (lang: Lang, en: string, fr: string) => lang === 'en' ? en : fr;

export default function Assistant({ lang, companies, deals, documents, onOpenDocument }: AssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Answer[]>([]);
  const [thinking, setThinking] = useState(false);
  const id = useRef(0);

  const ask = (question: string) => {
    if (!question.trim()) return;
    setThinking(true);
    setInput('');
    window.setTimeout(() => {
      const query = question.toLowerCase();
      const matched = companies.filter((company) => query.includes(company.name.toLowerCase())).slice(0, 2);
      const overdue = companies.filter((company) => company.reportingStatus === 'overdue');
      const citedDocs = documents.filter((doc) => matched.some((company) => company.id === doc.companyId)).slice(0, 2);
      let body: string;
      if (matched.length) {
        const company = matched[0];
        body = txt(lang,
          `${company.name} is in the ${company.period.en} reporting cycle. The verified ARR is ${company.verified.arr ?? 'Missing'}, and the record is ${company.completeness}% complete. ${company.reportingStatus === 'overdue' ? 'The report is overdue, so I would prioritise a founder follow-up.' : 'No reporting escalation is currently required.'} I only read from reviewed claims and source documents.`,
          `${company.name} se trouve dans le cycle de reporting ${company.period.fr}. Le RRA vérifié est ${company.verified.arr ?? 'Manquant'} et le dossier est complet à ${company.completeness} %. ${company.reportingStatus === 'overdue' ? 'Le rapport est en retard ; je recommande une relance du fondateur.' : 'Aucune escalade de reporting n’est nécessaire actuellement.'} Je m’appuie uniquement sur les données vérifiées et les documents sources.`);
      } else if (/(overdue|retard|report|rapport)/.test(query)) {
        body = txt(lang,
          `${overdue.length} portfolio companies are overdue on their latest report: ${overdue.map((company) => company.name).join(', ')}. One additional conflicting ARR claim is isolated in the review queue and has not changed the verified record.`,
          `${overdue.length} entreprises du portefeuille sont en retard sur leur dernier rapport : ${overdue.map((company) => company.name).join(', ')}. Une autre déclaration de RRA en conflit reste isolée dans la file de vérification et n’a pas modifié le dossier vérifié.`);
      } else if (/(deal|pipeline|dossier)/.test(query)) {
        const active = deals.filter((deal) => !['no_go', 'invested'].includes(deal.stage));
        body = txt(lang,
          `There are ${active.length} active opportunities across the pipeline. ${deals.filter((deal) => deal.stage === 'diligence').length} are in due diligence and ${deals.filter((deal) => deal.stage === 'ic').length} are at IC review. The highest-priority next action is the Canopy IC memo, followed by the Harbor Labs technical diligence call.`,
          `${active.length} opportunités sont actives dans le pipeline. ${deals.filter((deal) => deal.stage === 'diligence').length} sont en due diligence et ${deals.filter((deal) => deal.stage === 'ic').length} au comité d’investissement. La prochaine action prioritaire est le mémo CI de Canopy, suivie de l’appel technique de Harbor Labs.`);
      } else if (/(review|vérif|verif|conflict|conflit)/.test(query)) {
        body = txt(lang,
          `The queue currently contains one conflict and three pending claims. For Basis, two ARR values (€8.1M reported and €7.7M from a public registry) are retained side by side. Both remain outside the verified record until a reviewer reconciles them.`,
          `La file contient actuellement un conflit et trois déclarations en attente. Pour Basis, deux valeurs de RRA (8,1 M€ déclarés et 7,7 M€ selon un registre public) sont conservées côte à côte. Les deux restent hors du dossier vérifié jusqu’à réconciliation humaine.`);
      } else {
        body = txt(lang,
          `I can answer with source-grounded context about the ${companies.length} companies, ${deals.length} opportunities, incoming documents, and the review queue. Ask me about a company, overdue reports, the pipeline, or a specific claim. I will cite the sources I use and never publish an unreviewed figure.`,
          `Je peux répondre à partir de ${companies.length} entreprises, ${deals.length} opportunités, des documents reçus et de la file de vérification. Interrogez-moi sur une entreprise, un rapport en retard, le pipeline ou une donnée précise. Je cite mes sources et ne publie jamais un chiffre non vérifié.`);
      }
      const sources = [
        ...citedDocs.map((doc) => ({ id: doc.id, label: doc.title })),
        ...matched.map((company) => ({ id: `company-${company.id}`, label: `${company.name} · ${company.period[lang]}` })),
        { id: 'review-queue', label: txt(lang, 'Review queue · current state', 'File de vérification · état actuel') },
      ].slice(0, Math.max(2, citedDocs.length + 1));
      setMessages((current) => [...current, { id: ++id.current, question, body, sources }]);
      setThinking(false);
    }, 650);
  };

  const submit = (event: FormEvent) => { event.preventDefault(); ask(input); };
  const suggestions = lang === 'en'
    ? ['Which portfolio reports are overdue?', 'What is happening in the deal pipeline?', 'Summarise the Basis conflict', 'Give me a Canopy update']
    : ['Quels rapports sont en retard ?', 'Où en est le pipeline ?', 'Résume le conflit Basis', 'Fais le point sur Canopy'];

  return <div className={`assistant-root ${open ? 'is-open' : ''}`}>
    {open && <section className="assistant-panel" aria-label={txt(lang, 'Alinea assistant', 'Assistant Alinea')}><header><div className="assistant-title"><span><Sparkles size={18} /></span><div><strong>{txt(lang, 'Alinea assistant', 'Assistant Alinea')}</strong><small><i />{txt(lang, 'Source-grounded · Claude', 'Ancré sur les sources · Claude')}</small></div></div><button className="icon-button" onClick={() => setOpen(false)} aria-label={txt(lang, 'Close assistant', 'Fermer l’assistant')}><X size={19} /></button></header><div className="assistant-security"><ShieldCheck size={13} />{txt(lang, 'No training on firm data · sources cited · review required', 'Aucun entraînement sur vos données · sources citées · vérification requise')}</div><div className="assistant-thread">{messages.length === 0 && <div className="assistant-empty"><span><Bot size={23} /></span><h3>{txt(lang, 'Ask your workspace.', 'Interrogez votre espace.')}</h3><p>{txt(lang, 'I can summarise reporting, deals, and source material. Every answer links to its evidence.', 'Je peux synthétiser le reporting, les dossiers et les sources. Chaque réponse renvoie à ses preuves.')}</p><div className="assistant-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)}>{suggestion}<ArrowUp size={13} /></button>)}</div></div>}{messages.map((message) => <div className="assistant-message" key={message.id}><div className="assistant-question">{message.question}</div><div className="assistant-answer"><span className="assistant-avatar"><Sparkles size={14} /></span><div><p>{message.body}</p><div className="assistant-sources"><span><MessageSquareText size={13} />{txt(lang, 'Sources', 'Sources')}</span>{message.sources.map((source) => source.id.startsWith('doc-') ? <button key={source.id} onClick={() => onOpenDocument(source.id)}><FileText size={12} />{source.label}</button> : <small key={source.id}>{source.label}</small>)}</div></div></div></div>)}{thinking && <div className="assistant-thinking"><span><Sparkles size={14} /></span>{txt(lang, 'Reading verified records and sources…', 'Lecture des dossiers vérifiés et des sources…')}</div>}</div><form className="assistant-input" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={txt(lang, 'Ask about the portfolio or pipeline…', 'Une question sur le portefeuille ou le pipeline…')} aria-label={txt(lang, 'Ask the assistant', 'Interroger l’assistant')} /><button type="submit" aria-label={txt(lang, 'Send', 'Envoyer')} disabled={!input.trim()}><ArrowUp size={17} /></button></form><footer>{txt(lang, 'Answers are decision support, not verified facts.', 'Les réponses sont une aide à la décision, pas des faits vérifiés.')}</footer></section>}
    <button className="assistant-launcher" onClick={() => setOpen((value) => !value)} aria-label={txt(lang, 'Open Alinea assistant', 'Ouvrir l’assistant Alinea')}>{open ? <X size={20} /> : <><span><Sparkles size={18} /></span><b>{txt(lang, 'Ask Alinea', 'Demander à Alinea')}</b></>}</button>
  </div>;
}
