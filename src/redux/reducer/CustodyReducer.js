import { logout } from '../constants/index';

const initialState = {
  CustodyResponse: '',
  CustodyCloseResponse: '',
};

const CustodyReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'CUSTODY_RESPONSE': {
      return {
        ...state,
        CustodyResponse: action.value,
      };
    }
    case 'CUSTODY_CLOSE_RESPONSE': {
      return {
        ...state,
        CustodyCloseResponse: action.value,
      };
    }
    default:
      return state;
  }
};

export default CustodyReducer;
