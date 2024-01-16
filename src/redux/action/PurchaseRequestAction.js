import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import {
  PURCHASE_ATTACHMENT_TYPE,
  PURCHASE_APPROVED_ORDERS,
} from '../reducer/PurchaserequestReducer';
import * as homeMyRequestActions from './homeMyRequestAction';
import { COMMON_LOADER } from '../reducer/loadingReducer';
import { showMessage } from 'react-native-flash-message';

export function PurchaseRequestSubmit(data) {
  // console.log('Data', data);

  let url = '';
  url =
    baseUrl +
    `/api/create/purchase.request?values=${encodeURIComponent(
      JSON.stringify(data.values),
    )}`;
  // console.log('purchase', url);

  return async (dispatch) => {
    let secretUrl = await EncryptUrl(url, true);
    // console.log('purchase request', url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData[0]) {
          let url =
            baseUrl +
            '/api/call/purchase.request/action_dm?ids=' +
            responseData[0];
          // console.log('purchase request2', responseData);

          fetch(url, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data.accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(async (resAction) => {
              // console.log('purchase 2', responseData);
              AsyncStorage.getItem('empID').then(async (mEmpID) => {
                // console.log('RESPONSEDATA LEAVE ------>', responseData[0]);
                // console.log('EMPLOYEE ID ------>', mEmpID);

                const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "purchase.request","employee_id":${mEmpID},"description":" تم إرسال طلب إنتداب بنجاح" }`;
                // console.log('log send request', logEvent);

                fetch(logEvent, {
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer ' + data.accessToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                  .then((response) => {
                    // console.log('RESPONSE send aothorization ---->', response);

                    response.json();
                  })
                  .then((responseData) => {
                    // dispatch({ type: COMMON_LOADER, value: false });
                  });
              });
              if (data.attachments?.length > 0) {
                const formBody = new FormData();
                await data.attachments.forEach(async (fileItem) => {
                  if (fileItem) {
                    formBody.append('files', fileItem);
                  }
                });
                let url =
                  baseUrl +
                  '/api/attachments/upload?res_model=purchase.request&res_id=' +
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
                    type: 'PURCHASE_REQUEST_POST',
                    value: responseData,
                  });

                  dispatch({ type: 'COMMON_LOADER', value: false });
                  let data1 = {
                    token: data.accessToken,
                    id: data.values.employee_id,
                    limit: 5,
                    page: 1,
                  };
                  // console.log('Data111', data1);
                  dispatch(
                    homeMyRequestActions.getAllMyReuqestList({
                      value: data1,
                    }),
                  );
                });
              } else {
                dispatch({
                  type: 'PURCHASE_REQUEST_POST',
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
                  '/api/call/purchase.request/action_sm?ids=' +
                  responseData[0],
                err,
              );
              dispatch({ type: 'COMMON_LOADER', value: false });
            });
        } else {
          dispatch({ type: 'PURCHASE_REQUEST_POST', value: responseData });

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

export function getPurchaseType(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=res.currency&fields=["display_name","id"]',
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
        dispatch({ type: 'PURCHASE_TYPES', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=res.currency&fields=["display_name","id"]',
          err,
        );
      });
  };
}

export function getStrategicPlanTypes(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=purchase.strategic.plan.type&fields=["display_name","id","name","initiative_ids"]',
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
        dispatch({ type: 'PLAN_TYPES', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=purchase.strategic.plan.type&fields=["display_name","id"]',
          err,
        );
      });
  };
}

export function getPurchaseInitiativeTypes(accessToken, filter_ids) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=purchase.initiative&fields=["display_name","id","program_ids"]&domain=[["id", "in", [${filter_ids}]]]`,
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
        dispatch({ type: 'INITIATIVE_TYPES', value: responseData });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=purchase.initiative&fields=["display_name","id"]',
          err,
        );
      });
  };
}

export function getPurchaseProgramTypes(accessToken, filter_ids) {
  return async (dispatch) => {
    if (filter_ids) {
      let secretUrl = await EncryptUrl(
        baseUrl +
          `/api/search_read?model=purchase.program&fields=["display_name","id"]&domain=[["id", "in", [${filter_ids}]]]`,
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
          dispatch({ type: 'PROGRAM_TYPES', value: responseData });
        })
        .catch((err) => {
          remoteLog(
            baseUrl +
              '/api/search_read?model=purchase.program&fields=["display_name","id"]',
            err,
          );
        });
    }
  };
}

export function getPurchaseAttachmentTypes(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=purchase.attachment.type&fields=["name","id"]',
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
        dispatch({ type: PURCHASE_ATTACHMENT_TYPE, value: responseData });
      })
      .catch((err) => {});
  };
}

export function emptyPurchaseRequest() {
  return (dispatch) => {
    dispatch({ type: 'PURCHASE_REQUEST_POST', value: [] });
  };
}
export function emptyRequisitionRequest() {
  return (dispatch) => {
    dispatch({ type: 'REQUISITION_REQUEST_POST', value: [] });
  };
}
export function emptyContractRequest() {
  return (dispatch) => {
    dispatch({ type: 'CONTRACT_REQUEST_POST', value: [] });
  };
}

export function emptyWorkOrderRequest() {
  return (dispatch) => {
    dispatch({ type: 'WORKORDER_REQUEST_POST', value: [] });
  };
}

export function emptyHrPaysRunRequest() {
  return (dispatch) => {
    dispatch({ type: 'HRPAYSRUN_REQUEST_POST', value: [] });
  };
}

export function emptyHrPaysRequest() {
  return (dispatch) => {
    dispatch({ type: 'HRPAYS_REQUEST_POST', value: [] });
  };
}

///
export function approve(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.request/${encodeURIComponent(
        data.action,
      )}?ids=${encodeURIComponent(data.id)}`;
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.request","res_id": ${data.id}}`;
        // console.log('from Mobile request', fromMob);
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
              // console.log('EMPLOYEE ID ------>', mEmpID);
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.request","employee_id":${mEmpID},"description":"لقد تم قبول شراء من طرف ${responseData}" }`;
              // console.log('log APPROVE request', logEvent);

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then((response) => {
                  // console.log('RESPONSE APPROVE autho ---->', response);
                  response.json();
                })
                .then((responseData) => {
                  // console.log('APPROVE autho ---->', responseData);
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch((err) => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'PURCHASE_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.request/${encodeURIComponent(
              data.action,
            )}?ids=${encodeURIComponent(data.id)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approveـpurchaseRequisition(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.requisition/${encodeURIComponent(
        data.action,
      )}?ids=${encodeURIComponent(data.id)}`;
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.requisition","res_id": ${data.id}}`;
        // console.log('from Mobile request', fromMob);
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
              // console.log('EMPLOYEE ID ------>', mEmpID);
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.requisition","employee_id":${mEmpID},"description":"لقد تم قبول اتفاقية شراء من طرف ${responseData}" }`;
              // console.log('log APPROVE request', logEvent);

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then((response) => {
                  // console.log('RESPONSE APPROVE autho ---->', response);
                  response.json();
                })
                .then((responseData) => {
                  // console.log('APPROVE autho ---->', responseData);
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch((err) => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'REQUISITION_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.requisition/${encodeURIComponent(
              data.action,
            )}?ids=${encodeURIComponent(data.id)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approveـpurchaseContract(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.contract/${encodeURIComponent(
        data.action,
      )}?ids=${encodeURIComponent(data.id)}`;
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.contract","res_id": ${data.id}}`;
        // console.log('from Mobile request', fromMob);
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
              // console.log('EMPLOYEE ID ------>', mEmpID);
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.contract","employee_id":${mEmpID},"description":"لقد تم قبول طلب التعاقد من طرف ${responseData}" }`;
              // console.log('log APPROVE request', logEvent);

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then((response) => {
                  // console.log('RESPONSE APPROVE autho ---->', response);
                  response.json();
                })
                .then((responseData) => {
                  // console.log('APPROVE autho ---->', responseData);
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch((err) => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'CONTRACT_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.contract/${encodeURIComponent(
              data.action,
            )}?ids=${encodeURIComponent(data.id)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approveـworkOrder(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.order/${encodeURIComponent(
        data.action,
      )}?ids=${encodeURIComponent(data.id)}`;
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
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.order","res_id": ${data.id}}`;
        // console.log('from Mobile request', fromMob);
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
              // console.log('EMPLOYEE ID ------>', mEmpID);
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.order","employee_id":${mEmpID},"description":"لقد تم قبول طلب امر العمل من طرف ${responseData}" }`;
              // console.log('log APPROVE request', logEvent);

              fetch(logEvent, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .then((response) => {
                  // console.log('RESPONSE APPROVE autho ---->', response);
                  response.json();
                })
                .then((responseData) => {
                  // console.log('APPROVE autho ---->', responseData);
                  dispatch({ type: COMMON_LOADER, value: false });
                });

              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch((err) => {
            // console.log('from mob err', err);
          });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'WORKORDER_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.order/${encodeURIComponent(
              data.action,
            )}?ids=${encodeURIComponent(data.id)}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approve_hr_payslip(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.payslip/${data.action}?ids=${encodeURIComponent(data.id)}`;
    let secretUrl = await EncryptUrl(url, true);
    console.log('secretUrl payslip', secretUrl);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.payslip","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.payslip","employee_id":${mEmpID},"description":"لقد تم قبول تدريب من طرف ${responseData}" }`;
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
        dispatch({ type: 'HRPAYS_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.payslip/${data.action}?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approve_hr_payslip_run(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.payslip.run/${data.action}?ids=${encodeURIComponent(
        data.id,
      )}`;
    let secretUrl = await EncryptUrl(url, true);
    console.log('secretUrl payslip_run', secretUrl);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('responseData lip_run 1', responseData);
        if (responseData.message) {
          dispatch({ type: 'COMMON_LOADER', value: false });
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: responseData.message,
          });
          return;
        }
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.payslip.run","res_id": ${data.id}}`;
        fetch(fromMob, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            // console.log('responseData lip_run 2', responseData);
            AsyncStorage.getItem('empID').then(async (mEmpID) => {
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.payslip.run","employee_id":${mEmpID},"description":"لقد تم قبول تدريب من طرف ${responseData}" }`;
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
                  // console.log('responseData lip_run 3', responseData);
                  dispatch({ type: 'COMMON_LOADER', value: false });
                });
            });
          });

        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({ type: 'HRPAYSRUN_REQUEST_POST', value: [100] });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/hr.payslip.run/${data.action}?ids=${encodeURIComponent(
              data.id,
            )}`,
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
      `/api/call/purchase.request/action_refuse?ids=${encodeURIComponent(
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
            `/api/write/purchase.request?ids=${data.id}&values=${JSON.stringify(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.request","res_id": ${data.id}}`;
            // console.log('from Mobile request', fromMob);
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
                  // console.log('EMPLOYEE ID ------>', mEmpID);
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.request","employee_id":${mEmpID},"description":"تم رفض طلب شراء بواسطة ${responseData}" }`;
                  // console.log('log reject request', logEvent);

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      // console.log('RESPONSE REJECT autho ---->', response);
                      response.json();
                    })
                    .then((responseData) => {
                      // console.log('Reject autho ---->', responseData);
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'PURCHASE_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.request?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.request/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_purchaseRequisition(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.requisition/action_refuse?ids=${encodeURIComponent(
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
            `/api/write/purchase.requisition?ids=${
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.requisition","res_id": ${data.id}}`;
            // console.log('from Mobile request', fromMob);
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
                  // console.log('EMPLOYEE ID ------>', mEmpID);
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.requisition","employee_id":${mEmpID},"description":"تم رفض طلب إتفاقية الشراء بواسطة ${responseData}" }`;
                  // console.log('log reject request', logEvent);

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      // console.log('RESPONSE REJECT autho ---->', response);
                      response.json();
                    })
                    .then((responseData) => {
                      // console.log('Reject autho ---->', responseData);
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'REQUISITION_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.requisition?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.requisition/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_purchaseCotract(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.contract/action_refuse?ids=${encodeURIComponent(
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
            `/api/write/purchase.contract?ids=${
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.contract","res_id": ${data.id}}`;
            // console.log('from Mobile request', fromMob);
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
                  // console.log('EMPLOYEE ID ------>', mEmpID);
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.contract","employee_id":${mEmpID},"description":"تم رفض طلب التعاقد بواسطة ${responseData}" }`;
                  // console.log('log reject request', logEvent);

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      // console.log('RESPONSE REJECT autho ---->', response);
                      response.json();
                    })
                    .then((responseData) => {
                      // console.log('Reject autho ---->', responseData);
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'CONTRACT_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.contract?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.contract/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_workOrder(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.order/action_refuse?ids=${encodeURIComponent(
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
            `/api/write/purchase.order?ids=${data.id}&values=${JSON.stringify(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.order","res_id": ${data.id}}`;
            // console.log('from Mobile request', fromMob);
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
                  // console.log('EMPLOYEE ID ------>', mEmpID);
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.order","employee_id":${mEmpID},"description":"تم رفض طلب امر العمل بواسطة ${responseData}" }`;
                  // console.log('log reject request', logEvent);

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      // console.log('RESPONSE REJECT autho ---->', response);
                      response.json();
                    })
                    .then((responseData) => {
                      // console.log('Reject autho ---->', responseData);
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'WORKORDER_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.order?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.order/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_workOrder2(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/purchase.order/action_requisition_refuse?ids=${encodeURIComponent(
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
            `/api/write/purchase.order?ids=${data.id}&values=${JSON.stringify(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.order","res_id": ${data.id}}`;
            // console.log('from Mobile request', fromMob);
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
                  // console.log('EMPLOYEE ID ------>', mEmpID);
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.order","employee_id":${mEmpID},"description":"تم رفض طلب امر العمل بواسطة ${responseData}" }`;
                  // console.log('log reject request', logEvent);

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then((response) => {
                      // console.log('RESPONSE REJECT autho ---->', response);
                      response.json();
                    })
                    .then((responseData) => {
                      // console.log('Reject autho ---->', responseData);
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch((err) => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'WORKORDER_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.order?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.order/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_hr_payslip(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.payslip/button_cancel?ids=${encodeURIComponent(data.id)}`;
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
            `/api/write/hr.payslip?ids=${data.id}&values=${JSON.stringify(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.payslip","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.payslip","employee_id":${mEmpID},"description":"تم رفض طلب تدريب بواسطة ${responseData}" }`;
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
            dispatch({ type: 'HRPAYS_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/hr.payslip?ids=${encodeURIComponent(
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
            `/api/call/hr.payslip/button_cancel?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function reject_hr_payslip_run(data, accessToken) {
  return async (dispatch) => {
    let url =
      baseUrl +
      `/api/call/hr.payslip.run/button_cancel?ids=${encodeURIComponent(
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
            `/api/write/hr.payslip.run?ids=${data.id}&values=${JSON.stringify(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.payslip.run","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.payslip.run","employee_id":${mEmpID},"description":"تم رفض طلب تدريب بواسطة ${responseData}" }`;
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
            dispatch({ type: 'HRPAYSRUN_REQUEST_POST', value: [100] });
          })
          .catch((err) => {
            remoteLog(
              baseUrl +
                `/api/write/hr.payslip.run?ids=${encodeURIComponent(
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
            `/api/call/hr.payslip.run/button_cancel?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getApprovedPurchaseOrders(accessToken) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl + '/api/call/all.requests/get_purchases_order_requisition_list',
    );

    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('getApprovedPurchaseOrders', responseData);
        dispatch({ type: PURCHASE_APPROVED_ORDERS, value: responseData });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch((err) => {
        // console.log('getApprovedPurchaseOrders error', err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}
