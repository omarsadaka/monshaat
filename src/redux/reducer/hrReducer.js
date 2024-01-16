import { logout } from '../constants/index';

const initialState = {
  hrRequestResponse: '',
};

const HrRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'HR_REQUEST_POST': {
      return {
        ...state,
        hrRequestResponse: action.value,
      };
    }
    default:
      return state;
  }
};

export default HrRequestReducer;
