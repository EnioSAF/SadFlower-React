import { useEffect, useReducer, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { initialState, transition } from '@/components/system32/applications/BoosterDemo/boosterDemoState';

const cards = [
  { name: 'FLEUR FANTÔME', type: 'HOLO', effect: 'holo', glow: '#e76b8f', image: '/booster-demo/fleur-fantome.svg' },
  { name: 'SIGNAL PERDU', type: 'RARE', effect: 'aurora', glow: '#56d6cf', image: '/booster-demo/signal-perdu.svg' },
  { name: 'DERNIER REFRAIN', type: 'SECRET', effect: 'gold', glow: '#eec471', image: '/booster-demo/dernier-refrain.svg' },
];

function HoloCard({ card, index }) {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let instance;
    let cancelled = false;
    setFailed(false);
    import('@kongyo2/cards-css').then(({ createHoloCard }) => {
      if (cancelled || !mount.current) return;
      instance = createHoloCard({
        image: card.image,
        imageAlt: `Carte ${card.name}`,
        back: '/booster-demo/card-back.svg',
        backAlt: 'Dos de carte SadFlower',
        effect: card.effect,
        glow: card.glow,
        textureSeed: index + 40,
        gyroscope: false,
      });
      mount.current.append(instance.element);
    }).catch(() => {
      if (!cancelled) setFailed(true);
    });
    return () => {
      cancelled = true;
      instance?.destroy();
      instance?.element.remove();
    };
  }, [card, index]);

  return <div className="booster-demo__holo-mount" ref={mount} aria-label={card.name}>
    {failed && <Image src={card.image} alt={`Carte ${card.name}`} width={500} height={700} unoptimized />}
  </div>;
}

export default function BoosterDemo() {
  const [state, dispatch] = useReducer(transition, initialState);
  const current = cards[state.cardIndex];
  const revealing = state.phase === 'revealing';

  return <>
    <Head><title>Booster Lab — SadFlower</title><meta name="description" content="Démo d'ouverture de booster et cartes holographiques SadFlower." /></Head>
    <main className="booster-demo">
      <div className="booster-demo__ambient" aria-hidden="true" />
      <header className="booster-demo__topbar">
        <Link href="/" className="booster-demo__back">← SADFLOWER</Link>
        <span>EXPERIMENTAL / PACK_001</span>
        <span className="booster-demo__status"><i /> LOCAL DEMO</span>
      </header>

      <div className="booster-demo__layout">
        <section className="booster-demo__intro">
          <p className="booster-demo__eyebrow">COLLECTION 001 · LABORATOIRE</p>
          <h1>BOOSTER<br /><em>SADFLOWER</em></h1>
          <p>Un petit avant-goût du rituel : ouvre le pack, découvre les cartes, bouge-les pour révéler leurs reflets.</p>
          <div className="booster-demo__steps" aria-label="Étapes du booster">
            <span className={state.phase === 'sealed' ? 'active' : ''}>01 DÉCHIRER</span>
            <span className={revealing ? 'active' : ''}>02 DÉCOUVRIR</span>
            <span className={state.phase === 'complete' ? 'active' : ''}>03 TERMINÉ</span>
          </div>
        </section>

        <section className="booster-demo__stage" aria-live="polite" aria-label="Ouverture du booster">
          <div className="booster-demo__stage-top"><span>PACK DISPENSER</span><span>NO. 001—003</span></div>
          {state.phase === 'sealed' && <div className="booster-demo__pack-wrap">
            <div className="booster-demo__pack" style={{ '--tear-progress': `${state.progress}%`, '--tear-offset': `${state.progress * 2}px`, '--tear-angle': `${state.progress * -0.1}deg` }}>
              <div className="booster-demo__pack-top" aria-hidden="true"><span>✦ SADFLOWER ✦ SADFLOWER ✦ SADFLOWER ✦</span></div>
              <div className="booster-demo__pack-art" aria-hidden="true">
                <span className="booster-demo__pack-orbit booster-demo__pack-orbit--one" />
                <span className="booster-demo__pack-orbit booster-demo__pack-orbit--two" />
                <span className="booster-demo__pack-flower">✳</span>
                <strong>SAD<br />FLOWER</strong>
                <small>TRADING CARDS / SERIES 01</small>
              </div>
              <div className="booster-demo__pack-bottom" aria-hidden="true">3 CARDS INSIDE <span>✦</span> OPEN YOUR WORLD</div>
              <div className="booster-demo__tear-line" aria-hidden="true" />
              <label className="booster-demo__tear-control">
                <span>DÉCHIRE ICI <b>→</b></span>
                <input aria-label="Déchirer le booster" type="range" min="0" max="100" value={state.progress} onChange={(event) => dispatch({ type: 'TEAR', progress: Number(event.target.value) })} />
              </label>
            </div>
            <p className="booster-demo__hint">GLISSE LA BANDE VERS LA DROITE <span>↗</span></p>
          </div>}
          {revealing && <div className="booster-demo__reveal" key={state.cardIndex}>
            <div className="booster-demo__card-head"><span>CARTE {String(state.cardIndex + 1).padStart(2, '0')} / 03</span><span className="booster-demo__rarity">{current.type}</span></div>
            <HoloCard card={current} index={state.cardIndex} />
            <div className="booster-demo__card-footer"><strong>{current.name}</strong><span>BOUGE TA SOURIS OU TON DOIGT SUR LA CARTE</span></div>
            <button className="booster-demo__action" onClick={() => dispatch({ type: 'NEXT', cardCount: cards.length })}>{state.cardIndex === cards.length - 1 ? 'Voir le tirage' : 'Carte suivante'} <span>↗</span></button>
          </div>}
          {state.phase === 'complete' && <div className="booster-demo__complete">
            <div className="booster-demo__complete-icon">✳</div>
            <p className="booster-demo__eyebrow">FIN DE SÉQUENCE</p>
            <h2>PACK OUVERT</h2>
            <div className="booster-demo__pull-list">{cards.map((card, i) => <div key={card.name}><span>0{i + 1}</span><strong>{card.name}</strong><small>{card.type}</small></div>)}</div>
            <button className="booster-demo__action" onClick={() => dispatch({ type: 'RESET' })}>Réessayer <span>↻</span></button>
          </div>}
          <div className="booster-demo__stage-bottom"><span>SF CARD SYSTEMS</span><span>INSERT COIN · NO COIN REQUIRED</span></div>
        </section>
      </div>
      <footer className="booster-demo__footer">PROTOTYPE VISUEL · AUCUNE CARTE ENREGISTRÉE <span>INTERACTION : <a href="https://codepen.io/jh3y/pen/rNRdZMM" target="_blank" rel="noreferrer">JHEY</a> + <a href="https://github.com/kongyo2/cards-css" target="_blank" rel="noreferrer">CARDS-CSS</a></span></footer>
    </main>
  </>;
}
