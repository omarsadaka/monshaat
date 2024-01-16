import AsyncStorage from '@react-native-community/async-storage';
import {
  baseUrl,
  DEGREE_ID,
  DEPT_ID,
  EMP_NO,
  GRADE_ID,
  JOB_ID,
  remoteLog,
  TYPE_ID,
  itsmAuthUrl,
  xـapiـkey,
  senderId,
} from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { useDispatch } from 'react-redux';

export function getProfile(data) {
  return async dispatch => {
    let profile = await AsyncStorage.getItem('PROFILE');
    profile = JSON.parse(profile);
    if (profile) {
      AsyncStorage.setItem('role', profile[0].role);
      AsyncStorage.setItem('empID', profile[0].id.toString());
      AsyncStorage.setItem('empNumber', profile[0].number.toString());
      AsyncStorage.setItem('accessToken', data.accessToken);
      AsyncStorage.setItem(EMP_NO, profile[0].number);
      AsyncStorage.setItem(JOB_ID, profile[0].job_id[0].toString());
      AsyncStorage.setItem(DEPT_ID, profile[0].department_id[0].toString());
      AsyncStorage.setItem(DEGREE_ID, profile[0].degree_id[0].toString());
      AsyncStorage.setItem(GRADE_ID, profile[0].grade_id[0].toString());
      AsyncStorage.setItem(TYPE_ID, profile[0].type_id[0].toString());
      dispatch({ type: 'GET_PROFILE', value: profile });
      return;
    }
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
          data.id
        }]]&fields=${'["attendance_state","number","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management","degree_id","grade_id","type_id"]'}`,
    );
    fetch(
      secretUrl,
      // baseUrl +
      //   `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
      //     data.id
      //   }]]&fields=${'["attendance_state","number","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","dept","management","degree_id","grade_id","type_id"]'}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        // console.log('profile dataaaa', responseData);
        // console.log('data.accessToken', data.accessToken);

        dispatch(getJsonWebToken(data.accessToken, responseData[0].work_email));
        AsyncStorage.setItem('PROFILE', JSON.stringify(responseData));
        AsyncStorage.setItem('role', responseData[0].role);
        AsyncStorage.setItem('empID', responseData[0].id.toString());
        AsyncStorage.setItem('empNumber', responseData[0].number.toString());
        AsyncStorage.setItem('accessToken', data.accessToken);
        AsyncStorage.setItem(EMP_NO, responseData[0].number);
        AsyncStorage.setItem(JOB_ID, responseData[0].job_id[0].toString());
        AsyncStorage.setItem(
          DEPT_ID,
          responseData[0].department_id[0].toString(),
        );
        AsyncStorage.setItem(
          DEGREE_ID,
          responseData[0].degree_id[0].toString(),
        );
        AsyncStorage.setItem(GRADE_ID, responseData[0].grade_id[0].toString());
        AsyncStorage.setItem(TYPE_ID, responseData[0].type_id[0].toString());

        dispatch({ type: 'GET_PROFILE', value: responseData });
        if (data.otp) {
          setTimeout(() => {
            let url = `${baseUrl}/api/call/force.notification/send_firebase_notice_api?kwargs={"employee_id":${responseData[0].id.toString()}}`;
            fetch(url, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + data.accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then(e => {})
              .catch(err => {
                // console.log('error in force notification api');
              });
          }, 3000);
        }
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
              data.id
            }]]&fields=${'["department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management"]'}`,
          err,
        );
      });
  };
}

export function getProfileData(data) {
  return async dispatch => {
    dispatch({ type: 'PROFILE_LOADING', value: true });
    let profile_data = await AsyncStorage.getItem('PROFILE_DATA');
    profile_data = JSON.parse(profile_data);
    if (data.home && profile_data) {
      dispatch({ type: 'GET_PROFILE_DATA', value: profile_data });
      AsyncStorage.setItem('role', profile_data[0].role);
    } else {
      let secretUrl = await EncryptUrl(
        baseUrl +
          `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
            data.id
          }]]&fields=${'["job_english_name","user_id", "department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management","attendance_state"]'}`,
      );
      console.log('sssssssssddd', secretUrl);
      fetch(
        secretUrl,
        // baseUrl +
        //   `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
        //     data.id
        //   }]]&fields=${'["user_id", "department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","dept","management","attendance_state"]'}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + data.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
        .then(response => response.json())
        .then(responseData => {
          AsyncStorage.setItem('PROFILE_DATA', JSON.stringify(responseData));
          if (responseData) {
            AsyncStorage.setItem('role', responseData[0].role);
          }
          dispatch({ type: 'GET_PROFILE_DATA', value: responseData });
        })
        .catch(err => {
          dispatch({ type: 'PROFILE_LOADING', value: false });
          remoteLog(
            baseUrl +
              `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
                data.id
              }]]&fields=${'["job_english_name","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management"]'}`,
            err,
          );
        });
    }
  };
}

export function getCorrProfileData(data) {
  return async dispatch => {
    dispatch({ type: 'PROFILE_LOADING', value: true });
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["id", "=", ${
          data.id
        }]]&fields=${'["job_english_name","id", "department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management","attendance_state"]'}`,
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + data.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch({ type: 'GET_CORRES_DATA', value: responseData });
      })
      .catch(err => {
        dispatch({ type: 'PROFILE_LOADING', value: false });
        remoteLog(
          baseUrl +
            `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${
              data.id
            }]]&fields=${'["job_english_name","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management"]'}`,
          err,
        );
      });
    // }
  };
}

export function getUserGroupData(data) {
  return async dispatch => {
    let user_group = await AsyncStorage.getItem('USER_GROUP');
    user_group = JSON.parse(user_group);
    if (user_group) {
      dispatch({ type: 'GET_USER_GROUP_DATA', value: user_group });
      return;
    }

    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=res.users&domain=[["id", "=", ${data.id}]]&fields=["groups_id"]`,
    );

    fetch(
      secretUrl,
      // baseUrl +
      //   `/api/search_read?model=res.users&domain=[["id", "=", ${data.id}]]&fields=["groups_id"]`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + data.accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        if (responseData) {
          AsyncStorage.setItem('USER_GROUP', JSON.stringify(responseData));

          dispatch({ type: 'GET_USER_GROUP_DATA', value: responseData });
        } else {
          dispatch({ type: 'GET_USER_GROUP_DATA', value: '' });
        }
      })
      .catch(err => {
        remoteLog(
          baseUrl +
            `/api/search_read?model=res.users&domain=[["id", "=", ${data.id}]]&fields=["groups_id"]`,
          err,
        );
      });
  };
}
export function getJsonWebToken(token, email) {
  return async dispatch => {
    try {
      fetch(`${itsmAuthUrl}/Security/TaskService/JWT/mobile/getJsonWebToken`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': xـapiـkey,
          senderId: senderId,
        },
      })
        .then(response => response.json())
        .then(responseData => {
          // console.log('getJsonWebToken', responseData.accessToken);
          var body = JSON.stringify({
            accessToken: token,
            email: email,
          });
          fetch(
            `${itsmAuthUrl}/UserProperties/TaskService/Authorization/SignInRequest`,
            {
              method: 'POST',
              body: body,
              headers: {
                Authorization: 'Bearer ' + responseData.accessToken,
                'x-api-key': xـapiـkey,
                'Content-Type': 'application/json',
              },
            },
          )
            .then(response => response.json())
            .then(responseData => {
              // console.log('SignInRequest', responseData.accessToken); //or refreshToken
              if (responseData['accessToken']) {
                AsyncStorage.setItem('ITSMTOKEN', JSON.stringify(responseData));
                dispatch({
                  type: 'ITSM_TOKEN',
                  value: responseData['accessToken'],
                });
              }
            })
            .catch(err => {
              // console.log('SignInRequest err', err);
            });
        })
        .catch(err => {
          // console.log('getJsonWebToken err', err);
        });
    } catch (error) {
      // console.log('getJsonWebToken error catch', error);
    }
  };
}
