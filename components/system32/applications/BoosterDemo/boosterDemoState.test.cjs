const test = require('node:test');
const assert = require('node:assert/strict');
const { initialState, transition } = require('./boosterDemoState');

test('a full tear opens the pack exactly once', () => {
  const partlyTorn = transition(initialState, { type: 'TEAR', progress: 74 });
  assert.equal(partlyTorn.phase, 'sealed');
  assert.equal(partlyTorn.progress, 74);

  const opened = transition(partlyTorn, { type: 'TEAR', progress: 100 });
  assert.equal(opened.phase, 'revealing');
  assert.equal(opened.progress, 100);
  assert.equal(opened.cardIndex, 0);
  assert.deepEqual(transition(opened, { type: 'TEAR', progress: 0 }), opened);
});

test('a face-down card must be turned before moving to the next card', () => {
  let state = transition(initialState, { type: 'TEAR', progress: 100 });
  assert.equal(state.cardRevealed, false);
  assert.deepEqual(transition(state, { type: 'NEXT', cardCount: 3 }), state);

  state = transition(state, { type: 'REVEAL' });
  assert.equal(state.cardRevealed, true);
  state = transition(state, { type: 'NEXT', cardCount: 3 });
  assert.equal(state.cardIndex, 1);
  assert.equal(state.cardRevealed, false);

  state = transition(state, { type: 'REVEAL' });
  state = transition(state, { type: 'NEXT', cardCount: 3 });
  assert.equal(state.cardIndex, 2);
  assert.equal(state.cardRevealed, false);

  state = transition(state, { type: 'REVEAL' });
  state = transition(state, { type: 'NEXT', cardCount: 3 });
  assert.equal(state.phase, 'complete');
  assert.deepEqual(transition(state, { type: 'RESET' }), initialState);
});

test('invalid progress and reveal actions leave state unchanged', () => {
  assert.deepEqual(transition(initialState, { type: 'NEXT', cardCount: 3 }), initialState);
  assert.deepEqual(transition(initialState, { type: 'REVEAL' }), initialState);
  assert.deepEqual(transition(initialState, { type: 'TEAR', progress: NaN }), initialState);
  assert.deepEqual(transition(initialState, { type: 'TEAR', progress: -20 }), initialState);
});
