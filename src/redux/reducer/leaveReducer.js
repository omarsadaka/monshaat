import { logout } from '../constants/index';

const initialState = {
  allLeaveTypes: '',
  leaveRequestResponse: '',
};

const LeavePermissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'LEAVE_PERMISSION_TYPES': {
      return {
        ...state,
        allLeaveTypes: action.value,
      };
    }
    case 'LEAVE_PERMISSION_POST': {
      return {
        ...state,
        leaveRequestResponse: action.value,
      };
    }
    default:
      return state;
  }
};

export default LeavePermissionReducer;
