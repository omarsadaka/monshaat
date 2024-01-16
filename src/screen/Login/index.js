import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import * as loadingAction from '../../redux/action/loadingAction';
import * as loginActions from '../../redux/action/loginActions';
import { baseUrl } from '../../services';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { Checkbox } from 'react-native-paper';

const { height } = Dimensions.get('window');
export default function Login(props) {
  const [state, setState] = useState({
    loginwith: 'username',
    username: '',
    password: '',
    mobileNumber: '',
    showPassword: false,
    isChecked: false,
  });
  const dispatch = useDispatch();
  const [rememberedList, setRememberList] = useState([]);
  const [filterRememberedList, setFilterRememberList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const loginUserData = useSelector(
    (state) => state.LoginReducer.loginUserData,
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Login_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    getRememberList();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getRememberList = async () => {
    try {
      // const data = await AsyncStorage.getItem('@RemmembersList');
      // if (data != null) {
      //   setRememberList(JSON.parse(data));
      //   setFilterRememberList(JSON.parse(data));
      // } else {
      //   setRememberList([]);
      // }

      const data = await AsyncStorage.getItem('@RemmemberName');
      if (data != null) {
        setState({ ...state, username:data ,isChecked: !state.isChecked,});
      } else {
        setState({ ...state, username:'' });
      }

    } catch (error) {
      // Error retrieving data
    }
  };

  useEffect(() => {
    if (typeof loginUserData === 'number') {
      dispatch(loginActions.emptyLoginData());
      AsyncStorage.setItem('userid', loginUserData.toString());
      props.navigation.navigate('OtpVerification', {
        userId: loginUserData,
        userName: state.username,
      });
    } else if (
      (typeof loginUserData === 'string' ||
        typeof loginUserData === 'boolean') &&
      loginUserData.length
    ) {
      dispatch(loginActions.emptyLoginData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'أنت غير متصل بالإنترنت',
      });
    }
  }, [dispatch, loginUserData, props.navigation, state.username]);

  const onChangeText = (value, type) => {
    let { username, password, mobileNumber } = state;
    if (type === 'username') {
      username = value;
    } else if (type === 'password') {
      password = value;
    } else {
      mobileNumber = value;
    }
    setState({ ...state, username, password, mobileNumber });
  };
  const login = async () => {
    let { username, password, loginwith } = state;
    if (loginwith === 'number') {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'هذه الخدمة غير متوفرة',
      });
    } else {
      if (!username) {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'الرجاء إدخال اسم المستخدم',
        });
      } else if (!password) {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'الرجاء إدخال كلمة السر',
        });
      } else {
        let data = {
          username: username,
          password: password,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(loginActions.loginUser(data));
        // dispatch(loadingAction.commonLoader(true));
      }
    }
  };

  const filter = (text) => {
    const arr = [];
    filterRememberedList.forEach((el) => {
      if (el.includes(text)) {
        arr.push(el);
      }
    });
    setFilterRememberList(arr);
  };
  const renderRemmemberedList = () => {
    return (
      <View
        style={[
          styles.remmemberList,
          {
            bottom:
              Platform.OS == 'android'
                ? isKeyboardVisible
                  ? Dimensions.get('window').height * 0.0
                  : Dimensions.get('window').height * 0.3
                : Dimensions.get('window').height * 0.43,
          },
        ]}
      >
        {filterRememberedList.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setState({
                  ...state,
                  username: item,
                });
                setShowList(false);
              }}
            >
              <Text style={styles.rememberLabel}>{item}</Text>
            </TouchableOpacity>
          );
        })}
        <Icon
          name={'x-circle'}
          size={14}
          color="red"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onPress={() => setShowList(false)}
        />
      </View>
    );
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
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
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
              <View style={styles.topTextContainer}>
                <Text style={styles.topText1}>موظفي منشآت</Text>
                <Text style={styles.topText2}>
                  أهلاً بكم، الرجاء تسجيل الدخول{' '}
                </Text>
              </View>
              {state.loginwith === 'username' ? (
                <View style={styles.container2}>
                  <View
                    style={[styles.inputContainer, { marginBottom: hp('2%') }]}
                  >
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={styles.input}
                      placeholder="اسم المستخدم"
                      placeholderTextColor="#99B4C8"
                      changeText={(e) => {
                        onChangeText(e.toLowerCase(), 'username');
                        if(state.isChecked){
                          AsyncStorage.removeItem('@RemmemberName')
                          setState({
                            ...state,
                            isChecked: !state.isChecked,
                          });
                        }
                        // if (e.length > 0) filter(e.toLowerCase());
                        // else setFilterRememberList(rememberedList);
                      }}
                      value={state.username}
                      keyboardType={
                        Platform.OS === 'android' ? 'visible-password' : ''
                      }
                      secureText={false}
                      onFocus={() => setShowList(true)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <View
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: 8,
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        zIndex: 99,
                      }}
                    >
                      <Icon
                        name={state.showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="grey"
                        style={{ marginLeft: wp('3%'), padding: 5 }}
                        onPress={() =>
                          setState({
                            ...state,
                            showPassword: !state.showPassword,
                          })
                        }
                      />
                    </View>
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={styles.input}
                      placeholder="كلمة المرور"
                      placeholderTextColor="#99B4C8"
                      changeText={(e) => onChangeText(e, 'password')}
                      value={state.password}
                      secureText={!state.showPassword}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.container2}>
                  <View
                    style={[styles.inputContainer, { marginBottom: hp('2%') }]}
                  >
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={styles.input}
                      placeholder="رقم الهاتف المحمول"
                      changeText={(e) => onChangeText(e, 'mobileNumber')}
                      value={state.mobileNumber}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <View style={{ flex: 1 }}>
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={styles.input}
                        placeholder="كلمة المرور"
                        changeText={(e) => onChangeText(e, 'password')}
                        value={state.password}
                        secureText={!state.showPassword}
                      />
                    </View>
                  </View>
                </View>
              )}
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={styles.checkText}>تذكر إسم المستخدم</Text>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={async () => {
                   
                    if (state.username) {
                      setState({
                        ...state,
                        isChecked: !state.isChecked,
                      });
                      setShowList(false);
                      if(state.isChecked){
                        AsyncStorage.removeItem('@RemmemberName')
                      }else{
                        try {
                          await AsyncStorage.setItem(
                            '@RemmemberName',
                            state.username,
                          );
                        } catch (error) {
                        }
                      }
                        

                      // if (rememberedList.includes(state.username)) {
                      //   const index = rememberedList.indexOf(state.username);
                      //   rememberedList.splice(index, 1); // 2nd parameter means remove one item only
                      // } else {
                      //   if (!rememberedList.includes(state.username)) {
                      //     rememberedList.push(state.username);
                      //     setRememberList((rememberedList) => [
                      //       state.username,
                      //       ...rememberedList,
                      //     ]);
                      //   }
                      //   console.log('RemmembersList ss', rememberedList);
                      //   try {
                      //     await AsyncStorage.setItem(
                      //       '@RemmembersList',
                      //       JSON.stringify(rememberedList),
                      //     );
                      //   } catch (error) {
                      //   }
                      // }
                    }
                  }}
                >
                  {state.isChecked ? (
                    <View style={styles.checkboxContainer2} />
                  ) : null}
                  {/* <Checkbox.IOS
                    status={state.isChecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setState({
                        ...state,
                        isChecked: !state.isChecked,
                      });
                    }}
                    color={'#007598'}
                  /> */}
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.loginBtn} onPress={login}>
                  <Text style={styles.loginBtnText}>تسجيل دخول</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ForgetPassword');
                }}
              >
                <Text style={styles.forgetText}>لا يمكن الدخول إلى حسابى</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginHorizontal: '8%',
              marginTop:
                Platform.OS == 'ios'
                  ? Dimensions.get('window').height * 0.15
                  : Dimensions.get('window').height * 0.08,
              // position: 'absolute',
              // right: '8%',
              // bottom: '6%',
            }}
          >
            <Text style={{ color: '#007297' }}>
              v 1.0.94 {baseUrl !== 'https://me.monshaat.gov.sa' && 'staging'}
            </Text>
          </View>
        </KeyboardAwareScrollView>
        {/* {showList &&
        rememberedList.length > 0 &&
        filterRememberedList.length > 0
          ? renderRemmemberedList()
          : null} */}
        {isLoading ? <Loader /> : null}
      </ImageBackground>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
  container1: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  loginWithBtns: {
    width: '50%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: hp('1.4%'),
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    height: height * 0.063,
    justifyContent: 'center',
  },
  input: {
    paddingRight: wp('4%'),
    // paddingVertical: hp('2%'),
    width: '100%',
    height: '100%',
    borderRadius: 10,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.75%'),
  },
  loginBtn: {
    borderRadius: 10,
    width: '100%',
    paddingVertical: hp('1.5%'),
    backgroundColor: '#007297',
    marginTop: 10,
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },

  container2: {
    marginBottom: hp('2%'),
    marginTop: hp('8%'),
  },
  topTextContainer: {
    alignItems: 'center',
  },
  topText1: {
    fontSize: 18,
    color: '#007297',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
  },
  topText2: {
    fontSize: 18,
    color: '#687D8D',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
  },
  checkboxContainer: {
    width: Dimensions.get('window').width * 0.06,
    height: Dimensions.get('window').width * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  checkboxContainer2: {
    width: Dimensions.get('window').width * 0.04,
    height: Dimensions.get('window').width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007598',
    borderRadius: 3,
  },
  checkText: {
    color: '#007297',
    textAlign: 'right',
    fontFamily: '29LTAzer-Medium',
    fontSize: 14,
    flex: 1,
    marginHorizontal: 8,
  },
  forgetText: {
    color: '#007297',
    textAlign: 'center',
    fontFamily: '29LTAzer-Medium',
    fontSize: 14,
    flex: 1,
    marginTop: Dimensions.get('window').height * 0.05,
  },
  remmemberList: {
    padding: '4%',
    paddingTop: 3,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 8,
    alignSelf: 'center',
    borderColor: '#d5e6ed',
    borderWidth: 1,
  },
  rememberLabel: {
    color: '#007297',
    textAlign: 'center',
    fontFamily: '29LTAzer-Medium',
    fontSize: 15,
    marginVertical: Platform.OS == 'ios' ? 2 : 0,
  },
});
