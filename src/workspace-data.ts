import { bi, dateOffset, type DealStage, type Localized } from './data';

export interface PipelineStep {
  id: DealStage;
  label: Localized;
  active: boolean;
  reached: number;
}

export const initialPipelineSteps: PipelineStep[] = [
  { id: 'mapped', label: bi('Mapped', 'Identifié'), active: true, reached: 64 },
  { id: 'analyse', label: bi('To analyse', 'À analyser'), active: true, reached: 47 },
  { id: 'first_call', label: bi('First call', 'Premier appel'), active: true, reached: 31 },
  { id: 'diligence', label: bi('Due diligence', 'Due diligence'), active: true, reached: 18 },
  { id: 'ic', label: bi('IC review', 'Comité d’investissement'), active: true, reached: 9 },
  { id: 'invested', label: bi('Invested', 'Investi'), active: true, reached: 4 },
  { id: 'no_go', label: bi('No go', 'Non retenu'), active: true, reached: 12 },
];

export interface Integration {
  id: string;
  name: string;
  description: Localized;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  detail: Localized;
}

export const initialIntegrations: Integration[] = [
  {
    id: 'gmail', name: 'Gmail', status: 'connected', lastSync: dateOffset(0, 8),
    description: bi('Read-only access to the shared Dealflow mailbox and portfolio correspondence.', 'Accès en lecture seule à la boîte Dealflow partagée et à la correspondance du portefeuille.'),
    detail: bi('Messages are deduplicated using their Internet Message-ID.', 'Les messages sont dédupliqués grâce à leur Internet Message-ID.'),
  },
  {
    id: 'dropbox', name: 'Dropbox', status: 'connected', lastSync: dateOffset(0, 7),
    description: bi('Mirror each deal folder into the document library with a SHA-256 identity check.', 'Miroir de chaque dossier de transaction dans la bibliothèque avec contrôle SHA-256.'),
    detail: bi('12,481 files indexed · 2 changes today.', '12 481 fichiers indexés · 2 changements aujourd’hui.'),
  },
  {
    id: 'granola', name: 'Granola', status: 'connected', lastSync: dateOffset(0, 6),
    description: bi('Hourly meeting-note sync matched by attendee email and company domain.', 'Synchronisation horaire des notes de réunion par e-mail et domaine d’entreprise.'),
    detail: bi('Last match: Canopy Q2 check-in · 8 attendees.', 'Dernière correspondance : point T2 Canopy · 8 participants.'),
  },
  {
    id: 'claude', name: 'Anthropic Claude', status: 'connected', lastSync: dateOffset(0, 9),
    description: bi('Deal enrichment, source-grounded analysis, and the workspace assistant.', 'Enrichissement, analyse fondée sur les sources et assistant de l’espace.'),
    detail: bi('Zero training on firm data · EU data residency · every answer cites its sources.', 'Aucun entraînement sur les données du cabinet · hébergement UE · chaque réponse cite ses sources.'),
  },
];

export interface AutomationJob {
  id: string;
  kind: 'email' | 'document' | 'enrichment' | 'extraction' | 'meeting' | 'reply';
  title: Localized;
  detail: Localized;
  status: 'queued' | 'running' | 'complete' | 'failed';
  startedAt: string;
  duration: string;
  attempts: number;
  idempotencyKey: string;
}

export const initialJobs: AutomationJob[] = [
  { id: 'job-1', kind: 'email', title: bi('Read shared Dealflow mailbox', 'Lecture de la boîte Dealflow'), detail: bi('3 new messages · 1 duplicate ignored by Message-ID', '3 nouveaux messages · 1 doublon ignoré via Message-ID'), status: 'complete', startedAt: dateOffset(0, 8), duration: '1.2s', attempts: 1, idempotencyKey: 'gmail:msg:18f2a…' },
  { id: 'job-2', kind: 'extraction', title: bi('Extract figures from Canopy Q2 report', 'Extraction des chiffres du rapport T2 de Canopy'), detail: bi('4 figures extracted · 1 sent to human review', '4 chiffres extraits · 1 envoyé à la vérification humaine'), status: 'complete', startedAt: dateOffset(0, 8), duration: '4.8s', attempts: 1, idempotencyKey: 'sha256:7c2d…' },
  { id: 'job-3', kind: 'meeting', title: bi('Sync Granola meeting notes', 'Synchronisation des notes Granola'), detail: bi('Canopy Q2 check-in matched via participant domains', 'Point T2 Canopy associé via les domaines des participants'), status: 'complete', startedAt: dateOffset(0, 6), duration: '2.1s', attempts: 1, idempotencyKey: 'granola:mtg:9912' },
  { id: 'job-4', kind: 'enrichment', title: bi('Enrich Orbit company profile', 'Enrichissement du profil Orbit'), detail: bi('Waiting for a reviewer to accept the sourced claim', 'En attente de l’acceptation d’une source par un vérificateur'), status: 'running', startedAt: dateOffset(0, 8), duration: '12s', attempts: 1, idempotencyKey: 'deal:orbit:enrich:2' },
  { id: 'job-5', kind: 'document', title: bi('Mirror Dropbox deal folders', 'Miroir des dossiers Dropbox'), detail: bi('2 new files · 0 duplicates by SHA-256', '2 nouveaux fichiers · 0 doublon SHA-256'), status: 'complete', startedAt: dateOffset(0, 7), duration: '8.4s', attempts: 1, idempotencyKey: 'dropbox:batch:401' },
  { id: 'job-6', kind: 'reply', title: bi('Draft bilingual pass reply', 'Rédaction d’une réponse bilingue de refus'), detail: bi('Queued after Nook was marked no-go', 'En file après le classement de Nook en non retenu'), status: 'queued', startedAt: dateOffset(0, 8), duration: '—', attempts: 0, idempotencyKey: 'reply:nook:1' },
];

export interface StagedImport {
  id: string;
  fileName: string;
  source: 'pdf' | 'csv' | 'link';
  companyName: string;
  normalizedKey: string;
  hash: string;
  found: number;
  confidence: number;
  duplicate: boolean;
  importedAt: string;
}

export const initialStagedImports: StagedImport[] = [
  { id: 'stage-1', fileName: 'Kestrel_pitch_deck.pdf', source: 'pdf', companyName: 'Kestrel', normalizedKey: 'kestrel', hash: '8f31b6…a70d', found: 14, confidence: 96, duplicate: false, importedAt: dateOffset(0, 8) },
  { id: 'stage-2', fileName: 'dealflow_export.csv', source: 'csv', companyName: 'Orbit', normalizedKey: 'orbit', hash: '1ad09e…be42', found: 7, confidence: 92, duplicate: false, importedAt: dateOffset(0, 8) },
  { id: 'stage-3', fileName: 'Nook_pitch_deck.pdf', source: 'pdf', companyName: 'Nook', normalizedKey: 'nook', hash: 'f0b4e8…71cc', found: 9, confidence: 99, duplicate: true, importedAt: dateOffset(-1), duplicateOf: 'deal-nook' } as StagedImport & { duplicateOf?: string },
  { id: 'stage-4', fileName: 'clover.trust/links', source: 'link', companyName: 'Clover', normalizedKey: 'clover', hash: '6e0f83…2bc1', found: 5, confidence: 87, duplicate: false, importedAt: dateOffset(-2) },
];

export interface DueRequest {
  id: string;
  companyId: string;
  title: Localized;
  detail: Localized;
  dueDate: string;
  status: 'open' | 'submitted' | 'complete';
  requestedBy: string;
}

export const initialDueRequests: DueRequest[] = [
  { id: 'request-canopy-1', companyId: 'canopy', title: bi('Q2 2026 investor report', 'Rapport investisseurs T2 2026'), detail: bi('Submit ARR, gross margin, cash runway, and a short operating update for the quarter ending 30 June.', 'Transmettre le RRA, la marge brute, l’autonomie de trésorerie et un point opérationnel pour le trimestre clos le 30 juin.'), dueDate: dateOffset(4), status: 'open', requestedBy: 'Camille Laurent' },
  { id: 'request-canopy-2', companyId: 'canopy', title: bi('Board-approved operating plan', 'Plan opérationnel approuvé par le conseil'), detail: bi('Please upload the board-approved FY2027 plan and confirm the hiring assumptions.', 'Merci de téléverser le plan FY2027 approuvé par le conseil et de confirmer les hypothèses de recrutement.'), dueDate: dateOffset(12), status: 'open', requestedBy: 'Noah Martin' },
  { id: 'request-canopy-3', companyId: 'canopy', title: bi('Customer concentration schedule', 'Tableau de concentration clients'), detail: bi('A named schedule showing the top ten customers by recurring revenue.', 'Un tableau nominatif des dix principaux clients par revenu récurrent.'), dueDate: dateOffset(-3), status: 'submitted', requestedBy: 'Camille Laurent' },
];

export interface Revision {
  id: string;
  companyId: string;
  metric: Localized;
  previousValue: string;
  newValue: string;
  reviewer: string;
  date: string;
  reason: Localized;
}

export const initialRevisions: Revision[] = [
  { id: 'rev-1', companyId: 'canopy', metric: bi('Annual recurring revenue', 'Revenu annuel récurrent'), previousValue: '€8.0M', newValue: '€8.4M', reviewer: 'Camille Laurent', date: dateOffset(-31), reason: bi('Verified against signed finance report; prior value preserved.', 'Vérifié au regard du rapport financier signé ; valeur précédente conservée.') },
  { id: 'rev-2', companyId: 'mosaic', metric: bi('Gross margin', 'Marge brute'), previousValue: '72%', newValue: '74%', reviewer: 'Camille Laurent', date: dateOffset(-3), reason: bi('Accepted after checking the Q2 board pack.', 'Accepté après vérification du dossier du conseil T2.') },
  { id: 'rev-3', companyId: 'sonder', metric: bi('Annual recurring revenue', 'Revenu annuel récurrent'), previousValue: '€1.8M', newValue: '€1.9M', reviewer: 'Noah Martin', date: dateOffset(-24), reason: bi('Corrected from €1.92M to the source-verified rounded value.', 'Corrigé de 1,92 M€ à la valeur arrondie vérifiée à la source.') },
];

export interface AuditEvent {
  id: string;
  actor: string;
  action: Localized;
  entity: string;
  previous: string;
  next: string;
  at: string;
}

export const initialAudit: AuditEvent[] = [
  { id: 'audit-1', actor: 'Noah Martin', action: bi('Verified claim', 'Créance vérifiée'), entity: 'Canopy · ARR', previous: '€8.4M', next: '€8.4M', at: dateOffset(-1) },
  { id: 'audit-2', actor: 'Camille Laurent', action: bi('Corrected figure', 'Chiffre corrigé'), entity: 'Mosaic · Gross margin', previous: '72%', next: '74%', at: dateOffset(-3) },
  { id: 'audit-3', actor: 'Automation', action: bi('Filed source', 'Source classée'), entity: 'Basis · Registry filing', previous: '—', next: 'doc-basis-public', at: dateOffset(-2) },
];

export const pipelineStatusLabels: Record<DealStage, Localized> = {
  mapped: bi('Mapped', 'Identifié'),
  analyse: bi('To analyse', 'À analyser'),
  first_call: bi('First call', 'Premier appel'),
  diligence: bi('Due diligence', 'Due diligence'),
  ic: bi('IC review', 'Comité d’investissement'),
  invested: bi('Invested', 'Investi'),
  no_go: bi('No go', 'Non retenu'),
};

export const customFields = [
  { id: 'cf-1', name: bi('Ownership %', 'Participation %'), type: 'number' },
  { id: 'cf-2', name: bi('Sector thesis', 'Thèse sectorielle'), type: 'dropdown' },
  { id: 'cf-3', name: bi('Co-investor', 'Cofinanceur'), type: 'text' },
  { id: 'cf-4', name: bi('Climate fund eligible', 'Éligible fonds climat'), type: 'yes_no' },
  { id: 'cf-5', name: bi('First meeting date', 'Date du premier échange'), type: 'date' },
];
