'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveMobileBookPage } = require('../../components/system32/windows/MentionLegal/mobilePageResolver');

const pages = [
  { id: 'front', page: { type: 'front-cover' } },
  { id: 'title', page: { type: 'editorial' } },
  { id: 'legal', page: { type: 'section' } },
];

test('uses an existing page when Fast Refresh keeps a stale mobile index', () => {
  const result = resolveMobileBookPage(pages, 99);

  assert.deepEqual(result, {
    index: 2,
    page: pages[2],
  });
});

test('uses the first page for an invalid mobile index', () => {
  const result = resolveMobileBookPage(pages, Number.NaN);

  assert.deepEqual(result, {
    index: 0,
    page: pages[0],
  });
});

test('replaces an incomplete sheet side with a safe blank page', () => {
  const result = resolveMobileBookPage([{ id: 'incomplete-sheet-back', page: undefined }], 0);

  assert.equal(result.page.page.type, 'blank');
});
