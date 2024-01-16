import { logout } from '../constants/index';

const initialState = {
  notificationData: '',
  allNotificationData: '',
  openNotificationData: '',
};

const NotificationrequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'GET_NOTIFICATION': {
      return {
        ...state,
        notificationData: action.value,
      };
    }
    case 'GET_ALL_NOTIFICATION': {
      return {
        ...state,
        allNotificationData: action.value,
      };
    }
    case 'OPEN_NOTIFICATION': {
      return {
        ...state,
        openNotificationData: action.value,
      };
    }
    default:
      return state;
  }
};

export default NotificationrequestReducer;
