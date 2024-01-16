import { logout } from '../constants/index';

const initialState = {
  userToken: null,
  accessToken: null,
  loginUserData: '',
  managerId: '',
  deptId: '',
  appIntroBool: 'false',
  loginOTP: '',
};

export const LOGIN_OTP = 'LOGIN_OTP';

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return { ...initialState, appIntroBool: state.appIntroBool };
    }
    case 'USER_TOKEN': {
      return {
        ...state,
        userToken: action.value,
      };
    }
    case 'ACCESS_TOKEN': {
      return {
        ...state,
        accessToken: action.value,
      };
    }
    case 'LOGIN_USER': {
      return {
        ...state,
        loginUserData: action.value,
      };
    }
    case 'MANAGER_ID': {
      return {
        ...state,
        managerId: action.value,
      };
    }
    case 'DEPT_ID': {
      return {
        ...state,
        deptId: action.value,
      };
    }
    case 'APP_INTRO': {
      return {
        ...state,
        appIntroBool: action.value,
      };
    }
    case LOGIN_OTP: {
      return {
        ...state,
        loginOTP: action.value,
      };
    }

    default:
      return state;
  }
};

export default LoginReducer;
