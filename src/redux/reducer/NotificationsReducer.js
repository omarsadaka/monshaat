import { GET_NOTIFICATIONS } from '../constants';
import { logout } from '../constants/index';

const Initial_State = {
  notificationsList: [],
  notificationsLoading: true,
  oneNotification: {},
};

export default function(state = Initial_State, action) {
  switch (action.type) {
    case logout: {
      return state;
    }
    case GET_NOTIFICATIONS:
      return { ...state, notificationsList: action.payload };
    case 'NOTIFICATIONS_LOADER':
      return { ...state, notificationsLoading: action.payload };
    default:
      return state;
  }
}
