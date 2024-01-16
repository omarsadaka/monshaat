import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { COMMON_LOADER } from '../reducer/loadingReducer';
import {
  DEPUTATION_LOCATION,
  DEPUTATION_TRAVEL_DURATION,
} from '../reducer/MandateTypeReducer';
import * as homeMyRequestActions from './homeMyRequestAction';

export function MandateRequestSubmit(data) {
  return async (dispatch) => {
    dispatch({ type: 'COMMON_LOADER', value: true });

    if (data.values.type === 'external') {
      let url =
        baseUrl +
        `/api/call/hr.deputation.allowance/get_travel_days_api?kwargs={"employee_id":"${data.values.employee_id}","country":"${data.values.location_ids[0][2].country_id}"}`;
      let secretUrl = await EncryptUrl(url, true);
      console.log('secretUrl omar ', secretUrl)
      await fetch(secretUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((mResDuration) => mResDuration.json())
        .then((mDuration) => {
          data.values.travel_days = mDuration ? mDuration : 0;
        })
        .catch((err) => {
          // console.log(err);
        });
    }
    let url = '';
    url = `${baseUrl}/api/create/hr.deputation?values=${encodeURIComponent(
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
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData[0]) {
          let url =
            baseUrl +
            '/api/call/hr.deputation/action_draft?ids=' +
            responseData[0];
          let secretUrl = await EncryptUrl(url, true);

          fetch(secretUrl, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data.accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(async (resAction) => {
              AsyncStorage.getItem('empID').then(async (mEmpID) => {
                const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "hr.deputation","employee_id":${mEmpID},"description":" تم إرسال طلب إنتداب بنجاح" }`;

                fetch(logEvent, {
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer ' + data.accessToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                  .then((response) => {
                    response.json();
                  })
                  .then((responseData) => {
                    // dispatch({ type: COMMON_LOADER, value: false });
                  });
              });
              if (data.attachments?.length > 0) {
                const formBody = new FormData();
                await data.attachments.forEach(async (fileItem) => {
                  formBody.append('files', fileItem);
                });
                let url =
                  baseUrl +
                  '/api/attachments/upload?res_model=hr.deputation&res_id=' +
                  responseData[0];
                // let secretUrl = await EncryptUrl(url, true);

                await fetch(url, {
                  method: 'POST',
                  body: formBody,
                  headers: {
                    Authorization: 'Bearer ' + data.accessToken,
                    'Content-Type': 'multipart/form-data',
                  },
                }).then((uploadRes) => {
                  dispatch({
                    type: 'MANDATE_REQUEST_POST',
                    value: responseData,
                  });

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
                });
              } else {
                dispatch({ type: 'MANDATE_REQUEST_POST', value: responseData });

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
              }
            })
            .catch((err) => {
              dispatch({ type: 'MANDATE_REQUEST_POST', value: responseData });

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
            });
          /*}).catch(err => {
                        dispatch({type: "MANDATE_REQUEST_POST", value: responseData});
                        dispatch({type: 'COMMON_LOADER', value: false});
                    })*/
        } else {
          dispatch({ type: 'MANDATE_REQUEST_POST', value: responseData });

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
        }
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getMandateType(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=hr.deputation.type&fields=["name"]',
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: 'DEPUTATION_TYPES', value: responseData });
      })
      .catch((err) => {});
  };
}

export function getLocation(accessToken, filterId) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read/hr.deputation.location?domain=[["deputation_id","=",${filterId}]]&fields=["country_id", "city_name"]`,
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: DEPUTATION_LOCATION, value: responseData });
      })
      .catch((err) => {});
  };
}

export function emptyMandateRequest() {
  return (dispatch) => {
    dispatch({ type: 'MANDATE_REQUEST_POST', value: '' });
  };
}

export function getTravelDays(data) {
  return async (dispatch) => {
    dispatch({ type: COMMON_LOADER, value: true });
    let url =
      baseUrl +
      `/api/call/hr.deputation.allowance/get_travel_days_api?kwargs={"employee_id":"${data.employee_id}","country":"${data.country_id}"}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((mResDuration) => mResDuration.json())
      .then((mDuration) => {
        dispatch({
          type: DEPUTATION_TRAVEL_DURATION,
          value: mDuration ? mDuration : '1',
        });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch((err) => {
        dispatch({ type: DEPUTATION_TRAVEL_DURATION, value: 1 });
        dispatch({ type: COMMON_LOADER, value: false });
        // console.log(err);
      });
  };
}

export function approve(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.deputation/${data.action}?ids=${encodeURIComponent(
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
      .then((response) => response.json())
      .then((responseData) => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.deputation","res_id": ${data.id}}`;
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            AsyncStorage.getItem('empID').then(async (mEmpID) => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.deputation","employee_id":${mEmpID},"description":"لقد تم قبول الإنتداب من طرف ${responseData}" }`;
              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then((response) => {
                  response.json();
                })
                .then((responseData) => {
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch((err) => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'MANDATE_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.deputation/button_refuse?ids=${encodeURIComponent(
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
      .then((response) => response.json())
      .then((responseData) => {
        fetch(
          baseUrl +
            `/api/write/hr.deputation?ids=${encodeURIComponent(
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
          .then((res) => res.json())
          .then((resData) => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.deputation","res_id": ${data.id}}`;
            fetch(fromMob, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then((response) => response.json())
              .then((responseData) => {
                AsyncStorage.getItem('empID').then(async (mEmpID) => {
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.deputation","employee_id":${mEmpID},"description":"تم رفض طلب إنتداب بواسطة ${responseData}" }`;

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      response.json();
                    })
                    .then((responseData) => {
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'MANDATE_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/hr.deputation?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: responseData });
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.deputation/button_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
