import moment from 'moment';
import { baseUrl, remoteLog } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

export function getHomeAttendance(reqData) {
  let data = reqData.data;
  let date = moment(new Date()).format('YYYY-MM-DD');
  let date2 = moment(new Date()).add(1, 'd').format('YYYY-MM-DD');
  let mUrl =
    baseUrl +
    `/api/search_read/hr.attendance?domain=[["employee_id.id","=",${data.id}], ["name",">=","${date}"],["name","<","${date2}"]]&fields=["name","action"]`;
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(mUrl);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({
          type: 'HOME_ATTENDANCE',
          payload: responseData,
        });
      })
      .catch((err) => {
        remoteLog(secretUrl, err);
      });
  };
}
export function getAllMyReuqestList(reqData) {
  let data = reqData.data;
  let url = '';
  url =
    baseUrl +
    `/api/call/all.requests/retrieve_my_requests?kwargs={"employee_id": ${data.id},"limit": ${data.limit},"page": ${data.page}}`;
  console.log('accessToken', data.token);
  console.log('employyeId', data.id);
  return async (dispatch) => {
    dispatch({ type: 'HOME_ALL_MY_REQUEST_LOADING', value: true });
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          dispatch({
            type: 'HOME_ALL_MY_REQUEST',
            value: responseData,
          });
        }

        dispatch({ type: 'HOME_ALL_MY_REQUEST_LOADING', value: false });
      })
      .catch((err) => {
        remoteLog(url, err);
        dispatch({ type: 'HOME_ALL_MY_REQUEST_LOADING', value: false });
      });
  };
}
export function getAllMyApproveList(reqData) {
  let data = reqData.data;
  let url = '';
  url =
    baseUrl +
    `/api/call/all.requests/retrieve_all?kwargs={"employee_id": ${data.id},"limit": ${data.limit},"page": ${data.page}}`;
  return async (dispatch) => {
    dispatch({ type: 'HOME_ALL_MY_APPROVE_LOADING', value: true });

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({
          type: 'HOME_ALL_MY_APPROVE',
          value: responseData,
        });
        let data = [
          ...responseData.authorizations,
          ...responseData['certificate achievement'],
          ...responseData.deputations,
          ...responseData['distance work'],
          ...responseData.holidays,
          ...responseData['payment orders'],
          ...responseData['purchase add budget'],
          ...responseData['purchase orders'],
          ...responseData['purchase requests'],
          ...responseData.training,
          ...responseData['training public'],
          ...responseData.resignations,
          ...responseData['purchase requisition'],
          ...responseData['work orders'],
          ...responseData['purchase contracts'],
        ];
        let IDS = data.map((item) => item.id);
        dispatch({
          type: 'HOME_ALL_MY_APPROVE_LOADING',
          value: false,
        });
        dispatch({ type: 'HOME_APPROVE_IDS', payload: IDS });
      })
      .catch((err) => {
        remoteLog(url, err);
        dispatch({ type: 'HOME_ALL_MY_APPROVE_LOADING', value: false });
      });
  };
}
export function getMyReuqestList(reqData) {
  let data = reqData.data;
  let activeMenuTab = reqData.activeMenuTab;
  let url = '';
  if (data.kwargs) {
    url =
      baseUrl +
      `/api/call/res.users/get_transactions?kwargs=${JSON.stringify(
        data.kwargs,
      )}` +
      '&domain=' +
      encodeURI(data.domain);
  } else if (data.fields) {
    url =
      baseUrl +
      `/api/search_read?model=helpdesk.ticket&fields=${data.fields}&domain=${data.domain}`;
  } else if (data.params) {
    url = baseUrl + `/api/search_read${data.params}`;
  } else if (data.key) {
    url = baseUrl + `/api/search_read?model=${data.key}`;
  } else {
    // dispatch({type: 'HOME_MY_REQUEST', value: {responseData:[],activeMenuTab:activeMenuTab}});
    // dispatch({type: 'COMMON_LOADER', value: false});
  }
  if (url) {
    return (dispatch) => {
      fetch(url, {
        method: data.kwargs ? 'POST' : 'GET',
        headers: {
          Authorization: 'Bearer ' + data.token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatch({
            type: 'HOME_MY_REQUEST',
            value: { responseData: responseData, activeMenuTab: activeMenuTab },
          });
          dispatch({ type: 'COMMON_LOADER', value: false });
        })
        .catch((err) => {
          remoteLog(url, err);
          dispatch({ type: 'COMMON_LOADER', value: false });
        });
    };
  }
}

export function getSectorsList(reqData) {
  let data = reqData.data;
  let url = '';
  url =
    baseUrl +
    `/api/call/all.requests/get_employee_sectors?kwargs={"employee_id": ${data.id}}`;
  console.log('omar base', url);
  console.log('omar token', data.token);
  return async (dispatch) => {
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('getSectorsList', responseData);
        dispatch({
          type: 'FILTER_SECTORS',
          value: responseData,
        });
      })
      .catch((err) => {
        remoteLog(url, err);
        console.log('getSectorsList error', err);
      });
  };
}
export function getDepartmentsList(data) {
  let url = '';
  url =
    baseUrl +
    `/api/call/all.requests/get_employee_departments?kwargs={"employee_id": ${data.id},"sector_ids":${data.sectors}}`;
  return async (dispatch) => {
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('getDepartmentsList', responseData);
        dispatch({
          type: 'FILTER_DEPARTMENTS',
          value: responseData,
        });
      })
      .catch((err) => {
        remoteLog(url, err);
      });
  };
}

export function getEmployeesList(data) {
  let url = '';
  url =
    baseUrl +
    `/api/call/all.requests/get_employee_employees?kwargs={"employee_id": ${data.id},"sector_ids":${data.sectors},"departments_ids":${data.departments}}`;
  return async (dispatch) => {
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + data.token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('getEmployeesList', responseData);
        dispatch({
          type: 'FILTER_EMPLOYEES',
          value: responseData,
        });
      })
      .catch((err) => {
        remoteLog(url, err);
      });
  };
}
export function EditableorNot(data) {
  return (dispatch) => {
    dispatch({ type: 'COME_FROM', value: data });
  };
}
