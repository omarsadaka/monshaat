import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import {
  CERT_ACHIEVEMENT_RESPONSE,
  INTERNAL_COURSES_RESPONSE,
  PAYMENT_ORDER_RESPONSE,
  PURCHASE_ADD_BUDGET_RESPONSE,
  PURCHASE_ORDER_RESPONSE,
  RESIGNATION_RESPONSE,
} from '../reducer/ApprovalReducer';
import { COMMON_LOADER } from '../reducer/loadingReducer';

export function approvePaymentOrder(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/payment.order/${data.action}?ids=${encodeURIComponent(data.id)}`;
  return async dispatch => {
    let secretUrl = await EncryptUrl(url, true, 'payment order');
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "payment.order","res_id": ${data.id}}`;

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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "payment.order","employee_id":${mEmpID},"description":"تم قبول طلب أمر صرف بواسطة ${_responseData}" }`;
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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: PAYMENT_ORDER_RESPONSE, value: [100] });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectPaymentOrder(data, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl + `/api/call/payment.order/action_refuse?ids=${data.id}`,
      true,
    );

    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(async _responseData => {
        fetch(
          baseUrl +
            `/api/write/payment.order?ids=${data.id}&values=${JSON.stringify(
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
          .then(_resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "payment.order","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "payment.order","employee_id":${mEmpID},"description":"تم رفض طلب أمر صرف بواسطة ${_responseData}" }`;
                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then(response => {
                      // console.log(
                      //   'RESPONSE send aothorization ---->',
                      //   response,
                      // );

                      response.json();
                    })
                    .then(_responseData => {
                      dispatch({ type: COMMON_LOADER, value: false });
                    });
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
            dispatch({ type: COMMON_LOADER, value: false });
            dispatch({ type: PAYMENT_ORDER_RESPONSE, value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/payment.order?ids=${encodeURIComponent(
                  data.id,
                )}&values=${data.reason}`,
              err,
            );
            dispatch({ type: COMMON_LOADER, value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/payment.order/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function approvePurchaseOrder(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/purchase.order/${data.action}?ids=${encodeURIComponent(
      data.id,
    )}`;
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
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.order","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.order","employee_id":${mEmpID},"description":"تم قبول طلب أمر شراء بواسطة ${_responseData}" }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: PURCHASE_ORDER_RESPONSE, value: [100] });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectPurchaseOrder(data, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl + `/api/call/purchase.order/action_refuse?ids=${data.id}`,
      true,
    );
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
          .then(res => res.json())
          .then(_resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.order","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.order","employee_id":${mEmpID},"description":"تم رفض طلب أمر شراء بواسطة ${_responseData}" }`;

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
                      dispatch({ type: COMMON_LOADER, value: false });
                    });
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
            dispatch({ type: PURCHASE_ORDER_RESPONSE, value: [100] });
            dispatch({ type: COMMON_LOADER, value: false });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.order?ids=${encodeURIComponent(
                  data.id,
                )}&values=${data.reason}`,
              err,
            );
            dispatch({ type: COMMON_LOADER, value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.order/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function approvePurchaseAddBudget(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/purchase.add.budget/${data.action}?ids=${encodeURIComponent(
      data.id,
    )}`;
  return async dispatch => {
    let secretUrl = await EncryptUrl(url, true);

    fetch(secretUrl, {
      method: 'POST', //was post
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.add.budget","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.add.budget","employee_id":${mEmpID},"description":"تم قبول طلب تعزيز ميزانية بواسطة ${_responseData}" }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: PURCHASE_ADD_BUDGET_RESPONSE, value: [100] });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectPurchaseAddBudget(data, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/call/purchase.add.budget/action_refuse?ids=${encodeURIComponent(
          data.id,
          true,
        )}`,
    );

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
            `/api/write/purchase.add.budget?ids=${encodeURIComponent(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "purchase.add.budget","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "purchase.add.budget","employee_id":${mEmpID},"description":"تم رفض طلب تعزيز ميزانية بواسطة ${_responseData}" }`;

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
                      dispatch({ type: COMMON_LOADER, value: false });
                    });
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });

            dispatch({ type: COMMON_LOADER, value: false });
            dispatch({ type: PURCHASE_ADD_BUDGET_RESPONSE, value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/purchase.add.budget?ids=${encodeURIComponent(
                  data.id,
                )}&values=${data.reason}`,
              err,
            );
            dispatch({ type: COMMON_LOADER, value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/purchase.order/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectResignation(data, accessToken) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/call/hr.resignation/button_refuse?ids=${encodeURIComponent(
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
            `/api/write/hr.resignation?ids=${encodeURIComponent(
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
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.resignation","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.resignation","employee_id":${mEmpID},"description":"تم رفض طلب إستقالة بواسطة ${_responseData}" }`;

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
                      dispatch({ type: COMMON_LOADER, value: false });
                    });
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
            dispatch({ type: 'COMMON_LOADER', value: false });
            dispatch({ type: 'RESIGNATION_RESPONSE', value: [100] });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/hr.resignation?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: 'COMMON_LOADER', value: responseData });
            dispatch({ type: 'COMMON_LOADER', value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/hr.resignation/button_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function approveResignation(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/hr.resignation/${data.action}?ids=${encodeURIComponent(
      data.id,
    )}`;

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
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.resignation","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.resignation","employee_id":${mEmpID},"description":"تم قبول طلب إستقالة بواسطة ${_responseData}" }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              dispatch({ type: COMMON_LOADER, value: false });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: RESIGNATION_RESPONSE, value: [100] });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function approveCertAchievement(data, accessToken) {
  let url =
    baseUrl + `/api/call/certificate.achievement/${data.action}?ids=${data.id}`;
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
      .then(_responseData => {
        dispatch({ type: CERT_ACHIEVEMENT_RESPONSE, value: [100] });
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "certificate.achievement","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "certificate.achievement","employee_id":${mEmpID},"description":"تم قبول طلب شهادة الانجاز بواسطة ${_responseData}" }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
              dispatch({ type: COMMON_LOADER, value: false });
            });
          })

          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectCertAchievement(data, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/call/certificate.achievement/action_refuse?ids=${encodeURIComponent(
          data.id,
          true,
        )}`,
    );

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
            `/api/write/certificate.achievement?ids=${
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
          .then(res => res.json())
          .then(_resData => {
            dispatch({ type: COMMON_LOADER, value: false });
            dispatch({ type: CERT_ACHIEVEMENT_RESPONSE, value: [100] });
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "certificate.achievement","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "certificate.achievement","employee_id":${mEmpID},"description":"تم رفض طلب تدريب داخلي بواسطة ${_responseData}" }`;

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
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/certificate.achievement?ids=${
                  data.id
                }&values=${JSON.stringify(data.reason)}`,
              err,
            );
            dispatch({ type: COMMON_LOADER, value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/certificate.achievement/action_refuse?ids=${data.id}`,
          err,
        );
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function approveInternalCourses(data, accessToken) {
  let url =
    baseUrl +
    `/api/call/hr.training.public/action_dm?ids=${encodeURIComponent(data.id)}`;
  return async dispatch => {
    let secretUrl = await EncryptUrl(url, true, 'training public');
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {
        const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.training.public","res_id": ${data.id}}`;
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
              const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.training.public","employee_id":${mEmpID},"description":"لقد تم قبول دورة داخلية من طرف ${_responseData}" }`;

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
                  dispatch({ type: COMMON_LOADER, value: false });
                });
            });
          })
          .catch(err => {
            // console.log('from mob err', err);
          });
        dispatch({ type: INTERNAL_COURSES_RESPONSE, value: [100] });
        dispatch({ type: COMMON_LOADER, value: false });
      })
      .catch(err => {
        remoteLog(url, err);
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}

export function rejectInternalCourses(data, accessToken) {
  return async dispatch => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/call/hr.training.public/button_refuse?ids=${encodeURIComponent(
          data.id,
          true,
        )}`,
    );

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
            `/api/write/hr.training.public?ids=${
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
          .then(res => res.json())
          .then(_resData => {
            const fromMob = `${baseUrl}/api/call/all.requests/identify_approval_ref?kwargs={"res_model": "hr.training.public","res_id": ${data.id}}`;
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
                  const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${data.id},"res_model": "hr.training.public","employee_id":${mEmpID},"description":"تم رفض طلب دورة داخلية  بواسطة ${_responseData}" }`;

                  fetch(logEvent, {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                    .then(response => {
                      // console.log(
                      //   'RESPONSE send aothorization ---->',
                      //   response,
                      // );

                      response.json();
                    })
                    .then(_responseData => {
                      dispatch({ type: COMMON_LOADER, value: false });
                    });

                  dispatch({ type: COMMON_LOADER, value: false });
                });
              })
              .catch(err => {
                // console.log('from mob err', err);
              });
            dispatch({ type: INTERNAL_COURSES_RESPONSE, value: [100] });
            dispatch({ type: COMMON_LOADER, value: false });
            dispatch({ type: INTERNAL_COURSES_RESPONSE, value: [100] });
            dispatch({ type: COMMON_LOADER, value: false });
          })
          .catch(err => {
            remoteLog(
              baseUrl +
                `/api/write/hr.training.public?ids=${encodeURIComponent(
                  data.id,
                )}&values=${data.reason}`,
              err,
            );
            dispatch({ type: COMMON_LOADER, value: false });
          });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/call/hr.training.public/action_refuse?ids=${encodeURIComponent(
              data.id,
            )}`,
          err,
        );
        dispatch({ type: COMMON_LOADER, value: false });
      });
  };
}
