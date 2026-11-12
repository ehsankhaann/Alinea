export type Lang = 'en' | 'fr';
export type RoleId = 'admin' | 'reviewer' | 'editor' | 'viewer' | 'founder';
export type Page = 'overview' | 'companies' | 'deals' | 'inbox' | 'meetings' | 'documents' | 'review' | 'activity' | 'operations' | 'settings';
export type Localized = { en: string; fr: string };

export const bi = (en: string, fr: string): Localized => ({ en, fr });

export const dateOffset = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const roles: Record<RoleId, { name: string; email: string; title: Localized; initials: string; avatar: string }> = {
  admin: {
    name: 'Camille Laurent', email: 'camille@alinea.vc', title: bi('Administrator', 'Administratrice'), initials: 'CL',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=faces&auto=format&q=85',
  },
  reviewer: {
    name: 'Noah Martin', email: 'noah@alinea.vc', title: bi('Reviewer', 'Vérificateur'), initials: 'NM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&auto=format&q=85',
  },
  editor: {
    name: 'Elise Bernard', email: 'elise@alinea.vc', title: bi('Editor', 'Éditrice'), initials: 'EB',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format&q=85',
  },
  viewer: {
    name: 'Luc Moreau', email: 'luc@alinea.vc', title: bi('Viewer', 'Lecteur'), initials: 'LM',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces&auto=format&q=85',
  },
  founder: {
    name: 'Sophie Chen', email: 'sophie@canopy.earth', title: bi('Founder · Canopy', 'Fondatrice · Canopy'), initials: 'SC',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format&q=85',
  },
};

export type VerifiedMetrics = {
  arr?: string;
  growth?: string;
  nrr?: string;
  burn?: string;
  margin?: string;
};

export interface Company {
  id: string;
  name: string;
  initials: string;
  brand: string;
  ink: string;
  sector: Localized;
  stage: Localized;
  location: string;
  kind: 'portfolio' | 'watchlist';
  website: string;
  description: Localized;
  founded: string;
  owner: string;
  verified: VerifiedMetrics;
  updatedAt: string;
  reportingStatus: 'complete' | 'on_track' | 'due_soon' | 'overdue' | 'missing' | 'conflict';
  period: Localized;
  dueDate: string;
  lastReport: string | null;
  completeness: number;
  reportingFrequency: 'quarterly' | 'semiannual';
}

export const initialCompanies: Company[] = [
  { id: 'canopy', name: 'Canopy', initials: 'C', brand: '#dce9d6', ink: '#315d42', sector: bi('Climate technology', 'Technologie climatique'), stage: bi('Series A', 'Série A'), location: 'Paris, France', kind: 'portfolio', website: 'canopy.earth', description: bi('Software and financing infrastructure helping commercial buildings decarbonize at scale.', 'Logiciels et infrastructure de financement pour décarboner les bâtiments commerciaux à grande échelle.'), founded: '2020', owner: 'Camille Laurent', verified: { arr: '€8.4M', growth: '+38%', margin: '68%' }, updatedAt: dateOffset(-2), reportingStatus: 'overdue', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(-6), lastReport: dateOffset(-95), completeness: 72, reportingFrequency: 'quarterly' },
  { id: 'luma', name: 'Luma Health', initials: 'L', brand: '#f3e4c4', ink: '#9c6428', sector: bi('Digital health', 'Santé numérique'), stage: bi('Series B', 'Série B'), location: 'London, UK', kind: 'portfolio', website: 'lumahealth.co', description: bi('A connected care platform making specialist healthcare more accessible and personal.', 'Une plateforme de soins connectés rendant les soins spécialisés plus accessibles et personnalisés.'), founded: '2019', owner: 'Noah Martin', verified: { arr: '€14.2M', growth: '+62%', nrr: '108%' }, updatedAt: dateOffset(-4), reportingStatus: 'due_soon', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(5), lastReport: dateOffset(-86), completeness: 94, reportingFrequency: 'quarterly' },
  { id: 'northstar', name: 'Northstar AI', initials: 'N', brand: '#e3dff0', ink: '#5f4b91', sector: bi('Enterprise AI', 'IA d’entreprise'), stage: bi('Seed', 'Amorçage'), location: 'Berlin, Germany', kind: 'portfolio', website: 'northstar.ai', description: bi('Decision intelligence for teams navigating complex supply chains.', 'Une intelligence décisionnelle pour les équipes gérant des chaînes d’approvisionnement complexes.'), founded: '2022', owner: 'Camille Laurent', verified: { arr: '€2.6M', growth: '+84%', burn: '€172K/mo' }, updatedAt: dateOffset(-6), reportingStatus: 'on_track', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(10), lastReport: dateOffset(-78), completeness: 86, reportingFrequency: 'quarterly' },
  { id: 'mosaic', name: 'Mosaic', initials: 'M', brand: '#f2ded4', ink: '#a35e46', sector: bi('Financial technology', 'Technologie financière'), stage: bi('Series A', 'Série A'), location: 'Montréal, Canada', kind: 'portfolio', website: 'mosaic.finance', description: bi('Modern financial tools built for the next generation of independent businesses.', 'Des outils financiers modernes conçus pour la prochaine génération d’entreprises indépendantes.'), founded: '2021', owner: 'Elise Bernard', verified: { arr: '€6.8M', growth: '+27%', margin: '74%' }, updatedAt: dateOffset(-3), reportingStatus: 'complete', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(1), lastReport: dateOffset(-12), completeness: 100, reportingFrequency: 'quarterly' },
  { id: 'sonder', name: 'Sonder', initials: 'S', brand: '#dbe7ed', ink: '#3c7088', sector: bi('Developer tools', 'Outils développeurs'), stage: bi('Seed', 'Amorçage'), location: 'Amsterdam, Netherlands', kind: 'portfolio', website: 'sonder.dev', description: bi('An observability workspace that helps engineering teams ship with confidence.', 'Un espace d’observabilité qui aide les équipes d’ingénierie à livrer en toute confiance.'), founded: '2022', owner: 'Noah Martin', verified: { arr: '€1.9M', growth: '+51%' }, updatedAt: dateOffset(-8), reportingStatus: 'missing', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(-15), lastReport: null, completeness: 41, reportingFrequency: 'quarterly' },
  { id: 'arcadia', name: 'Arcadia', initials: 'A', brand: '#dce8e4', ink: '#3b6d61', sector: bi('Energy', 'Énergie'), stage: bi('Series B', 'Série B'), location: 'Lyon, France', kind: 'portfolio', website: 'arcadia.energy', description: bi('Distributed energy infrastructure for industrial sites across Europe.', 'Infrastructure énergétique distribuée pour les sites industriels européens.'), founded: '2018', owner: 'Camille Laurent', verified: { arr: '€19.6M', growth: '+31%', margin: '61%' }, updatedAt: dateOffset(-1), reportingStatus: 'complete', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(1), lastReport: dateOffset(-14), completeness: 100, reportingFrequency: 'quarterly' },
  { id: 'tandem', name: 'Tandem', initials: 'T', brand: '#e7e3ee', ink: '#66547e', sector: bi('Applied AI', 'IA appliquée'), stage: bi('Series A', 'Série A'), location: 'Paris, France', kind: 'portfolio', website: 'tandem.ai', description: bi('AI copilots that turn complex back-office work into supervised workflows.', 'Des copilotes IA qui transforment les tâches complexes en flux supervisés.'), founded: '2021', owner: 'Noah Martin', verified: { arr: '€5.2M', growth: '+71%', nrr: '121%' }, updatedAt: dateOffset(-2), reportingStatus: 'due_soon', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(4), lastReport: dateOffset(-92), completeness: 88, reportingFrequency: 'quarterly' },
  { id: 'willow', name: 'Willow & Co', initials: 'W', brand: '#f0e8d8', ink: '#887249', sector: bi('Consumer', 'Consommation'), stage: bi('Seed', 'Amorçage'), location: 'Copenhagen, Denmark', kind: 'portfolio', website: 'willowandco.com', description: bi('Circular household goods designed for a lower-waste everyday life.', 'Des articles ménagers circulaires pour un quotidien sans gaspillage.'), founded: '2023', owner: 'Elise Bernard', verified: { arr: '€1.4M', growth: '+46%' }, updatedAt: dateOffset(-7), reportingStatus: 'on_track', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(9), lastReport: dateOffset(-81), completeness: 79, reportingFrequency: 'quarterly' },
  { id: 'basis', name: 'Basis', initials: 'B', brand: '#dce4ef', ink: '#466386', sector: bi('Financial technology', 'Technologie financière'), stage: bi('Series A', 'Série A'), location: 'Dublin, Ireland', kind: 'portfolio', website: 'basis.finance', description: bi('Treasury automation for founder-led European companies.', 'Automatisation de trésorerie pour les entreprises européennes.'), founded: '2020', owner: 'Camille Laurent', verified: { arr: '€7.3M', growth: '+22%', margin: '81%' }, updatedAt: dateOffset(-4), reportingStatus: 'conflict' as never, period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(2), lastReport: dateOffset(-89), completeness: 91, reportingFrequency: 'quarterly' },
  { id: 'meridian', name: 'Meridian', initials: 'M', brand: '#e4e7df', ink: '#5a6a4d', sector: bi('Logistics', 'Logistique'), stage: bi('Series B', 'Série B'), location: 'Rotterdam, Netherlands', kind: 'portfolio', website: 'meridian.freight', description: bi('Visibility and financing software for mid-market freight operators.', 'Logiciels de visibilité et de financement pour les opérateurs logistiques.'), founded: '2017', owner: 'Noah Martin', verified: { arr: '€26.1M', growth: '+19%', margin: '57%' }, updatedAt: dateOffset(-9), reportingStatus: 'complete', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(1), lastReport: dateOffset(-21), completeness: 100, reportingFrequency: 'quarterly' },
  { id: 'atlasbio', name: 'Atlas Bio', initials: 'A', brand: '#eadfdf', ink: '#8c5b5b', sector: bi('Biotechnology', 'Biotechnologie'), stage: bi('Series A', 'Série A'), location: 'Basel, Switzerland', kind: 'portfolio', website: 'atlasbio.ch', description: bi('Programmable proteins for precision metabolic medicine.', 'Des protéines programmables pour la médecine métabolique de précision.'), founded: '2020', owner: 'Camille Laurent', verified: { burn: 'CHF 740K/mo' }, updatedAt: dateOffset(-11), reportingStatus: 'overdue', period: bi('H1 2026', 'S1 2026'), dueDate: dateOffset(-22), lastReport: dateOffset(-151), completeness: 52, reportingFrequency: 'semiannual' },
  { id: 'bloom', name: 'Bloom', initials: 'B', brand: '#f1e2e8', ink: '#966278', sector: bi('Digital health', 'Santé numérique'), stage: bi('Seed', 'Amorçage'), location: 'Lyon, France', kind: 'portfolio', website: 'bloom.health', description: bi('Perinatal care navigation for families and their clinicians.', 'Accompagnement périnatal pour les familles et leurs cliniciens.'), founded: '2022', owner: 'Elise Bernard', verified: { arr: '€2.1M', growth: '+64%' }, updatedAt: dateOffset(-3), reportingStatus: 'due_soon', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(6), lastReport: dateOffset(-84), completeness: 83, reportingFrequency: 'quarterly' },
  { id: 'patch', name: 'Patch', initials: 'P', brand: '#e8e5d6', ink: '#7b7446', sector: bi('Legal technology', 'Technologie juridique'), stage: bi('Seed', 'Amorçage'), location: 'Brussels, Belgium', kind: 'portfolio', website: 'patch.legal', description: bi('Collaborative contracting tools for European scale-ups.', 'Des outils de contractualisation collaborative pour les scale-ups européennes.'), founded: '2023', owner: 'Noah Martin', verified: { arr: '€1.1M', growth: '+92%' }, updatedAt: dateOffset(-5), reportingStatus: 'on_track', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(12), lastReport: dateOffset(-76), completeness: 76, reportingFrequency: 'quarterly' },
  { id: 'relay', name: 'Relay', initials: 'R', brand: '#dce8ec', ink: '#42707d', sector: bi('Developer tools', 'Outils développeurs'), stage: bi('Series A', 'Série A'), location: 'Lisbon, Portugal', kind: 'portfolio', website: 'relay.dev', description: bi('Reliable event infrastructure for distributed software teams.', 'Infrastructure d’événements fiable pour les équipes logicielles distribuées.'), founded: '2020', owner: 'Camille Laurent', verified: { arr: '€9.7M', growth: '+57%', nrr: '117%' }, updatedAt: dateOffset(-1), reportingStatus: 'complete', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(1), lastReport: dateOffset(-18), completeness: 100, reportingFrequency: 'quarterly' },
  { id: 'solstice', name: 'Solstice', initials: 'S', brand: '#f2e9d7', ink: '#987442', sector: bi('Climate technology', 'Technologie climatique'), stage: bi('Series A', 'Série A'), location: 'Madrid, Spain', kind: 'portfolio', website: 'solstice.energy', description: bi('Solar procurement and monitoring for commercial rooftops.', 'Achat et suivi solaire pour les toitures commerciales.'), founded: '2019', owner: 'Noah Martin', verified: { arr: '€4.8M', growth: '+35%', margin: '63%' }, updatedAt: dateOffset(-6), reportingStatus: 'overdue', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(-4), lastReport: dateOffset(-97), completeness: 67, reportingFrequency: 'quarterly' },
  { id: 'tern', name: 'Tern', initials: 'T', brand: '#dfe9e2', ink: '#4f7060', sector: bi('Mobility', 'Mobilité'), stage: bi('Seed', 'Amorçage'), location: 'Munich, Germany', kind: 'portfolio', website: 'tern.mobility', description: bi('Fleet operations software for shared electric mobility.', 'Logiciel d’exploitation de flottes pour la mobilité électrique partagée.'), founded: '2022', owner: 'Elise Bernard', verified: { arr: '€2.9M', growth: '+43%' }, updatedAt: dateOffset(-8), reportingStatus: 'missing', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(-11), lastReport: null, completeness: 34, reportingFrequency: 'quarterly' },
  { id: 'verdant', name: 'Verdant', initials: 'V', brand: '#e7ecd9', ink: '#677742', sector: bi('Agrifood', 'Agroalimentaire'), stage: bi('Series A', 'Série A'), location: 'Bordeaux, France', kind: 'portfolio', website: 'verdant.farm', description: bi('Field-level agronomy intelligence for regenerative growers.', 'Intelligence agronomique parcellaire pour les producteurs régénératifs.'), founded: '2019', owner: 'Camille Laurent', verified: { arr: '€5.5M', growth: '+29%', margin: '66%' }, updatedAt: dateOffset(-2), reportingStatus: 'on_track', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(14), lastReport: dateOffset(-71), completeness: 90, reportingFrequency: 'quarterly' },
  { id: 'pollen', name: 'Pollen', initials: 'P', brand: '#e7e9cf', ink: '#777b3a', sector: bi('Future of work', 'Avenir du travail'), stage: bi('Pre-seed', 'Pré-amorçage'), location: 'Paris, France', kind: 'watchlist', website: 'pollen.work', description: bi('A new operating layer for independent teams and the people behind them.', 'Une nouvelle plateforme de travail pour les équipes indépendantes et leurs talents.'), founded: '2024', owner: 'Camille Laurent', verified: {}, updatedAt: dateOffset(-10), reportingStatus: 'on_track', period: bi('Q2 2026', 'T2 2026'), dueDate: dateOffset(18), lastReport: null, completeness: 20, reportingFrequency: 'quarterly' },
];
export type DealStage = 'mapped' | 'analyse' | 'first_call' | 'diligence' | 'ic' | 'invested' | 'no_go';
export interface Deal {
  id: string;
  name: string;
  companyId: string | null;
  sector: Localized;
  round: Localized;
  amount: string;
  stage: DealStage;
  owner: string;
  updatedAt: string;
  description: Localized;
  brand: string;
  ink: string;
  priority?: 'high' | 'medium' | 'low';
  source?: string;
  nextStep?: Localized;
  team?: string[];
  tasks?: { id: string; label: Localized; done: boolean }[];
}

export const initialDeals: Deal[] = [
  { id: 'deal-canopy', name: 'Canopy', companyId: 'canopy', sector: bi('Climate technology', 'Technologie climatique'), round: bi('Series B', 'Série B'), amount: '€18M', stage: 'ic', owner: 'Camille Laurent', updatedAt: dateOffset(-1), description: bi('Expansion round to accelerate European market penetration and building partnerships.', 'Tour de financement pour accélérer l’expansion européenne et les partenariats immobiliers.'), brand: '#dce9d6', ink: '#315d42', priority: 'high', source: 'Founder relationship', nextStep: bi('IC memo due Thursday', 'Mémo CI attendu jeudi'), team: ['Camille Laurent', 'Noah Martin'] },
  { id: 'deal-harbor', name: 'Harbor Labs', companyId: null, sector: bi('Infrastructure', 'Infrastructure'), round: bi('Seed', 'Amorçage'), amount: '€4M', stage: 'diligence', owner: 'Noah Martin', updatedAt: dateOffset(-1), description: bi('Secure infrastructure for developers building financial products across borders.', 'Infrastructure sécurisée pour les développeurs de produits financiers internationaux.'), brand: '#dce8ef', ink: '#426f8a', priority: 'high', source: 'Inbound · Dealflow mailbox', nextStep: bi('Technical diligence call', 'Appel de due diligence technique'), team: ['Noah Martin', 'Elise Bernard'] },
  { id: 'deal-vela', name: 'Vela', companyId: null, sector: bi('Climate technology', 'Technologie climatique'), round: bi('Seed', 'Amorçage'), amount: '€5M', stage: 'first_call', owner: 'Camille Laurent', updatedAt: dateOffset(-3), description: bi('Grid intelligence software for a more resilient energy future.', 'Logiciel d’intelligence réseau pour un avenir énergétique plus résilient.'), brand: '#e9e3d5', ink: '#806c48', priority: 'medium', source: 'Referral · Arcadia', nextStep: bi('Founder follow-up', 'Suivi fondateur'), team: ['Camille Laurent'] },
  { id: 'deal-pollen', name: 'Pollen', companyId: 'pollen', sector: bi('Future of work', 'Avenir du travail'), round: bi('Pre-seed', 'Pré-amorçage'), amount: '€2M', stage: 'mapped', owner: 'Elise Bernard', updatedAt: dateOffset(-2), description: bi('Early conversation with a promising team redesigning independent work.', 'Premier échange avec une équipe prometteuse qui repense le travail indépendant.'), brand: '#e7e9cf', ink: '#777b3a', priority: 'low', source: 'Outbound mapping', nextStep: bi('Qualify market', 'Qualifier le marché'), team: ['Elise Bernard'] },
  { id: 'deal-fieldnote', name: 'Fieldnote', companyId: null, sector: bi('Enterprise software', 'Logiciel d’entreprise'), round: bi('Seed', 'Amorçage'), amount: '€3.5M', stage: 'analyse', owner: 'Noah Martin', updatedAt: dateOffset(-5), description: bi('A collaborative knowledge layer for teams working in the field.', 'Un espace de connaissance collaboratif pour les équipes sur le terrain.'), brand: '#e5e2ed', ink: '#645983', priority: 'medium', source: 'Inbound · Shared mailbox', nextStep: bi('Review product evidence', 'Examiner les preuves produit'), team: ['Noah Martin'] },
  { id: 'deal-ada', name: 'Ada Bio', companyId: null, sector: bi('Biotechnology', 'Biotechnologie'), round: bi('Series A', 'Série A'), amount: '€12M', stage: 'no_go', owner: 'Camille Laurent', updatedAt: dateOffset(-14), description: bi('Computational biology platform for faster therapeutic discovery.', 'Plateforme de biologie computationnelle pour accélérer la découverte thérapeutique.'), brand: '#f1dfdf', ink: '#945e66', priority: 'low', source: 'Referral', nextStep: bi('Passed at screening', 'Non retenu au screening'), team: ['Camille Laurent'] },
  { id: 'deal-kestrel', name: 'Kestrel', companyId: null, sector: bi('Climate technology', 'Technologie climatique'), round: bi('Series A', 'Série A'), amount: '€9M', stage: 'first_call', owner: 'Camille Laurent', updatedAt: dateOffset(-4), description: bi('Industrial heat recovery systems for food manufacturing.', 'Systèmes de récupération de chaleur industrielle pour l’agroalimentaire.'), brand: '#eee4d7', ink: '#8a704d', priority: 'high', source: 'Dealflow mailbox', nextStep: bi('Founder call booked', 'Appel fondateur planifié'), team: ['Camille Laurent', 'Noah Martin'] },
  { id: 'deal-orbit', name: 'Orbit', companyId: null, sector: bi('Applied AI', 'IA appliquée'), round: bi('Seed', 'Amorçage'), amount: '€4.5M', stage: 'diligence', owner: 'Noah Martin', updatedAt: dateOffset(-2), description: bi('Workflow intelligence for compliance teams in regulated industries.', 'Intelligence de flux pour les équipes conformité des secteurs régulés.'), brand: '#e3e2ef', ink: '#66618a', priority: 'high', source: 'Inbound · Referral', nextStep: bi('Customer references', 'Références clients'), team: ['Noah Martin', 'Elise Bernard'] },
  { id: 'deal-clover', name: 'Clover', companyId: null, sector: bi('Digital health', 'Santé numérique'), round: bi('Seed', 'Amorçage'), amount: '€3M', stage: 'analyse', owner: 'Elise Bernard', updatedAt: dateOffset(-6), description: bi('Care coordination for chronic conditions in primary care.', 'Coordination des soins pour les maladies chroniques en soins primaires.'), brand: '#e6ece1', ink: '#5d704b', priority: 'medium', source: 'Dealflow mailbox', nextStep: bi('Map competitive landscape', 'Cartographier la concurrence'), team: ['Elise Bernard'] },
  { id: 'deal-basalt', name: 'Basalt', companyId: null, sector: bi('Financial technology', 'Technologie financière'), round: bi('Seed', 'Amorçage'), amount: '€3.2M', stage: 'mapped', owner: 'Noah Martin', updatedAt: dateOffset(-8), description: bi('Risk tooling for embedded finance providers.', 'Outils de risque pour les fournisseurs de finance intégrée.'), brand: '#e0e6ee', ink: '#4b657f', priority: 'low', source: 'Outbound mapping', nextStep: bi('Initial screening', 'Screening initial'), team: ['Noah Martin'] },
  { id: 'deal-tide', name: 'Tide', companyId: null, sector: bi('Logistics', 'Logistique'), round: bi('Series A', 'Série A'), amount: '€8M', stage: 'invested', owner: 'Camille Laurent', updatedAt: dateOffset(-20), description: bi('Port scheduling automation for regional freight terminals.', 'Automatisation de planification portuaire pour les terminaux régionaux.'), brand: '#dbe9e9', ink: '#3f7073', priority: 'high', source: 'Proprietary', nextStep: bi('Post-investment onboarding', 'Intégration post-investissement'), team: ['Camille Laurent', 'Elise Bernard'] },
  { id: 'deal-nook', name: 'Nook', companyId: null, sector: bi('Consumer', 'Consommation'), round: bi('Pre-seed', 'Pré-amorçage'), amount: '€1.5M', stage: 'no_go', owner: 'Elise Bernard', updatedAt: dateOffset(-12), description: bi('Community marketplace for second-home sharing.', 'Place de marché communautaire pour le partage de résidences secondaires.'), brand: '#f1e8df', ink: '#8a6c50', priority: 'low', source: 'Dealflow mailbox', nextStep: bi('No further action', 'Aucune action'), team: ['Elise Bernard'] },
];
export type ReviewStatus = 'pending' | 'verified' | 'rejected' | 'not_applicable' | 'conflict';
export type MetricKey = keyof VerifiedMetrics;
export interface ReviewItem {
  id: string;
  companyId: string;
  metric: Localized;
  metricKey: MetricKey;
  value: string;
  previousValue: string;
  sourceDocId: string;
  excerpt: Localized;
  receivedAt: string;
  status: ReviewStatus;
  decidedBy?: string;
  decidedAt?: string;
  captureMethod?: Localized;
  reviewedValue?: string;
  reviewerNote?: Localized;
  conflictValue?: string;
  conflictDocId?: string;
  conflictExcerpt?: Localized;
  digest?: string;
}

export const initialReviews: ReviewItem[] = [
  { id: 'review-canopy', companyId: 'canopy', metric: bi('Annual recurring revenue', 'Revenu annuel récurrent'), metricKey: 'arr', value: '€9.1M', previousValue: '€8.4M', sourceDocId: 'doc-canopy', excerpt: bi('Annualised recurring revenue reached €9.1 million at the close of Q2, compared with €8.4 million at the end of Q1.', 'Le revenu annuel récurrent a atteint 9,1 millions d’euros à la fin du T2, contre 8,4 millions d’euros à la fin du T1.'), receivedAt: dateOffset(-1), status: 'pending' },
  { id: 'review-luma', companyId: 'luma', metric: bi('Net revenue retention', 'Rétention nette du revenu'), metricKey: 'nrr', value: '112%', previousValue: '108%', sourceDocId: 'doc-luma', excerpt: bi('Net revenue retention for the trailing twelve months improved to 112%, driven by expansion in existing health systems.', 'La rétention nette du revenu sur douze mois s’est améliorée à 112 %, portée par l’expansion des systèmes de santé existants.'), receivedAt: dateOffset(-1, 9), status: 'pending' },
  { id: 'review-northstar', companyId: 'northstar', metric: bi('Monthly net burn', 'Consommation mensuelle nette'), metricKey: 'burn', value: '€185K/mo', previousValue: '€172K/mo', sourceDocId: 'doc-northstar', excerpt: bi('Net cash burn averaged €185,000 per month in the latest operating period as the engineering team expanded.', 'La consommation nette de trésorerie a atteint 185 000 € par mois sur la dernière période, avec la croissance de l’équipe d’ingénierie.'), receivedAt: dateOffset(-2), status: 'pending' },
  { id: 'review-mosaic', companyId: 'mosaic', metric: bi('Gross margin', 'Marge brute'), metricKey: 'margin', value: '74%', previousValue: '72%', sourceDocId: 'doc-mosaic', excerpt: bi('Blended gross margin increased to 74% for the quarter as payment processing costs declined.', 'La marge brute consolidée a augmenté à 74 % sur le trimestre avec la baisse des coûts de traitement des paiements.'), receivedAt: dateOffset(-5), status: 'verified', decidedBy: 'Camille Laurent', decidedAt: dateOffset(-3) },
  { id: 'review-sonder', companyId: 'sonder', metric: bi('Year-over-year growth', 'Croissance annuelle'), metricKey: 'growth', value: '+90%', previousValue: '+51%', sourceDocId: 'doc-sonder', excerpt: bi('The presentation cites 90% growth, but the underlying revenue schedule does not reconcile with this figure.', 'La présentation indique une croissance de 90 %, mais le tableau des revenus sous-jacent ne concorde pas avec ce chiffre.'), receivedAt: dateOffset(-9), status: 'rejected', decidedBy: 'Noah Martin', decidedAt: dateOffset(-8) },
  { id: 'review-basis', companyId: 'basis', metric: bi('Annual recurring revenue', 'Revenu annuel récurrent'), metricKey: 'arr', value: '€8.1M', previousValue: '€7.3M', sourceDocId: 'doc-basis-board', conflictValue: '€7.7M', conflictDocId: 'doc-basis-public', excerpt: bi('Management reports annual recurring revenue of €8.1 million at period close, including a signed but not yet live enterprise contract.', 'La direction déclare un revenu annuel récurrent de 8,1 millions d’euros à la clôture, incluant un contrat signé mais pas encore actif.'), conflictExcerpt: bi('A public company registry filing states annual recurring revenue of €7.7 million for the same period.', 'Un dépôt public au registre indique un revenu annuel récurrent de 7,7 millions d’euros pour la même période.'), receivedAt: dateOffset(-2), status: 'conflict', captureMethod: bi('AI extraction · PDF', 'Extraction IA · PDF') },
  { id: 'review-arcadia', companyId: 'arcadia', metric: bi('Gross margin', 'Marge brute'), metricKey: 'margin', value: '61%', previousValue: '59%', sourceDocId: 'doc-arcadia', excerpt: bi('Gross margin is not applicable at the holding level for this reporting period; the operations report will cover site-level margins.', 'La marge brute n’est pas applicable au niveau de la holding pour cette période ; le rapport opérationnel couvrira les marges par site.'), receivedAt: dateOffset(-4), status: 'not_applicable', decidedBy: 'Camille Laurent', decidedAt: dateOffset(-3), reviewerNote: bi('Group margin is not a meaningful KPI this period.', 'La marge du groupe n’est pas un indicateur pertinent pour cette période.') },
];

export interface DocumentRecord {
  id: string;
  title: string;
  companyId: string | null;
  dealId?: string | null;
  kind: 'report' | 'deck' | 'memo' | 'notes' | 'other';
  extension: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  summary: Localized;
  fileUrl?: string;
}

export const initialDocuments: DocumentRecord[] = [
  { id: 'doc-canopy', title: 'Canopy Q2 financial report', companyId: 'canopy', kind: 'report', extension: 'PDF', size: '2.4 MB', uploadedBy: 'Inbox automation', uploadedAt: dateOffset(-1), summary: bi('Quarterly financial report filed automatically from an email from Canopy. One extracted figure is awaiting verification.', 'Rapport financier trimestriel classé automatiquement depuis un courriel de Canopy. Un chiffre extrait attend une vérification.') },
  { id: 'doc-luma', title: 'Luma monthly operating report', companyId: 'luma', kind: 'report', extension: 'PDF', size: '1.8 MB', uploadedBy: 'Inbox automation', uploadedAt: dateOffset(-1, 9), summary: bi('May operating results, including retention and patient engagement data. New figures are not yet part of the verified record.', 'Résultats opérationnels de mai, dont la rétention et l’engagement des patients. Les nouveaux chiffres ne font pas encore partie du dossier vérifié.') },
  { id: 'doc-northstar', title: 'Northstar board pack', companyId: 'northstar', kind: 'deck', extension: 'PDF', size: '5.2 MB', uploadedBy: 'Elise Bernard', uploadedAt: dateOffset(-2), summary: bi('Board materials covering cash position, product milestones, and hiring plans.', 'Documents du conseil sur la trésorerie, les jalons produit et les plans de recrutement.') },
  { id: 'doc-mosaic', title: 'Mosaic Q2 board notes', companyId: 'mosaic', kind: 'notes', extension: 'DOCX', size: '840 KB', uploadedBy: 'Camille Laurent', uploadedAt: dateOffset(-5), summary: bi('Board meeting notes and verified gross margin update.', 'Notes du conseil et mise à jour vérifiée de la marge brute.') },
  { id: 'doc-sonder', title: 'Sonder investor presentation', companyId: 'sonder', kind: 'deck', extension: 'PDF', size: '3.6 MB', uploadedBy: 'Noah Martin', uploadedAt: dateOffset(-9), summary: bi('Investor presentation retained as a source. A growth claim was rejected after review.', 'Présentation aux investisseurs conservée comme source. Une affirmation de croissance a été rejetée après examen.') },
  { id: 'doc-vela', title: 'Vela investment memo', companyId: null, dealId: 'deal-vela', kind: 'memo', extension: 'PDF', size: '1.1 MB', uploadedBy: 'Camille Laurent', uploadedAt: dateOffset(-3), summary: bi('Initial investment thesis, market landscape, and diligence questions for Vela.', 'Thèse d’investissement initiale, panorama du marché et questions de due diligence pour Vela.') },
];

export interface InboxItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: Localized;
  preview: Localized;
  body: Localized;
  companyId: string | null;
  dealId?: string | null;
  confidence: number | null;
  receivedAt: string;
  attachmentId?: string;
  reviewIds: string[];
  processed: boolean;
  unread: boolean;
  mailbox?: 'company' | 'dealflow';
}

export const initialInbox: InboxItem[] = [
  { id: 'mail-canopy', sender: 'Sophie Chen', senderEmail: 'sophie@canopy.earth', subject: bi('Q2 financial report + operating update', 'Rapport financier T2 et point opérationnel'), preview: bi('Sharing our latest numbers and the full finance pack ahead of our catch-up.', 'Voici nos derniers chiffres et le dossier financier complet avant notre échange.'), body: bi('Hi Camille,\n\nSharing our Q2 financial report and operating update ahead of our catch-up next week. We have had a strong quarter across our European markets. The full finance pack is attached, including the latest annual recurring revenue figure.\n\nHappy to walk through any questions.\n\nBest,\nSophie', 'Bonjour Camille,\n\nJe vous transmets notre rapport financier T2 et notre point opérationnel avant notre échange la semaine prochaine. Le trimestre a été solide sur nos marchés européens. Le dossier financier complet est joint, avec le dernier chiffre de revenu annuel récurrent.\n\nJe reste disponible pour toute question.\n\nSophie'), companyId: 'canopy', confidence: 99, receivedAt: dateOffset(-1), attachmentId: 'doc-canopy', reviewIds: ['review-canopy'], processed: true, unread: true },
  { id: 'mail-luma', sender: 'Amelia Ross', senderEmail: 'amelia@lumahealth.co', subject: bi('May operating report', 'Rapport opérationnel de mai'), preview: bi('Please find our monthly operating report and retention update attached.', 'Veuillez trouver notre rapport mensuel et la mise à jour de la rétention en pièce jointe.'), body: bi('Hello team,\n\nAttached is our May operating report. Patient engagement remains strong and expansion within existing health systems contributed to improved net revenue retention.\n\nLet me know if you would like a deeper breakdown before the board meeting.\n\nAmelia', 'Bonjour à tous,\n\nVous trouverez ci-joint notre rapport opérationnel de mai. L’engagement des patients reste élevé et l’expansion de nos clients existants a amélioré la rétention nette du revenu.\n\nJe peux vous envoyer plus de détails avant le conseil.\n\nAmelia'), companyId: 'luma', confidence: 98, receivedAt: dateOffset(-1, 9), attachmentId: 'doc-luma', reviewIds: ['review-luma'], processed: true, unread: true },
  { id: 'mail-harbor', sender: 'Daniel Price', senderEmail: 'daniel@harborlabs.io', subject: bi('Following up on our introduction', 'Suite à notre présentation'), preview: bi('Great speaking with you. Here is a short overview of what we are building.', 'Ravi d’avoir échangé avec vous. Voici un bref aperçu de notre projet.'), body: bi('Hi Noah,\n\nGreat speaking with you yesterday. As promised, here is a short overview of Harbor Labs and the seed round we are putting together. We would love to continue the conversation with the team.\n\nAll the best,\nDaniel', 'Bonjour Noah,\n\nRavi d’avoir échangé avec vous hier. Comme convenu, voici une présentation de Harbor Labs et du tour d’amorçage que nous préparons. Nous serions ravis de poursuivre la discussion avec l’équipe.\n\nBien à vous,\nDaniel'), companyId: null, dealId: 'deal-harbor', confidence: 96, receivedAt: dateOffset(-2), reviewIds: [], processed: true, unread: false },
  { id: 'mail-unknown', sender: 'Jules Moreau', senderEmail: 'jules@fieldnote.team', subject: bi('Introduction to Fieldnote', 'Présentation de Fieldnote'), preview: bi('We are building a better way for field teams to share what they know.', 'Nous créons une meilleure façon pour les équipes de terrain de partager leurs connaissances.'), body: bi('Hello,\n\nI am Jules, co-founder of Fieldnote. We are building a collaborative knowledge layer for field teams and are beginning conversations with investors. Would love to share more.\n\nJules', 'Bonjour,\n\nJe suis Jules, cofondateur de Fieldnote. Nous créons un espace de connaissance collaboratif pour les équipes de terrain et commençons à rencontrer des investisseurs. Au plaisir d’en discuter.\n\nJules'), companyId: null, dealId: null, confidence: null, receivedAt: dateOffset(-3), reviewIds: [], processed: false, unread: false },
];

export interface Meeting {
  id: string;
  title: string;
  companyId: string;
  kind: 'board' | 'founder' | 'internal' | 'update';
  startsAt: string;
  duration: number;
  attendees: string;
  location: string;
  notes: Localized;
  completed: boolean;
}

export const initialMeetings: Meeting[] = [
  { id: 'meeting-canopy', title: 'Canopy Q2 check-in', companyId: 'canopy', kind: 'update', startsAt: dateOffset(1, 10), duration: 45, attendees: 'Camille Laurent, Sophie Chen', location: 'Google Meet', notes: bi('Review Q2 performance, European expansion, and the updated operating plan.', 'Examiner les résultats du T2, l’expansion européenne et le plan opérationnel actualisé.'), completed: false },
  { id: 'meeting-luma', title: 'Luma board meeting', companyId: 'luma', kind: 'board', startsAt: dateOffset(3, 14), duration: 90, attendees: 'Camille Laurent, Noah Martin, Amelia Ross', location: 'Zoom', notes: bi('Board discussion on patient engagement, retention, and next-quarter priorities.', 'Discussion du conseil sur l’engagement des patients, la rétention et les priorités du prochain trimestre.'), completed: false },
  { id: 'meeting-pollen', title: 'Pollen founder introduction', companyId: 'pollen', kind: 'founder', startsAt: dateOffset(5, 11), duration: 30, attendees: 'Elise Bernard, Pollen founders', location: 'Google Meet', notes: bi('Initial founder conversation and product walkthrough.', 'Premier échange avec les fondateurs et présentation du produit.'), completed: false },
  { id: 'meeting-mosaic', title: 'Mosaic quarterly board', companyId: 'mosaic', kind: 'board', startsAt: dateOffset(-5, 15), duration: 90, attendees: 'Camille Laurent, Mosaic board', location: 'Montréal office', notes: bi('Discussed payments growth, gross margin, and strategic hiring.', 'Échange sur la croissance des paiements, la marge brute et les recrutements stratégiques.'), completed: true },
];

export interface ActivityItem {
  id: string;
  title: Localized;
  description: Localized;
  kind: 'review' | 'document' | 'email' | 'meeting' | 'company' | 'deal';
  companyId?: string;
  date: string;
}

export const initialActivity: ActivityItem[] = [
  { id: 'activity-canopy', title: bi('New figure awaiting review', 'Nouveau chiffre à vérifier'), description: bi('Canopy Q2 ARR extracted from a financial report', 'Revenu récurrent T2 de Canopy extrait d’un rapport financier'), kind: 'review', companyId: 'canopy', date: dateOffset(-1) },
  { id: 'activity-luma', title: bi('Report filed automatically', 'Rapport classé automatiquement'), description: bi('Luma monthly operating report matched with 98% confidence', 'Rapport mensuel de Luma associé avec une confiance de 98 %'), kind: 'document', companyId: 'luma', date: dateOffset(-1, 9) },
  { id: 'activity-harbor', title: bi('Deal email matched', 'Courriel associé à un dossier'), description: bi('Harbor Labs introduction added to the deal record', 'Présentation de Harbor Labs ajoutée au dossier d’investissement'), kind: 'email', date: dateOffset(-2) },
  { id: 'activity-northstar', title: bi('Board pack added', 'Dossier du conseil ajouté'), description: bi('Northstar AI board materials filed to company record', 'Documents du conseil de Northstar AI classés au dossier'), kind: 'document', companyId: 'northstar', date: dateOffset(-2, 8) },
  { id: 'activity-mosaic', title: bi('Gross margin verified', 'Marge brute vérifiée'), description: bi('Camille verified Mosaic’s 74% gross margin against source', 'Camille a vérifié la marge brute de 74 % de Mosaic à la source'), kind: 'review', companyId: 'mosaic', date: dateOffset(-3) },
];