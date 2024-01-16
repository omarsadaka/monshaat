import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import * as loadingAction from './loadingAction';
export const SEARCH_DATA = 'SEARCH_DATA';
export const MANAGER_DATA = 'MANAGER_DATA';
export const DEPT_DATA = 'DEPT_DATA';
export const COL_DATA = 'COL_DATA';
export const MANAGER_DATA2 = 'MANAGER_DATA2';
export const DEPT_DATA2 = 'DEPT_DATA2';
export const COL_DATA2 = 'COL_DATA2';

export function getManagerData(data) {
  return async (dispatch) => {
    if (!data.id) {
      return;
    }
    dispatch({ type: 'SEARCH_MANAGER_LOADING', value: true });

    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["id", "=", ${
          data.id
        }]]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management","number"]'}`,
    );
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: MANAGER_DATA, value: responseData });
        AsyncStorage.setItem('MANAGER_DATA', JSON.stringify(responseData));
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/search_read?model=hr.employee&domain=[["id", "=", ${
              data.id
            }]]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management"]'}`,
          err,
        );
        dispatch({ type: 'SEARCH_MANAGER_LOADING', value: false });
      });
  };
}

export function getManagerData2(data) {
  return async (dispatch) => {
    if (!data.id) {
      return;
    }
    dispatch({ type: 'SEARCH_MANAGER_LOADING', value: true });

    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["id", "=", ${
          data.id
        }]]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management","number"]'}`,
    );
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: MANAGER_DATA2, value: responseData });
        AsyncStorage.setItem('MANAGER_DATA', JSON.stringify(responseData));
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/search_read?model=hr.employee&domain=[["id", "=", ${
              data.id
            }]]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management"]'}`,
          err,
        );
        dispatch({ type: 'SEARCH_MANAGER_LOADING', value: false });
      });
  };
}

export function getDeptData(data) {
  if (!data.id) {
    return;
  }
  return async (dispatch) => {
    dispatch({ type: 'SEARCH_DEPT_LOADING', value: true });

    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      let url =
        baseUrl +
        `/api/search_read?model=hr.employee&domain=[["parent_id", "=", ${mEmpID}]]&fields=["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","department_global_id","dept","management","number"]`;
      let secretUrl = await EncryptUrl(url);
      // console.log(url, 'getDeptData');
      fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          // console.log(url, 'getDeptData', responseData);
          dispatch({ type: DEPT_DATA, value: responseData });
          AsyncStorage.setItem('DEPT_DATA', JSON.stringify(responseData));
        })
        .catch((err) => {
          remoteLog(
            baseUrl +
              `/api/search_read?model=hr.employee&domain=${
                '[["department_id", "=", ' +
                data.id +
                '],["id","!=",' +
                mEmpID +
                ']' +
                (data.managerId ? ',["id","!=",' + data.managerId + ']' : '')
              }]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management"]'}`,
            err,
          );
          dispatch({ type: 'SEARCH_DEPT_LOADING', value: false });
        });
    });
  };
}

export function getDeptData2(data) {
  if (!data.id) {
    return;
  }
  return async (dispatch) => {
    dispatch({ type: 'SEARCH_DEPT_LOADING', value: true });

    let url =
      baseUrl +
      `/api/search_read?model=hr.employee&domain=[["parent_id", "=", ${data.user_id}]]&fields=["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","department_global_id","dept","management","number"]`;
    let secretUrl = await EncryptUrl(url);
    // console.log(url, 'getDeptData');

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log(url, 'getDeptData', responseData);
        dispatch({ type: DEPT_DATA2, value: responseData });
        AsyncStorage.setItem('DEPT_DATA', JSON.stringify(responseData));
      })
      .catch((err) => {
        remoteLog(
          baseUrl +
            `/api/search_read?model=hr.employee&domain=${
              '[["department_id", "=", ' +
              data.id +
              '],["id","!=",' +
              data.user_id +
              ']' +
              (data.managerId ? ',["id","!=",' + data.managerId + ']' : '')
            }]&fields=${'["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","management"]'}`,
          err,
        );
        dispatch({ type: 'SEARCH_DEPT_LOADING', value: false });
      });
  };
}

export function getColData(data) {
  if (!data.id) {
    return;
  }
  return async (dispatch) => {
    dispatch({ type: 'SEARCH_COL_LOADING', value: true });

    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      let url =
        baseUrl +
        `/api/search_read?model=hr.employee&domain=[["parent_id", "=", ${
          data.id
        }]${
          mEmpID ? ',["id","!=",' + mEmpID + ']' : ''
        }]&fields=["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","department_global_id","dept","management","number"]`;
      let secretUrl = await EncryptUrl(url);
      // console.log('col', url);
      fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          // console.log('col data', responseData);

          dispatch({ type: COL_DATA, value: responseData });
          AsyncStorage.setItem('COL_DATA', JSON.stringify(responseData));
        })
        .catch((err) => {
          dispatch({ type: 'SEARCH_COL_LOADING', value: false });
        });
    });
  };
}

export function getColData2(data) {
  if (!data.id) {
    return;
  }
  return async (dispatch) => {
    dispatch({ type: 'SEARCH_COL_LOADING', value: true });

    let url =
      baseUrl +
      `/api/search_read?model=hr.employee&domain=[["parent_id", "=", ${
        data.id
      }]${
        data.user_id ? ',["id","!=",' + data.user_id + ']' : ''
      }]&fields=["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","department_global_id","dept","management","number"]`;
    let secretUrl = await EncryptUrl(url);
    // console.log('col', url);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('col data', responseData);

        dispatch({ type: COL_DATA2, value: responseData });
        AsyncStorage.setItem('COL_DATA', JSON.stringify(responseData));
      })
      .catch((err) => {
        dispatch({ type: 'SEARCH_COL_LOADING', value: false });
      });
  };
}

export function getSearchData(data) {
  return (dispatch) => {
    dispatch({ type: 'SEARCH_LOADING', value: true });
    dispatch(loadingAction.standadLoader(true));
    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      let searchText = JSON.stringify(data.searchKey);
      if (data.searchKey == '@' || data.searchKey == '%') {
        dispatch({ type: 'COMMON_LOADER', value: false });
        return;
      }
      let url =
        baseUrl +
        `/api/call/all.requests/employee_search_request?kwargs={"employee_object": ${searchText}}`;

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatch({ type: SEARCH_DATA, value: responseData });
          dispatch(loadingAction.standadLoader(false));
          dispatch({ type: 'COMMON_LOADER', value: false });
        })
        .catch((err) => {
          remoteLog(url, err);
          // dispatch({ type: "COMMON_LOADER", value: false });
          dispatch({ type: 'SEARCH_LOADING', value: false });
          dispatch(loadingAction.standadLoader(false));
        });
    });
  };
}
