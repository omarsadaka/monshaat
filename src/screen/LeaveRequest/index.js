import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { default as moment, default as Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewItem from '../../components/OrderViewItem';
import * as leaveActions from '../../redux/action/leaveActions';
import * as loadingAction from '../../redux/action/loadingAction';
import { baseUrl, getStatus } from '../../services';
import { checkWeekend } from '../../services/checkWeekend';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import OrderDateViewItem from '../../components/OrderDateViewItem';
import Feather from 'react-native-vector-icons/Feather';

let viewType = 'new';
let item = null;
const LeaveRequest = (props) => {
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);

  const [isHourFromVisible, setHourFrom] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [date1, setDate1] = useState('');
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [isHourToVisible, setHourTo] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const [state, setState] = useState({
    dateone: '',
    datetwo: '',
    leaveTypeData: [],
    toggleCheckBox: false,
    hourTo: '',
    leaveId: '',
    hourFrom: '',
    hourFromErr: false,
    hourToErr: false,
    dateoneErr: false,
    leaveSelectedId: '',
    placeHolderData: '',
    showModal: false,
    description: '',
    reason: null,
    isValidated: false,
    visible1: false,
    visible2: false,

    // timelineData: [],
  });

  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const allLeaveTypes = useSelector(
    (state) => state.LeavePermissionReducer.allLeaveTypes,
  );

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const leaveRequestResponse = useSelector(
    (state) => state.LeavePermissionReducer.leaveRequestResponse,
  );

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Leave_Request_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        let x = item.hour_from;
        let y = item.hour_to;
        let b =
          y -
          (y % 1) +
          ':' +
          (Math.round((y % 1) * 60) > 9
            ? Math.round((y % 1) * 60)
            : Math.round((y % 1) * 60) + '0');
        let a =
          x -
          (x % 1) +
          ':' +
          (Math.round((x % 1) * 60) > 9
            ? Math.round((x % 1) * 60)
            : Math.round((x % 1) * 60) + '0');
        setState({
          ...state,
          hourFrom: a,
          hourTo: b,
          dateone: item.date,
          placeHolderData: item.type_id[1],
          leaveSelected: item.type_id[0],
          toggleCheckBox: item.all_day,
          description: item.description,
          reason: item.reason ? item.reason : '',
        });
        viewType = props.route.params.viewType;
        dispatch(leaveActions.getLeaves(accessToken));
      } else {
        dispatch(leaveActions.getLeaves(accessToken));
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (
      typeof leaveRequestResponse === 'object' &&
      leaveRequestResponse.length
    ) {
      dispatch(leaveActions.emptyLeavePermissionData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'success',
        message: 'قدمت بنجاح',
      });
      setState({ ...state, showModal: true });
    } else if (
      typeof leaveRequestResponse === 'object' &&
      Object.keys(leaveRequestResponse).length
    ) {
      dispatch(leaveActions.emptyLeavePermissionData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: leaveRequestResponse.message.replace('None', ''),
      });
    }
  }, [leaveRequestResponse]);

  useEffect(() => {
    if (typeof allLeaveTypes === 'object' && allLeaveTypes.length > 0) {
      let data = [];
      allLeaveTypes.map((item) => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        leaveTypeData: data,
        leaveSelected: null,
        leaveSelectedId: null,
      });
    }
  }, [allLeaveTypes]);

  const handleLeaves = (value, index) => {
    if (index) {
      setState({
        ...state,
        leaveSelected: value,
        leaveSelectedId: value,
      });
    }
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const showHourFrom = () => {
    setHourFrom(true);
  };

  const showHourTo = () => {
    setHourTo(true);
  };

  const hideHourFrom = () => {
    setHourFrom(false);
  };

  const hideHourTo = () => {
    setHourTo(false);
  };

  const handleConfirmone = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      hideDatePickerone();
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء اختيار يوم عمل',
      });
      return;
    }
    let a = moment(date).format('DD/MM/YYYY');
    setDate1(date);
    setState({
      ...state,
      dateone: a,
      dateoneErr: false,
      visible2: false,
    });
    hideDatePickerone();
  };

  const handleHourFrom = (date) => {
    let a = moment(date).format('HH:mm');
    setState({ ...state, hourFrom: a, hourFromErr: false });
    hideHourFrom();
  };

  const handleHourTo = (date) => {
    let a = moment(date).format('HH:mm');
    setState({ ...state, hourTo: a, hourToErr: false });
    hideHourTo();
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        // console.log('LISTENER.ITEM', item);
        // console.log('ITEM.ID', item.id);

        let url = `${baseUrl}/api/read/last_update?res_model=hr.authorization&res_id=${item.id}`;
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
              // console.log('lastupdate', data);
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
        title: obj.old_value_char == 'طلب' ? ' صاحب الطلب' : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };
  // var finalArray = lastUpdate.map(function (obj) {
  //   return {
  //     time: obj.create_date,
  //     title: obj.employee_Id[1],
  //     description: obj.new_value_char,

  //   };
  //   // console.log(finalArray);

  // });

  const handleLeave = async (id) => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        console.log('ITEEEEEEEM.NAME', id);
      }
    });
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    let empID = await AsyncStorage.getItem('empID');
    let userId = await AsyncStorage.getItem('userid');
    let {
      hourFrom,
      hourTo,
      dateone,
      hourToErr,
      hourFromErr,
      dateoneErr,
      leaveSelectedId,
      toggleCheckBox,
      description,
    } = state;
    if (
      ((date1 && hourTo && hourFrom) || (date1 && toggleCheckBox)) &&
      leaveSelectedId
    ) {
      let data;
      if (!toggleCheckBox) {
        let newHourFrom = timeToFloat(hourFrom);
        let newHourTo = timeToFloat(hourTo);
        data = {
          values: {
            employee_id: empID,
            type_id: leaveSelectedId,
            date: moment(date1).format('MM/DD/YYYY'),
            hour_from: newHourFrom,
            hour_to: newHourTo,
            all_day: toggleCheckBox,
            description: description,
            is_from_mobile: true,
          },
          accessToken: accessToken,
        };
      } else {
        data = {
          values: {
            employee_id: empID,
            type_id: leaveSelectedId,
            date: moment(date1).format('MM/DD/YYYY'),
            all_day: toggleCheckBox,
            description: description,
            is_from_mobile: true,
          },
          accessToken: accessToken,
        };
      }
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(leaveActions.postLeaves(data));
      dispatch(loadingAction.commonLoader(true));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }
    setModal2(false);
  };

  function timeToFloat(time) {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  const approveRequest = async () => {
    setModal2(false);
    let data = {
      id: item.id,
    };
    dispatch(loadingAction.commonLoader(true));
    dispatch(leaveActions.approve(data, accessToken));
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
        // reason: state.reason,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(leaveActions.reject(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };
  function convertNumToTime(number) {
    // Check sign of given number
    var sign = number >= 0 ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    if (minute.length < 2) {
      minute = '0' + minute;
    }

    // Add Sign in final result
    sign = sign == 1 ? '' : '-';

    // Concate hours and minutes
    time = sign + hour + ':' + minute;

    return time;
  }

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
          <View style={{ alignItems: 'center' }}>
            <OrderHeader
              {...props}
              title="استئذان"
              icon={require('../../assets/images/agaza.png')}
            />
            <View style={{ width: '90%', paddingBottom: 16 }}>
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
                  title2={Moment(item.create_date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={getStatus('Leave', item.state)['statusText']}
                  icon={require('../../assets/images/order/type.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item && item.reason ? (
                <OrderViewItem
                  title1="سبب الرفض"
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
                    icon={require('../../assets/images/order/id.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null
              ) : null}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor:
                        state.isValidated && !state.leaveSelected
                          ? 'red'
                          : '#e2e2e2',
                      borderRadius: 6,
                      borderWidth: 1,
                      backgroundColor: 'white',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.leaveTypeData}
                    onValueChange={(value, index) => handleLeaves(value, index)}
                    value={state.leaveSelected}
                    placeholderText={
                      state.placeHolderData
                        ? state.placeHolderData
                        : 'نوع الاستئذان *'
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الموضوع"
                  title2={state.placeHolderData.split(']')[1]}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {editableData ? (
                <View style={styles.rowContainer}>
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
                        : 'تاريخ الاستئذان *'}
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={state.visible2}
                    hardwareAccelerated={true}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => setState({ ...state, visible2: false })}
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
                            // maxDate={new Date()}
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
                    // minimumDate={new Date()}
                    date={date1 ? new Date(date1) : new Date()}
                    onConfirm={handleConfirmone}
                    onCancel={hideDatePickerone}
                  /> */}
                </View>
              ) : (
                <OrderViewItem
                  title1="تاريخ الاستئذان"
                  title2={moment(state.dateone).format('DD-MM-YYYY')}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {/* {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الرصيد الحالي</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.current_autorization_stock}
                </Text>
              </View>
            ) : null} */}
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%',
                  paddingHorizontal: 5,
                  marginVertical: hp('2%'),
                  alignItems: 'center',
                }}
              >
                <ToggleSwitch
                  isOn={!state.toggleCheckBox}
                  onColor="#EAEFF3"
                  offColor="#007598"
                  size="small"
                  onToggle={(isOn) =>
                    editableData
                      ? setState({
                          ...state,
                          toggleCheckBox: !state.toggleCheckBox,
                        })
                      : null
                  }
                />
                <Text style={styles.fullDay}>كامل اليوم</Text>

                {/* <View
                  style={[
                    styles.checkboxContainer,
                    { backgroundColor: editableData ? "#007598" : "grey" },
                  ]}
                >
                  <CheckBox
                    style={styles.checkboxStyle}
                    checkBoxColor={editableData ? "#007598" : "grey"}
                    onClick={() =>
                      editableData
                        ? setState({
                            ...state,
                            toggleCheckBox: !state.toggleCheckBox,
                          })
                        : null
                    }
                    isChecked={state.toggleCheckBox}
                  />
                </View> */}
              </View>
              {!state.toggleCheckBox ? (
                <View>
                  {
                    editableData ? (
                      <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                          onPress={editableData ? showHourFrom : null}
                          style={[
                            styles.dateStyle,
                            {
                              borderColor:
                                state.isValidated && !state.hourFrom
                                  ? 'red'
                                  : '#e2e2e2',
                            },
                          ]}
                        >
                          <Icon size={25} name="clock-o" color="#c2c2c2" />
                          <Text style={styles.dateText}>
                            {state.hourFrom ? state.hourFrom : 'من الساعة *'}
                          </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                          style={{ fontFamily: '29LTAzer-Regular' }}
                          locale="ar"
                          headerTextIOS="إختر الوقت"
                          cancelTextIOS="إلغاء"
                          confirmTextIOS="إختيار"
                          isVisible={isHourFromVisible}
                          mode="time"
                          onConfirm={handleHourFrom}
                          onCancel={hideHourFrom}
                        />
                      </View>
                    ) : null
                    // <OrderViewItem
                    //   title1="من الساعة"
                    //   title2={state.hourFrom}
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
                          onPress={editableData ? showHourTo : null}
                          style={[
                            styles.dateStyle,
                            {
                              borderColor:
                                state.isValidated && !state.hourTo
                                  ? 'red'
                                  : '#e2e2e2',
                            },
                          ]}
                        >
                          <Icon size={25} name="clock-o" color="#c2c2c2" />
                          <Text style={styles.dateText}>
                            {state.hourTo ? state.hourTo : 'إلى الساعة *'}
                          </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                          style={{ fontFamily: '29LTAzer-Regular' }}
                          locale="ar"
                          headerTextIOS="إختر الوقت"
                          cancelTextIOS="إلغاء"
                          confirmTextIOS="إختيار"
                          isVisible={isHourToVisible}
                          mode="time"
                          // minimumDate={
                          //   state.hourFrom ? new Date(state.hourFrom) : null
                          // }
                          onConfirm={handleHourTo}
                          onCancel={hideHourTo}
                        />
                      </View>
                    ) : null
                    // <OrderViewItem
                    //   title1="إلى الساعة"
                    //   title2={state.hourTo}
                    //   icon={require('../../assets/images/order/date.png')}
                    //   title2Style={{
                    //     backgroundColor: '#FFFFFF',
                    //   }}
                    // />
                  }
                </View>
              ) : null}

              {!state.toggleCheckBox && !editableData ? (
                <OrderDateViewItem
                  isLeave={true}
                  title1="الوقت "
                  startDate={
                    item?.hour_from
                      ? convertNumToTime(item?.hour_from)
                      : //  parseFloat(item.hour_from)
                        //     .toFixed(2)
                        //     .replace('.', ':')
                        '--'
                  }
                  icon={require('../../assets/images/order/date.png')}
                  endDate={
                    item?.hour_to
                      ? convertNumToTime(item?.hour_to)
                      : // parseFloat(item?.hour_to)
                        //     .toFixed(2)
                        //     .replace('.', ':')
                        '--'
                  }
                  duration={
                    item?.hour_to && item?.hour_from
                      ? convertNumToTime(item?.hour_to - item?.hour_from)
                      : // parseFloat(item?.hour_to - item?.hour_from)
                        //     .toFixed(2)
                        //     .replace('.', ':')
                        '--'
                  }
                  styleText={{
                    fontSize: hp('1.6%'),
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
                    styles.inputContainer,
                    { height: 'auto', backgroundColor: 'white' },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height }]}
                    placeholder="سبب الاستئذان"
                    changeText={(e) =>
                      setState({ ...state, description: e, discriptionErr: '' })
                    }
                    value={state.description}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="سبب الاستئذان"
                  title2={state.description}
                  icon={require('../../assets/images/order/subject.png')}
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
                      width: '50%',
                      marginVertical: 10,
                      alignItems: 'center',
                      // flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      borderRadius: 30,
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
                        fontSize: 15,
                        width: '100%',
                        marginRight: 10,
                        // paddingRight: 16,
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
                    hasBackdrop={true}
                    backdropOpacity={0.8}
                    backdropColor="black"
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                  >
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
            </View>

            {editableData ? (
              <View style={{ width: '80%' }}>
                <CommonFormButton
                  {...props}
                  disabled={
                    !(
                      ((date1 && state.hourTo && state.hourFrom) ||
                        (date1 && state.toggleCheckBox)) &&
                      state.leaveSelectedId
                    )
                  }
                  onPress={() => setModal2(true)}
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
                  <View style={[styles.accept]}>
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Medium',
                        fontSize: 14,
                        textAlign: 'center',
                        color: '#FCFCFC',
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
          editableData ? handleLeave() : approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
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

export default LeaveRequest;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    paddingRight: wp('4%'),
    marginBottom: hp('0.5%'),
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
  },
  input: {
    height: '100%',
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
  },
  mandateTypebtn: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#90909080',
    borderRadius: 10,
  },
  mandateTypeText: {
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 6,
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
  checkboxStyle: {
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    backgroundColor: '#007598',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#dedede',
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
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    justifyContent: 'center',
    marginVertical: 5,
  },
  fullDay: {
    textAlign: 'right',
    color: '#007297',
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
