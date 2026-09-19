const initialState = Object.freeze({ phase: 'sealed', progress: 0, cardIndex: 0 });

function transition(state, action) {
  if (action.type === 'RESET') return initialState;

  if (action.type === 'TEAR' && state.phase === 'sealed') {
    if (!Number.isFinite(action.progress) || action.progress < 0 || action.progress > 100) return state;
    const progress = Math.max(state.progress, action.progress);
    return { ...state, progress, phase: progress === 100 ? 'revealing' : 'sealed' };
  }

  if (action.type === 'NEXT' && state.phase === 'revealing') {
    if (!Number.isInteger(action.cardCount) || action.cardCount <= 0) return state;
    if (state.cardIndex + 1 >= action.cardCount) return { ...state, phase: 'complete' };
    return { ...state, cardIndex: state.cardIndex + 1 };
  }

  return state;
}

module.exports = { initialState, transition };
