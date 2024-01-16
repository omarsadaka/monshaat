import { SetActivityData, SetFamilyData, SetNewsData } from '../constants';
import { logout } from '../constants/index';

const initialState = {
  familyData: [],
  newsData: [],
  monshaatActivityData: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case logout: {
      return initialState;
    }
    case SetFamilyData:
      return { ...state, familyData: payload };
    case SetNewsData:
      return { ...state, newsData: payload };
    case SetActivityData:
      return { ...state, monshaatActivityData: payload };

    default:
      return state;
  }
};
