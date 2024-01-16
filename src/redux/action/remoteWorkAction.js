import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import * as homeMyRequestActions from './homeMyRequestAction';

export function approve(data, accessToken) {
  return async dispatch => {
    dispatch({ type: 'COMMON_LOADER', value: true });

    let url =
      baseUrl +
      `/api/call/hr.distance.work/action_dm?ids=${encodeURIComponent(data.id)}`;
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.distance.work","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.distance.work","employee_id":${mEmpID},"description":"لقد تم قبول عمل عن بعد من طرف ${responseData}" }`;
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
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'REMOTE_WORK', value: [100] });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/hr.distance.work/action_dm?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject(data, accessToken) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/call/hr.distance.work/action_refuse?ids=${encodeURIComponent(
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
            `/api/write/hr.distance.work?ids=${encodeURIComponent(
              data.id,
            )}&values=${JSON.stringify(data.reason)}`,
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.distance.work","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.distance.work","employee_id":${mEmpID},"description":"تم رفض طلب عمل عن بعد بواسطة ${responseData}" }`;
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
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    });
                });
              })
              .catch(err => {
                console.log('from mob err', err);
              });

            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'REMOTE_WORK', value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/hr.distance.work?ids=${encodeURIComponent(
                  data.id,
                )}&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/hr.distance.work/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function postRemotWorkData(data) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/create/hr.distance.work?values=${encodeURIComponent(
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
          '/api/call/hr.distance.work/action_draft?ids=' +
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "hr.distance.work","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب عمل عن بعد بنجاح " }`;

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
                '/api/call/hr.distance.work/action_draft?ids=' +
                responseData[0],
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
        dispatch({ type: 'REMOTE_WORK', value: responseData });

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
            `/api/create/hr.distance.work?values=${JSON.stringify(
              data.values,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getRemoteWorkHistory(data) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.distance.work&domain=[["employee_id", "=", ${
          data.empID
        }]]&order=${'create_date desc'}`,
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
        dispatch({ type: 'REMOTE_WORK_HISTORY', value: responseData });
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/create/hr.distance.work?values=${JSON.stringify(data)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyRemoteWorkData() {
  return dispatch => {
    dispatch({ type: 'REMOTE_WORK', value: '' });
  };
}
