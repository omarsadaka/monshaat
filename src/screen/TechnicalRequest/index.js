import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment2 from '../../components/OrderViewAttatchment2';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as technicalAction from '../../redux/action/technicalAction';
import { baseUrl, getStatus } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import base64 from 'react-native-base64';
import RNFS from 'react-native-fs';
import { isProductionMode } from '../../services';
import { itsmBaseUrl } from '../../services';
import * as profileAction from '../../redux/action/profileAction';
import OrderDateViewItem2 from '../../components/OrderDateViewItem2';

let viewType = 'new';
let item = null;
const TechnicalRequest = (props) => {
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [id4, setId4] = useState(0);
  const [id5, setId5] = useState(0);
  const [category, setCategory] = useState([]);
  const [sub1, setSub1] = useState();
  const [category2, setCategory2] = useState([]);
  const [sub2, setSub2] = useState();
  const [category3, setCategory3] = useState([]);
  const [sub3, setSub3] = useState();
  const [category4, setCategory4] = useState([]);
  const [sub4, setSub4] = useState();
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const [state, setState] = useState({
    leaveTypeData: [],
    classificationTypeData: [],
    typeData: [],
    typeSelected: '',
    leaveSelected: '',
    startDate: '',
    endDate: '',
    duration: '',
    comments: '',
    startDateErr: '',
    endDateErr: '',
    showModal: false,
    durationErr: '',
    classificationId: -1,
    classificationSelected: '',
    typeSelectedId: -1,
    categoryData: [],
    categorySelected: '',
    categorySelectedId: -1,
    locationData: [],
    locationSelected: '',
    type: '',
    subType: '',
    priorityData: [
      {
        label: '☆☆☆',
        value: '0',
      },
      {
        label: '☆☆★',
        value: '1',
      },
      {
        label: '☆★★',
        value: '2',
      },
      {
        label: '★★★',
        value: '3',
      },
    ],
    prioritySelected: '',
    subject: '',
    arrayData: [],
    base64Data: [],
    placeholderTicket: '',
    placeholderClass: '',
    filename: [],
    description: '',
    team_id: '',
    teamList: [],
    reason: null,
    isValidated: false,
    visible1: false,
  });
  const [lastUpdate, setLastUpdate] = useState('');
  const [timelineData, setTimelineData] = useState('');
  const [item_data, setItem_data] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [attachments_loader, setAttachments_loader] = useState(false);
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const itsmToken = useSelector((state) => state.ProfileReducer.ITSMToken);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Technical_Request_Screen');
    }
    getToken();
  }, [isFocused]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ITSMTOKEN');
    const data = JSON.parse(token);
    // setItsmToken(data.accessToken);
    dispatch({
      type: 'ITSM_TOKEN',
      value: data.accessToken,
    });
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        setAttachments_loader(true);
        let url = `${itsmBaseUrl}monshaat_queryfromincidentnumber?number=${item.id}`;
        let headers = new Headers();
        headers.append(
          'Authorization',
          'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'), //M0bile@pp
        );
        fetch(url, {
          method: 'GET',
          headers: isProductionMode
            ? {
                Authorization: 'Bearer ' + itsmToken,
              }
            : headers,
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.status == 'failure') {
              dispatch(
                profileAction.getJsonWebToken(
                  accessToken,
                  userProfileData[0].work_email,
                ),
              );
              clearTimeout(timeout);
              let timeout = setTimeout(() => {
                getToken();
              }, 1000);
            }
            var arr = responseData.result;
            const data = [];
            setItem_data(arr);
            if (arr.hasOwnProperty('attachment_base64_data_1')) {
              const obj = {
                id: arr.attachment_id_1,
                name: arr.attachment_file_name_1,
                url: arr.attachment_base64_data_1,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_2')) {
              const obj = {
                id: arr.attachment_id_2,
                name: arr.attachment_file_name_2,
                url: arr.attachment_base64_data_2,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_3')) {
              const obj = {
                id: arr.attachment_id_3,
                name: arr.attachment_file_name_3,
                url: arr.attachment_base64_data_3,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_4')) {
              const obj = {
                id: arr.attachment_id_4,
                name: arr.attachment_file_name_4,
                url: arr.attachment_base64_data_4,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_5')) {
              const obj = {
                id: arr.attachment_id_5,
                name: arr.attachment_file_name_5,
                url: arr.attachment_base64_data_5,
              };
              data.push(obj);
            }
            setAttachments(data);
            setAttachments_loader(false);
          })
          .catch((err) => {
            // console.log('responseData err', err);
            setAttachments_loader(false);
          });
      }
    });
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        setState({
          ...state,
          item: item,
        });
        viewType = props.route.params.viewType;
        let url = `${itsmBaseUrl}monshaat_queryfromincidentnumber?number=${item.id}`;
        let headers = new Headers();
        headers.append(
          'Authorization',
          'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
        );
        fetch(url, {
          method: 'GET',
          headers: isProductionMode
            ? {
                Authorization: 'Bearer ' + itsmToken,
              }
            : headers,
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.status == 'failure') {
              // showMessage({
              //   style: {
              //     alignItems: 'flex-end',
              //     fontFamily: '29LTAzer-Regular',
              //   },
              //   type: 'danger',
              //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
              // });
              dispatch(loadingAction.commonLoader(true));
              dispatch(
                profileAction.getJsonWebToken(
                  accessToken,
                  userProfileData[0].work_email,
                ),
              );
              clearTimeout(timeout);
              let timeout = setTimeout(() => {
                getToken();
                dispatch(loadingAction.commonLoader(false));
                props.navigation.goBack();
              }, 3000);
            }
            setCategory(responseData.result);
          })
          .catch((err) => {
            // console.log('responseData err', err);
          });
      }

      if (props.route.params && props.route.params.subType) {
        subType = props.route.params.subType;

        setState({
          ...state,
          subType: props.route.params.subType,
        });
      }
    });

    return unsubscribe;
  }, [props.navigation, itsmToken]);

  const addFile = async () => {
    if (state.arrayData.length >= 4) {
      showMessage({
        style: {
          alignItems: 'flex-end',
          fontFamily: '29LTAzer-Regular',
        },
        type: 'danger',
        message: 'غير مسموح بأكثر من ٤ مرفقات',
      });
      return;
    }
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        let base64Data = [...state.base64Data];
        RNFS.readFile(mFile.uri, 'base64').then((result) => {
          // console.log('result.uri', result);
          base64Data.push({ base64: result });
        });
        // alert(mFile.size); //3 mb
        if (
          getFileExtention(mFile.name) == 'png' ||
          getFileExtention(mFile.name) == 'jpg' ||
          getFileExtention(mFile.name) == 'jpeg' ||
          getFileExtention(mFile.name) == 'pdf'
        ) {
          if (mFile.size <= 3000000) {
            arrayData.push(mFile);
            filename.push({ name: mFile.name });
            setState({ ...state, arrayData, filename, base64Data });
          } else {
            showMessage({
              style: {
                alignItems: 'flex-end',
                fontFamily: '29LTAzer-Regular',
              },
              type: 'danger',
              message: 'حجم الملف كبير إختر ملف أخر حجم أقصى ٣ ميجا بايتس',
            });
          }
        } else {
          showMessage({
            style: {
              alignItems: 'flex-end',
              fontFamily: '29LTAzer-Regular',
            },
            type: 'danger',
            message: 'غير قادر على رفع هذا الملف يدعم فقط الصور وملفات ال pdf.',
          });
        }
      }
    } catch (err) {
      throw err;
    }
  };
  const getFileExtention = (name) => {
    return /[.]/.exec(name) ? /[^.]+$/.exec(name) : undefined;
  };

  const removeFile = (name) => {
    if (name) {
      let arrayData = [...state.arrayData];
      let filename = [...state.filename];
      let i = filename.indexOf(name);
      if (i > -1) {
        arrayData.splice(i, 1);
        filename.splice(i, 1);
        setState({ ...state, arrayData, filename });
      }
    }
  };

  useEffect(() => {
    if (state.subject.length > 0 && sub1 && sub2) {
      setIsInActive(false);
    } else setIsInActive(true);
  }, [state, sub1, sub2, sub3, sub4]);

  const getSubCategory1 = (index, value) => {
    setCategory2([]);
    setCategory3([]);
    setCategory4([]);
    if (index) {
      let url = `${itsmBaseUrl}monshaat_query_subcategory?category_value=${value}`;
      let headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
      );
      fetch(url, {
        method: 'GET',
        headers: isProductionMode
          ? {
              Authorization: 'Bearer ' + itsmToken,
            }
          : headers,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 'failure') {
            dispatch(
              profileAction.getJsonWebToken(
                accessToken,
                userProfileData[0].work_email,
              ),
            );
            getToken();
          }
          if (responseData) setCategory2(responseData.result);
        })
        .catch((err) => {
          // console.log('responseData err', err);
        });
    }
  };
  const getSubCategory2 = (index, value) => {
    setCategory3([]);
    setCategory4([]);
    if (index) {
      let url = `${itsmBaseUrl}monshaat_query_subcategory2?subcategory_value=${value}`;
      let headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
      );
      fetch(url, {
        method: 'GET',
        headers: isProductionMode
          ? {
              Authorization: 'Bearer ' + itsmToken,
            }
          : headers,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 'failure') {
            dispatch(
              profileAction.getJsonWebToken(
                accessToken,
                userProfileData[0].work_email,
              ),
            );
            getToken();
          }
          if (responseData) setCategory3(responseData.result);
        })
        .catch((err) => {
          // console.log('responseData err', err);
        });
    }
  };
  const getSubCategory3 = (index, value) => {
    setCategory4([]);
    if (index) {
      let url = `${itsmBaseUrl}monshaat_query_subcategory3?subcategory_value2=${value}`;
      let headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
      );
      fetch(url, {
        method: 'GET',
        headers: isProductionMode
          ? {
              Authorization: 'Bearer ' + itsmToken,
              'Content-Type': 'application/json',
            }
          : headers,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 'failure') {
            dispatch(
              profileAction.getJsonWebToken(
                accessToken,
                userProfileData[0].work_email,
              ),
            );
            getToken();
          }
          if (responseData) {
            setCategory4(responseData.result);
          }
        })
        .catch((err) => {
          // console.log('responseData err', err);
        });
    }
  };

  const submitRequest = () => {
    setModal2(false);
    dispatch(loadingAction.commonLoader(true));
    let url = `${itsmBaseUrl}monshaat_incident`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    headers.append('Content-Type', 'application/json');
    fetch(url, {
      method: 'POST',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
            'Content-Type': 'application/json',
          }
        : headers,
      body: JSON.stringify({
        callerEmail: userProfileData[0].work_email,
        description: state.subject,
        shortDescription: state.subject,
        category: sub1,
        subcategory: sub2,
        subcategory2: sub3 ? sub3 : '',
        subcategory3: sub4 ? sub4 : '',
        file_name1: state.arrayData.length > 0 ? state.arrayData[0].name : '',
        payload1: state.base64Data.length > 0 ? state.base64Data[0].base64 : '',
        file_name2: state.arrayData.length > 1 ? state.arrayData[1].name : '',
        payload2: state.base64Data.length > 1 ? state.base64Data[1].base64 : '',
        file_name3: state.arrayData.length > 2 ? state.arrayData[2].name : '',
        payload3: state.base64Data.length > 2 ? state.base64Data[2].base64 : '',
        file_name4: state.arrayData.length > 3 ? state.arrayData[3].name : '',
        payload4: state.base64Data.length > 3 ? state.base64Data[3].base64 : '',
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          dispatch(loadingAction.commonLoader(true));
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
          clearTimeout(timeout);
          let timeout = setTimeout(() => {
            getToken();
            dispatch(loadingAction.commonLoader(false));
          }, 3000);
        }
        // submitAttachment(responseData.result.incident_number);

        clearTimeout(timeout);
        let timeout = setTimeout(() => {
          dispatch(loadingAction.commonLoader(false));
          setState({ ...state, showModal: true });
        }, 300);
      })
      .catch((err) => {
        dispatch(loadingAction.commonLoader(false));
        // console.log('responseData err', err);
      });
  };

  useEffect(() => {
    let url = `${itsmBaseUrl}monshaat_query_category`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    fetch(url, {
      method: 'GET',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('responseData aaaa', responseData);
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
          getToken();
        }
        if (responseData.result) setCategory(responseData.result);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  }, []);

  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <View style={{ alignItems: 'center', paddingBottom: 32 }}>
            <OrderHeader
              {...props}
              title={`مركز الطلبات والدعم ${
                state.type != 'technical' ? 'تقني' : 'غير تقني'
              } ${
                !editableData
                  ? '(ابلاغ عن مشكلة)'
                  : state.subType != 'new'
                  ? '(طلب خدمة)'
                  : '(ابلاغ عن مشكلة)'
              }`}
              icon={require('../../assets/images/da3m.png')}
            />
            <View style={{ width: '90%' }}>
              {!editableData && state.item ? (
                <OrderViewItem
                  title1="رقم الطلب"
                  title2={state.item?.id ? state.item.id : ''}
                  icon={require('../../assets/images/order/id.png')}
                />
              ) : null}
              {!editableData && state.item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={
                    getStatus(
                      'TechnicalRequest',
                      state.item?.state ? state.item.state : '',
                    )['statusText']
                  }
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}

              {!editableData && state.item ? (
                <OrderViewItem
                  title1="صاحب الطلب"
                  title2={
                    state?.item?.IncidentCaller
                      ? state?.item.IncidentCaller
                      : '--'
                  }
                  icon={require('../../assets/images/order/category2.png')}
                />
              ) : null}

              {/* {!editableData && state.item ? (
                <OrderViewItem
                  title1="الوقت"
                  title2={Moment(state.item?.create_date).format(
                    'D-MM-Y hh:mm:ss',
                  )}
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null} */}

              {!editableData && state.item ? (
                <OrderDateViewItem2
                  title1="الوقت "
                  date={Moment(state.item?.create_date).format('DD-MM-YYYY')}
                  icon={require('../../assets/images/order/date.png')}
                  time={Moment(state.item?.create_date).format(' hh:mm:ss a')}
                  styleText={{
                    color: 'gray',
                    fontFamily: '29LTAzer-Regular',
                    marginVertical: 2,
                    marginHorizontal: 2,
                    textAlign: 'right',
                    flex: 1,
                  }}
                />
              ) : null}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !sub1 ? 'red' : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={category}
                    onValueChange={(value, index) => {
                      setSub1(value);
                      getSubCategory1(index, value);
                    }}
                    value={sub1}
                    placeholderText={'اختيار الفئة *'}
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1=" الفئة"
                  title2={item_data?.category ? item_data.category : ''}
                  icon={require('../../assets/images/order/category.png')}
                />
              )}

              {editableData ? (
                category2.length > 1 ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderWidth: 1,
                        borderRadius: 6,
                        borderColor:
                          state.isValidated && !sub2 ? 'red' : '#e3e3e3',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={category2}
                      onValueChange={(value, index) => {
                        setSub2(value);
                        getSubCategory2(index, value);
                      }}
                      value={sub2}
                      placeholderText={
                        state.placeholderTicket
                          ? state.placeholderTicket
                          : 'اختيار الفئة الفرعية'
                      }
                      disabled={!editableData}
                    />
                  </View>
                ) : null
              ) : item_data?.subcategory ? (
                <OrderViewItem
                  title1="اختيار الفئة الفرعية"
                  title2={item_data?.subcategory}
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}

              {editableData ? (
                category3.length > 1 ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderWidth: 1,
                        borderRadius: 6,
                        borderColor:
                          state.isValidated && !sub3 ? 'red' : '#e3e3e3',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={category3}
                      onValueChange={(value, index) => {
                        setSub3(value);
                        getSubCategory3(index, value);
                      }}
                      value={sub3}
                      placeholderText={
                        state.placeholderTicket
                          ? state.placeholderTicket
                          : 'اختيار الفئة الفرعية'
                      }
                      disabled={!editableData}
                    />
                  </View>
                ) : null
              ) : item_data?.subcategory2 ? (
                <OrderViewItem
                  title1="اختيار الفئة الفرعية"
                  title2={item_data?.subcategory2}
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}
              {editableData ? (
                category4.length > 1 ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderWidth: 1,
                        borderRadius: 6,
                        borderColor:
                          state.isValidated && !sub4 ? 'red' : '#e3e3e3',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={category4}
                      onValueChange={(value, index) => {
                        setSub4(value);
                      }}
                      value={sub4}
                      placeholderText={
                        state.placeholderTicket
                          ? state.placeholderTicket
                          : 'اختيار الفئة الفرعية'
                      }
                      disabled={!editableData}
                    />
                  </View>
                ) : null
              ) : item_data?.subcategory3 ? (
                <OrderViewItem
                  title1="اختيار الفئة الفرعية"
                  title2={item_data?.subcategory3}
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}
              {/* {editableData && (
                <OrderViewItem
                  title1="الوصف"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor:
                        state.isValidated && !state.subject.length
                          ? 'red'
                          : '#e2e2e2',
                    },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height + 40 }]}
                    placeholder="وصف المشكلة *"
                    placeholderStyle={{
                      fontFamily: '29LTAzer-Regular',
                    }}
                    changeText={(e) =>
                      setState({ ...state, subject: e, subjectErr: '' })
                    }
                    value={state.subject}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={(e) => {
                      if (e.nativeEvent.contentSize.height > 100) return;
                      setHeight(e.nativeEvent.contentSize.height);
                    }}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الوصف"
                  title2={
                    state.item?.IncidentDescription
                      ? state.item.IncidentDescription
                      : ''
                  }
                  icon={require('../../assets/images/order/subject.png')}
                />
              )}

              {editableData ? (
                <View>
                  {state.filename.length
                    ? state.filename.map((item, index) => (
                        <View
                          style={{
                            flexDirection: 'row-reverse',
                            marginBottom: 10,
                          }}
                          key={index}
                        >
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              backgroundColor: '#efefef',
                              alignSelf: 'stretch',
                              flexGrow: 1,
                              borderRadius: 6,
                            }}
                          >
                            <View style={{ flexGrow: 1, flex: 1 }}>
                              <Text
                                style={{
                                  padding: 10,
                                  width: '100%',
                                  overflow: 'hidden',
                                  textAlign: 'right',
                                  fontFamily: '29LTAzer-Regular',
                                }}
                                numberOfLines={1}
                              >
                                {item.name}
                              </Text>
                            </View>
                            <IconFe
                              name="paperclip"
                              size={20}
                              color={'#007598'}
                              style={{
                                marginRight: 8,
                                padding: 10,
                              }}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              removeFile(item);
                            }}
                          >
                            <IconFe
                              name="x"
                              size={20}
                              color={'red'}
                              style={{
                                marginRight: 8,
                                padding: 10,
                                backgroundColor: '#efefef',
                                borderRadius: 6,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                    : null}

                  <TouchableOpacity
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}
                    onPress={editableData ? addFile : null}
                  >
                    <MaterialCommunityIcons
                      name="arrow-collapse-up"
                      size={20}
                      color="#c2c2c2"
                      style={{ paddingLeft: 16 }}
                    />
                    <Text
                      style={{
                        alignSelf: 'stretch',
                        color: '#99b4c8',
                        fontFamily: '29LTAzer-Regular',
                        flexGrow: 1,
                        padding: 10,
                        textAlign: 'right',
                        alignSelf: 'center',
                      }}
                    >
                      المرفقات
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : attachments_loader ? (
                <View>
                  <OrderViewItem
                    title1="المرفقات"
                    title2=""
                    icon={require('../../assets/images/order/attatchments.png')}
                  />
                  {/* <ActivityIndicator size="small" color="blue" /> */}
                  <Loader />
                </View>
              ) : attachments && attachments.length > 0 ? (
                <OrderViewAttatchment2
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={attachments}
                />
              ) : (
                <OrderViewItem
                  title1="المرفقات"
                  title2="لا يوجد مرفق"
                  icon={require('../../assets/images/order/attatchments.png')}
                />
              )}
            </View>
            <View style={{ width: '80%' }}>
              {editableData ? (
                <CommonFormButton
                  {...props}
                  onPress={() => {
                    setModal2(true);
                  }}
                  disabled={isInActive}
                />
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      {Platform.OS == 'android' ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoading}
          onRequestClose={() => {
            // Alert.console.log("Modal has been closed.");
          }}
        >
          <Loader />
        </Modal>
      ) : (
        isLoading && <Loader />
      )}

      <CommonPopup
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setState({ ...state, showModal: false });
          // props.navigation.goBack();
          props.navigation.popToTop();
        }}
      />
      <CommonPopup
        visible={modal2}
        text={'انت على وشك إرسال الطلب، هل انت متأكد؟'}
        onClose={() => {
          if (!modal2) {
            return;
          }
          submitRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
    </LinearGradient>
  );
};

export default TechnicalRequest;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },

  input: {
    // height: "100%",
    textAlign: 'right',
    paddingRight: wp('2%'),
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'right',
    marginTop: hp('1%'),
    marginRight: wp('4%'),
    fontFamily: '29LTAzer-Regular',
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
});
