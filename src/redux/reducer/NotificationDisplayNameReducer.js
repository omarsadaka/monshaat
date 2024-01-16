import { logout } from '../constants/index';

const initialState = {
  notificationDatadisplayname: '',
};

const NotificationDisplayNameReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'GET_NOTIFICATIONDISPLAYNAME': {
      return {
        ...state,
        notificationDatadisplayname: action.value,
      };
    }
    default:
      return state;
  }
};

export default NotificationDisplayNameReducer;
