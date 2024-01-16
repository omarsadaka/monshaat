import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { COMMON_LOADER } from '../reducer/loadingReducer';
import { TEAM_LIST } from '../reducer/technicalReducer';
import { TRAINING_TRAVEL_DAYS } from '../reducer/trainingReducer';
import * as homeMyRequestActions from './homeMyRequestAction';

export function getCountries(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=res.country&fields=["display_name"]',
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
        dispatch({ type: 'GET_COUNTRIES', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=res.country&fields=["display_name"]',
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getCities(accessToken, filterId) {
  let mUrl =
    baseUrl + '/api/search_read?model=res.city&fields=["name","country_id"]';
  if (filterId) {
    mUrl = mUrl + '&domain=[["country_id","=",' + filterId + ']]';
  }
  return async (dispatch) => {
    // let secretUrl = await EncryptUrl(mUrl);
    fetch(mUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: 'GET_CITIES', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=res.city&fields=["name"]&domain=[["country_id","=",' +
            filterId +
            ']]',
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
export function getCurrencyTypes(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=res.currency&fields=["name"]',
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
        // responseData.forEach(el => {
        //   if (el.name == "EUR") {
        //     el.name = "يورو";
        //   } else if (el.name == "GBP") {
        //     el.name = "جنيه استرليني";
        //   } else if (el.name == "SAR") {
        //     el.name = "ريال سعودي";
        //   } else if (el.name == "USD") {
        //     el.name = "دولار";
        //   }
        // });

        dispatch({ type: 'CURRENCY_TYPE', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl + '/api/search_read?model=res.currency&fields=["name"]',
          err,
        );
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
      //   (
      //     `["|","|",["parent_id", "=", ${mEmpID}],"&",["parent_id", "=", ${managerID}],["id","!=",${mEmpID}],["id", "=", ${managerID}]]`
      //   );
      let url =
        baseUrl +
        `/api/call/all.requests/get_substitute_employees?kwargs={"employee_id": ${mEmpID}, "parent_id": ${managerID}}`;
      let secretUrl = await EncryptUrl(url);

      // console.log('secretUrl omar', secretUrl);
      fetch(
        secretUrl,

        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
        .then((response) => response.json())
        .then((responseData) => {
          dispatch({ type: 'GET_ALTERNATE_EMPLOYEE', value: responseData });
        })
        .catch((err) => {
          remoteLog(
            baseUrl +
              '/api/search_read?model=hr.employee&fields=["id","name","family_name","complete_name"]&domain=' +
              '[["id","!=",' +
              mEmpID +
              ']]',
            err,
          );
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    });
  };
}
export function TrainingRequestSubmit(data) {
  let url = '';
  url = `${baseUrl}/api/create?model=hr.training.request&values=${encodeURIComponent(
    JSON.stringify(data.values),
  )}`;
  return async (dispatch) => {
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
            '/api/call/hr.training.request/action_draft?ids=' +
            responseData[0];
          let secretUrl = await EncryptUrl(url, true, 'training 2');
          fetch(url, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data.accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(async (resAction) => {
              AsyncStorage.getItem('empID').then(async (mEmpID) => {
                const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "hr.training.request","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب تدريب بنجاح " }`;
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
                    // dispatch({ type: 'COMMON_LOADER', value: false });
                  });
              });

              const urlEvent = `${baseUrl}/api/call/all.requests/set_deputation_allowance_value?kwargs={"training_id":${responseData[0]}}`;
              fetch(urlEvent, {
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
                  // console.log('set_deputation_allowance_value', responseData);
                })
                .catch((error) => {
                  // console.log('set_deputation_allowance_value error', error);
                });

              if (data.attachments?.length > 0) {
                const formBody = new FormData();
                await data.attachments.forEach(async (fileItem) => {
                  formBody.append('files', fileItem);
                });
                let url =
                  baseUrl +
                  '/api/attachments/upload?res_model=hr.training.request&res_id=' +
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
                    type: 'TRAINING_TYPE_POST',
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
                dispatch({
                  type: 'TRAINING_TYPE_POST',
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
              }
            })
            .catch((err) => {
              remoteLog(
                baseUrl +
                  '/api/call/hr.training.request/action_draft?ids=' +
                  responseData[0],
                err,
              );
            });
        } else {
          remoteLog(url, responseData);
          dispatch({
            type: 'TRAINING_TYPE_POST',
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
        }
      })
      .catch((err) => {
        remoteLog(url, err);
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
///
export function approve(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.training.request/${data.action}?ids=${encodeURIComponent(
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.training.request","res_id": ${data.id}}`;
        // console.log('FROMMOBILE---------->', fromMob);
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            // console.log(
            //   'RESPONSEDATA----TRAINING-----FROMMOBILE------->',
            //   responseData,
            // );
            AsyncStorage.getItem('empID').then(async (mEmpID) => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.training.request","employee_id":${mEmpID},"description":"لقد تم قبول تدريب من طرف ${responseData}" }`;
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
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
          });

        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'TRAINING_TYPE_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.training.request/${
              data.action
            }?ids=${encodeURIComponent(data.id)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.training.request/button_refuse?ids=${encodeURIComponent(
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
            `/api/write/hr.training.request?ids=${
              data.id
            }&values=${JSON.stringify(data.reason)}`,
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.training.request","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.training.request","employee_id":${mEmpID},"description":"تم رفض طلب تدريب بواسطة ${responseData}" }`;
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
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });

            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'TRAINING_TYPE_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/hr.training.request?ids=${encodeURIComponent(
                  data.id,
                )}&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.training.request/button_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
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
      .then((response) => response.json())

      .then((mDuration) => {
        dispatch({
          type: TRAINING_TRAVEL_DAYS,
          value: mDuration ? mDuration : 1,
        });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch((err) => {
        dispatch({ type: TRAINING_TRAVEL_DAYS, value: 1 });
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function emptyTrainingData() {
  return (dispatch) => {
    dispatch({ type: 'TRAINING_TYPE_POST', value: '' });
  };
}
export function getClassificationType(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=helpdesk.ticket.class&fields=["name", "id","type_ids"]',
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
        dispatch({ type: 'CLASSIFICATION_TYPES', value: responseData });
      })
      .catch((err) => {});
  };
}

export function getType(accessToken, filter_ids) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=helpdesk.ticket.type&fields=["name", "id","category_ids"]&domain=[["id", "in", [${filter_ids}]]]`,
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
        dispatch({ type: 'TECHNICAL_TYPES', value: responseData });
      })
      .catch((err) => {});
  };
}

export function getCategories(accessToken, filter_ids) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=helpdesk.ticket.category&fields=["name", "id"]&domain=[["id", "in", [${filter_ids}]]]`,
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
        dispatch({ type: 'CATEGORY_TYPES', value: responseData });
      })
      .catch((err) => {});
  };
}

export function getLocations(accessToken) {
  return async (dispatch) => {
    dispatch({ type: 'TECH_LOCATIONS', value: [] });
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=helpdesk.ticket.location&fields=["name", "id"]',
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
        dispatch({ type: 'TECH_LOCATIONS', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=helpdesk.ticket.location&fields=["name", "id"]',
          err,
        );
      });
  };
}

export function getTeams(accessToken) {
  return async (dispatch) => {
    dispatch({ type: TEAM_LIST, value: [] });
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/search_read?model=helpdesk.team&fields=["name", "id"]',
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
        dispatch({ type: TEAM_LIST, value: responseData });
      })
      .catch((err) => {
        // console.log(err);
      });
  };
}

export function emptyTechnicalData() {
  return (dispatch) => {
    dispatch({ type: 'TECHNICAL_POST', value: '' });
  };
}
