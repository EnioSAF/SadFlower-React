export const LEGAL_SECTIONS = [
  {
    id: 'legal', label: 'LEGAL', tabColor: '#b84b2b', route: '/mentions-legales', title: 'Mentions légales',
    blocks: [
      ['Éditeur', 'Nom / structure : [À renseigner]'],
      ['Publication', 'Directeur de la publication : [À renseigner]'],
      ['Contact', 'E-mail : [À renseigner] · Adresse : [À renseigner]'],
      ['Hébergement', 'Front-end : Vercel · API et données : Heroku / Strapi. Les coordonnées contractuelles exactes de chaque hébergeur seront indiquées ici avant publication.'],
    ],
  },
  {
    id: 'rgpd', label: 'RGPD', tabColor: '#3d70a8', route: '/confidentialite', title: 'Vie privée & données personnelles',
    blocks: [
      ['Responsable', 'Le responsable du traitement et son contact sont : [À renseigner].'],
      ['Données collectées', 'Les demandes MyWork peuvent contenir nom, e-mail, téléphone, date souhaitée, message et choix de prestation.'],
      ['Finalités', 'Répondre aux demandes de devis ou de réservation, assurer le suivi des échanges, prévenir les abus et sécuriser le service.'],
      ['Base légale', 'La base applicable dépend du traitement : mesures précontractuelles pour répondre à une demande, obligation légale lorsque nécessaire, ou consentement lorsqu’il est demandé séparément.'],
      ['Destinataires', 'Seules les personnes habilitées et les prestataires techniques nécessaires au fonctionnement du site peuvent y accéder.'],
      ['Conservation', 'Les demandes sont conservées pendant la durée nécessaire au traitement, puis selon les obligations légales applicables. La durée définitive sera précisée avant mise en production.'],
      ['Vos droits', 'Vous pouvez demander accès, rectification, effacement, limitation, opposition ou portabilité lorsque ces droits s’appliquent. Contact : [À renseigner]. Vous pouvez aussi saisir la CNIL.'],
    ],
  },
  {
    id: 'cookies', label: 'COOKIES', tabColor: '#4d8d49', route: '/cookies', title: 'Cookies & traceurs',
    blocks: [
      ['Traceurs nécessaires', 'Les éléments strictement nécessaires au fonctionnement du site peuvent être utilisés sans consentement lorsqu’ils respectent les conditions légales.'],
      ['Mesure d’audience', 'Vercel Web Analytics peut transmettre des statistiques agrégées et anonymisées. La configuration et les données réellement envoyées doivent être vérifiées avant publication.'],
      ['Services tiers', 'Le lecteur Twitch peut charger des ressources depuis Twitch. Ce chargement doit être contrôlé et expliqué avant toute activation de traceur non nécessaire.'],
      ['Vos choix', 'Les préférences de consentement et les moyens de retrait seront accessibles depuis cette section.'],
    ],
  },
  {
    id: 'author', label: 'AUTEUR', tabColor: '#8a4f91', route: '/droits-auteur', title: 'Droits d’auteur & crédits',
    blocks: [
      ['Créations', 'Les textes, visuels, musiques, interfaces, code et éléments originaux présents sur SadFlower OS sont protégés par le droit d’auteur, sauf indication contraire.'],
      ['Réutilisation', 'Toute reproduction, modification ou réutilisation publique nécessite l’autorisation de son auteur ou le respect de la licence applicable.'],
      ['Crédits', 'Les bibliothèques, services, assets et contenus tiers sont crédités lorsque leur licence ou leur auteur l’exige.'],
      ['Demande', 'Pour signaler une attribution manquante ou demander une autorisation : [À renseigner].'],
    ],
  },
  {
    id: 'terms', label: 'CGU', tabColor: '#ba8b2d', route: '/cgu', title: 'Conditions générales d’utilisation',
    blocks: [
      ['Objet', 'Le site présente un portfolio interactif, des articles, des créations et des services de développement et de musique.'],
      ['Utilisation', 'L’utilisateur s’engage à utiliser le site de manière licite, loyale et à ne pas perturber son fonctionnement.'],
      ['Disponibilité', 'Le site peut évoluer, être interrompu ou afficher des contenus provenant de services tiers.'],
      ['Contact', 'Pour toute question relative à l’utilisation du site : [À renseigner].'],
    ],
  },
  {
    id: 'sales', label: 'CGV', tabColor: '#b4577a', route: '/cgv', title: 'Conditions générales de vente',
    blocks: [
      ['Prestations', 'Les prestations proposées peuvent inclure développement web, applications, jeux vidéo, audit front-end, composition, sound design, mixage et mastering.'],
      ['Devis', 'Chaque projet fait l’objet d’un échange et, lorsque nécessaire, d’un devis précisant périmètre, prix, délais et livrables.'],
      ['Commande', 'La commande devient définitive selon les modalités indiquées dans le devis ou contrat accepté.'],
      ['Propriété intellectuelle', 'Les droits d’utilisation, fichiers sources, licences et livrables sont définis projet par projet.'],
      ['Version', 'Ces CGV constituent une base de présentation et devront être complétées avec l’identité juridique, les prix, le paiement, la rétractation et la médiation avant toute vente à un particulier.'],
    ],
  },
];

export const LEGAL_SECTION_BY_ROUTE = Object.fromEntries(LEGAL_SECTIONS.map((section) => [section.route, section]));
export const DEFAULT_LEGAL_SECTION = LEGAL_SECTIONS[0];

export function getLegalPages(section) {
  const source = section || DEFAULT_LEGAL_SECTION;
  const blocks = source.blocks || [];
  const pages = [];
  for (let index = 0; index < blocks.length; index += 2) {
    pages.push({
      id: `${source.id}-${index / 2 + 1}`,
      blocks: blocks.slice(index, index + 2),
    });
  }
  return pages.length ? pages : [{ id: `${source.id}-1`, blocks: [] }];
}

export const LEGAL_PAGES = Object.fromEntries(
  LEGAL_SECTIONS.map((section) => [section.id, getLegalPages(section)])
);
