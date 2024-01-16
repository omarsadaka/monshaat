import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

export function getAllInternalCourses(reqData) {
  let data = reqData.data;
  let mUrl =
    baseUrl +
    `/api/search_read?model=hr.training&fields=["name","number","date_from","date_to","training_center","type","programme_training","place","state","number_participant","number_place","number_of_days"]`;
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(mUrl);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({
          type: 'INTERNAL_COURSES',
          payload: responseData,
        });
      })
      .catch((err) => {
        remoteLog(url, err);
      });
  };
}

export function EditableorNot(data) {
  return (dispatch) => {
    dispatch({ type: 'COME_FROM', value: data });
  };
}

export function postInternalCourses(accessToken, trainingID) {
  return (dispatch) => {
    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      let url =
        baseUrl +
        `/api/call/all.requests/action_candidat_api?kwargs={"employee_id": ${mEmpID}, "training_id": ${trainingID}}`;

      let secretUrl = await EncryptUrl(url);
      fetch(secretUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatch({
            type: 'POST_INTERNAL_COURSES',
            value: responseData,
          });
          dispatch({ type: 'COMMON_LOADER', value: false });
        })
        .catch((err) => {
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    });
  };
}

export function emptyInternalData(data) {
  return (dispatch) => {
    dispatch({ type: 'INTERNAL_COU', value: data });
  };
}
