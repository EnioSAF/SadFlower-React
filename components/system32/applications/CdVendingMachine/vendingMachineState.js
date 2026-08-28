'use strict';

const MACHINE_PHASES = Object.freeze({
  IDLE: 'idle',
  SELECTED: 'selected',
  DISPENSING: 'dispensing',
  DELIVERED: 'delivered',
  ERROR: 'error',
});

const INITIAL_MACHINE_STATE = Object.freeze({
  phase: MACHINE_PHASES.IDLE,
  selectedAlbumId: null,
  deliveredAlbumId: null,
  message: 'SELECT DISC',
});

function transitionMachine(state, event) {
  if (!event || typeof event.type !== 'string') return state;
  if (event.type === 'RESET') return INITIAL_MACHINE_STATE;
  if (event.type === 'FAIL') {
    return { ...state, phase: MACHINE_PHASES.ERROR, message: 'SERVICE' };
  }
  if (event.type === 'SELECT' && state.phase !== MACHINE_PHASES.DISPENSING) {
    if (!event.albumId) return state;
    return {
      phase: MACHINE_PHASES.SELECTED,
      selectedAlbumId: event.albumId,
      deliveredAlbumId: null,
      message: 'DISC READY',
    };
  }
  if (event.type === 'OBTAIN') {
    if (!state.selectedAlbumId) return { ...state, message: 'SELECT DISC' };
    if (state.phase !== MACHINE_PHASES.SELECTED) return state;
    return { ...state, phase: MACHINE_PHASES.DISPENSING, message: 'DISPENSING' };
  }
  if (event.type === 'COMPLETE' && state.phase === MACHINE_PHASES.DISPENSING) {
    return {
      ...state,
      phase: MACHINE_PHASES.DELIVERED,
      deliveredAlbumId: state.selectedAlbumId,
      message: 'TAKE DISC',
    };
  }
  return state;
}

module.exports = { INITIAL_MACHINE_STATE, MACHINE_PHASES, transitionMachine };
