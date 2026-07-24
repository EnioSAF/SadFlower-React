import { LEGAL_SECTIONS } from './legalData';

const editorialPages = [
  {
    id: 'title',
    type: 'title',
    eyebrow: 'SadFlower OS présente',
    title: 'Le registre de bord',
    subtitle: 'Mentions légales, vie privée et règles de la maison',
  },
  {
    id: 'title-verso',
    type: 'quote',
    quote: 'Tout ce qui doit être lisible reste consigné ici.',
    caption: 'Édition SadFlower OS — 2026',
  },
  {
    id: 'contents',
    type: 'contents',
    title: 'Sommaire',
    entries: LEGAL_SECTIONS.map((section) => ({
      id: section.id,
      label: section.label,
      title: section.title,
      color: section.tabColor,
    })),
  },
  {
    id: 'contents-verso',
    type: 'instructions',
    title: 'Comment consulter ce livre',
    lines: [
      'Cliquez sur le bord droit pour avancer.',
      'Cliquez sur le bord gauche pour revenir.',
      'Les marque-pages rejoignent directement un chapitre.',
      'Les flèches du clavier fonctionnent également.',
    ],
  },
];

function buildSectionPages() {
  const pages = [];
  const targets = {};

  LEGAL_SECTIONS.forEach((section) => {
    targets[section.id] = editorialPages.length + pages.length;

    for (let index = 0; index < section.blocks.length; index += 2) {
      pages.push({
        id: `${section.id}-${index / 2 + 1}`,
        type: 'legal',
        sectionId: section.id,
        sectionLabel: section.label,
        sectionTitle: section.title,
        pageInSection: index / 2 + 1,
        showSectionTitle: index === 0,
        blocks: section.blocks.slice(index, index + 2),
      });
    }

  });

  pages.push({
    id: 'colophon',
    type: 'quote',
    quote: 'Le registre se referme, mais ses pages restent accessibles.',
    caption: 'SadFlower OS — fin du volume I',
  });

  return { pages, targets };
}

const sectionBook = buildSectionPages();
export const BOOK_PAGES = [...editorialPages, ...sectionBook.pages];

function pairPages(pages) {
  const sheets = [];
  for (let index = 0; index < pages.length; index += 2) {
    sheets.push({
      id: `sheet-${index / 2 + 1}`,
      kind: 'paper',
      front: pages[index],
      back: pages[index + 1],
    });
  }
  return sheets;
}

const paperSheets = pairPages(BOOK_PAGES);

export const BOOK_LEAVES = [
  {
    id: 'front-cover',
    kind: 'front-cover',
    front: { id: 'front-cover-face', type: 'front-cover' },
    back: { id: 'front-cover-inside', type: 'inside-cover', side: 'front' },
  },
  ...paperSheets,
  {
    id: 'back-cover',
    kind: 'back-cover',
    front: { id: 'back-cover-inside', type: 'inside-cover', side: 'back' },
    back: { id: 'back-cover-face', type: 'back-cover' },
  },
];

export const BOOKMARK_TARGETS = Object.fromEntries(
  Object.entries(sectionBook.targets).map(([sectionId, pageIndex]) => {
    const sheetIndex = Math.floor(pageIndex / 2);
    const leafIndex = 1 + sheetIndex;
    const targetTurnedCount = pageIndex % 2 === 0 ? leafIndex : leafIndex + 1;
    return [sectionId, targetTurnedCount];
  })
);

export const BOOK_META = {
  firstOpenTurnedCount: 1,
  contentsTurnedCount: 2,
  totalLeaves: BOOK_LEAVES.length,
  totalPaperSheets: paperSheets.length,
};
