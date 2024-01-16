import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { GET_NOTIFICATIONS } from '../constants';

export function getNotifications(userId, accessToken) {
  return async (dispatch) => {
    dispatch({ type: 'NOTIFICATIONS_LOADER', payload: true });
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/fetch/notifications?limit=100&page=1&user_id=' + userId,
    );
    console.log('secretUrl', secretUrl);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log('getNotifications', responseData);
        dispatch({ type: GET_NOTIFICATIONS, payload: responseData });
        dispatch({ type: 'NOTIFICATIONS_LOADER', payload: false });
      })
      .catch((_err) => {
        dispatch({ type: 'NOTIFICATIONS_LOADER', payload: false });
      });
  };
}

export function setNotificationViewd(notificationId, accessToken) {
  let url =
    baseUrl +
    `/api/write/base.notification?ids=${notificationId}&values={"is_opened":1}`;
  return async (_dispatch) => {
    // let secretUrl = await EncryptUrl(url, true);
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('setNotificationViewd', responseData);
      })
      .catch((_err) => {
        //console.log("err", err);
      });
  };
}

// {{baseUrl}}/api/search_read/hr.holidays?order=date_from desc&domain=[["id","=",your request id]]

export function navigationWithNotification(accessToken, res_model, requestId) {
  const url =
    baseUrl +
    `/api/search_read/${res_model} ?domain=[["id","=", ${requestId} ]]`;
  return async (dispatch) => {
    // dispatch({ type: GET_NOTIFICATIONS, payload: [] });
    dispatch({ type: 'COMMON_LOADER', payload: true });

    let secretUrl = await EncryptUrl(url);

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        // dispatch({ type: GET_ONE_NOTIFICATION, payload: responseData });
        // console.log("GET_ONE_NOTIFICATION ", responseData);

        dispatch({ type: 'COMMON_LOADER', payload: false });
        return responseData;
      })
      .catch((_err) => {
        dispatch({ type: 'COMMON_LOADER', payload: false });
      });
  };
}
