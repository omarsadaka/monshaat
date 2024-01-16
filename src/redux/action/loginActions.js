import AsyncStorage from '@react-native-community/async-storage';
import { Base64 } from 'js-base64';
import CryptoJS from 'react-native-crypto-js';
import DeviceInfo from 'react-native-device-info';
import { showMessage } from 'react-native-flash-message';
import { baseUrl, remoteLog, userDB } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { GenerateNewSession } from '../../utils';
import { LOGIN_OTP } from '../reducer/loginReducer';

export function storeUserToken(token) {
  return (dispatch) => {
    dispatch({ type: 'USER_TOKEN', value: token });
  };
}

export function findAccessToken() {
  return (dispatch) => {
    let username, password;
    AsyncStorage.getItem('username').then((mUsername) => {
      username = mUsername;
      AsyncStorage.getItem('password').then(async (mPassword) => {
        password = mPassword;
        if (username && password) {
          let formBody = new FormData();
          formBody.append('grant_type', 'password');
          formBody.append('scope', 'auth2test');
          formBody.append('client_id', '0XsaYG4EZ6PHvXOfrQv8xAJRhAf4J8');
          formBody.append('client_secret', '2d3jQiuywKHdpJWskoMtZejkN3znKS');
          formBody.append('password', password);
          formBody.append('username', username);
          let url = baseUrl + '/api/authentication/oauth2/token';
          fetch(url, {
            method: 'POST',
            body: formBody,
          })
            .then((response) => response.json())
            .then(async (responseData) => {
              if (responseData['access_token']) {
                dispatch({
                  type: 'ACCESS_TOKEN',
                  value: responseData['access_token'],
                });
              } else {
                dispatch({ type: 'ACCESS_TOKEN', value: null });
                const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
                let item = JSON.parse(ReleaseNotes);
                // AsyncStorage.clear();
                if (item) {
                  await AsyncStorage.setItem(
                    'ReleaseNotes',
                    JSON.stringify({
                      item: item,
                    }),
                  );
                }
                // dispatch(storeUserToken(null));
                // dispatch(emptyLoginData());
              }
            })
            .catch(async (err) => {
              remoteLog(baseUrl + '/api/authentication/oauth2/token', err);
              // dispatch({ type: 'ACCESS_TOKEN', value: null });
              // AsyncStorage.removeItem('userToken');
              // AsyncStorage.removeItem('username');
              // AsyncStorage.removeItem('password');
              // AsyncStorage.removeItem('accessToken');
              const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
              let item = JSON.parse(ReleaseNotes);
              // AsyncStorage.clear();
              if (item) {
                await AsyncStorage.setItem(
                  'ReleaseNotes',
                  JSON.stringify({
                    item: item,
                  }),
                );
              }
              // dispatch(storeUserToken(null));
              // dispatch(emptyLoginData());
            });
        } else {
          // dispatch({ type: 'ACCESS_TOKEN', value: null });
        }
      });
    });
  };
}

export function loginUser(data) {
  return async (dispatch) => {
    const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
    let item = JSON.parse(ReleaseNotes);
    // AsyncStorage.clear();
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('ITSMTOKEN');
    await AsyncStorage.removeItem('ReleaseNotes');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('ReleaseNotes');
    await AsyncStorage.removeItem('empID');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('PROFILE');
    await AsyncStorage.removeItem('empNumber');
    await AsyncStorage.removeItem('PROFILE_DATA');
    await AsyncStorage.removeItem('USER_GROUP');

    if (item) {
      await AsyncStorage.setItem(
        'ReleaseNotes',
        JSON.stringify({
          item: item,
        }),
      );
    }
    AsyncStorage.setItem('username', data.username);
    AsyncStorage.setItem('password', data.password);
    let device = DeviceInfo.getModel();
    let formBody = new FormData();
    formBody.append('grant_type', 'password');
    formBody.append('scope', 'auth2test');
    formBody.append('client_id', '0XsaYG4EZ6PHvXOfrQv8xAJRhAf4J8');
    formBody.append('client_secret', '2d3jQiuywKHdpJWskoMtZejkN3znKS');
    formBody.append('password', data.password);
    formBody.append('username', data.username);

    let url = baseUrl + '/api/authentication/oauth2/token';
    let secretUrl = await EncryptUrl(url, true);
    fetch(url, {
      method: 'POST',
      body: formBody,
    })
      .then((response) => response.json())
      .then(async (responseToken) => {
        console.log('url responseToken',responseToken)
        if (responseToken['access_token']) {
          dispatch({
            type: 'ACCESS_TOKEN',
            value: responseToken['access_token'],
          });
          let ciphertext = CryptoJS.AES.encrypt(
            data.password,
            'monshaat_123',
          ).toString();
          let EncryptedPassword = Base64.encode(ciphertext);
          let url =
            baseUrl +
            `/api/call/res.users/api_login?kwargs=` +
            `{"url": "${baseUrl}", "is_encrypt": ${true}, "db": "${userDB}","username": ${JSON.stringify(
              data.username,
            )}, "password": ${`"${EncryptedPassword}"`},"device_type": "${device}"}`;
          let secretUrl = await EncryptUrl(url, true);
          console.log('url url',url)
          fetch(url, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + responseToken['access_token'],
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then(async (responseData) => {
              if (responseData) {
                let secretUrl = await EncryptUrl(
                  baseUrl +
                    `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${responseData}]]&fields=["id"]`,
                );
                fetch(secretUrl, {
                  method: 'GET',
                  headers: {
                    Authorization: 'Bearer ' + responseToken['access_token'],
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                  .then((response) => response.json())
                  .then(async (mRes) => {
                    if (mRes && mRes.length > 0) {
                      await AsyncStorage.setItem(
                        'empID',
                        mRes[0].id.toString(),
                      );
                      dispatch({ type: 'LOGIN_USER', value: responseData });
                      GenerateNewSession();
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    } else {
                      showMessage({
                        style: { alignItems: 'flex-end' },
                        type: 'danger',
                        message: mRes.message.replace('None', ''),
                      });
                      dispatch({ type: 'COMMON_LOADER', value: false });
                    }
                  })
                  .catch((err) => {
                    remoteLog(
                      baseUrl +
                        `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${responseData}]]&fields=["id"]`,
                      err,
                    );
                    dispatch({ type: 'COMMON_LOADER', value: false });
                  });
              } else {
                dispatch({ type: 'LOGIN_USER', value: false });
                dispatch({ type: 'COMMON_LOADER', value: false });
              }
            })
            .catch((err) => {
              remoteLog(
                baseUrl +
                  `/api/call/res.users/api_login?kwargs={"url": "${baseUrl}", "db": "${userDB}","username": ${JSON.stringify(
                    data.username,
                  )}, "password": ${JSON.stringify(data.password)}}`,
                err,
              );
              dispatch({ type: 'COMMON_LOADER', value: false });
            });
        } else {
          if (responseToken && responseToken.error == 'invalid_grant') {
            showMessage({
              style: { alignItems: 'flex-end' },
              type: 'danger',
              message: 'اسم المستخدم او كلمة المرور خاطئة',
            });
          }
          dispatch({ type: 'LOGIN_USER', value: false });
          dispatch({ type: 'COMMON_LOADER', value: false });
        }
      })
      .catch((err) => {
        // console.log('err', err);
        dispatch({ type: 'COMMON_LOADER', value: false });

        remoteLog(baseUrl + '/api/authentication/oauth2/token', err);
        dispatch({ type: 'LOGIN_USER', value: 'false' });
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('password');
        dispatch(storeUserToken(null));
        dispatch(emptyLoginData());
      });
  };
}

export function emptyLoginData() {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_USER', value: '' });
  };
}

export function getManagerId(data) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&fields=["parent_id"]&domain=[["user_id", "=", ${data.id}]]`,
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
        dispatch({ type: 'MANAGER_ID', value: responseData });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getDeptId(data) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&fields=["department_id"]&domain=[["user_id", "=", ${
          data.id
        }]]&fields=${'["department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","dept","role","management"]'}`,
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
        dispatch({ type: 'DEPT_ID', value: responseData });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function handleAppIntro(data) {
  return (dispatch) => {
    dispatch({ type: 'APP_INTRO', value: data });
  };
}

export function sendOTP(userId, accessToken) {
  return async (dispatch) => {
    dispatch({ type: 'COMMON_LOADER', value: false });
    // return; //if production comment return
    let secretUrl = await EncryptUrl(
      baseUrl + `/api/otp/code?user_id=${userId}`,
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
        fetch(
          baseUrl +
            `/api/search_read/hr.employee?domain=[["user_id","=",${userId}]]&fields=[ "mobile_phone"]`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
          .then((res) => res.json())
          .then((resData) => {
            dispatch({
              type: LOGIN_OTP,
              value: { otp: responseData, user: resData[0] },
            });
            dispatch({ type: 'COMMON_LOADER', value: false });
          })
          .catch((err) => {
            // console.log('send OTP err', err);
          });
      })
      .catch((err) => {
        // console.log('send OTP err', err);
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}
