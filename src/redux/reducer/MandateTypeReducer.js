import { logout } from '../constants/index';

const initialState = {
  deputationTypes: '',
  mandateRequestResponse: '',
  deputationLocation: '',
  deputationTravelDuration: 1,
};

export const DEPUTATION_LOCATION = 'DEPUTATION_LOCATION';
export const DEPUTATION_TRAVEL_DURATION = 'DEPUTATION_TRAVEL_DURATION';

const MandateTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'DEPUTATION_TYPES': {
      return {
        ...state,
        deputationTypes: action.value,
      };
    }
    case 'MANDATE_REQUEST_POST': {
      return {
        ...state,
        mandateRequestResponse: action.value,
      };
    }
    case DEPUTATION_LOCATION: {
      return {
        ...state,
        deputationLocation: action.value,
      };
    }
    case DEPUTATION_TRAVEL_DURATION: {
      return {
        ...state,
        deputationTravelDuration: action.value,
      };
    }
    default:
      return state;
  }
};

export default MandateTypeReducer;
