import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BOOK_LEAVES, BOOK_META, BOOKMARK_TARGETS } from './bookData';
import { LEGAL_SECTIONS } from './legalData';
import { playBookPoof, playPageTurn } from './bookSounds';
import '/styles/system32/windows/MentionLegal/bookscene.sass';

const TURN_MS = 260;
const COVER_TURN_MS = 330;
const CASCADE_STEP_MS = 60;
const MOBILE_BREAKPOINT = '(max-width: 800px)';
const MOBILE_BOOK_PAGES = BOOK_LEAVES.flatMap((leaf, leafIndex) => [
  { id: `${leaf.id}-front`, page: leaf.front, leafIndex, side: 'front' },
  { id: `${leaf.id}-back`, page: leaf.back, leafIndex, side: 'back' },
]);

function turnDuration(leafIndex) {
  const kind = BOOK_LEAVES[leafIndex]?.kind;
  return kind === 'front-cover' || kind === 'back-cover' ? COVER_TURN_MS : TURN_MS;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function MentionLegal({ closeWindow }) {
  const sceneRef = useRef(null);
  const dragRef = useRef(null);
  const isInteractionReadyRef = useRef(false);
  const cascadeTimerRef = useRef(null);
  const releaseTimerRef = useRef(null);
  const touchRef = useRef(null);
  const [turnedCount, setTurnedCount] = useState(0);
  const [turningLeaves, setTurningLeaves] = useState([]);
  const [turnDirection, setTurnDirection] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isMobileBook, setIsMobileBook] = useState(false);
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState('');
  const [isMobileBusy, setIsMobileBusy] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const totalLeaves = BOOK_LEAVES.length;
  const isOpeningFromFront = isBusy
    && turnDirection === 'forward'
    && turnedCount === 0
    && turningLeaves.includes(0);
  const isOpeningFromBack = isBusy
    && turnDirection === 'backward'
    && turnedCount === totalLeaves
    && turningLeaves.includes(totalLeaves - 1);
  const isClosingToFront = isBusy
    && turnDirection === 'backward'
    && turnedCount === 1
    && turningLeaves.includes(0);
  const isClosingToBack = isBusy
    && turnDirection === 'forward'
    && turnedCount === totalLeaves - 1
    && turningLeaves.includes(totalLeaves - 1);
  const pose = isOpeningFromFront || isOpeningFromBack
    ? 'open-book'
    : turnedCount === 0
    ? 'closed-front'
    : turnedCount === totalLeaves
      ? 'closed-back'
      : 'open-book';

  useEffect(() => {
    const query = window.matchMedia(MOBILE_BREAKPOINT);
    const sync = () => setIsMobileBook(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const clearTimers = useCallback(() => {
    window.clearTimeout(cascadeTimerRef.current);
    window.clearTimeout(releaseTimerRef.current);
  }, []);

  useEffect(() => {
    const centerBook = () => {
      const node = sceneRef.current;
      const width = node?.offsetWidth || Math.min(940, window.innerWidth * 0.9);
      const height = node?.offsetHeight || Math.min(680, window.innerHeight * 0.84);
      setPosition({
        x: Math.max(8, (window.innerWidth - width) / 2),
        y: Math.max(8, (window.innerHeight - height) / 2),
      });
    };
    centerBook();
    window.addEventListener('resize', centerBook);
    return () => window.removeEventListener('resize', centerBook);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // The desktop-icon click that mounts the book can otherwise bubble into the
  // newly mounted scene and turn the front cover in the same interaction.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      isInteractionReadyRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const settleTurn = useCallback((target, delay = TURN_MS, afterSettle) => {
    window.clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = window.setTimeout(() => {
      setTurnedCount(target);
      setTurningLeaves([]);
      if (afterSettle) {
        afterSettle();
        return;
      }
      setTurnDirection('');
      setIsBusy(false);
    }, delay);
  }, []);

  const turnMobile = useCallback((direction) => {
    if (isMobileBusy) return;
    const target = clamp(mobilePageIndex + direction, 0, MOBILE_BOOK_PAGES.length - 1);
    if (target === mobilePageIndex) return;
    playPageTurn();
    setIsMobileBusy(true);
    setMobileDirection(direction > 0 ? 'forward' : 'backward');
    window.clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = window.setTimeout(() => {
      setMobilePageIndex(target);
      setMobileDirection('');
      setIsMobileBusy(false);
    }, TURN_MS);
  }, [isMobileBusy, mobilePageIndex]);

  const turnOne = useCallback((direction) => {
    if (isMobileBook) {
      turnMobile(direction);
      return;
    }
    if (isBusy) return;
    const target = clamp(turnedCount + direction, 0, totalLeaves);
    if (target === turnedCount) return;
    playPageTurn();
    setIsBusy(true);
    setTurnDirection(direction > 0 ? 'forward' : 'backward');
    const leafIndex = direction > 0 ? turnedCount : turnedCount - 1;
    setTurningLeaves([leafIndex]);
    // Keep the settled spread on screen while its leaf moves. Updating this
    // value before the transition exposed the paper stack as a blank page.
    settleTurn(target, turnDuration(leafIndex));
  }, [isBusy, isMobileBook, settleTurn, totalLeaves, turnMobile, turnedCount]);

  const closeBook = useCallback(() => {
    playBookPoof();
    closeWindow();
  }, [closeWindow]);

  const jumpTo = useCallback((target) => {
    if (isMobileBook) {
      const section = LEGAL_SECTIONS.find((item) => BOOKMARK_TARGETS[item.id] === target);
      const mobileTarget = MOBILE_BOOK_PAGES.findIndex(({ page }) => page.sectionId === section?.id);
      if (mobileTarget >= 0 && mobileTarget !== mobilePageIndex) {
        playPageTurn();
        setMobileDirection(mobileTarget > mobilePageIndex ? 'forward' : 'backward');
        setMobilePageIndex(mobileTarget);
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = window.setTimeout(() => setMobileDirection(''), TURN_MS);
      }
      return;
    }
    const safeTarget = clamp(target, 1, totalLeaves - 1);
    if (safeTarget === turnedCount || isBusy) return;
    clearTimers();
    setIsBusy(true);
    setTurningLeaves([]);
    const direction = safeTarget > turnedCount ? 1 : -1;
    setTurnDirection(direction > 0 ? 'forward' : 'backward');
    const step = (cursor) => {
      if (cursor === safeTarget) {
        setTurnDirection('');
        setIsBusy(false);
        return;
      }
      const leafIndex = direction > 0 ? cursor : cursor - 1;
      const nextCursor = cursor + direction;
      playPageTurn();
      setTurningLeaves([leafIndex]);
      settleTurn(nextCursor, turnDuration(leafIndex), () => {
        cascadeTimerRef.current = window.setTimeout(() => step(nextCursor), CASCADE_STEP_MS);
      });
    };

    step(turnedCount);
  }, [clearTimers, isBusy, isMobileBook, mobilePageIndex, settleTurn, totalLeaves, turnedCount]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeBook();
      if (event.key === 'ArrowLeft') turnOne(-1);
      if (event.key === 'ArrowRight') turnOne(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeBook, turnOne]);

  function startDrag(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveDrag(event) {
    if (!dragRef.current) return;
    const node = sceneRef.current;
    const width = node?.offsetWidth || 940;
    const height = node?.offsetHeight || 680;
    setPosition({
      x: clamp(dragRef.current.x + event.clientX - dragRef.current.pointerX, 8, window.innerWidth - width - 8),
      y: clamp(dragRef.current.y + event.clientY - dragRef.current.pointerY, 8, window.innerHeight - height - 8),
    });
  }

  function stopDrag() {
    dragRef.current = null;
  }

  function handleBookClick(event) {
    if (!isInteractionReadyRef.current) return;
    if (event.target.closest('button, a, input, textarea, select, .book-drag-zone')) return;
    if (pose === 'closed-front') {
      turnOne(1);
      return;
    }
    if (pose === 'closed-back') {
      turnOne(-1);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    if (relativeX <= bounds.width * .28) turnOne(-1);
    if (relativeX >= bounds.width * .72) turnOne(1);
  }

  function startMobileSwipe(event) {
    touchRef.current = event.changedTouches?.[0]?.clientX;
  }

  function endMobileSwipe(event) {
    const startX = touchRef.current;
    const endX = event.changedTouches?.[0]?.clientX;
    touchRef.current = null;
    if (typeof startX !== 'number' || typeof endX !== 'number') return;
    const distance = endX - startX;
    if (Math.abs(distance) < 42) return;
    turnMobile(distance < 0 ? 1 : -1);
  }

  function renderLegalText(text) {
    return text.split(/(\[[^\]]+\])/g).map((part, index) => (
      part.startsWith('[') && part.endsWith(']')
        ? <mark className="legal-fill-blank" key={`${part}-${index}`}>{part}</mark>
        : part
    ));
  }

  function renderPage(page) {
    if (!page) return null;

    if (page.type === 'front-cover') {
      return (
        <div className="cover-copy">
          <small>SadFlower OS</small>
          <h1>Legal<br />Library</h1>
          <span>Registre officiel du bureau</span>
          <em>Cliquez pour ouvrir</em>
        </div>
      );
    }

    if (page.type === 'back-cover') {
      return (
        <div className="cover-copy back-copy">
          <small>SadFlower OS</small>
          <h2>Fin du registre</h2>
          <p>Les informations légales restent également accessibles depuis leurs adresses web dédiées.</p>
          <em>Cliquez pour rouvrir</em>
        </div>
      );
    }

    if (page.type === 'inside-cover') {
      return (
        <div className="inside-cover-copy">
          <span className="bookplate">SADFLOWER<br />LEGAL ARCHIVES</span>
          <small>{page.side === 'front' ? 'Ex-libris' : 'Fin du volume'}</small>
        </div>
      );
    }

    if (page.type === 'title') {
      return (
        <div className="title-page">
          <small>{page.eyebrow}</small>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <span>Volume I · 2026</span>
        </div>
      );
    }

    if (page.type === 'quote') {
      return (
        <blockquote className="quote-page">
          <p>« {page.quote} »</p>
          <cite>{page.caption}</cite>
        </blockquote>
      );
    }

    if (page.type === 'contents') {
      return (
        <div className="contents-page">
          <h1>{page.title}</h1>
          <ol>
            {page.entries.map((entry) => (
              <li key={entry.id}>
                <button type="button" onClick={() => jumpTo(BOOKMARK_TARGETS[entry.id])}>
                  <span style={{ background: entry.color }} />
                  <b>{entry.label}</b>
                  <em>{entry.title}</em>
                </button>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    if (page.type === 'instructions') {
      return (
        <div className="instructions-page">
          <h2>{page.title}</h2>
          <ul>{page.lines.map((line) => <li key={line}>{line}</li>)}</ul>
        </div>
      );
    }

    if (page.type === 'legal') {
      return (
        <div className="legal-paper-content">
          {page.showSectionTitle && (
            <header>
              <small>{page.sectionLabel}</small>
              <h1>{page.sectionTitle}</h1>
            </header>
          )}
          {page.blocks.map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{renderLegalText(text)}</p>
            </section>
          ))}
        </div>
      );
    }

    return <div className="blank-page">{page.note && <em>{page.note}</em>}</div>;
  }

  const leftPaperCount = clamp(turnedCount - 1, 0, BOOK_META.totalPaperSheets);
  const rightPaperCount = BOOK_META.totalPaperSheets - leftPaperCount;
  const mobilePage = MOBILE_BOOK_PAGES[mobilePageIndex];

  return (
    <div className="legal-scene-backdrop">
      <section
        ref={sceneRef}
        className={[
          'mention-book-scene',
          `pose-${pose}`,
          isBusy ? 'is-turning' : '',
          isOpeningFromFront || isClosingToFront ? 'boundary-hide-left' : '',
          isOpeningFromBack || isClosingToBack ? 'boundary-hide-right' : '',
        ].filter(Boolean).join(' ')}
        style={{
          left: position.x,
          top: position.y,
          '--left-paper-count': leftPaperCount,
          '--right-paper-count': rightPaperCount,
          '--paper-total': BOOK_META.totalPaperSheets,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="MentionLegal.exe"
      >
        {isMobileBook && (
          <div className="mobile-book-reader" onTouchStart={startMobileSwipe} onTouchEnd={endMobileSwipe}>
            <button className="book-close mobile-book-close" type="button" aria-label="Fermer le livre" onClick={closeBook}>×</button>
            <article className={`mobile-book-page ${mobileDirection ? `turn-${mobileDirection}` : ''}`} aria-live="polite">
              <div className="mobile-book-page-content">
                {renderPage(mobilePage.page)}
              </div>
              <small className="mobile-book-folio">Feuille {mobilePageIndex + 1} / {MOBILE_BOOK_PAGES.length}</small>
            </article>
            <nav className="mobile-book-controls" aria-label="Navigation du registre">
              <button type="button" onClick={() => turnMobile(-1)} disabled={mobilePageIndex === 0 || isMobileBusy}>Précédent</button>
              <button type="button" onClick={() => turnMobile(1)} disabled={mobilePageIndex === MOBILE_BOOK_PAGES.length - 1 || isMobileBusy}>Suivant</button>
            </nav>
          </div>
        )}
        <div className={`book-object ${isMobileBook ? 'desktop-book-object' : ''}`} onClick={handleBookClick}>
          <button className="book-close" type="button" aria-label="Fermer le livre" onClick={closeBook}>×</button>
          <div className="book-board board-left" aria-hidden="true" />
          <div className="book-board board-right" aria-hidden="true" />
          <div className="paper-stack stack-left" aria-hidden="true" />
          <div className="paper-stack stack-right" aria-hidden="true" />
          <div className="book-spine" aria-hidden="true" />

          {BOOK_LEAVES.map((leaf, index) => {
            const settledTurned = index < turnedCount;
            const isActiveTurn = turningLeaves.includes(index);
            const isForwardTurn = isActiveTurn && turnDirection === 'forward';
            const isBackwardTurn = isActiveTurn && turnDirection === 'backward';
            const turned = isForwardTurn ? true : isBackwardTurn ? false : settledTurned;
            const remainingDepth = totalLeaves - index;
            const turnedDepth = index + 1;
            // The hinge never moves.  Only the free outer edge of a paper
            // sheet grows as it lies deeper in the left or right stack.
            const edgeDepth = turned
              ? Math.max(turnedCount - index - 1, 0)
              : Math.max(index - turnedCount, 0);
            // During a turn, keep outgoing page and incoming page mounted.
            // The active leaf overlaps the incoming page until it physically
            // crosses the spine, instead of revealing the blank paper stack.
            const frontVisible = (!settledTurned && index === turnedCount)
              || (isForwardTurn && index === turnedCount + 1);
            const backVisible = (settledTurned && index === turnedCount - 1)
              || (isBackwardTurn && index === turnedCount - 2);
            // A bookmark belongs to exactly one physical page face.  Matching
            // only its turn count rendered it on both neighbouring leaves,
            // which made a second, detached-looking tab appear.
            const bookmarkSection = LEGAL_SECTIONS.find((section) => {
              const target = BOOKMARK_TARGETS[section.id];
              return (target === index && leaf.front?.sectionId === section.id)
                || (target === index + 1 && leaf.back?.sectionId === section.id);
            });
            const bookmarkSide = bookmarkSection && leaf.front?.sectionId === bookmarkSection.id
              ? 'front'
              : 'back';
            const bookmarkIndex = bookmarkSection
              ? LEGAL_SECTIONS.findIndex((section) => section.id === bookmarkSection.id)
              : -1;
            const bookmarkIsCurrent = bookmarkSection
              && bookmarkSide === 'front'
              && BOOKMARK_TARGETS[bookmarkSection.id] === turnedCount;
            const closedCoverDirection = pose === 'closed-front' && index === 0
              ? 1
              : pose === 'closed-back' && index === totalLeaves - 1
                ? -1
                : 0;
            // Covers are whole-page controls.  They must not rely on the
            // narrow generic "page edge" click zones used by the book body.
            const coverDirection = index === 0
              ? (turnedCount === 0 ? 1 : turnedCount === 1 ? -1 : 0)
              : index === totalLeaves - 1
                ? (turnedCount === totalLeaves ? -1 : turnedCount === totalLeaves - 1 ? 1 : 0)
                : 0;
            const onCoverClick = coverDirection
              ? (event) => {
                event.stopPropagation();
                if (!isInteractionReadyRef.current) return;
                turnOne(coverDirection);
              }
              : undefined;
            return (
              <div
                className={[
                  'book-leaf',
                  `leaf-${leaf.kind}`,
                  turned ? 'is-turned' : 'is-unturned',
                  isActiveTurn ? 'is-active-turn' : '',
                  isActiveTurn ? `turn-${turnDirection}` : '',
                ].filter(Boolean).join(' ')}
                style={{
                  '--leaf-index': index,
                  '--leaf-depth': turned ? turnedDepth : remainingDepth,
                  '--edge-width': `${edgeDepth * 3}px`,
                  '--leaf-turn-duration': `${turnDuration(index)}ms`,
                  zIndex: isActiveTurn ? totalLeaves * 3 : turned ? totalLeaves + index : totalLeaves - index,
                }}
                onKeyDown={closedCoverDirection ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') turnOne(closedCoverDirection);
                } : undefined}
                role={closedCoverDirection ? 'button' : undefined}
                tabIndex={closedCoverDirection ? 0 : undefined}
                aria-label={closedCoverDirection > 0 ? 'Ouvrir le registre' : closedCoverDirection < 0 ? 'Rouvrir le registre' : undefined}
                key={leaf.id}
              >
                <article
                  className={`leaf-face leaf-front ${frontVisible ? 'is-visible-face' : ''}`}
                  aria-hidden={!frontVisible}
                  inert={frontVisible ? undefined : ''}
                  onClick={onCoverClick}
                >
                  {renderPage(leaf.front)}
                  {leaf.kind === 'paper' && <small className="folio folio-front">{index * 2 - 1}</small>}
                </article>
                <article
                  className={`leaf-face leaf-back ${backVisible ? 'is-visible-face' : ''}`}
                  aria-hidden={!backVisible}
                  inert={backVisible ? undefined : ''}
                  onClick={onCoverClick}
                >
                  {renderPage(leaf.back)}
                  {leaf.kind === 'paper' && <small className="folio folio-back">{index * 2}</small>}
                </article>
                {bookmarkSection && (
                  <button
                    className={[
                      'bookmark-tab',
                      'bookmark-on-leaf',
                      `bookmark-${bookmarkSide}`,
                      bookmarkIsCurrent ? 'is-current-bookmark' : 'is-compact-bookmark',
                    ].join(' ')}
                    type="button"
                    style={{
                      '--bookmark-color': bookmarkSection.tabColor,
                      '--bookmark-index': bookmarkIndex,
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      jumpTo(BOOKMARK_TARGETS[bookmarkSection.id]);
                    }}
                    aria-label={`Ouvrir ${bookmarkSection.label}`}
                  >
                    <span>{bookmarkSection.label}</span>
                  </button>
                )}
              </div>
            );
          })}
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <div
              className={`book-drag-zone drag-${side}`}
              aria-hidden="true"
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              key={side}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
