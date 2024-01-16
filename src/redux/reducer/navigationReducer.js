const initialState = {
  navigeteTo: { index: 2, viewExperts: null, tabValue: null },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'navigate-to':
      return { ...state, navigeteTo: payload };
    case 'reset-navigate-to':
      return state;
    default:
      return state;
  }
};
