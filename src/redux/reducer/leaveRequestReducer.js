import { logout } from '../constants/index';

const initialState = {
  allLeaveTypes: '',
  leaveVacationRes: '',
  allAternateEmployeeDataList: '',
  leaveCredit: '0',
  leaveCreditSick: '0',
};

const LeaveRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'LEAVE_TYPES': {
      return {
        ...state,
        allLeaveTypes: action.value,
      };
    }
    case 'LEAVE_CREDIT': {
      return {
        ...state,
        leaveCredit: action.value,
      };
    }
    case 'LEAVE_CREDIT_SICK': {
      return {
        ...state,
        leaveCreditSick: action.value,
      };
    }
    case 'VACATION_RESPONSE': {
      return {
        ...state,
        leaveVacationRes: action.value,
      };
    }
    case 'GET_ALTERNATE_EMPLOYEE_FOR_LEAVE': {
      return {
        ...state,
        allAternateEmployeeDataList: action.value,
      };
    }
    default:
      return state;
  }
};

export default LeaveRequestReducer;
