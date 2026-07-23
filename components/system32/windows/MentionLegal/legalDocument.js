import Head from 'next/head';
import Link from 'next/link';
import { LEGAL_SECTIONS } from './legalData';
import '/styles/system32/windows/MentionLegal/legalroute.sass';

export default function LegalDocument({ sectionId }) {
  const section = LEGAL_SECTIONS.find((item) => item.id === sectionId) || LEGAL_SECTIONS[0];

  return (
    <>
      <Head>
        <title>{section.title} — SadFlower</title>
        <meta name="description" content={`${section.title} du site SadFlower`} />
      </Head>
      <main className="legal-route">
        <nav className="legal-route-nav" aria-label="Documents légaux">
          <strong>MentionLegal.exe</strong>
          {LEGAL_SECTIONS.map((item) => (
            <Link key={item.id} className={item.id === section.id ? 'active' : ''} href={item.route}>
              {item.label}
            </Link>
          ))}
        </nav>
        <article className="legal-route-page">
          <p className="legal-route-kicker">SadFlower OS / documentation</p>
          <h1>{section.title}</h1>
          {section.blocks.map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
