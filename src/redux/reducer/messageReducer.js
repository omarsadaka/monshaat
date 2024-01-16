import {
  ADD_NEW_MESSAGE,
  GET_CORRESPONDANTSLIST,
  GET_OLD_MESSAGES,
  GET_ONE_CORRES,
  GET_UNSEEN_COUNTER,
} from '../constants';
import { logout } from '../constants/index';

const Initial_State = {
  messages: [],
  correspondantsList: [],
  unSeenCount: -1,
};

export default function(state = Initial_State, action) {
  switch (action.type) {
    case logout: {
      return state;
    }
    case GET_OLD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case ADD_NEW_MESSAGE:
      const found = state.messages.find(
        el => el.created_at === action.payload.created_at,
      );
      let newMsgs = [...state.messages];
      if (found == undefined) newMsgs = [...newMsgs, action.payload];

      return {
        ...state,
        messages: newMsgs,
      };
    case GET_CORRESPONDANTSLIST:
      return { ...state, correspondantsList: action.payload };

    case GET_UNSEEN_COUNTER:
      return { ...state, unSeenCount: action.payload };

    case GET_ONE_CORRES: {
      let newCorresp = state.correspondantsList.map(el => {
        if (el)
          if (action.payload)
            if (action.payload.id == el.id) {
              var o = Object.assign({}, el);
              o.image = action.payload.image;
              o.sector_id = action.payload.sector_id;
              o.job_id = action.payload.job_id;
              return o;
            } else return el;
          else return el;
      });

      return { ...state, correspondantsList: newCorresp };
    }

    default:
      return state;
  }
}
