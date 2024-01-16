import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import * as homeMyRequestActions from './homeMyRequestAction';
export function postHrRequest(data) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/create/salary.identification.request?values=${encodeURIComponent(
        JSON.stringify(data.values),
      )}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(async responseData => {
        let url =
          baseUrl +
          '/api/call/salary.identification.request/action_hrm?ids=' +
          responseData[0];
        let secretUrl = await EncryptUrl(url, true);

        fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + data.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(async responseData2 => {
            AsyncStorage.getItem('empID').then(async mEmpID => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "salary.identification.request","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب خطاب الموارد البشرية بنجاح " }`;

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + data.accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then(response => {
                  response.json();
                })
                .then(responseData => {
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
            dispatch({ type: 'HR_REQUEST_POST', value: responseData });

            dispatch({ type: 'COMMON_LOADER', value: false });

            let data1 = {
              token: data.accessToken,
              id: data.values.employee_id,
              limit: 5,
              page: 1,
            };
            dispatch(
              homeMyRequestActions.getAllMyReuqestList({
                value: data1,
              }),
            );
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                '/api/call/salary.identification.request/action_hrm?ids=' +
                responseData[0],
              err,
            );
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/create/salary.identification.request?values=${JSON.stringify(
              data.values,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyHrData() {
  return dispatch => {
    dispatch({ type: 'HR_REQUEST_POST', value: '' });
  };
}
