import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import * as homeMyRequestActions from './homeMyRequestAction';

export function approve(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/hr.authorization/action_hrm?ids=${encodeURIComponent(data.id)}`;
  return async dispatch => {
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'LEAVE_PERMISSION_POST', value: [100] });
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.authorization","res_id": ${data.id}}`;
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(responseData => {
            AsyncStorage.getItem('empID').then(async mEmpID => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.holidays","employee_id":${mEmpID},"description":"لقد تم قبول الاستئذان من طرف ${responseData}" }`;

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then(response => {
                  response.json();
                })
                .then(responseData => {
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject(data, accessToken) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/call/hr.authorization/button_refuse?ids=${encodeURIComponent(
        data.id,
      )}`;

    let secretUrl = await EncryptUrl(url, true);

    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        fetch(
          baseUrl +
            `/api/write/hr.authorization?ids=${data.id}&values=${JSON.stringify(
              data.reason,
            )}`,
          {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
          .then(res => res.json())
          .then(resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.authorization","res_id": ${data.id}}`;
            fetch(fromMob, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then(response => response.json())
              .then(responseData => {
                AsyncStorage.getItem('empID').then(async mEmpID => {
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.holidays","employee_id":${mEmpID},"description":"تم رفض طلب استئذان بواسطة ${responseData}" }`;

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then(response => {
                      response.json();
                    })
                    .then(responseData => {
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'LEAVE_PERMISSION_POST', value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/hr.authorization?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/hr.authorization/button_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getLeaves(accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=hr.authorization.type&fields=["name"]',
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'LEAVE_PERMISSION_TYPES', value: responseData });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=hr.authorization.type&fields=["name"]',
          err,
        );
      });
  };
}

export function postLeaves(data) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/create/hr.authorization?values=${encodeURIComponent(
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
          '/api/call/hr.authorization/action_dm?ids=' +
          responseData[0];
        let secretUrl = await EncryptUrl(url, true);
        fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + data.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(() => {
            AsyncStorage.getItem('empID').then(async mEmpID => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "hr.authorization","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب استئذان بنجاح " }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
            });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                '/api/call/hr.authorization/action_dm?ids=' +
                responseData[0],
              err,
            );
          });
        dispatch({ type: 'LEAVE_PERMISSION_POST', value: responseData });
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
            `/api/create/hr.authorization?values=${JSON.stringify(
              data.values,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyLeavePermissionData() {
  return dispatch => {
    dispatch({ type: 'LEAVE_PERMISSION_POST', value: '' });
  };
}
