import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import * as homeMyRequestActions from './homeMyRequestAction';

export function getLeavesType(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=hr.holidays.status&fields=["name"]',
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
        dispatch({ type: 'LEAVE_TYPES', value: responseData });
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getLeavesCredit(accessToken, id) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read/hr.employee.holidays.stock?fields=["holidays_available_stock"]&domain=[["employee_id","=",${id}],["holiday_status_id.name","=","إجازة سنوية"]]`,
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
        console.log(
          'getLeavesCredit',
          responseData[0].holidays_available_stock
            .toString()
            .match(/^-?\d+(?:\.\d{0,1})?/)[0],
        );

        dispatch({
          type: 'LEAVE_CREDIT',
          value: responseData[0].holidays_available_stock
            .toString()
            .match(/^-?\d+(?:\.\d{0,1})?/)[0],
        });
        // dispatch({ type: "COMMON_LOADER", value: false });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
export function getLeavesCreditSick(accessToken, id) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read/hr.employee.holidays.stock?fields=["token_holidays_sum","holiday_status_id","holidays_available_stock"]&domain=[["employee_id","=",${id}],["holiday_status_id.name","=","إجازة مرضيّة"]]`,
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
        dispatch({
          type: 'LEAVE_CREDIT_SICK',
          value: responseData[0].holidays_available_stock
            .toString()
            .match(/^-?\d+(?:\.\d{0,1})?/)[0],
        });
        // dispatch({ type: "COMMON_LOADER", value: false });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getAlternateEmployee(accessToken, filterId, managerID) {
  return (dispatch) => {
    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      // let url =
      //   baseUrl +
      //   '/api/search_read?model=hr.employee&fields=["id","name","family_name","complete_name"]&domain=' +
      //   encodeURIComponent(
      //     `["|","|",["parent_id", "=", ${mEmpID}],"&",["parent_id", "=", ${managerID}],["id","!=",${mEmpID}],["id", "=", ${managerID}]]`
      //   );
      let url =
        baseUrl +
        `/api/call/all.requests/get_substitute_employees?kwargs={"employee_id": ${mEmpID}, "parent_id": ${managerID}}`;
      // +
      // '[["id","!=",' +
      // mEmpID +
      // '],["department_id","=",' +
      // filterId +
      // "]]";
      // console.log("alt emp", url);
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
            type: 'GET_ALTERNATE_EMPLOYEE_FOR_LEAVE',
            value: responseData,
          });
          // dispatch({type: 'COMMON_LOADER', value: false});
        })
        .catch((err) => {
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    });
  };
}

export function leaveRequest(data, accessToken,data2) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/create/hr.holidays?values=${encodeURIComponent(
        JSON.stringify(data),
      )}`;
    let secretUrl = await EncryptUrl(url, true);
    // console.log('secretUrl adada', secretUrl)
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {

        if (responseData[0]) {
          let url =
            baseUrl +
            '/api/call/hr.holidays/send_holiday_request?ids=' +
            responseData[0];
          let secretUrl = await EncryptUrl(url, true);

          fetch(secretUrl, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(async (resAction) => {
              AsyncStorage.getItem('empID').then(async (mEmpID) => {
                const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "hr.holidays","employee_id":${mEmpID},"description":" لقد تم إرسال طلب الإجازة " }`;

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
                    // dispatch({ type: COMMON_LOADER, value: false });
                  });
              });

              if (data2.attachments?.length > 0) {
                const formBody = new FormData();
                await data2.attachments.forEach((fileItem) => {
                  formBody.append('files', fileItem);
                });
                let url =
                  baseUrl +
                  '/api/attachments/upload?res_model=hr.holidays&res_id=' +
                  responseData[0];
                // let secretUrl = await EncryptUrl(url, true);
                await fetch(url, {
                  method: 'POST',
                  body: formBody,
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'multipart/form-data',
                  },
                }).then((res) => {
                  dispatch({
                    type: 'VACATION_RESPONSE',
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
                  remoteLog(
                    baseUrl +
                      '/api/attachments/upload?res_model=hr.holidays&res_id=' +
                      responseData[0],
                    res,
                  );
                }).catch((err)=>{
                  // console.log(err)
                })
              } else {
                dispatch({ type: 'VACATION_RESPONSE', value: responseData });
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
              remoteLog(
                baseUrl +
                  '/api/attachments/upload?res_model=hr.holidays&res_id=' +
                  responseData[0],
                err,
              );
              dispatch({ type: 'VACATION_RESPONSE', value: responseData });
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
          dispatch({ type: 'VACATION_RESPONSE', value: responseData });
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
        // console.log('err ssssd', err)
        remoteLog(
          baseUrl + `/api/create/hr.holidays?values=${JSON.stringify(data)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function leaveApprove(data, accessToken) {
  // /api/call/all.requests/add_actions_log?kwargs={"res_id": 5,"res_model": "hr.holidays","employee_id":297,"description":"تم قبول طلب إجازة بواسطة المدير المباشر" }
  return async (dispatch) => {
    let mEmpID = AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/call/hr.holidays/button_accept_dm?ids=${encodeURIComponent(
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.holidays","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.holidays","employee_id":${mEmpID},"description":" لقد تم قبول الإجازة من طرف ${responseData}" }`;

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
            // console.log('LOG APPROVE ERROR', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'VACATION_RESPONSE', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.holidays/button_accept_dm?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function leaveReject(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.holidays/button_delay_dm_draft?ids=${encodeURIComponent(
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
            `/api/write/hr.holidays?ids=${data.id}&values=${JSON.stringify(
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
          .then((res) => res.json())
          .then((resData) => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.holidays","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.holidays","employee_id":${mEmpID},"description":"تم رفض طلب إجازة بواسطة ${responseData}" }`;

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
            dispatch({ type: 'VACATION_RESPONSE', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/hr.holidays?ids=${data.id}&values=${JSON.stringify(
                  data.reason,
                )}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.holidays/button_delay_dm_draft?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyVacationData() {
  return (dispatch) => {
    dispatch({ type: 'VACATION_RESPONSE', value: '' });
  };
}
