import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { GET_IN_OUT } from '../constants';
import { commonLoader } from './loadingAction';

export function submitAttendance(data, accessToken) {
  let url = '';

  url = baseUrl + `/api/create/hr.attendance?values=${JSON.stringify(data)}`;

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
        dispatch({ type: 'ATTENDANCE_TYPE_POST', value: responseData });
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch(_err => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function emptyAttendanceRequest() {
  return dispatch => {
    dispatch({ type: 'ATTENDANCE_TYPE_POST', value: '' });
  };
}

export function getAttendanceList(data, accessToken) {
  return dispatch => {
    AsyncStorage.getItem('empID').then(async mEmpID => {
      let mUrl =
        baseUrl +
        `/api/search_read?model=hr.attendance.summary&domain=[["date",">=","${data.dateFrom}"],["date","<=","${data.dateTo}"],[ "employee_id","=",  ${mEmpID} ]]`;
      let secretUrl = await EncryptUrl(mUrl);
      fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          dispatch(commonLoader(false));
          if (responseData.length > 0) {
            dispatch({ type: 'ATTENDANCE_LIST', value: responseData });
          } else {
            dispatch({ type: 'ATTENDANCE_LIST', value: [] });
          }
        })
        .catch(_err => {
          dispatch(commonLoader(false));
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    });
  };
}

export function getAttendance(data, accessToken) {
  return dispatch => {
    AsyncStorage.getItem('empID').then(async mEmpID => {
      let date1 = moment(data.dateFrom).format('D-MM-Y');
      let date2 = moment(data.dateTo).format('D-MM-Y');
      let date3 = moment(data.date1).format('DD/MM/YYYY');
      let date4 = moment(data.date2).format('DD/MM/YYYY');
      let mUrl =
        baseUrl +
        `/api/search_read/hr.attendance?domain=[["employee_id.id","=",${mEmpID}], ["name",">=","${date1}"],["name","<=","${date2}"]]&fields=["name","action"]`;
      let url =
        baseUrl +
        `/api/call/all.requests/get_attendance?kwargs={"employee_id": ${mEmpID},"date_from": "${date3}","date_to": "${date4}"}`;
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
          dispatch(commonLoader(false));
          if (responseData.length > 0) {
            dispatch({ type: 'ATTENDANCE_LIST', value: responseData });
          } else {
            dispatch({ type: 'ATTENDANCE_LIST', value: [] });
          }
        })
        .catch(_err => {
          dispatch(commonLoader(false));
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    });
  };
}

export function attendanceCheckIn(accessToken, userId) {
  return async _dispatch => {
    let url = `${baseUrl}/api/attendance/check_in?employee_id=${userId}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {})
      .catch(err => {
        // console.log('attend  CheckIn err', err);
      });
  };
}

export function attendanceCheckOut(accessToken, userId) {
  return async _dispatch => {
    let url = `${baseUrl}/api/attendance/checkout?employee_id=${userId}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(_responseData => {})
      .catch(err => {
        // console.log('attend  checkin err', err);
      });
  };
}
export function attendanceCheckInOut(accessToken, employee_id, inOut) {
  return async dispatch => {
    let action = inOut == 'check_in' ? 'sign_in' : 'sign_out';
    let date = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
    let url = `${baseUrl}/api/create/hr.attendance?values={"employee_id":${employee_id}, "name": "${date}", "action":"${action}"}`;

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
        dispatch({
          type: GET_IN_OUT,
          payload: inOut,
        });
        dispatch({ type: 'COMMON_LOADER', value: false });
        dispatch({
          type: 'ATTENDANCE_MODAL',
          value: true,
        });
      })
      .catch(err => {
        // console.log('attend  inOut err', err);
      });
  };
}

export function attendanceGet(accessToken, userId) {
  return async dispatch => {
    let url = `${baseUrl}/api/search_read/hr.employee?domain=[["user_id","=",${userId}]]&fields=["attendance_state"]`;
    let secretUrl = await EncryptUrl(url);

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({
          type: 'ATTENDANCE_MODAL',
          payload: true,
        });
        if (responseData[0].attendance_state == 'onduty') {
          dispatch({
            type: GET_IN_OUT,
            payload: 'check_in',
          });
        } else {
          dispatch({
            type: GET_IN_OUT,
            payload: 'checkout',
          });
        }

        //GET_IN_OUT
      })
      .catch(_err => {
        // console.log('attend  inOut err', err);
      });
  };
}
