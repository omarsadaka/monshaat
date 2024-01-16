import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { TEAM_LIST } from '../reducer/technicalReducer';
import * as homeMyRequestActions from './homeMyRequestAction';

export function getClassificationType(accessToken) {
  return async dispatch => {
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
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'CLASSIFICATION_TYPES', value: responseData });
      })
      .catch(err => {});
  };
}

export function getType(accessToken, filter_ids) {
  return async dispatch => {
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
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'TECHNICAL_TYPES', value: responseData });
      })
      .catch(err => {});
  };
}

export function getCategories(accessToken, filter_ids) {
  return async dispatch => {
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
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'CATEGORY_TYPES', value: responseData });
      })
      .catch(err => {});
  };
}

export function getLocations(accessToken) {
  return async dispatch => {
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
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'TECH_LOCATIONS', value: responseData });
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            '/api/search_read?model=helpdesk.ticket.location&fields=["name", "id"]',
          err,
        );
      });
  };
}

export function getTeams(accessToken) {
  return async dispatch => {
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
      .then(response => response.json())
      .then(responseData => {
        //console.log(responseData);
        dispatch({ type: TEAM_LIST, value: responseData });
      })
      .catch(err => {
        //console.log(err);
      });
  };
}

export function postTechnicalRequest(data, openModel) {
  return async dispatch => {
    let url =
      baseUrl +
      `/api/create/helpdesk.ticket?values=${encodeURIComponent(
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
        AsyncStorage.getItem('empID').then(async mEmpID => {
          // console.log('RESPONSEDATA authorization ------>', responseData[0]);

          // console.log('EMPLOYEE ID ------>', mEmpID);
          const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${responseData[0]},"res_model": "helpdesk.ticket","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب دعم فني عن بعد بنجاح " }`;
          // console.log('log send request', logEvent);

          fetch(logEvent, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data.accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(response => {
              // console.log('RESPONSE send aothorization ---->', response);
              response.json();
            })
            .then(responseData => {
              // console.log('send aothorization ---->', responseData);
              dispatch({ type: 'COMMON_LOADER', value: false });
              openModel();
            });
        });
        if (data.attachments?.length > 0) {
          const formBody = new FormData();

          await data.attachments.forEach(fileItem => {
            formBody.append('files', fileItem);
          });
          let url =
            baseUrl +
            '/api/attachments/upload?res_model=helpdesk.ticket&res_id=' +
            responseData[0];
          // let secretUrl = await EncryptUrl(url, true);

          await fetch(url, {
            method: 'POST',
            body: formBody,
            headers: {
              Authorization: 'Bearer ' + data.accessToken,
              'Content-Type': 'multipart/form-data',
            },
          }).then(resFile => {
            dispatch({ type: 'TECHNICAL_POST', value: responseData });

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
          dispatch({ type: 'TECHNICAL_POST', value: responseData });

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
        }
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            '/api/attachments/upload?res_model=helpdesk.ticket&res_id=' +
            responseData[0],
          err,
        );
        dispatch({ type: 'TECHNICAL_POST', value: responseData });

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
  };
}

export function emptyTechnicalData() {
  return dispatch => {
    dispatch({ type: 'TECHNICAL_POST', value: '' });
  };
}
