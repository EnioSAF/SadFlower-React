'use strict';

const SERVICES = [
  { code: 'developer.fullstack-web', category: 'Développeur', kind: 'quote', label: 'Site web FullStack', description: 'Un site complet, du brief au déploiement.', examples: 'Vitrine, portfolio, e-commerce, API' },
  { code: 'developer.application', category: 'Développeur', kind: 'quote', label: 'Application & automatisation', description: 'Bots, outils métier et tâches automatisées.', examples: 'Discord, Twitch, scripts, dashboards' },
  { code: 'developer.game', category: 'Développeur', kind: 'quote', label: 'Jeu vidéo', description: 'Conception, réalisation et édition de jeux.', examples: 'Godot, prototypes, game jams' },
  { code: 'developer.frontend-audit', category: 'Développeur', kind: 'booking', label: 'Audit front-end', description: 'Un regard expert sur ton interface.', examples: 'UX, accessibilité, performance' },
  { code: 'musician.author-composer-performer', category: 'Musicien', kind: 'booking', label: 'Auteur-compositeur-interprète', description: 'Une chanson avec intention, texte et interprétation.', examples: 'Maquette, chanson, direction artistique' },
  { code: 'musician.soundtrack', category: 'Musicien', kind: 'quote', label: 'Bande son & instrumental', description: 'Une identité sonore pour image ou jeu.', examples: 'Documentaire, jeu vidéo, podcast' },
  { code: 'musician.mix-mastering', category: 'Musicien', kind: 'quote', label: 'Mix & mastering', description: 'Nettoyage, équilibre et finition de tes titres.', examples: 'Single, EP, instrumental' },
  { code: 'musician.music-audit', category: 'Musicien', kind: 'booking', label: 'Audit musique / MAO', description: 'Conseils globaux pour faire avancer ton son.', examples: 'Workflow, arrangement, plugins' },
];

function buildRequestPayload(form, service) {
  return {
    kind: service.kind,
    serviceCode: service.code,
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    ...(form.preferredDate ? { preferredDate: new Date(form.preferredDate).toISOString() } : {}),
    ...(form.message.trim() ? { message: form.message.trim() } : {}),
    consent: true,
  };
}

function isFormValid(form) {
  return form.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) && form.consent;
}

module.exports = { SERVICES, buildRequestPayload, isFormValid };
