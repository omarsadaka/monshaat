const initialState = {
  team: {
    currenYear: null,
    previousYear: null,
    nextYear: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set-my-team-calender':
      return { ...state, team: payload };

    default:
      return state;
  }
};
