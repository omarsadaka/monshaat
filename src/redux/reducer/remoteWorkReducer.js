import { logout } from '../constants/index';

const initialState = {
  remoteWorkHistory: '',
  remoteWorkResponse: '',
};

const RemoteWorkReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'REMOTE_WORK': {
      return {
        ...state,
        remoteWorkResponse: action.value,
      };
    }
    case 'REMOTE_WORK_HISTORY': {
      return {
        ...state,
        remoteWorkHistory: action.value,
      };
    }

    default:
      return state;
  }
};

export default RemoteWorkReducer;
