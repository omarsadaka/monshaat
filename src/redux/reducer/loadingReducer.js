import { logout } from '../constants/index';

const initialState = {
  isLoading: false,
  isLoadingStand: true,
};

export const COMMON_LOADER = 'COMMON_LOADER';
export const STAND_LOADER = 'STAND_LOADER';

const CommonLoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case COMMON_LOADER: {
      return {
        ...state,
        isLoading: action.value,
      };
    }
    case STAND_LOADER: {
      return {
        ...state,
        isLoadingStand: action.value,
      };
    }
    default:
      return state;
  }
};

export default CommonLoaderReducer;
