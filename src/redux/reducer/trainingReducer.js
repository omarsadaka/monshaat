import { logout } from '../constants/index';

const initialState = {
  allCountries: '',
  allCities: '',
  trainingRequestResponse: '',
  allAternateEmployeeData: '',
  currencyType: '',
  travelDays: 1,
};

export const TRAINING_TRAVEL_DAYS = 'TRAINING_TRAVEL_DAYS';

const TrainingReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'GET_COUNTRIES': {
      return {
        ...state,
        allCountries: action.value,
      };
    }
    case 'GET_CITIES': {
      return {
        ...state,
        allCities: action.value,
      };
    }
    case 'GET_ALTERNATE_EMPLOYEE': {
      return {
        ...state,
        allAternateEmployeeData: action.value,
      };
    }
    case 'TRAINING_TYPE_POST': {
      return {
        ...state,
        trainingRequestResponse: action.value,
      };
    }
    case 'CURRENCY_TYPE': {
      return {
        ...state,
        currencyType: action.value,
      };
    }
    case TRAINING_TRAVEL_DAYS: {
      return {
        ...state,
        travelDays: action.value,
      };
    }

    default:
      return state;
  }
};

export default TrainingReducer;
