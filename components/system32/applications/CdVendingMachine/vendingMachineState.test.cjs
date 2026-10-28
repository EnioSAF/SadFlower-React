'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  INITIAL_MACHINE_STATE,
  MACHINE_PHASES,
  transitionMachine,
} = require('./vendingMachineState');
const { DEMO_ALBUMS } = require('./vendingMachineData');
const { playMachineSound, stopMachineAudio } = require('./machineAudio');

test('catalogue exposes six unique stable slots', () => {
  assert.equal(DEMO_ALBUMS.length, 6);
  assert.equal(new Set(DEMO_ALBUMS.map(({ id }) => id)).size, 6);
  assert.equal(new Set(DEMO_ALBUMS.map(({ slotCode }) => slotCode)).size, 6);
});

test('selection stores a stable album id and can be replaced', () => {
  const first = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-01' });
  const second = transitionMachine(first, { type: 'SELECT', albumId: 'demo-02' });
  assert.equal(second.phase, MACHINE_PHASES.SELECTED);
  assert.equal(second.selectedAlbumId, 'demo-02');
});

test('obtain without selection stays safe and requests a disc', () => {
  const state = transitionMachine(INITIAL_MACHINE_STATE, { type: 'OBTAIN' });
  assert.equal(state.phase, MACHINE_PHASES.IDLE);
  assert.equal(state.message, 'SELECT DISC');
});

test('selected disc travels through dispensing to delivered', () => {
  const selected = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-03' });
  const dispensing = transitionMachine(selected, { type: 'OBTAIN' });
  const delivered = transitionMachine(dispensing, { type: 'COMPLETE' });
  assert.equal(dispensing.phase, MACHINE_PHASES.DISPENSING);
  assert.equal(delivered.phase, MACHINE_PHASES.DELIVERED);
  assert.equal(delivered.deliveredAlbumId, 'demo-03');
});

test('reset clears selection and invalid events preserve state', () => {
  const selected = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-04' });
  assert.deepEqual(transitionMachine(selected, { type: 'UNKNOWN' }), selected);
  assert.deepEqual(transitionMachine(selected, { type: 'RESET' }), INITIAL_MACHINE_STATE);
});

test('audio feedback is a safe no-op outside the browser', async () => {
  await assert.doesNotReject(() => playMachineSound('select', false));
  assert.doesNotThrow(() => stopMachineAudio());
});
