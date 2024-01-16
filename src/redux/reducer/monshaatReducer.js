import { logout } from '../constants/index';

const initialState = {
  monshaatNewsData: '',
  monshaatFamily: '',
  monshaatActivity: '',
};

const MonshaatReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'MONSHAAT_NEWS': {
      return {
        ...state,
        monshaatNewsData: action.value,
      };
    }

    case 'MONSHAAT_FAMILY': {
      return {
        ...state,
        monshaatFamily: action.value,
      };
    }
    case 'MONSHAAT_ACTIVITY': {
      return {
        ...state,
        monshaatActivity: action.value,
      };
    }
    default:
      return state;
  }
};

export default MonshaatReducer;
