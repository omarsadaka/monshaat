import { logout } from '../constants/index';

// import merge from "lodash.merge";
var _ = require('lodash');

const initialState = {
  requestDataList: '',
  allMyRequests: {},
  allMyApprove: {},
  approveIDs: [],
  approveLoading: false,
  requestLoading: false,
  hour_start: '',
  hour_stop: '',
  editable: '',
  attendance: [],
  sectors: [],
  departments: [],
  employees: [],
};
function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
const HomeMyRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'HOME_ATTENDANCE': {
      return {
        ...state,
        attendance: action.payload,
      };
    }
    case 'HOME_APPROVE_IDS': {
      return {
        ...state,
        approveIDs: action.payload,
      };
    }
    case 'HOME_ALL_MY_REQUEST_LOADING': {
      return {
        ...state,
        requestLoading: action.value,
      };
    }
    case 'HOME_ALL_MY_APPROVE_LOADING': {
      return {
        ...state,
        approveLoading: action.value,
      };
    }
    case 'HOME_ALL_MY_REQUEST': {
      return {
        ...state,
        requestLoading: false,
        allMyRequests: _.mergeWith(
          state.allMyRequests,
          action.value,
          customizer,
        ),
      };
    }
    case 'HOME_ALL_MY_APPROVE': {
      return {
        ...state,
        approveLoading: false,
        allMyApprove: _.mergeWith(state.allMyApprove, action.value, customizer),
      };
    }
    case 'CLEAR_HOME': {
      return {
        ...state,
        approveLoading: false,
        allMyRequests: {},
        allMyApprove: {},
      };
    }
    case 'HOME_MY_REQUEST': {
      return {
        ...state,
        requestDataList: action.value,
      };
    }
    case 'COME_FROM': {
      return {
        ...state,
        editable: action.value,
      };
    }
    case 'FILTER_SECTORS': {
      return {
        ...state,
        sectors: action.payload,
      };
    }
    case 'FILTER_DEPARTMENTS': {
      return {
        ...state,
        departments: action.payload,
      };
    }
    case 'FILTER_EMPLOYEES': {
      return {
        ...state,
        employees: action.payload,
      };
    }
    default:
      return state;
  }
};

export default HomeMyRequestReducer;
