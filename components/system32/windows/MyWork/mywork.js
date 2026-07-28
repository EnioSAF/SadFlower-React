import React, { useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useZIndex } from '@/components/Tools/ZIndexContext';
import { SERVICES, buildRequestPayload, isFormValid } from './myWorkData';
import '98.css';

const initialForm = { name: '', email: '', phone: '', preferredDate: '', message: '', consent: false };

export default function MyWork({ closeWindow }) {
  const { bringToFront, zIndex: globalZIndex } = useZIndex();
  const [zIndex, setZIndex] = useState(globalZIndex);
  const [category, setCategory] = useState('Développeur');
  const [tab, setTab] = useState('Services');
  const [selectedCode, setSelectedCode] = useState(SERVICES[0].code);
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState('idle');
  const [result, setResult] = useState(null);
  const selectedService = SERVICES.find((service) => service.code === selectedCode) || SERVICES[0];
  const visibleServices = useMemo(() => SERVICES.filter((service) => service.category === category), [category]);
  const isMobileScreen = () => window.innerWidth <= 600;
  const getCenterPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return {
      x: (windowWidth - 350) / 2,
      y: (windowHeight - 220) / 2,
    };
  };
  const mobile = isMobileScreen();
  const earliestDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const chooseService = (service) => { setSelectedCode(service.code); setTab('Quick quote'); };
  const submit = async (event) => {
    event.preventDefault();
    if (!isFormValid(form)) { setState('invalid'); return; }
    setState('loading');
    try {
      const response = await fetch('/api/my-work/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify(buildRequestPayload(form, selectedService)),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message || 'Request refused');
      setResult(body.data);
      setState('success');
    } catch (error) {
      setResult(error.message);
      setState('error');
    }
  };

  return <Rnd className="window mywork-window" style={{ zIndex }} default={{ ...getCenterPosition(), width: 760, height: 650 }} minWidth={350} minHeight={220} disableDragging={mobile} position={mobile} onClick={!mobile ? () => setZIndex(bringToFront()) : undefined}>
    <div className="title-bar">
      <div className="title-bar-text">MyWork.exe</div>
      <div className="title-bar-controls"><button aria-label="Minimize" /><button aria-label="Maximize" /><button aria-label="Close" onClick={closeWindow} /></div>
    </div>
    <div className="window-body mywork-body">
      <div className="browser-toolbar"><button>&lt;-</button><button>-&gt;</button><button>↻</button><label>Address</label><input readOnly value="http://mywork.sadflower.local/" /></div>
      <div className="browser-brand"><strong>MYWORK</strong><span> services, sounds &amp; strange little machines</span></div>
      <menu className="browser-tabs" role="tablist">{['Services', 'Portfolio', 'Quick quote'].map((item) => <li key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</li>)}</menu>
      <div className="browser-page">
        {tab === 'Portfolio' && <section className="retro-panel"><h2>Recent uploads</h2><p>Web experiments, Godot prototypes, songs and sounds — made with care, shipped with personality.</p><div className="portfolio-grid"><article><b>SADFLOWER OS</b><span>Interactive portfolio / XP desktop</span></article><article><b>GAME AUDIO LAB</b><span>Atmospheres, loops, tiny worlds</span></article><article><b>AUTOMATION KIT</b><span>Bots and useful little tools</span></article></div></section>}
        {tab !== 'Portfolio' && <>
          <section className="hero-strip"><div><small>WELCOME TO MY WORK</small><h1>Need a thing made?</h1><p>Pick a department. Tell me what is stuck. We make a plan.</p></div><div className="price-sticker">OPEN<br />FOR<br />WORK</div></section>
          <div className="category-tabs"><button className={category === 'Développeur' ? 'selected' : ''} onClick={() => setCategory('Développeur')}>DEV DEPT.</button><button className={category === 'Musicien' ? 'selected' : ''} onClick={() => setCategory('Musicien')}>MUSIC DEPT.</button></div>
          {tab === 'Services' && <section className="service-grid">{visibleServices.map((service) => <article className="service-card" key={service.code}><div className="service-card-head"><span>{service.category}</span><b>{service.label}</b></div><p>{service.description}</p><small>{service.examples}</small><button onClick={() => chooseService(service)}>Ask about it &gt;&gt;</button></article>)}</section>}
          {tab === 'Quick quote' && <section className="quote-layout"><div className="retro-panel selected-service"><small>SELECTED LISTING</small><h2>{selectedService.label}</h2><p>{selectedService.description}</p><button onClick={() => setTab('Services')}>Change service</button></div><form className="quote-form" onSubmit={submit}><h2>Quick quote / reservation</h2><label>Name *<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label><label>Email *<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label>Phone<input value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label><label>Preferred date<input type="date" min={earliestDate} value={form.preferredDate} onChange={(event) => update('preferredDate', event.target.value)} /></label><label>Message<textarea rows="4" value={form.message} onChange={(event) => update('message', event.target.value)} /></label><button type="button" className={`consent ${form.consent ? 'is-checked' : ''}`} role="checkbox" aria-checked={form.consent} onClick={() => update('consent', !form.consent)}><span className="consent-box" aria-hidden="true" /><span>I agree to be contacted about this request.</span></button><small className="privacy-note">Your data is used only to answer this request. <a href="/confidentialite" target="_blank" rel="noreferrer">Privacy / RGPD</a></small><button type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Sending...' : 'SEND REQUEST >>'}</button>{state === 'invalid' && <p className="form-error">Name, valid email and consent are required.</p>}{state === 'success' && <p className="form-success">Request received: {result?.requestId}</p>}{state === 'error' && <p className="form-error">{result}. Please try again later.</p>}</form></section>}
        </>}
      </div>
    </div>
    <div className="status-bar"><p className="status-bar-field">MyWork online</p><p className="status-bar-field">Listings: {SERVICES.length}</p><p className="status-bar-field">Visitors: probably you</p></div>
  </Rnd>;
}
