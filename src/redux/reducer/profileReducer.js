import { logout } from '../constants/index';

const initialState = {
  profileData: '',
  userProfileData: '',
  corresProfileData: '',
  userGroupData: '',
  isLoading: false,
  ITSMToken: null,
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'GET_PROFILE': {
      return {
        ...state,
        profileData: action.value,
      };
    }
    case 'PROFILE_LOADING': {
      return {
        ...state,
        isLoading: action.value,
      };
    }
    case 'GET_PROFILE_DATA': {
      return {
        ...state,
        userProfileData: action.value,
        isLoading: false,
      };
    }
    case 'GET_CORRES_DATA': {
      return {
        ...state,
        corresProfileData: action.value,
        isLoading: false,
      };
    }
    case 'GET_USER_GROUP_DATA': {
      return {
        ...state,
        userGroupData: action.value,
      };
    }
    case 'ITSM_TOKEN': {
      return {
        ...state,
        ITSMToken: action.value,
      };
    }
    default:
      return state;
  }
};

export default ProfileReducer;
