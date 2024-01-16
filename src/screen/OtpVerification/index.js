import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPTextView from 'react-native-otp-textinput';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader';
import * as loginActions from '../../redux/action/loginActions';
import * as profileAction from '../../redux/action/profileAction';
import { COMMON_LOADER } from '../../redux/reducer/loadingReducer';
import { LOGIN_OTP } from '../../redux/reducer/loginReducer';
import { baseUrl, msgServer, otpTimer, otpTryLimit } from '../../services';

let timerCount = otpTimer;
let mCountDownTimer = null;
// let errMessage = '';
// let otpInput = '';
// let otpTry = 0;
const OtpVerification = props => {
  const [state, setState] = useState({
    userId: '',
    mLoginOTP: '',
    mPhone: '',
    timer: '',
    isTimeOut: false,
  });
  const [errMessage, setErrMessage] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTry, setOtpTry] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  const otpDetails = useSelector(state => state.LoginReducer.loginOTP);
  const localUser = useSelector(
    state => state.ProfileReducer.userProfileData[0],
  );
  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.userId) {
        dispatch({ type: COMMON_LOADER, value: true });
        setState({
          ...state,
          userId: props.route.params.userId,
          mLoginOTP: '',
          mPhone: '',
          timer: '',
          isTimeOut: false,
        });
        // Clipboard.setString('');
        // console.log('Access Token Clipboard.setStri', accessToken);

        const data = {
          accessToken,
          id: props.route.params.userId,
          otp: true,
        };

        dispatch(profileAction.getProfile(data));
        dispatch(profileAction.getProfileData(data));
        dispatch(loginActions.sendOTP(props.route.params.userId, accessToken));
      }
    });
  }, [props.navigation]);

  useEffect(() => {
    dispatch({ type: COMMON_LOADER, value: false });
    // errMessage = '';
    // otpInput = '';
    setErrMessage('');
    setOtpInput('');
    if (typeof otpDetails === 'object' && Object.keys(otpDetails).length) {
      // otpTry = 0;
      setOtpTry(0);
      setState({
        ...state,
        mLoginOTP: otpDetails.otp.code,
        mPhone: otpDetails.user.mobile_phone,
      });
      dispatch({ type: LOGIN_OTP, value: '' });
      //     showMessage({
      //         type: 'success',
      //         message: otpDetails.message,
      //     });
    } else if (
      typeof otpDetails === 'object' &&
      Object.keys(otpDetails).length
    ) {
      dispatch({ type: LOGIN_OTP, value: '' });
      if (otpDetails.message)
        showMessage({
          style: { alignItems: 'flex-end' },
          type: 'danger',
          message: otpDetails.message.replace('None', ''),
        });
    }
  }, [otpDetails]);

  useEffect(() => {
    if (state.mLoginOTP) {
      countDownTimer();
    }
  }, [state.mLoginOTP]);

  const countDownTimer = () => {
    timerCount = otpTimer;
    if (mCountDownTimer) {
      clearInterval(mCountDownTimer);
      mCountDownTimer = null;
    }
    mCountDownTimer = setInterval(function() {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date

      if (timerCount) {
        timerCount--;
        // Display the result in the element with id="demo"
        setState({
          ...state,
          timer: new Date(timerCount * 1000).toISOString().substr(14, 5),
        });
      } // If the count down is finished, write some text
      if (timerCount <= 0) {
        clearInterval(mCountDownTimer);
        setState({ ...state, isTimeOut: true, timer: '00:00' });
        // errMessage = 'لقد خرجت من الحد. الرجاد الدخول على الحساب من جديد.';
        setErrMessage('لقد خرجت من الحد. الرجاد الدخول على الحساب من جديد.');
      }
    }, 1000);
  };

  // remove otp for apple
  // useEffect(()=>{
  //   AsyncStorage.setItem("userToken", "token");
  //   dispatch(loginActions.storeUserToken("token"));
  //   })

  const handleOtpValidation = async otpInput => {
    let paypassOTP = false; //if production set paypassOTP = false
    // errMessage = '';
    setErrMessage('');
    AsyncStorage.setItem('userid', props.route.params.userId.toString());
    if (otpInput.length === 4) {
      if (!state.isTimeOut) {
        if (otpTry < otpTryLimit) {
          setOtpTry(otpTry + 1);
          if (props.route.params && props.route.params.userName) {
            if (
              props.route.params.userName === 'testerpapp' ||
              props.route.params.userName === 'testerpapp1'
            ) {
              paypassOTP = true;
            }
          }
          if (
            // otpInput === '1234' || // if production comment this
            otpInput === state.mLoginOTP ||
            (paypassOTP && otpInput === '1234')
          ) {
            setErrMessage('');
            if (paypassOTP) {
              requestUserPermission();
              AsyncStorage.setItem('userToken', 'token');
              dispatch(loginActions.storeUserToken('token'));
            } else {
              // errMessage = '';
              clearInterval(mCountDownTimer);
              mCountDownTimer = null;
              setState({
                ...state,
                isTimeOut: true,
                timer: '00:00',
              });
              requestUserPermission();
              // AsyncStorage.setItem("userToken", "token");
              // dispatch(loginActions.storeUserToken("token"));
            }
          } else {
            // errMessage = 'كلمة المرور لمرة واحدة غير صالحة';
            setErrMessage('كلمه المرور غير صحيحه');
          }
        } else {
          // errMessage = 'لقد خرجت من الحد. الرجاد الدخول على الحساب من جديد.';
          setErrMessage('لقد خرجت من الحد. الرجاد الدخول على الحساب من جديد.');
        }
      } else {
        // errMessage = 'انتهت صلاحية كلمة مرورك لمرة واحدة';
        setErrMessage('انتهت صلاحية كلمة مرورك لمرة واحدة');
      }
    } else if (otpInput.length < 1) {
      // errMessage = ' يجب ادخال رقم التحقق';
      setErrMessage(' يجب ادخال رقم التحقق');
    } else {
      // errMessage = 'كلمة المرور لمرة واحدة غير صالحة';
      setErrMessage('كلمه المرور غير صحيحه');
    }
  };

  /////////////////////// Notification handling   adomaikhi
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      const fireBaseToken = getFcmToken();
      // return fireBaseToken;
    } else {
      AsyncStorage.setItem('userToken', 'token');
      dispatch(loginActions.storeUserToken('token'));
    }
  };

  const getFcmToken = async () => {
    // console.log('getFcmTokengetFcmTokengetFcmTokengetFcmTokengetFcmToken');
    const fcmToken = await messaging().getToken();
    // console.log('fcmToken,fcmToken', fcmToken);
    if (fcmToken) {
      // console.log('Your Firebase Token is:', fcmToken);
      AsyncStorage.setItem('fcmToken', fcmToken);
      url = `${baseUrl}/api/user_registration?user_id=${props.route.params.userId.toString()}&registration_id=${fcmToken}`;

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(response => {
        //console.log("set firebase response", response);
        AsyncStorage.setItem('userToken', 'token');
        dispatch(loginActions.storeUserToken('token'));
      });

      // registration on node server
      // console.log('\n\n\n  localUser', localUser);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localUser.id.toString(),
          token: fcmToken,
        }),
      };

      // console.log(`${msgServer}user_registration`);
      fetch(`${msgServer}user_registration`, requestOptions)
        .then(response => response.json())
        .then(data => console.log('response data', data));
      //////////////////////////////////////////////////////////////

      return fcmToken;
    } else {
      //console.log("Failed", "No Token Recived");
      AsyncStorage.setItem('userToken', 'token');
      dispatch(loginActions.storeUserToken('token'));
      return 'No Token Recived';
    }
  };

  //////////////////////////////////////////    //////////////////////////////////////////    //////////////////////////////////////////

  const logout = async () => {
    // unsubscrib from notification
    // console.log(' unsc from notif msg');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: localUser.id.toString(),
        token: fcmToken,
      }),
    };

    // fetch(`${msgServer}user_registration`, requestOptions)   production
    fetch(`${msgServer}logout`, requestOptions)
      .then(response => response.json())
      .then(data => console.log('logout response data', data));
    //////////////////////////////////////////////////////////////

    url = `${baseUrl}/api/user_registration?user_id=${props.route.params.userId.toString()}&registration_id=${null}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => {
      //console.log("set firebase response", response);
      //console.log("firebase Token deleted");
    });

    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('username');
    AsyncStorage.removeItem('password');
    AsyncStorage.removeItem('role');
    AsyncStorage.removeItem('userGroup');
    AsyncStorage.removeItem('accessToken');
    dispatch(loginActions.storeUserToken(null));
    dispatch(loginActions.emptyLoginData());
    const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
    let item = JSON.parse(ReleaseNotes);
    await AsyncStorage.getAllKeys().then(keys =>
      AsyncStorage.multiRemove(keys),
    );
    if (item) {
      await AsyncStorage.setItem(
        'ReleaseNotes',
        JSON.stringify({
          item: item,
        }),
      );
    }
    props.navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bgdark.png')}
      style={{ flex: 1 }}
    >
      <ImageBackground
        resizeMode="stretch"
        source={require('../../assets/images/bglight.png')}
        style={{ flex: 1, marginTop: '20%' }}
      >
        <KeyboardAwareScrollView>
          <View style={styles.coontainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
            <View style={{ marginVertical: hp('1%') }}>
              <Text
                style={{
                  fontFamily: '29LTAzer-Regular',
                  color: '#007297',
                  fontSize: 22,
                }}
              >
                التحقق من هوية المستخدم
              </Text>
            </View>
            <View
              style={{
                marginTop: 32,
                marginBottom: 16,
                fontFamily: '29LTAzer-Regular',
                fontSize: 14,
              }}
            >
              <Text style={styles.textStyle}>
                الرجاء إدخال رقم التأكيد الذي تم إرساله إلى رقم هاتفك المحمول
                المنتهي بـ {state.mPhone.substr(state.mPhone.length - 4)}
              </Text>
            </View>
            <View style={{ padding: 16 }}>
              <OTPTextView
                inputCount={1}
                inputCellLength={4}
                offTintColor={'#e2e2e2'}
                tintColor={'#007598'}
                handleTextChange={e => {
                  setOtpInput(e);
                  if (e.length >= 4) {
                    handleOtpValidation(e);
                  }
                }}
                containerStyle={{ height: 80, width: '80%' }}
                textInputStyle={{
                  borderRadius: 6,
                  borderColor: '#e2e2e2',
                  backgroundColor: '#ffffff',
                  height: 56,
                  borderWidth: 1,
                  color: '#000000',
                  width: '90%',
                }}
                // autoFocusOnLoad={false}
                // onCodeFilled={mCode => {
                //   otpInput=mCode;
                //   handleOtpValidation();
                // }}
              />
            </View>

            <View style={{ width: '80%' }}>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 8,
                }}
              >
                <TouchableOpacity onPress={logout}>
                  <Text
                    style={{
                      color: 'blue',
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    تسجيل الخروج وإعادة المحاولة
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: '29LTAzer-Regular',
                    paddingVertical: 8,
                    color: 'gray',
                  }}
                >
                  {state.timer}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => handleOtpValidation(otpInput)}
              >
                <Text style={styles.loginBtnText}>إستمرار </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 32,
                  marginBottom: 16,
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 14,
                }}
              >
                <Text style={[styles.textStyle, { color: 'red', padding: 8 }]}>
                  {errMessage}
                </Text>
              </View>
            </View>
            {isLoading ? <Loader /> : null}
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </ImageBackground>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 10,
    width: '100%',
    paddingVertical: hp('1.5%'),
    marginVertical: hp('2%'),
    backgroundColor: '#007598',
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  textStyle: {
    fontSize: hp('2.5%'),
    color: '#687D8D',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  coontainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
});
