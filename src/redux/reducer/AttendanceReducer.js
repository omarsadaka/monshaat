import { logout } from '../constants/index';

const initialState = {
  attendanceResponse: '',
  attendanceList: '',
  inOut: '',
  showModal: false,
};

const AttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'ATTENDANCE_MODAL': {
      return {
        ...state,
        showModal: action.value,
      };
    }
    case 'ATTENDANCE_TYPE_POST': {
      return {
        ...state,
        attendanceResponse: action.value,
      };
    }
    case 'ATTENDANCE_LIST': {
      return {
        ...state,
        attendanceList: action.value,
      };
    }
    case 'GET_IN_OUT': {
      //console.log("\n\n\n\n\n\n", action.payload);
      return {
        ...state,
        inOut: action.payload,
      };
    }
    default:
      return state;
  }
};

export default AttendanceReducer;
