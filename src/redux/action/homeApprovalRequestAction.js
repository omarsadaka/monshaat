import { baseUrl } from '../../services';

export function getApprovalRequestList(data) {
  let url = '';
  if (data.kwargs && data.domain) {
    url =
      baseUrl +
      `/api/call/res.users/get_transactions?kwargs=${JSON.stringify(
        data.kwargs,
      )}` +
      '&domain=' +
      JSON.stringify(data.domain);
  } else if (data.params) {
    url = baseUrl + `/api/search_read?${data.params}`;
  } else {
    url = baseUrl + `/api/search_read?model=${data.key}`;
  }

  return dispatch => {
    fetch(url, {
      method: data.kwargs ? 'POST' : 'GET',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'HOME_APPROVAL_REQUEST', value: responseData });
        // dispatch({type: 'COMMON_LOADER', value: false});
      })
      .catch(_err => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function EditableorNot(data) {
  return dispatch => {
    dispatch({ type: 'COME_FROM', value: data });
  };
}
