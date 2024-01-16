import AsyncStorage from '@react-native-community/async-storage';
import CameraRoll from '@react-native-community/cameraroll';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // Share,
} from 'react-native';
import * as Contacts from 'react-native-contacts';
import { showMessage } from 'react-native-flash-message';
import * as rnfs from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import vCard from 'react-native-vcards';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import * as profileAction from '../../redux/action/profileAction';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import TabNav from '../../components/TabNavigator';
import MyDepartmentStaff from './MyDepartmentStaff';
const HitSlope = {
  bottom: 100,
  right: 100,
  left: 100,
};

const ManagerProfile = (props) => {
  const [dataJob, setDataJob] = useState([]);
  const viewRef = useRef();
  const [state, setState] = useState({
    profileData: {},
    imageLoading: true,
    comeFrom: '',
    isEnglish: false,
    activeIndex: 0,
    disabled: false,
    activeTab: 'myData',
    activeTab2: 'arabic',
  });
  const [showQrCode, setShowQrCode] = useState(false);

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const profileLoading = useSelector((state) => state.ProfileReducer.isLoading);
  const localUser = useSelector(
    (state) => state.ProfileReducer.userProfileData[0],
  );
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Profile_Screen');
    }
  }, [isFocused]);

  const onPullToRefresh = () => {
    if (accessToken !== null) {
      AsyncStorage.getItem('userid').then(async (data1) => {
        let data = {
          id: data1,
          accessToken: accessToken,
        };
        dispatch(profileAction.getProfileData(data));
      });
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.profileData) {
        item = props.route.params.profileData;
        console.log('saadadadadad', item);
        setState({
          ...state,
          profileData: item,
          comeFrom: 'loogeduser',
          imageLoading: true,
        });
      } else {
      }
    });
    AsyncStorage.getItem('empID').then(async (data1) => {
      let mUrl = `${baseUrl}/api/search_read?model=hr.employee&domain=[["id","=",${data1}]]&fields=["job_english_name"]`;
      // console.log('URL', mUrl);
      fetch(mUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDataJob(data);
        });
    });
    return unsubscribe;
  }, [props.navigation, accessToken]);

  useEffect(() => {
    if (state.comeFrom === 'loogeduser' && localUser) {
      // console.log('localUser', localUser);
      setState({
        ...state,
        profileData: localUser,
      });
    }
  }, [localUser]);

  const getManagerProfile = async () => {
    setState({ ...state, disabled: true });

    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["id", "=", ${state.profileData.parent_id[0]}]]&fields=
        ["attendance_state","replace_employee_id","department_id","administration_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","role","emp_state","image","sector","department_global_id","dept","management"]
      `,
    );
    // console.log('URL44', secretUrl);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.length) {
          dispatch({ type: 'COMMON_LOADER', value: false });
          props.navigation.push('ManagerProfile', {
            profileData: responseData[0],
          });
        } else {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: 'التفاصيل غير موجودة',
          });
          dispatch({ type: 'COMMON_LOADER', value: false });
        }
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };

  const getReplacementProfile = async () => {
    dispatch({ type: 'COMMON_LOADER', value: true });
    let secretUrl = await EncryptUrl(
      baseUrl +
        `/api/search_read?model=hr.employee&domain=[["id", "=", ${state.profileData.replace_employee_id[0]}]]&fields=
        ["attendance_state","administration_id","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","role","emp_state","image","sector","department_global_id","dept","management"]
      `,
    );
    // console.log('url555555', secretUrl);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.length) {
          dispatch({ type: 'COMMON_LOADER', value: false });
          props.navigation.push('Profile', {
            profileData: responseData[0],
          });
        } else {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: 'التفاصيل غير موجودة',
          });
          dispatch({ type: 'COMMON_LOADER', value: false });
        }
      })
      .catch((_err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };

  if (!state.profileData) {
    return null;
  }
  let profileData = state.profileData;
  let deptDet = profileData.department_id
    ? profileData.department_id[1]
    : '-/-/-';
  let deptDetArr = deptDet.split('/');
  profileData.management = deptDetArr[1];
  profileData.dept = deptDetArr[2];
  profileData.sector = deptDetArr[0];

  function shareVcard() {
    // console.log('Dattaa', profileData);
    // console.log('HomeAdressID', profileData.address_home_id);
    if (profileData) {
      let contact = vCard();
      //set properties

      contact.firstName = profileData.complete_name;
      // + " | " + profileData.english_name;

      contact.workPhone = profileData.work_phone
        ? '+96611834' + profileData.work_phone
        : '';
      contact.cellPhone = profileData.mobile_phone
        ? profileData.mobile_phone
        : '';
      contact.workEmail = profileData.work_email ? profileData.work_email : '';
      contact.title =
        profileData.job_id && profileData.job_id.length
          ? profileData.job_id[1]
          : '';
      contact.jobTitle = profileData.job_id[1];
      contact.homeAddress =
        (profileData.address_home_id ? profileData.address_home_id[1] : '') +
        (profileData.address_id ? profileData.address_id[1] : '');
      const documentPath = rnfs.DocumentDirectoryPath;
      contact
        .saveToFile(documentPath + '/' + profileData.complete_name + '.vcf')
        .then((res) => {
          Share.open({
            title: 'Save contact details',
            url:
              'file://' +
              documentPath +
              '/' +
              profileData.complete_name +
              '.vcf',
            type: 'text/x-vcalendar',
            subject: profileData.complete_name,
          });
        })
        .catch((err) => {});
    }
  }

  function saveContact() {
    checkMultiple([
      PERMISSIONS.ANDROID.WRITE_CONTACTS,
      PERMISSIONS.ANDROID.READ_CONTACTS,
      PERMISSIONS.IOS.CONTACTS,
    ]).then((statuses) => {
      if (
        (statuses[PERMISSIONS.ANDROID.WRITE_CONTACTS] === RESULTS.GRANTED &&
          statuses[PERMISSIONS.ANDROID.READ_CONTACTS] === RESULTS.GRANTED) ||
        statuses[PERMISSIONS.IOS.CONTACTS] === RESULTS.GRANTED
      ) {
        processSaveContact();
      } else {
        requestMultiple([
          PERMISSIONS.ANDROID.WRITE_CONTACTS,
          PERMISSIONS.ANDROID.READ_CONTACTS,
          PERMISSIONS.IOS.CONTACTS,
        ]).then((statuses) => {
          if (
            (statuses[PERMISSIONS.ANDROID.WRITE_CONTACTS] === RESULTS.GRANTED &&
              statuses[PERMISSIONS.ANDROID.READ_CONTACTS] ===
                RESULTS.GRANTED) ||
            statuses[PERMISSIONS.IOS.CONTACTS] === RESULTS.GRANTED
          ) {
            processSaveContact();
          } else {
            showMessage({
              style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
              type: 'danger',
              message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
            });
          }
        });
      }
    });
  }

  function processSaveContact() {
    try {
      // console.log('ProfileData1111', profileData.sector_id[1]);

      // console.log('ProfileData', profileData);
      if (profileData) {
        let newPerson = {
          emailAddresses: [
            {
              label: 'work',
              email: profileData.work_email ? profileData.work_email : '',
            },
          ],
          street: 'KSA',
          phoneNumbers: [
            {
              label: 'work',
              number: profileData.work_phone
                ? '+96611834' + profileData.work_phone
                : '',
            },
            {
              label: 'mobile',
              number: profileData.mobile_phone ? profileData.mobile_phone : '',
            },
          ],

          givenName: profileData.complete_name ? profileData.complete_name : '',
          // profileData.complete_name + " | " + profileData.english_name,
          // formattedName:
          //   profileData.complete_name + " | " + profileData.english_name,

          // organization: profileData.sector_id[1] ? profileData.sector_id[1] : "",

          jobTitle: profileData.job_id[1],
          // department: profileData.department_id
          //   ? profileData.department_id[1]
          //   : "",
          homeAddress:
            (profileData.address_home_id
              ? profileData.address_home_id[1]
              : '') + (profileData.address_id ? profileData.address_id[1] : ''),
          // postalAddresses: [
          //   {
          //     label: "home",
          //     formattedAddress:
          //       (profileData.address_home_id
          //         ? profileData.address_home_id[1]
          //         : "") +
          //       (profileData.address_id
          //         ? profileData.address_home_id
          //           ? ", " + profileData.address_id[1]
          //           : profileData.address_id[1]
          //         : ""),
          //   },
          // ],
        };

        Contacts.addContact(newPerson)
          .then((res) => {
            showMessage({
              style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
              type: 'success',
              message: 'تم حفظ جهة الإتصال في دليل الهاتف',
            });
          })
          .catch((err) => {
            showMessage({
              style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
              type: 'danger',
              message: 'تعذر حفظ جهة الاتصال',
            });
          });
      }
    } catch (e) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
      });
    }
  }
  // console.log('profileData', profileData);
  const firstName =
    profileData &&
    profileData.english_name &&
    profileData.english_name.split(' ').slice(0, -3).join(' ');
  // console.log('First name', firstName);
  const lastName =
    profileData &&
    profileData.english_name &&
    profileData.english_name.split(' ').slice(-1).join(' ');

  const name =
    state.isEnglish == false
      ? profileData && profileData.name
      : encodeURIComponent(firstName);
  // profileData && profileData.english_name;

  let NameToshow = !state.isEnglish
    ? profileData.complete_name
    : profileData.english_name;
  const lastNameArOrEn =
    state.isEnglish == false
      ? profileData && profileData.family_name
      : encodeURIComponent(lastName);
  const postition =
    dataJob && state.isEnglish == false
      ? profileData.job_id && profileData.job_id.length
        ? profileData.job_id[1]
        : null
      : dataJob && dataJob[0]?.job_english_name;
  // console.log('wanted-position', postition);
  const organisation = false
    ? NameToshow
    : state.isEnglish
    ? 'Monshaat'
    : 'منشآت';
  const qrCode =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    'FN:' +
    NameToshow +
    '\n' +
    'N:' + //Name
    // name +
    // "\n" +
    NameToshow +
    // profileData.family_name +
    '\n' + // retour à la ligne
    'ORG:' +
    organisation +
    '\n' + // Organisation
    'TITLE:' + // Title
    postition +
    '\n' + // retour à la ligne
    'ADR:;;;;;;Saudi Arabia\n' + // adresse
    'TEL;WORK;VOICE:' + // telephone / type WORK/ VOICE
    (profileData.work_phone ? '+96611834' + profileData.work_phone : '') +
    '\n' +
    'TEL;CELL:' + // numéro mobile TEL;Cell
    (profileData.mobile_phone ? profileData.mobile_phone : '') +
    '\n' +
    'TEL;FAX:\n' + // Numéro Fax
    'EMAIL;WORK;INTERNET:' + // email ; type work ; internet
    profileData.work_email +
    '\n' +
    'URL:\n' + // URL du site ou de n'importe quoi
    'END:VCARD\n'; // fin de la card de nouveau contact
  let qrCodeEncoded =
    Platform.OS === 'ios' ? qrCode : encodeURIComponent(qrCode);

  let qrCodeImage =
    'https://chart.googleapis.com/chart?cht=qr&chl=' +
    qrCodeEncoded +
    `&chs=${state.isEnglish ? '285' : '500'}&choe=UTF-8&chld=L|2`;
  // let qrCodeImage =
  // "https://chart.googleapis.com/chart?cht=qr&chl=" +
  // qrCodeEncoded +
  // "&chs=250x250&choe=UTF-8&chld=L|2";
  async function hasAndroidPermission() {
    const permission = [
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    const hasPermission = await PermissionsAndroid.checkMultiple(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.requestMultiple(permission);
    return status === 'granted';
  }
  async function saveQr() {
    // if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    //   return;
    // }
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.8,
    });

    CameraRoll.save(uri)
      .then((res) => {
        //console.log("res", res);
        if (res.length) {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'success',
            message: 'تم حفظ جهة الاتصال في ملف الصور',
          });
        } else {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: 'تعذر حفظ جهة الاتصال',
          });
        }
      })
      .catch((e) => {
        //console.log("erorr", e);
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
        });
      });
  }

  const shareImage = async () => {
    try {
      // capture component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      // share
      const shareResponse = await Share.open({ url: uri });
      // Share.share({
      //   message: Platform.OS == 'android' ? uri : '',
      //   url: Platform.OS == 'ios' ? uri : '',
      // });
    } catch (error) {
      //console.log("error", error);
    }
  };

  return (
    <View style={{ width: '100%', height: Dimensions.get('window').height }}>
      <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
        <NewHeader
          {...props}
          title={
            state.comeFrom === 'loogeduser' ? 'ملفي' : profileData.complete_name
          }
          back
        />

        <View style={{ marginTop: 15 }}>
          <RefreshContainer
            refresh={profileLoading}
            // onPullToRefresh={onPullToRefresh}
          >
            {Object.keys(profileData).length ? (
              <View style={styles.cardContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      height: '90%',
                      width: '100%',
                    }}
                  >
                    <View style={styles.avilabilityContainer}>
                      <View style={AppStyle.employeeStatusContainer}>
                        <View
                          style={[
                            AppStyle.employeeStatus,
                            {
                              backgroundColor:
                                profileData.attendance_state === 'onduty'
                                  ? '#D2E7FF'
                                  : profileData.attendance_state === 'holidays'
                                  ? '#ffe9e9'
                                  : profileData.attendance_state ===
                                    'deputation'
                                  ? '#ffeed3'
                                  : profileData.attendance_state === 'training'
                                  ? '#e9f4f8'
                                  : profileData.attendance_state ===
                                    'distance_work'
                                  ? '#ebffd8'
                                  : profileData.attendance_state === 'absence'
                                  ? '#ffe9e9'
                                  : profileData.attendance_state ===
                                    'authorization'
                                  ? '#ffe9e9'
                                  : '',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              AppStyle.h3,
                              {
                                color: '#4B4B4B',
                                fontFamily: '29LTAzer-Regular',
                                fontSize: hp('1.2%'),
                                textAlign: 'center',
                                width: '100%',
                              },
                            ]}
                            numberOfLines={2}
                          >
                            {profileData.attendance_state === 'onduty'
                              ? 'متواجد'
                              : profileData.attendance_state === 'holidays'
                              ? 'اجازة'
                              : profileData.attendance_state === 'deputation'
                              ? 'انتداب'
                              : profileData.attendance_state === 'training'
                              ? 'تدريب'
                              : profileData.attendance_state === 'distance_work'
                              ? 'عمل عن بعد'
                              : profileData.attendance_state === 'absence'
                              ? 'غياب'
                              : profileData.attendance_state === 'authorization'
                              ? 'استئذان'
                              : ''}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => setShowQrCode(true)}>
                        <Image
                          source={require('../../assets/images/Group80.png')}
                          style={{ width: 20, height: 20 }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                      <View style={styles.profileDetailsContainer}>
                        <View style={AppStyle.employeeDetailsContainer}>
                          <View>
                            {profileData.image ? (
                              <Image
                                source={{
                                  uri: `data:image/jpeg;base64,${profileData.image}`,
                                }}
                                style={AppStyle.employeeImage}
                                resizeMode="cover"
                                onError={() =>
                                  setState({ ...state, imageLoading: false })
                                }
                              />
                            ) : (
                              <Image
                                source={require('../../assets/images/user.png')}
                                style={AppStyle.employeeImage}
                                resizeMode="cover"
                              />
                            )}
                          </View>
                          <View style={AppStyle.employeeInfo}>
                            <Text
                              selectable={true}
                              style={styles.itemMonshaatName}
                            >
                              {profileData.complete_name}
                            </Text>
                            <View
                              style={{
                                flexDirection:
                                  Platform.OS == 'android'
                                    ? 'row'
                                    : 'row-reverse',
                                alignItems: 'center',
                                marginTop: 8,
                              }}
                            >
                              <Text
                                selectable={true}
                                style={styles.itemMonshaatText}
                              >
                                {profileData.number
                                  ? `(${profileData.number})`
                                  : null}
                              </Text>
                              <Text
                                selectable={true}
                                style={styles.itemMonshaatJob}
                              >
                                {profileData.job_id
                                  ? profileData.job_id[1]
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* <Seperator style={{ marginTop: 29 }} /> */}
                    {/* <Text style={styles.label}> بيانات الموظف</Text> */}
                    <View
                      style={{
                        width: '90%',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      <View
                        style={[styles.tabContainer, { flexDirection: 'row' }]}
                      >
                        <TouchableOpacity
                          style={{ alignItems: 'center', flex: 1 }}
                          onPress={() =>
                            setState((old) => ({
                              ...state,
                              activeTab: 'myData',
                            }))
                          }
                        >
                          <Text
                            style={{
                              color:
                                state.activeTab == 'myData'
                                  ? '#2365A8'
                                  : '#A9A9A9',
                              fontFamily: '29LTAzer-Medium',
                              fontSize: hp('1.7%'),
                            }}
                          >
                            لوحة البيانات
                          </Text>
                          <View
                            style={{
                              width: '100%',
                              marginTop: 5,
                              height: state.activeTab == 'myData' ? 3 : 1,
                              backgroundColor:
                                state.activeTab == 'myData'
                                  ? '#2365A8'
                                  : 'gray',
                            }}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ alignItems: 'center', flex: 1 }}
                          onPress={() => {
                            setState((old) => ({
                              ...state,
                              activeTab: 'MyDepartmentStaff',
                            }));
                          }}
                        >
                          <Text
                            style={{
                              color:
                                state.activeTab == 'MyDepartmentStaff'
                                  ? '#007598'
                                  : '#A9A9A9',
                              fontFamily: '29LTAzer-Medium',
                              fontSize: hp('1.7%'),
                            }}
                          >
                            موظفى الإدارة
                          </Text>
                          <View
                            style={{
                              width: '100%',
                              marginTop: 5,
                              height:
                                state.activeTab == 'MyDepartmentStaff' ? 3 : 1,
                              backgroundColor:
                                state.activeTab == 'MyDepartmentStaff'
                                  ? '#007598'
                                  : '#A9A9A9',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {state.activeTab == 'myData' ? (
                      <View style={{ alignItems: 'center' }}>
                        <View style={{ marginTop: 10 }}>
                          <View style={styles.section}>
                            <View style={styles.iconsContainer}>
                              <TouchableOpacity
                                style={styles.qrIconContainer}
                                onPress={() => saveContact()}
                              >
                                <Image
                                  resizeMode="contain"
                                  style={styles.icon}
                                  source={require('../../assets/images/download.png')}
                                />
                              </TouchableOpacity>

                              {localUser && (
                                <TouchableOpacity
                                  style={styles.qrIconContainer}
                                  onPress={() =>
                                    profileData.id != localUser.id
                                      ? props.navigation.navigate(
                                          'MessagesFeed',
                                          {
                                            correspondant: profileData,
                                            type: 'community',
                                          },
                                        )
                                      : showMessage({
                                          style: { alignItems: 'flex-end' },
                                          type: 'danger',
                                          message:
                                            'لايمكن بدء المحادثة لكونها مع نفس المستخدم',
                                        })
                                  }
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={
                                      profileData.id != localUser.id
                                        ? styles.icon
                                        : styles.disabledIcon
                                    }
                                    source={require('../../assets/images/chat_new.png')}
                                  />
                                </TouchableOpacity>
                              )}

                              <TouchableOpacity
                                style={styles.qrIconContainer}
                                onPress={shareVcard}
                              >
                                <Image
                                  resizeMode="contain"
                                  style={styles.icon}
                                  source={require('../../assets/images/share.png')}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.qrIconContainer}
                                onPress={() => {
                                  Linking.openURL(
                                    `mailto:${profileData.work_email}`,
                                  );
                                }}
                              >
                                <Image
                                  resizeMode="contain"
                                  style={styles.icon}
                                  source={require('../../assets/images/email.png')}
                                />
                              </TouchableOpacity>
                              {profileData.work_phone ? (
                                <TouchableOpacity
                                  style={styles.qrIconContainer}
                                  onPress={() => {
                                    Linking.openURL(
                                      `tel:+96611834${profileData.work_phone}`,
                                    );
                                  }}
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={styles.icon}
                                    source={require('../../assets/images/phone.png')}
                                  />
                                </TouchableOpacity>
                              ) : null}

                              <TouchableOpacity
                                style={styles.qrIconContainer}
                                onPress={() =>
                                  Linking.openURL(
                                    `tel:${profileData.mobile_phone}`,
                                  )
                                }
                              >
                                <Image
                                  resizeMode="contain"
                                  style={{ width: 13, height: 21 }}
                                  source={require('../../assets/images/iphone.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Seperator />
                        </View>
                        <View
                          style={[styles.section, { flexDirection: 'column' }]}
                        >
                          <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() =>
                              Linking.openURL(`tel:${profileData.mobile_phone}`)
                            }
                          >
                            <Text selectable={true} style={styles.itemText}>
                              {profileData.mobile_phone}
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group10.png')}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() => {
                              Linking.openURL(
                                `mailto:${profileData.work_email}`,
                              );
                            }}
                          >
                            <Text selectable={true} style={styles.itemText}>
                              {profileData.work_email}
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group12.png')}
                            />
                          </TouchableOpacity>

                          {
                            <TouchableOpacity
                              style={styles.itemContainer}
                              onPress={() => {
                                Linking.openURL(
                                  `tel:+96611834${profileData.work_phone}`,
                                );
                              }}
                            >
                              <Text selectable={true} style={styles.itemText}>
                                {profileData.work_phone
                                  ? Platform.OS == 'android'
                                    ? '+96611834' + profileData.work_phone
                                    : '96611834' + profileData.work_phone + '+'
                                  : '--'}
                              </Text>
                              <Image
                                resizeMode="contain"
                                style={styles.icon}
                                source={require('../../assets/images/Group11.png')}
                              />
                            </TouchableOpacity>
                          }
                        </View>
                        <Seperator />
                        <View
                          style={[styles.section, { flexDirection: 'column' }]}
                        >
                          <View style={styles.itemContainer}>
                            <Text selectable={true} style={styles.itemText2}>
                              {profileData.sector ? profileData.sector : '--'}
                            </Text>
                            {/* <Text selectable={true} style={styles.itemText2}>
                          القطاع
                        </Text> */}
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 5 },
                              ]}
                            >
                              قطاع
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group42.png')}
                            />
                          </View>
                          <View style={styles.itemContainer}>
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 0 },
                              ]}
                            >
                              {profileData.department_global_id
                                ? profileData.department_global_id
                                    .toString()
                                    .replace(/[0-9]/g, '')
                                    .replace(/,/g, '')
                                    .split('/')[1]
                                : '--'}
                            </Text>
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 5 },
                              ]}
                            >
                              الإدارة العامة
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group41.png')}
                            />
                          </View>
                          <View style={styles.itemContainer}>
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 0 },
                              ]}
                            >
                              {profileData.department_id
                                ? profileData.department_id
                                    .toString()
                                    .replace(/[0-9]/g, '')
                                    .replace(/,/g, '')
                                    .split('/')[2]
                                : '--'}
                            </Text>

                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 5 },
                              ]}
                            >
                              الإدارة
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group41.png')}
                            />
                          </View>

                          <View style={styles.itemContainer}>
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 0 },
                              ]}
                            >
                              {profileData.department_id
                                ? profileData.department_id
                                    .toString()
                                    .replace(/[0-9]/g, '')
                                    .replace(/,/g, '')
                                    .split('/')[3]
                                : '--'}
                            </Text>
                            <Text
                              selectable={true}
                              style={[
                                styles.itemText2,
                                { marginHorizontal: 5 },
                              ]}
                            >
                              القسم
                            </Text>
                            <Image
                              resizeMode="contain"
                              style={styles.icon}
                              source={require('../../assets/images/Group42.png')}
                            />
                          </View>
                          {profileData.replace_employee_id ? (
                            <TouchableOpacity onPress={getReplacementProfile}>
                              <View style={styles.itemContainer}>
                                {/* <Image
                              resizeMode="contain"
                              style={[
                                styles.icon,
                                { position: 'absolute', left: -5 },
                              ]}
                              source={require('../../assets/images/left.png')}
                            /> */}
                                <Text
                                  selectable={true}
                                  style={styles.itemText2}
                                >
                                  {
                                    profileData.replace_employee_id[1].split(
                                      ']',
                                    )[1]
                                  }
                                </Text>

                                <Text
                                  selectable={true}
                                  style={[
                                    styles.itemText2,
                                    { marginHorizontal: 5 },
                                  ]}
                                >
                                  الموظف البديل
                                </Text>
                                <Image
                                  resizeMode="contain"
                                  style={styles.icon}
                                  source={require('../../assets/images/Group13.png')}
                                />
                              </View>
                            </TouchableOpacity>
                          ) : null}
                          {profileData.number !== '1200' &&
                          profileData.number !== '1316' &&
                          profileData.parent_id ? (
                            <TouchableOpacity
                              disabled={state.disabled}
                              onPress={getManagerProfile}
                            >
                              <View style={styles.itemContainer}>
                                <Image
                                  resizeMode="contain"
                                  style={[
                                    styles.icon,
                                    { position: 'absolute', left: 5 },
                                  ]}
                                  source={require('../../assets/images/left.png')}
                                />
                                <Text
                                  selectable={true}
                                  style={styles.itemText2}
                                >
                                  {profileData.parent_id[1].split(']')[1]}
                                </Text>
                                <Text
                                  selectable={true}
                                  style={[
                                    styles.itemText2,
                                    { marginHorizontal: 5 },
                                  ]}
                                >
                                  المدير المباشر
                                </Text>
                                <Image
                                  resizeMode="contain"
                                  style={styles.icon}
                                  source={require('../../assets/images/Group13.png')}
                                />
                              </View>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    ) : (
                      // <></>
                      <MyDepartmentStaff
                        userID={state.profileData.id}
                        managerID={state.profileData.parent_id[0]}
                        departmentID={state.profileData.department_id[0]}
                        name={profileData.complete_name.split(' ')[0]}
                        navigation={props.navigation}
                      />
                    )}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <CustomActivityIndicator
                modalVisible={true}
              ></CustomActivityIndicator>
            )}
          </RefreshContainer>
        </View>
        {isLoading ? <Loader /> : null}
      </LinearGradient>
      {showQrCode ? (
        <View style={styles.qrIconContainer1}>
          {state.comeFrom === 'loogeduser' && (
            <>
              <View
                style={[
                  // styles.section,
                  {
                    // justifyContent: 'center',
                    flexDirection: 'column',
                  },
                ]}
              >
                <View
                  style={[styles.tabContainer, { backgroundColor: '#fff' }]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => setShowQrCode(false)}>
                      <Text style={[styles.title, { fontSize: 25 }]}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>مسح رمز الإستجابة السريعة</Text>
                  </View>
                  <TabNav
                    label1="English version"
                    label2="النسخة العربية"
                    onNavChange={(v) => {
                      setState((old) => ({
                        ...state,
                        activeTab2: v == 0 ? 'arabic' : 'english',
                        isEnglish: v == 0 ? false : true,
                      }));
                    }}
                  />
                </View>
                <View style={styles.qrIconContainer2}>
                  <ViewShot
                    ref={viewRef}
                    options={{ format: 'jpg', quality: 0.9 }}
                  >
                    <Image
                      source={{
                        uri: qrCodeImage,
                      }}
                      style={{
                        alignSelf: 'center',
                        width: 250,
                        height: 250,

                        // flex: 1,
                      }}
                      resizeMode="cover"
                    />
                  </ViewShot>

                  <View style={styles.shareQrContainer}>
                    <TouchableOpacity
                      onPress={saveQr}
                      style={styles.shareQrItem}
                    >
                      <Text style={styles.shareQrItemText}>
                        {state.activeTab2 == 'arabic'
                          ? 'تحميل الرمز'
                          : 'Download Code'}
                      </Text>
                      <View style={styles.shareQrItemImage}>
                        <Image
                          source={require('../../assets/images/download.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={shareImage}
                      style={styles.shareQrItem}
                    >
                      <Text style={styles.shareQrItemText}>
                        {state.activeTab2 == 'arabic'
                          ? 'مشاركة الرمز'
                          : 'Share Code'}
                      </Text>
                      <View style={styles.shareQrItemImage}>
                        <Image
                          source={require('../../assets/images/share.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ height: 120 }} />
              </View>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
};
export default ManagerProfile;

const Seperator = ({ style }) => (
  <View style={[styles.seperator, style]}></View>
);
const styles = StyleSheet.create({
  personalDataMainContainer: {
    // height: 200,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: hp('2%'),
  },
  personalDataInnerContainer: {
    height: 50,
    // backgroundColor: "#007598",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImageContainer: {
    width: '60%',
    alignItems: 'center',
    position: 'absolute',
    left: '20%',
    paddingVertical: hp('2%'),
  },
  statusQrContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  qrIconContainer: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  qrIconContainer1: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignContent: 'center',
    position: 'absolute',
    top: 0,
    backgroundColor: '#d5e6ed',
  },
  qrIconContainer2: {
    width: '80%',
    height: '55%',
    backgroundColor: '#FFF',
    elevation: 5,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconsContainer: {
    flexDirection: 'row',
    // paddingVertical: hp("2%"),
    width: '100%',
    justifyContent: 'space-around',
  },
  contactDetailContainer: {
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    paddingVertical: hp('1.5%'),
  },
  employeeStatusContainer: {
    width: 96,
    padding: 8,
    alignItems: 'center',
  },
  employeeStatus: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5CB46680',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginVertical: 4,
  },
  h3: {
    fontSize: hp('1.3%'),
    color: '#222222',
    fontFamily: '29LTAzer-Regular',

    // fontFamily: '',
  },
  cardContainer: {
    backgroundColor: '#fff',
    width: '93%',
    height: Dimensions.get('window').height * 0.8,
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    marginBottom: 2,
    paddingTop: 7,
  },
  section: {
    width: '90%',
    padding: 10,
    // height: 200,
    // paddingVertical: 5,
    width: '100%',
    flexDirection: 'row',
  },
  avilabilityContainer: {
    // width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetailsContainer: {
    width: '100%',
    height: '100%',
  },
  itemMonshaatText: {
    color: '#4B4B4B',
    fontSize: hp('1%'),
    paddingVertical: 3,
    marginHorizontal: 4,
    fontFamily: '29LTAzer-Regular',
  },
  itemMonshaatName: {
    color: '#4B4B4B',
    fontSize: hp('2%'),
    fontFamily: '29LTAzer-Medium',
    paddingVertical: 3,
  },
  itemMonshaatJob: {
    color: '#4B4B4B',
    fontSize: hp('1.6%'),
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
  },
  seperator: {
    width: '80%',
    height: 1,
    backgroundColor: '#dbdbdb',
    alignSelf: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  disabledIcon: {
    width: 20,
    height: 20,
    tintColor: '#d9d9d9',
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  itemText: {
    marginHorizontal: 7,
    color: '#4B4B4B',
    fontSize: hp('2%'),
    writingDirection: 'rtl',
    fontFamily: '29LTAzer-Medium',
  },
  itemText2: {
    marginHorizontal: 2,
    color: '#4B4B4B',
    fontSize: hp('2%'),
    writingDirection: 'rtl',
    fontFamily: '29LTAzer-Medium',
  },
  shareQrContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  shareQrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareQrItemText: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    fontFamily: '29LTAzer-Regular',
  },
  shareQrItemImage: {
    // backgroundColor: 'white',
    padding: 10,
    // marginHorizontal: 10,
    // borderRadius: 50,
    // overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },

  btn: {
    color: '#ddd4cd',
    fontFamily: '29LTAzer-Bold',
  },
  btnActive: {
    color: '#007598',
    fontFamily: '29LTAzer-Bold',
  },
  label: {
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Bold',
    fontSize: hp('2%'),
    textAlign: 'right',
    width: '95%',
    marginTop: 10,
  },
  tabContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? '12%' : 0,
  },
  title: {
    flex: 1,
    color: '#000000',
    fontFamily: '29LTAzer-Bold',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});
