import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

export function getNotification(id, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl + ` /api/fetch/notifications?user_id=${id}`,
    );

    fetch(
      secretUrl,

      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        dispatch({
          type: 'GET_NOTIFICATION',
          value: responseData,
        });
      })
      .catch(err => {});
  };
}

export function getDetailNotification(data) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=${data.model}&domain=[["id","=", ${data.domain}]]`,
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'OPEN_NOTIFICATION', value: responseData });
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch(err => {});
  };
}

export function emptyDetailData() {
  return dispatch => {
    dispatch({ type: 'OPEN_NOTIFICATION', value: '' });
  };
}
