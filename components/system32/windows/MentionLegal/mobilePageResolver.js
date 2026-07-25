'use strict';

const EMPTY_MOBILE_PAGE = {
  id: 'mobile-page-unavailable',
  page: {
    id: 'mobile-page-unavailable-content',
    type: 'blank',
  },
};

function resolveMobileBookPage(pages, index) {
  if (!Array.isArray(pages) || pages.length === 0) {
    return { index: 0, page: EMPTY_MOBILE_PAGE };
  }

  const requestedIndex = Number.isInteger(index) ? index : 0;
  const safeIndex = Math.min(Math.max(requestedIndex, 0), pages.length - 1);
  const candidate = pages[safeIndex];

  return {
    index: safeIndex,
    page: candidate?.page ? candidate : EMPTY_MOBILE_PAGE,
  };
}

module.exports = { resolveMobileBookPage };
