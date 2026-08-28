'use strict';

const DEMO_ALBUMS = Array.from({ length: 6 }, (_, index) => {
  const number = index + 1;
  const row = index < 3 ? 'A' : 'B';
  const column = (index % 3) + 1;
  const colors = ['#e65454', '#efb74d', '#7bcf8f', '#5e9ee6', '#a77ae8', '#e77fb4'];

  return {
    id: `demo-0${number}`,
    slotCode: `${row}${column}`,
    title: `DEMO DISC 0${number}`,
    artist: 'SADFLOWER ARCHIVE',
    cover: '/CdVendingMachine/generic-disc.svg',
    accentColor: colors[index],
    machineMessage: `DISC ${row}${column} READY`,
  };
});

module.exports = { DEMO_ALBUMS };
