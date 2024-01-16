import { baseUrl } from '../../services';

export function getNotificationDisplayName(data) {
  return dispatch => {
    fetch(
      baseUrl +
        `/api/search_read?model=base.notification&domain=[["id", "=",${data}]]`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'GET_NOTIFICATIONDISPLAYNAME', value: responseData });
      })
      .catch(err => {});
  };
}
