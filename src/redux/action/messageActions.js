import axios from 'axios';
import { baseUrl, msgServer } from '../../services/index';
import {
  ADD_NEW_MESSAGE,
  GET_CORRESPONDANTSLIST,
  GET_OLD_MESSAGES,
  GET_UNSEEN_COUNTER,
} from '../constants';
import store from '../store';
import * as loadingAction from './loadingAction';

export const getCountUnseen = userId => {
  return dispatch => {
    axios
      .get(`${msgServer}countUnseen/${userId}`)
      .then(res => {
        dispatch({
          type: GET_UNSEEN_COUNTER,
          payload: res.data.count,
        });
      })
      .catch(err => {
        // console.log('error getCountUnseen action', err);
      });
  };
};

export const getMessages = socket => {
  return dispatch => {
    socket.on('chat message', msg => {
      dispatch({
        type: ADD_NEW_MESSAGE,
        payload: msg,
      });
    });
  };
};
export const getOldMessages = (type, correspondant) => {
  // console.log(
  //   'oldmessages',
  //   `${msgServer}oldmessages/${type}/${correspondant}`,
  // );
  return dispatch => {
    dispatch({ type: 'PROFILE_LOADING', value: true });
    axios
      .get(`${msgServer}oldmessages/${type}/${correspondant}`)
      .then(res => {
        dispatch({
          type: GET_OLD_MESSAGES,
          payload: res.data,
        });
        dispatch({ type: 'PROFILE_LOADING', value: false });
      })
      .catch(err => {
        // console.log('getOldMessages error', err);
        dispatch({ type: 'PROFILE_LOADING', value: false });
      });
  };
};
export const getCorrespondnatList = (user, accessToken) => {
  return dispatch => {
    dispatch(loadingAction.standadLoader(true));
    axios
      .get(`${msgServer}conversationHistory/${user}`)
      .then(res => {
        const List = [];
        res.data.forEach(element => {
          if (element.hasOwnProperty('id')) {
            List.push(element);
          }
        });
        const corresIds = List.map(item => item.id);
        // var corresIds = [];
        // res?.data.map(item => {
        //   if (item.hasOwnProperty('id')) {
        //     corresIds.push(item.id);
        //   }
        // });
        // var data = [];
        // res?.data.forEach(element => {
        //   if (element.hasOwnProperty('id')) {
        //     data.push(element);
        //   }
        // });
        let url =
          baseUrl +
          `/api/search_read?model=hr.employee&domain=[["id", "in",[${corresIds}]]]&fields=${'["complete_name","department_global_id","sector","department_id","image", "sector_id","job_id","work_email","mobile_phone","work_phone"]'}`;
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(res1 => {
            const coreespWithProfile = List.map(el => {
              let finalEl = Object.assign({}, el);
              res1.forEach(el1 => {
                if (el.id === el1.id) {
                  finalEl.complete_name = el1.complete_name;
                  finalEl.image = el1.image;
                  finalEl.sector_id = el1.sector_id;
                  finalEl.job_id = el1.job_id;
                  finalEl.work_email = el1.work_email;
                  finalEl.mobile_phone = el1.mobile_phone;
                  finalEl.work_phone = el1.work_phone;
                  finalEl.department_global_id = el1.department_global_id;
                  // finalEl.sector = el1.sector;
                  finalEl.seen = el.seen;
                  finalEl.department_id = el1.department_id;
                }
              });
              return finalEl;
            });
            dispatch(loadingAction.standadLoader(false));
            dispatch({
              type: GET_CORRESPONDANTSLIST,
              payload: coreespWithProfile,
            });
          });
      })
      .catch(err => {
        // console.log('getCorrespondnatList error', err);
      });
  };
};

export const deleteMsg = msg => {
  return dispatch => {
    const oldMessages = store.getState().messageReducer.messages;
    const updatedIndex = store
      .getState()
      .messageReducer.messages.findIndex(item => item._id === msg._id);
    let updatedMessaages = [...oldMessages];
    /// -1

    fetch(`${msgServer}delete/${msg._id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 500) {
          return console.log('internal server error');
        }
        if (updatedIndex === -1) {
          // console.log('deleteting -1 error');
        } else {
          updatedMessaages[updatedIndex].deleted = true;
          dispatch({
            type: GET_OLD_MESSAGES,
            payload: updatedMessaages,
          });
        }
      })

      .catch(e => {
        // console.log(e);
      });
  };
};
export const clearMsgs = () => {
  return dispatch => {
    dispatch({
      type: GET_OLD_MESSAGES,
      payload: [],
    });
    dispatch({
      type: GET_CORRESPONDANTSLIST,
      payload: [],
    });
  };
};
