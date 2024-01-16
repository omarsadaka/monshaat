import { SetActivityData, SetFamilyData, SetNewsData } from '../constants';

export const setFamilyData = data => {
  return dispatch => {
    dispatch({
      type: SetFamilyData,
      payload: data,
    });
  };
};

export const setNewsData = data => {
  return dispatch => {
    dispatch({
      type: SetNewsData,
      payload: data,
    });
  };
};

export const setActivityData = data => {
  return dispatch => {
    dispatch({
      type: SetActivityData,
      payload: data,
    });
  };
};
