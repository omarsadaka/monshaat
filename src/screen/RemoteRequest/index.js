import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
// import CheckBox from "react-native-check-box";
import { Checkbox } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as remoteWorkAction from '../../redux/action/remoteWorkAction';
import { baseUrl, getStatus } from '../../services';
import { checkWeekend } from '../../services/checkWeekend';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import Feather from 'react-native-vector-icons/Feather';
import OrderDateViewItem from '../../components/OrderDateViewItem';

let viewType = 'new';
let item = null;
const RemoteRequest = (props) => {
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [isDatePickerVisibletwo, setDatePickerVisibilitytwo] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [isInActive, setIsInActive] = useState(true);

  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [state, setState] = useState({
    dateone: '',
    datetwo: '',
    leaveTypeData: [
      { value: 'SL', label: 'SL' },
      { value: 'PL', label: 'PL' },
    ],
    dateoneErr: false,
    datetwoErr: false,
    descriptionErr: false,
    description: '',
    showModal: false,
    notes: '',
    reason: null,
    acceptCondition: false,
    mRemoteWorkHistory: [],
    isValidated: false,
    visible1: false,
    visible2: false,
    visible3: false,
    endDateDisabled: true,
  });

  useEffect(() => {
    if (
      date1.length !== 0 &&
      date2.length !== 0 &&
      state.notes.trim().length > 0 &&
      state.acceptCondition === true
    ) {
      setIsInActive(false);
    } else {
      setIsInActive(true);
    }
  }, [state, date1, date2]);
  const [timelineData, setTimelineData] = useState('');

  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const remoteWorkResponse = useSelector(
    (state) => state.RemoteWorkReducer.remoteWorkResponse,
  );
  const remoteWorkHistory = useSelector(
    (state) => state.RemoteWorkReducer.remoteWorkHistory,
  );

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Remote_Work');
    }
  }, [isFocused]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      //
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;

        let url = `${baseUrl}/api/read/last_update?res_model=hr.distance.work&res_id=${item.id}`;
        //`${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=06968`;
        (async () => {
          let secretUrl = await EncryptUrl(url);

          fetch(secretUrl, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              let newdata = finalArray(data);
              // let removedEl = newdata.shift();
              setTimelineData(newdata);
            });
        })();
      }
    });
  });

  const finalArray = (data) => {
    return data.map((obj) => {
      return {
        time: moment(obj.create_date).format('D-MM-Y hh:mm:ss'),
        title:
          obj.old_value_char == 'طلب'
            ? ' صاحب الطلب'
            : obj.old_value_char == 'طلب'
            ? ' صاحب الطلب'
            : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;

        dispatch(
          remoteWorkAction.getRemoteWorkHistory({
            accessToken: accessToken,
            empID: item.employee_id[0],
          }),
        );
        setState({
          ...state,
          dateone: item.date_from,
          datetwo: item.date_to,
          notes: item.description,
          duration: item.duration,
          reason: item.reason ? item.reason : '',
        });

        viewType = props.route.params.viewType;
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (typeof remoteWorkResponse === 'object' && remoteWorkResponse.length) {
      dispatch(remoteWorkAction.emptyRemoteWorkData());
      setState({ ...state, showModal: true });
    } else if (
      typeof remoteWorkResponse === 'object' &&
      Object.keys(remoteWorkResponse).length
    ) {
      dispatch(remoteWorkAction.emptyRemoteWorkData());
      showMessage({
        type: 'danger',
        message: remoteWorkResponse.message.replace('None', ''),
        style: { alignItems: 'flex-end' },
      });
    }
  }, [remoteWorkResponse]);

  useEffect(() => {
    if (typeof remoteWorkHistory === 'object' && remoteWorkHistory.length) {
      state.mRemoteWorkHistory = remoteWorkHistory;
    }
  }, [remoteWorkHistory]);

  const handleLeaves = (value, index) => {
    if (index) {
      setState({
        ...state,
        leaveSelected: value,
      });
    }
  };
  const showDatePickerone = () => {
    setDatePickerVisibilityone(true);
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const showDatePickertwo = () => {
    setDatePickerVisibilitytwo(true);
  };

  const hideDatePickertwo = () => {
    setDatePickerVisibilitytwo(false);
  };

  const handleConfirmone = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      showMessage({
        style: {
          alignItems: 'flex-end',
          fontFamily: '29LTAzer-Regular',
        },
        type: 'danger',
        message: 'برجاء اختيار يوم عمل',
      });
      return;
    }
    let a = moment(date).format('MM/DD/YYYY');
    setDate1(date);
    setDate2('');
    setState({
      ...state,
      dateone: a,
      datetwo: '',
      duration: '1',
      dateoneErr: false,
      visible2: false,
      endDateDisabled: false,
    });
  };
  const handleConfirmtwo = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'برجاء اختيار يوم عمل',
      });
      return;
    }
    setDate2(date);

    let b = moment(date).format('DD/MM/YYYY');
    setState({ ...state, datetwo: b, datetwoErr: false, visible3: false });
  };

  const handleRemoteWork = async () => {
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    let userId = await AsyncStorage.getItem('userid');
    let empID = await AsyncStorage.getItem('empID');
    let {
      dateone,
      datetwo,
      duration,
      dateoneErr,
      datetwoErr,
      notes,
      notesErr,
    } = state;
    if (date1 && date2 && state.acceptCondition && notes.trim().length) {
      let data = {
        values: {
          employee_id: empID,
          date_from: moment(date1).format('MM/DD/YYYY'),
          date_to: moment(date2).format('MM/DD/YYYY'),
          duration: duration,
          description: notes,
          is_from_mobile: true,
        },
        accessToken: accessToken,
      };
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(remoteWorkAction.postRemotWorkData(data));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }

    setModal2(false);
  };

  const approveRequest = () => {
    setModal2(false);
    let data = {
      id: item.id,
    };
    dispatch(loadingAction.commonLoader(true));
    dispatch(remoteWorkAction.approve(data, accessToken));
  };

  const rejectRequest = () => {
    setReasonInputVisible(true);
  };

  const rejectConfirm = () => {
    if (state.reason) {
      setReasonInputVisible(false);
      let data = {
        id: item.id,
        reason: { reason: state.reason },
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(remoteWorkAction.reject(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };
  useEffect(() => {
    if (date1 && date2) {
      let now = moment(date1); //todays date
      let end = moment(date2); // another date
      let duration = moment.duration(end.diff(now));
      let days = duration.asDays() + 1;
      let diff = Math.round(days).toString();
      setState({ ...state, duration: diff });
    }
  }, [date1, date2, state.dateone, state.datetwo]);

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="عمل عن بعد"
            icon={require('../../assets/images/remote.png')}
          />
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '90%', marginBottom: 16 }}>
              {!editableData && item ? (
                <OrderViewItem
                  title1="رقم الطلب"
                  title2={item.name}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="تاريخ الطلب"
                  title2={moment(item.write_date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}

              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={getStatus('RemoteWork', item.state).statusText}
                  icon={require('../../assets/images/order/type.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item && item.reason ? (
                <OrderViewItem
                  title1={
                    item && item.state === 'cancel'
                      ? 'سبب الإلغاء'
                      : 'سبب الرفض'
                  }
                  title2={item.reason}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {editableData !== true ? (
                // && viewType === "approval"
                item ? (
                  <OrderViewItem
                    title1="صاحب الطلب"
                    title2={item.employee_id[1].split(']')[1]}
                    icon={require('../../assets/images/order/category2.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null
              ) : null}

              {
                editableData ? (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      onPress={
                        editableData
                          ? () => setState({ ...state, visible2: true })
                          : null
                      }
                      style={[
                        styles.dateStyle,
                        {
                          borderColor:
                            state.isValidated && !date1 ? 'red' : '#e2e2e2',
                        },
                      ]}
                    >
                      <Image
                        style={{ height: 25, width: 25, tintColor: '#c2c2c2' }}
                        source={require('./../../assets/images/date2.png')}
                      />
                      <Text style={styles.dateText}>
                        {date1
                          ? moment(date1).format('DD/MM/YYYY')
                          : 'تاريخ البداية *'}
                      </Text>
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={state.visible2}
                        hardwareAccelerated={true}
                      >
                        <TouchableWithoutFeedback
                          onPress={() =>
                            setState({ ...state, visible2: false })
                          }
                        >
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              alignSelf: 'center',
                              padding: 10,
                              borderRadius: 15,
                              // backgroundColor: "white",
                              backgroundColor: 'rgba(0, 117,152, 0.97)',
                              alignItems: 'flex-end',
                              justifyContent: 'space-around',
                              position: 'absolute',

                              // top: 262
                            }}
                          >
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                top: 220,
                              }}
                            >
                              <CalendarPicker
                                // enableDateChange={true}
                                // startFromSunday={true}
                                // minDate={new Date()}
                                weekdays={[
                                  'الأحد',
                                  'الأثنين',
                                  'الثلاثاء',
                                  'الاربعاء',
                                  'الخميس',
                                  'الجمعة',
                                  'السبت',
                                ]}
                                months={[
                                  'يناير',
                                  'فبراير',
                                  'مارس',
                                  'ابريل',
                                  'مايو',
                                  'يونيو',
                                  'يوليو',
                                  'اغسطس',
                                  'سبتمبر',
                                  'اكتوبر',
                                  'نوفمبر',
                                  'ديسمبر',
                                ]}
                                previousTitle="السابق"
                                nextTitle="التالي"
                                todayBackgroundColor="#e6ffe6"
                                selectedDayColor="#66ff33"
                                selectedDayTextColor="#000000"
                                // scaleFactor={375}
                                textStyle={{
                                  fontFamily: '29LTAzer-Regular',
                                  color: '#000000',
                                }}
                                // scrollable={true}
                                // horizontal={true}
                                // enableDateChange={true}
                                onDateChange={handleConfirmone}
                                date={date1 ? new Date(date1) : new Date()}
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                      {/* <DateTimePickerModal
                      style={{ fontFamily: "29LTAzer-Regular" }}
                      locale="ar"
                      headerTextIOS="إختر التاريخ"
                      cancelTextIOS="إلغاء"
                      confirmTextIOS="إختيار"
                      isVisible={isDatePickerVisibleone}
                      mode="date"
                      onConfirm={handleConfirmone}
                      onCancel={hideDatePickerone}
                      minimumDate={new Date()}
                      date={date1 ? new Date(date1) : new Date()}

                    /> */}
                    </TouchableOpacity>
                  </View>
                ) : null
                // <OrderViewItem
                //   title1="تاريخ البداية"
                //   title2={state.dateone}
                //   icon={require('../../assets/images/order/date.png')}
                //   title2Style={{
                //     backgroundColor: '#FFFFFF',
                //   }}
                // />
              }

              {
                editableData ? (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      onPress={
                        editableData
                          ? () => setState({ ...state, visible3: true })
                          : null
                      }
                      style={[
                        styles.dateStyle,
                        {
                          borderColor:
                            state.isValidated && !date2 ? 'red' : '#e2e2e2',
                        },
                      ]}
                      disabled={state.endDateDisabled}
                    >
                      <Image
                        style={{ height: 25, width: 25, tintColor: '#c2c2c2' }}
                        source={require('./../../assets/images/date2.png')}
                      />
                      <Text style={styles.dateText}>
                        {date2
                          ? moment(date2).format('DD/MM/YYYY')
                          : 'تاريخ النهاية *'}
                      </Text>
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={state.visible3}
                        hardwareAccelerated={true}
                      >
                        <TouchableWithoutFeedback
                          onPress={() =>
                            setState({ ...state, visible3: false })
                          }
                        >
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              alignSelf: 'center',
                              padding: 10,
                              borderRadius: 15,
                              // backgroundColor: "white",
                              backgroundColor: 'rgba(0, 117,152, 0.97)',
                              alignItems: 'flex-end',
                              justifyContent: 'space-around',
                              position: 'absolute',

                              // top: 262
                            }}
                          >
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                top: 220,
                              }}
                            >
                              <CalendarPicker
                                // enableDateChange={true}
                                // startFromSunday={true}
                                minDate={date1 ? new Date(date1) : new Date()}
                                initialDate={
                                  date1 ? new Date(date1) : new Date()
                                }
                                weekdays={[
                                  'الأحد',
                                  'الأثنين',
                                  'الثلاثاء',
                                  'الاربعاء',
                                  'الخميس',
                                  'الجمعة',
                                  'السبت',
                                ]}
                                months={[
                                  'يناير',
                                  'فبراير',
                                  'مارس',
                                  'ابريل',
                                  'مايو',
                                  'يونيو',
                                  'يوليو',
                                  'اغسطس',
                                  'سبتمبر',
                                  'اكتوبر',
                                  'نوفمبر',
                                  'ديسمبر',
                                ]}
                                previousTitle="السابق"
                                nextTitle="التالي"
                                todayBackgroundColor="#e6ffe6"
                                selectedDayColor="#66ff33"
                                selectedDayTextColor="#000000"
                                // scaleFactor={375}
                                textStyle={{
                                  fontFamily: '29LTAzer-Regular',
                                  color: '#000000',
                                }}
                                // scrollable={true}
                                // horizontal={true}
                                // enableDateChange={true}
                                onDateChange={handleConfirmtwo}
                                date={date2 ? new Date(date2) : new Date()}
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                      {/* <DateTimePickerModal
                      style={{ fontFamily: "29LTAzer-Regular" }}
                      locale="ar"
                      headerTextIOS="إختر التاريخ"
                      cancelTextIOS="إلغاء"
                      confirmTextIOS="إختيار"
                      isVisible={isDatePickerVisibletwo}
                      mode="date"
                      onConfirm={handleConfirmtwo}
                      onCancel={hideDatePickertwo}
                      date={date2 ? new Date(date2) : new Date()}
                      minimumDate={
                        date1 ? new Date(date1) : new Date()
                      }
                    /> */}
                    </TouchableOpacity>
                  </View>
                ) : null
                // <OrderViewItem
                //   title1="تاريخ النهاية"
                //   title2={state.datetwo}
                //   icon={require('../../assets/images/order/date.png')}
                //   title2Style={{
                //     backgroundColor: '#FFFFFF',
                //   }}
                // />
              }

              {
                editableData ? (
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <View style={[styles.inputContainer, { width: '100%' }]}>
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={styles.input}
                        placeholder="المدة الزمنية"
                        keyboardType="numeric"
                        value={state.duration}
                        editable={false}
                      />
                    </View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        right: 10,
                        width: 40,
                        marginHorizontal: 5,
                        color: '#18ab91',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      أيام
                    </Text>
                  </View>
                ) : null
                // <OrderViewItem
                //   title1="المدة"
                //   title2={state.duration + ' أيام'}
                //   icon={require('../../assets/images/order/subject.png')}
                //   title2Style={{
                //     backgroundColor: '#FFFFFF',
                //   }}
                // />
              }

              {!editableData ? (
                <OrderDateViewItem
                  title1="التاريخ"
                  startDate={state.dateone}
                  endDate={state.datetwo}
                  duration={state.duration}
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null}

              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor:
                        state.isValidated && state.notes.trim().length < 1
                          ? 'red'
                          : '#e2e2e2',
                      height: 'auto',
                    },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height }]}
                    changeText={(e) =>
                      setState({ ...state, notes: e, notesErr: '' })
                    }
                    value={state.notes}
                    editable={editableData}
                    placeholder="ملاحظات *"
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="ملاحظات"
                  title2={state.notes}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {!editableData && (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      alignSelf: 'center',
                      padding: 8,
                      width: '55%',
                      marginVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor: '#008AC5',
                    }}
                    disabled={timelineData.length == 0 ? true : false}
                  >
                    {/* <Icon2
                      name="archive"
                      size={25}
                      color="white"
                      resizeMode="stretch"
                      style={{ right: -90 }}
                    /> */}
                    <Text
                      style={{
                        color: '#008AC5',
                        fontFamily: '29LTAzer-Medium',
                        fontSize: hp('2%'),
                        width: '100%',
                        marginRight: 10,
                        paddingRight: 16,
                        textAlign: 'center',
                        marginHorizontal: 10,
                      }}
                    >
                      سجل الموافقات{' '}
                    </Text>
                  </TouchableOpacity>

                  <Modal3
                    isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    // animationType={"slide"}
                    hasBackdrop={true}
                    // transparent={true}
                    //  backdropTransitionInTiming={300}
                    //  backdropTransitionOutTiming={300}
                    backdropOpacity={0.8}
                    backdropColor="black"
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    // coverScreen={false}
                    // deviceHeight={Dimensions.get('screen').height}
                    // backdropColor={"black"}
                    // visible={state.visible1}
                    // hardwareAccelerated={true}

                    // animationDuration={500}
                  >
                    {/* <TouchableWithoutFeedback
      onPress={() => setState({ ...state, visible1: false })}
    > */}
                    <KeyboardAvoidingView behavior="position" enabled>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          top: 90,
                          alignSelf: 'center',
                          overflow: 'hidden',
                          marginTop: -20,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: 'white',
                            borderColor: '#e3e3e3',
                            justifyContent: 'center',
                            marginVertical: 5,
                            width: '100%',
                            height: '80%',
                            top: 0,
                            paddingLeft: 15,
                            paddingRight: 15,
                            alignSelf: 'center',
                            borderRadius: 20,
                            paddingTop: 20,
                            paddingBottom: 40,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              marginVertical: 10,
                              color: '#008AC5',
                              fontFamily: '29LTAzer-Medium',
                              fontSize: 18,
                            }}
                          >
                            سجل الموافقات
                          </Text>
                          {timelineData.length ? (
                            <Timeline
                              data={timelineData}
                              circleSize={20}
                              circleColor="#008AC5"
                              lineColor="#008AC5"
                              // innerCircle={'dot'}
                              descriptionStyle={{
                                color: '#008AC5',
                                fontFamily: '29LTAzer-Medium',
                                textAlign: 'right',
                                fontSize: 17,
                              }}
                              titleStyle={{
                                color: '#898C8E',
                                fontFamily: '29LTAzer-Regular',
                                textAlign: 'right',
                                fontSize: 13,
                              }}
                              timeStyle={{
                                color: '#008AC5',
                                width: 140,
                                fontFamily: '29LTAzer-Light',
                              }}
                            />
                          ) : (
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 20,
                                fontFamily: '29LTAzer-Regular',
                              }}
                            >
                              لا يوجد سجل لهذا الطلب...
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => setModalVisible(false)}
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 20,
                          }}
                        >
                          <Feather
                            name="x-circle"
                            size={23}
                            color={'#E23636'}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                    {/* </TouchableWithoutFeedback> */}
                  </Modal3>
                </View>
              )}
              {editableData ? (
                <View style={{ backgroundColor: '#f3fcff', marginTop: 10 }}>
                  <View style={styles.heading}>
                    <Text
                      style={{
                        color: '#20547a',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      سياسة الخدمة
                    </Text>
                  </View>
                  <Text style={[styles.viewerValueText]}>
                    {
                      '1- يعد يوم العمل عن بعد يوم عمل رسمي بحيث يلتزم الموظف بساعات العمل الرسمية. ويلتزم الموظف بتقديم التقارير والإثباتات اللازمة عما تم إنجازه خلال العمل عن بعد متى ما طلب منه ذلك. '
                    }
                    {'\n'}
                    {
                      '2- على الموظف أن يكون متاح للتواصل من خلال الهاتف النقال المعتمد لدى منشآت والبريد الإلكتروني الرسمي خلال ساعات العمل الرسمية. '
                    }
                    {'\n'}
                    {
                      '3- يعد كل رئيس مباشر مسؤول عن التزام مرؤوسيه بساعات العمل والإنجاز، والتنسيق مع الإدارة العامة للموارد البشرية في حال تبين عدم التزام أي من مرؤوسيه بالسياسة. '
                    }
                  </Text>
                </View>
              ) : null}
              {editableData ? (
                <View
                  style={{
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    marginVertical: hp('2%'),
                    marginRight: 20,
                    //  alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginRight: 8,
                      color: '#20547a',
                      fontFamily: '29LTAzer-Regular',
                      marginTop: Platform.OS === 'android' ? 0 : 3,
                    }}
                  >
                    تم الإطلاع والموافقة *
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                      status={state.acceptCondition ? 'checked' : 'unchecked'}
                      onPress={() =>
                        editableData
                          ? setState({
                              ...state,
                              acceptCondition: !state.acceptCondition,
                            })
                          : null
                      }
                      disabled={!editableData}
                      color={
                        state.isValidated && !state.acceptCondition
                          ? 'red'
                          : '#007598'
                      }
                    />
                  </View>
                </View>
              ) : null}
            </View>
            {editableData ? (
              <View style={{ width: '80%' }}>
                <CommonFormButton
                  {...props}
                  onPress={() => {
                    setModal2(true);
                  }}
                  disabled={isInActive}
                />
              </View>
            ) : viewType === 'approval' ? (
              <View
                style={{
                  marginBottom: 32,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '80%',
                  alignSelf: 'center',
                }}
              >
                <TouchableOpacity
                  style={{ width: '45%' }}
                  onPress={rejectRequest}
                >
                  <View style={styles.reject}>
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Medium',
                        fontSize: 14,
                        textAlign: 'center',
                        color: '#FCFCFC',
                      }}
                    >
                      رفض
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: '45%' }}
                  onPress={() => setModal2(true)}
                >
                  <View style={styles.accept}>
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Medium',
                        fontSize: 14,
                        color: '#FCFCFC',
                        textAlign: 'center',
                      }}
                    >
                      قبول
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>

      <CommonPopup
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setTimeout(() => {
            setState({ ...state, showModal: false });
            // props.navigation.goBack();
            props.navigation.popToTop();
          }, 1000);
        }}
      />
      <CommonPopup
        visible={modal2}
        text={
          !editableData
            ? 'انت على وشك الموافقة على الطلب، هل انت متأكد؟'
            : 'انت على وشك إرسال الطلب، هل انت متأكد؟'
        }
        onClose={() => {
          if (!modal2) {
            return;
          }
          editableData ? handleRemoteWork() : approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          // Alert.console.log("Modal has been closed.");
        }}
      >
        {isLoading ? <Loader /> : null}
      </Modal> */}
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={reasonInputVisible}
          onRequestClose={() => {
            // Alert.console.log("Modal has been closed.");
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#00000055',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: '90%',
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 35,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View style={{ width: '100%' }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    marginBottom: 16,
                    fontWeight: 'bold',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  سبب الرفض
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: '#ffffff' },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height2 }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight2(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  style={{ ...styles.btnPrimary, width: '45%' }}
                  onPress={() => {
                    rejectConfirm();
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    إرسال
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.btnDanger, width: '45%' }}
                  onPress={() => {
                    setReasonInputVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    الغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

export default RemoteRequest;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    backgroundColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007598',
  },
  btnDanger: {
    borderColor: '#20547A',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
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
  mandateTypebtn: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#90909080',
    borderRadius: 10,
  },
  mandateTypeText: {
    color: 'white',
    fontFamily: '29LTAzer-Regular',
  },
  rowContainer: {
    justifyContent: 'space-around',
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
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#e2e2e2',
    borderWidth: 1,
  },
  checkboxStyle: {
    width: 15,
    height: 15,
    // borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    // backgroundColor: "#007598",
    width: 20,
    height: 20,
    // borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonStyle: {
    borderColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: 'center',
    marginVertical: 30,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  dateText: {
    marginLeft: 15,
    marginTop: 4,
    textAlign: 'right',
    width: '85%',
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
  },
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
  },
  accept: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#5CB366',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 8 : 4,
    marginVertical: 8,
  },
  reject: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E23636',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 8 : 4,
    marginVertical: 8,
  },
});
