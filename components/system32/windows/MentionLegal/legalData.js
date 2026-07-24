// Remplace seulement le contenu entre crochets. Une fois les champs remplis,
// ce fichier devient directement le texte public du livre et des pages légales.
export const LEGAL_SECTIONS = [
  {
    id: 'legal', label: 'LEGAL', tabColor: '#b84b2b', route: '/mentions-legales', title: 'Mentions légales',
    blocks: [
      ['Éditeur', 'Ce site est édité par [Enio SadFlower], exerçant sous le nom commercial [Enio Sadflower], en micro-entreprise. [SIREN : 848 268 330. SIRET : 848 268 330 00034]'],
      ['Publication', 'Directeur de la publication : [Enio SadFlower]. Contact : [enio.sadflower@gmail.com]'],
      ['TVA', 'Taxe TVA non applicable, art. 293 B du CGI'],
      ['Hébergement du site', 'Le front-end est hébergé par [OVH], [2 rue Kellermann, 59100 Roubaix, France], [1007 ou +33 9 72 10 10 07]'],
      ['API et données', 'L’API et les données sont hébergées par [Heroku], [1 Market St Ste 300, San Francisco, CA 94105, USA]'],
    ],
  },
  {
    id: 'rgpd', label: 'RGPD', tabColor: '#3d70a8', route: '/confidentialite', title: 'Vie privée & données personnelles',
    blocks: [
      ['Responsable du traitement', 'Le responsable du traitement est [Enio SadFlower], exerçant sous le nom commercial [Enio Sadflower]. Contact : [enio.sadflower@gmail.com]'],
      ['Données collectées', 'Les demandes MyWork peuvent contenir nom, e-mail, téléphone, date souhaitée, message et choix de prestation.'],
      ['Finalités', 'Ces données servent à répondre aux demandes de devis ou de réservation, assurer le suivi des échanges, prévenir les abus et sécuriser le service.'],
      ['Base légale', 'La base applicable dépend du traitement : mesures précontractuelles pour répondre à une demande, obligation légale lorsque nécessaire, ou consentement lorsqu’il est demandé séparément.'],
      ['Destinataires', 'Les données sont accessibles aux seules personnes habilitées et aux prestataires techniques nécessaires au fonctionnement du site : [LISTE DES PRESTATAIRES QUI REÇOIVENT DES DONNÉES PERSONNELLES].'],
      ['Conservation', 'Les demandes sans contrat sont conservées pendant 3 ans après le dernier échange, puis supprimées ou anonymisées, sauf obligation légale ou litige à traiter.'],
      ['Vos droits', 'Vous pouvez demander accès, rectification, effacement, limitation, opposition ou portabilité lorsque ces droits s’appliquent, en écrivant à [enio.sadflower@gmail.com]. Vous pouvez aussi saisir la CNIL.'],
    ],
  },
  {
    id: 'cookies', label: 'COOKIES', tabColor: '#4d8d49', route: '/cookies', title: 'Cookies & traceurs',
    blocks: [
      ['Traceurs nécessaires', 'Aucun cookie propriétaire n’est déposé directement par [SadFlower OS]. Le site utilise le stockage local du navigateur pour mémoriser la version affichée et la première visite [(`version`, `hasVisited`)]. Certaines fonctions optionnelles peuvent aussi y stocker une session ou l’état de SadGotchu (`authToken`, `user`, `SADGOTCHU_ID`, `sadGotchu`, `lastUpdateTime`)..'],
      ['Mesure d’audience', 'La mesure d’audience utilisée est : [Google Stats]. Son statut de consentement est : [EXEMPTÉE].'],
      ['Services tiers', 'Le site peut afficher des contenus Twitch. Leur chargement intervient : [APRÈS CONSENTEMENT / DIRECTEMENT CAR AUCUN TRACEUR NON NÉCESSAIRE N’EST DÉPOSÉ / AUTRE À PRÉCISER].'],
      ['Vos choix', 'Pour accepter, refuser ou modifier vos choix relatifs aux traceurs : [LIEN, BOUTON OU INSTRUCTION DE GESTION DU CONSENTEMENT].'],
    ],
  },
  {
    id: 'author', label: 'AUTEUR', tabColor: '#8a4f91', route: '/droits-auteur', title: 'Droits d’auteur & crédits',
    blocks: [
      ['Créations', 'Les textes, visuels, musiques, interfaces, code et éléments originaux présents sur SadFlower OS sont protégés par le droit d’auteur, sauf indication contraire.'],
      ['Réutilisation', 'Toute reproduction, modification ou réutilisation publique nécessite l’autorisation de son auteur ou le respect de la licence applicable.'],
      ['Crédits', 'Les bibliothèques, services, assets et contenus tiers sont crédités lorsque leur licence ou leur auteur l’exige.'],
      ['Demande', 'Pour signaler une attribution manquante ou demander une autorisation : [enio.sadflower@gmail.com]'],
    ],
  },
  {
    id: 'terms', label: 'CGU', tabColor: '#ba8b2d', route: '/cgu', title: 'Conditions générales d’utilisation',
    blocks: [
      ['Objet', 'Le site présente un portfolio interactif, des articles, des créations et des services de développement et de musique.'],
      ['Utilisation', 'L’utilisateur s’engage à utiliser le site de manière licite, loyale et à ne pas perturber son fonctionnement.'],
      ['Disponibilité', 'Le site peut évoluer, être interrompu ou afficher des contenus provenant de services tiers.'],
      ['Contact', 'Pour toute question relative à l’utilisation du site : [enio.sadflower@gmail.com]'],
    ],
  },
  {
    id: 'sales', label: 'CGV', tabColor: '#b4577a', route: '/cgv', title: 'Conditions générales de vente',
    blocks: [
      ['Prestations', 'Les prestations proposées peuvent inclure développement web, applications, jeux vidéo, audit front-end, composition, sound design, mixage et mastering.'],
      ['Devis', 'Chaque projet fait l’objet d’un échange et, lorsque nécessaire, d’un devis précisant le périmètre, le prix, les délais, les livrables et les éventuelles étapes de validation.'],
      ['Commande et acompte', 'La réservation du créneau et le démarrage interviennent après acceptation du devis et versement d’un acompte d’au moins 25 %, sauf condition différente indiquée dans le devis.'],
      ['Règlement et livraison', 'Le règlement peut être effectué par virement, PayPal, Wero, crypto-actif ou autres arangements lorsqu’il est accepté au devis. Le solde est dû avant livraison finale des fichiers, accès, sources ou droits d’utilisation.'],
      ['Paiement et litiges', 'Le paiement est dû à la date indiquée dans le devis ou la facture. En cas de retard d’un client professionnel, des pénalités de retard et une indemnité forfaitaire de 40 € pour frais de recouvrement peuvent être exigées dans les conditions légales. Pour toute question ou contestation, contactez d’abord [enio.sadflower@gmail.com] afin de rechercher une solution amiable.'],
      ['Droits', 'Les droits d’utilisation, fichiers sources, licences et livrables sont définis projet par projet dans le devis ou le contrat accepté.'],
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
