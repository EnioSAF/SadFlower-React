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
  const [leaving, setLeaving] = useState(false);
  const tearFrame = useRef(null);
  const nextTimer = useRef(null);
  const pointer = useRef(null);
  const progress = useRef(0);
  const current = cards[state.cardIndex];
  const revealing = state.phase === 'revealing';

  useEffect(() => {
    progress.current = state.progress;
  }, [state.progress]);

  useEffect(() => () => {
    cancelAnimationFrame(tearFrame.current);
    clearTimeout(nextTimer.current);
  }, []);

  const autoTear = () => {
    if (state.phase !== 'sealed') return;
    cancelAnimationFrame(tearFrame.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progress.current = 100;
      dispatch({ type: 'TEAR', progress: 100 });
      return;
    }
    const from = progress.current;
    const started = performance.now();
    const duration = Math.max(280, (100 - from) * 9);
    const step = (now) => {
      const fraction = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - fraction) ** 3;
      const nextProgress = Math.min(100, from + (100 - from) * eased);
      progress.current = nextProgress;
      dispatch({ type: 'TEAR', progress: nextProgress });
      if (fraction < 1) tearFrame.current = requestAnimationFrame(step);
    };
    tearFrame.current = requestAnimationFrame(step);
  };

  const startTearPointer = (event) => {
    if (state.phase !== 'sealed') return;
    cancelAnimationFrame(tearFrame.current);
    pointer.current = {
      id: event.pointerId,
      startX: event.clientX,
      startProgress: progress.current,
      width: event.currentTarget.getBoundingClientRect().width,
      dragged: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveTearPointer = (event) => {
    const active = pointer.current;
    if (!active || active.id !== event.pointerId || state.phase !== 'sealed') return;
    const distance = event.clientX - active.startX;
    if (Math.abs(distance) < 5 && !active.dragged) return;
    active.dragged = true;
    const nextProgress = Math.min(100, Math.max(active.startProgress, active.startProgress + (distance / Math.max(1, active.width - 16)) * 100));
    progress.current = nextProgress;
    dispatch({ type: 'TEAR', progress: nextProgress });
  };

  const endTearPointer = (event) => {
    const active = pointer.current;
    if (!active || active.id !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!active.dragged) autoTear();
  };

  const nextCard = () => {
    if (!state.cardRevealed || leaving) return;
    setLeaving(true);
    nextTimer.current = setTimeout(() => {
      dispatch({ type: 'NEXT', cardCount: cards.length });
      setLeaving(false);
    }, 380);
  };

  const reset = () => {
    cancelAnimationFrame(tearFrame.current);
    clearTimeout(nextTimer.current);
    progress.current = 0;
    pointer.current = null;
    setLeaving(false);
    dispatch({ type: 'RESET' });
  };

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
            <div className="booster-demo__pack" style={{ '--tear-progress': `${state.progress}%`, '--tear-lift': `${state.progress * -0.32}px`, '--tear-rotate': `${state.progress * -0.07}deg`, '--tear-opacity': state.progress > 0 ? 1 : 0 }}>
              <div className="booster-demo__pack-top" aria-hidden="true"><span>✦ SADFLOWER ✦ SADFLOWER ✦ SADFLOWER ✦</span></div>
              <div className="booster-demo__pack-peel" aria-hidden="true"><span>✦ SADFLOWER ✦ SADFLOWER ✦ SADFLOWER ✦</span></div>
              <div className="booster-demo__pack-curl" aria-hidden="true" />
              <div className="booster-demo__pack-tear-edge" aria-hidden="true" />
              <div className="booster-demo__pack-art" aria-hidden="true">
                <span className="booster-demo__pack-orbit booster-demo__pack-orbit--one" />
                <span className="booster-demo__pack-orbit booster-demo__pack-orbit--two" />
                <span className="booster-demo__pack-flower">✳</span>
                <strong>SAD<br />FLOWER</strong>
                <small>TRADING CARDS / SERIES 01</small>
              </div>
              <div className="booster-demo__pack-bottom" aria-hidden="true">3 CARDS INSIDE <span>✦</span> OPEN YOUR WORLD</div>
              <div className="booster-demo__tear-line" aria-hidden="true" />
              <button type="button" className="booster-demo__tear-control" aria-label="Déchirer le booster" onPointerDown={startTearPointer} onPointerMove={moveTearPointer} onPointerUp={endTearPointer} onPointerCancel={() => { pointer.current = null; }} onClick={(event) => { if (event.detail === 0) autoTear(); }}>
                <span>DÉCHIRE ICI <b>→</b></span>
              </button>
            </div>
            <p className="booster-demo__hint">CLIQUE OU GLISSE LA BANDE <span>↗</span></p>
          </div>}
          {revealing && <div className="booster-demo__reveal">
            <div className="booster-demo__card-head"><span>CARTE {String(state.cardIndex + 1).padStart(2, '0')} / 03</span><span className="booster-demo__rarity">{state.cardRevealed ? current.type : 'FACE CACHÉE'}</span></div>
            <div className="booster-demo__deck" key={state.cardIndex}>
              {cards.slice(state.cardIndex + 1).map((card, offset) => <div className="booster-demo__card-back booster-demo__card-back--stacked" key={card.name} style={{ '--stack-offset': `${(cards.length - state.cardIndex - offset - 1) * 9}px`, '--stack-rotate': `${(cards.length - state.cardIndex - offset - 1) * 2}deg` }}><Image src="/booster-demo/card-back.svg" alt="" width={500} height={700} unoptimized /></div>)}
              <div className={`booster-demo__turning-card${state.cardRevealed ? ' is-revealed' : ''}${leaving ? ' is-leaving' : ''}`}>
                <button className="booster-demo__card-back booster-demo__card-back--top" aria-label="Retourner la carte" disabled={state.cardRevealed} onClick={() => dispatch({ type: 'REVEAL' })}><Image src="/booster-demo/card-back.svg" alt="Dos de carte SadFlower" width={500} height={700} unoptimized /></button>
                <div className="booster-demo__card-face"><HoloCard card={current} index={state.cardIndex} /></div>
              </div>
            </div>
            <div className="booster-demo__card-footer">{state.cardRevealed ? <><strong>{current.name}</strong><span>BOUGE TA SOURIS OU TON DOIGT SUR LA CARTE</span></> : <strong>CLIQUE POUR RETOURNER LA CARTE</strong>}</div>
            {state.cardRevealed && <button className="booster-demo__action" disabled={leaving} onClick={nextCard}>{state.cardIndex === cards.length - 1 ? 'Voir le tirage' : 'Carte suivante'} <span>↗</span></button>}
          </div>}
          {state.phase === 'complete' && <div className="booster-demo__complete">
            <div className="booster-demo__complete-icon">✳</div>
            <p className="booster-demo__eyebrow">FIN DE SÉQUENCE</p>
            <h2>PACK OUVERT</h2>
            <div className="booster-demo__pull-list">{cards.map((card, i) => <div key={card.name}><span>0{i + 1}</span><strong>{card.name}</strong><small>{card.type}</small></div>)}</div>
            <button className="booster-demo__action" onClick={reset}>Réessayer <span>↻</span></button>
          </div>}
          <div className="booster-demo__stage-bottom"><span>SF CARD SYSTEMS</span><span>INSERT COIN · NO COIN REQUIRED</span></div>
        </section>
      </div>
      <footer className="booster-demo__footer">PROTOTYPE VISUEL · AUCUNE CARTE ENREGISTRÉE <span>INTERACTION : <a href="https://codepen.io/jh3y/pen/rNRdZMM" target="_blank" rel="noreferrer">JHEY</a> + <a href="https://github.com/kongyo2/cards-css" target="_blank" rel="noreferrer">CARDS-CSS</a></span></footer>
    </main>
  </>;
}
