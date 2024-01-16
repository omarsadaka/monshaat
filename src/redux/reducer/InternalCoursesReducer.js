import { logout } from '../constants/index';

const initialState = {
  requestDataList: '',
  approveIDs: [],
  approveLoading: false,
  requestLoading: false,
  editable: '',
  internalCourses: [],
  myInternal: {},
  internalRequestResponse: '',
  internalResponse: '',
};

const InternalCoursesRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'INTERNAL_COURSES': {
      return {
        ...state,
        internalCourses: action.payload,
      };
    }
    case 'INTERNAL_ALL_MY_REQUEST_LOADING': {
      return {
        ...state,
        requestLoading: action.value,
      };
    }
    case 'POST_INTERNAL_COURSES': {
      return {
        ...state,
        internalRequestResponse: action.value,
      };
    }

    case 'COME_FROM': {
      return {
        ...state,
        editable: action.value,
      };
    }
    case 'INTERNAL_COU': {
      return {
        ...state,
        internalResponse: action.value,
      };
    }

    default:
      return state;
  }
};
export default InternalCoursesRequestReducer;
