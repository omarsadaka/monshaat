import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { COMMON_LOADER } from '../reducer/loadingReducer';
import * as homeMyRequestActions from './homeMyRequestAction';

///
export function approve(data, accessToken) {
  return async dispatch => {
    dispatch({ type: 'COMMON_LOADER', value: true });

    let url =
      baseUrl +
      `/api/call/manage.financial.custody/${
        data.action
      }?ids=${encodeURIComponent(data.id)}`;
    let secretUrl = await EncryptUrl(url, true);

    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "manage.financial.custody","res_id": ${data.id}}`;
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(_responseData => {
            AsyncStorage.getItem('empID').then(async mEmpID => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "manage.financial.custody","employee_id":${mEmpID},"description":"لقد تم قبول طلب العهدة" }`;
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
                .then(_responseData => {
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'CUSTODY_RESPONSE', value: [100] });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/manage.financial.custody/action_dm?ids=${encodeURIComponent(
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
    // reject request
    let url =
      baseUrl +
      `/api/call/manage.financial.custody/action_refuse?ids=${encodeURIComponent(
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
      .then(_responseData => {
        // put the rejection reason
        fetch(
          baseUrl +
            `/api/write/manage.financial.custody?ids=${encodeURIComponent(
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
          .then(_resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "manage.financial.custody","res_id": ${data.id}}`;
            fetch(fromMob, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then(response => response.json())
              .then(_responseData => {
                AsyncStorage.getItem('empID').then(async mEmpID => {
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "manage.financial.custody","employee_id":${mEmpID},"description":"تم رفض طلب العهدة بواسطة ${_responseData}" }`;
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
                    .then(_responseData => {
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    });
                });
              })
              .catch(_err => {});

            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'CUSTODY_RESPONSE', value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/manage.financial.custody?ids=${encodeURIComponent(
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
            `/api/call/manage.financial.custody/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function postCustodyRequest(data) {
  return async dispatch => {
    //created as a draft
    let url =
      baseUrl +
      `/api/create/manage.financial.custody?values=${encodeURIComponent(
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
        // send to direct manager
        let url = `${baseUrl}/api/call/manage.financial.custody/action_send?ids=${responseData[0]}`;
        let secretUrl = await EncryptUrl(url, true);
        fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + data.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(_res => {
            dispatch({ type: COMMON_LOADER, value: false });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                '/api/call/manage.financial.custody/action_draft?ids=' +
                responseData[0],
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
        dispatch({ type: 'CUSTODY_RESPONSE', value: responseData });

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
      .catch(() => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyCustodyData() {
  return dispatch => {
    dispatch({ type: 'CUSTODY_RESPONSE', value: '' });
  };
}

export function emptyCustodyCloseData() {
  return dispatch => {
    dispatch({ type: 'CUSTODY_CLOSE_RESPONSE', value: '' });
  };
}

export function approveCustodyClose(data, accessToken) {
  return async dispatch => {
    dispatch({ type: 'COMMON_LOADER', value: true });

    let url =
      baseUrl +
      `/api/call/manage.financial.custody.close/${
        data.action
      }?ids=${encodeURIComponent(data.id)}`;
    let secretUrl = await EncryptUrl(url, true);

    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "manage.financial.custody.close","res_id": ${data.id}}`;
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(_responseData => {
            AsyncStorage.getItem('empID').then(async mEmpID => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "manage.financial.custody.close","employee_id":${mEmpID},"description":"لقد تم قبول طلب إستعاضة/إغلاق العهدة" }`;
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
                .then(_responseData => {
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'CUSTODY_CLOSE_RESPONSE', value: [100] });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/manage.financial.custody.close/action_dm?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function rejectCustodyClose(data, accessToken) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/call/manage.financial.custody.close/action_refuse?ids=${encodeURIComponent(
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
      .then(_responseData => {
        fetch(
          baseUrl +
            `/api/write/manage.financial.custody.close?ids=${encodeURIComponent(
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
          .then(_resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "manage.financial.custody.close","res_id": ${data.id}}`;
            fetch(fromMob, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then(response => response.json())
              .then(_responseData => {
                AsyncStorage.getItem('empID').then(async mEmpID => {
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "manage.financial.custody.close","employee_id":${mEmpID},"description":"تم رفض طلب إستعاضة/إغلاق العهدة بواسطة ${_responseData}" }`;
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
                    .then(_responseData => {
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    });
                });
              })
              .catch(() => {});

            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'CUSTODY_CLOSE_RESPONSE', value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/manage.financial.custody.close?ids=${encodeURIComponent(
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
            `/api/call/manage.financial.custody.close/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
