import { useState } from 'react';

import '/styles/system32/windows/PrivacyConsent/privacyconsent.sass';

const DEFAULT_CONSENT = { analytics: false, externalMedia: false };

export default function PrivacyConsent({ initialConsent, onSave, onOpenLegal }) {
  const [draft, setDraft] = useState({ ...DEFAULT_CONSENT, ...initialConsent });

  function save(consent) {
    onSave({ ...DEFAULT_CONSENT, ...consent });
  }

  return (
    <div className="privacy-consent-layer" role="presentation">
      <section className="window privacy-consent-window" role="dialog" aria-modal="true" aria-label="Configuration de confidentialité">
        <div className="title-bar"><div className="title-bar-text">SADFLOWER OS — Configuration de confidentialité</div></div>
        <div className="window-body privacy-consent-body">
          <span className="privacy-consent-stamp">SYSTEM NOTICE · 2026</span>
          <h1 id="privacy-consent-title">Avant d’entrer sur le bureau</h1>
          <p>SadFlower OS utilise son stockage local nécessaire au fonctionnement du bureau. Les statistiques anonymes et les contenus Twitch restent désactivés tant que vous ne les autorisez pas.</p>
          <fieldset className="privacy-consent-options">
            <legend>Modules optionnels — cochez votre choix</legend>
            <label><input type="checkbox" checked={draft.analytics} onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))} />Mesure d’audience anonyme (Vercel Analytics) : <strong>{draft.analytics ? 'autorisée' : 'refusée'}</strong></label>
            <label><input type="checkbox" checked={draft.externalMedia} onChange={(event) => setDraft((current) => ({ ...current, externalMedia: event.target.checked }))} />Contenus externes Twitch : <strong>{draft.externalMedia ? 'autorisés' : 'refusés'}</strong></label>
          </fieldset>
          <p className="privacy-consent-note">Les détails figurent dans le registre légal.</p>
        </div>
        <div className="privacy-consent-actions">
          <button type="button" onClick={() => save({ analytics: true, externalMedia: true })}>Tout accepter</button>
          <button type="button" onClick={() => save(DEFAULT_CONSENT)}>Refuser l’optionnel</button>
          <button type="button" onClick={() => save(draft)}>Enregistrer mes choix</button>
          <button type="button" className="privacy-legal-link" onClick={onOpenLegal}>Ouvrir MentionLegal.exe</button>
        </div>
        <div className="status-bar"><p className="status-bar-field">Stockage nécessaire : actif</p><p className="status-bar-field">Audience : {draft.analytics ? 'autorisée' : 'refusée'}</p><p className="status-bar-field">Twitch : {draft.externalMedia ? 'autorisé' : 'refusé'}</p></div>
      </section>
    </div>
  );
}
