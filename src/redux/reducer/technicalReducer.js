import { logout } from '../constants/index';

const initialState = {
  allClassificationType: '',
  allType: '',
  allCategories: '',
  allLocations: '',
  technicalResponse: '',
  teamList: [],
};

export const TEAM_LIST = 'TEAM_LIST';

const TechnicalReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'CLASSIFICATION_TYPES': {
      return {
        ...state,
        allClassificationType: action.value,
      };
    }
    case 'TECHNICAL_TYPES': {
      return {
        ...state,
        allType: action.value,
      };
    }
    case 'CATEGORY_TYPES': {
      return {
        ...state,
        allCategories: action.value,
      };
    }
    case 'TECH_LOCATIONS': {
      return {
        ...state,
        allLocations: action.value,
      };
    }

    case 'TECHNICAL_POST': {
      return {
        ...state,
        technicalResponse: action.value,
      };
    }

    case TEAM_LIST: {
      return {
        ...state,
        teamList: action.value,
      };
    }
    default:
      return state;
  }
};

export default TechnicalReducer;
