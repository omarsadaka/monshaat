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
import { AppStyle } from '../../../assets/style/AppStyle';
import CommonDropdown from '../../../components/CommonDropdown';
import CommonFormButton from '../../../components/CommonFormButton';
import CommonPopup from '../../../components/CommonPopup';
import CommonTextInput from '../../../components/CommonTextInput';
import Loader from '../../../components/loader';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewItem from '../../../components/OrderViewItem';
import * as leaveActions from '../../../redux/action/leaveActions';
import * as loadingAction from '../../../redux/action/loadingAction';
import { baseUrl, getStatus } from '../../../services';
import { checkWeekend } from '../../../services/checkWeekend';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import Feather from 'react-native-vector-icons/Feather';
import OrderDateViewItem from '../../../components/OrderDateViewItem';

const LeaveRequest = (props) => {
  let { item, viewType } = props;
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (item) {
      // item = props.item;
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
      // viewType = props.viewType;
      dispatch(leaveActions.getLeaves(accessToken));
    } else {
      dispatch(leaveActions.getLeaves(accessToken));
    }
  }, [item]);

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

  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url = `${baseUrl}/api/read/last_update?res_model=hr.authorization&res_id=${item.id}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        // console.log('asd@response', response);

        const data = await response.json();
        // console.log('asd@data', data);
        let newdata = finalArray(data);
        setTimelineData(newdata);
        setModalVisible(true);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
    }
  };

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
      if (item) {
        // item = props.item;
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
    <KeyboardAwareScrollView>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '90%', paddingBottom: 16 }}>
          {item ? (
            <OrderViewItem
              title1="رقم الطلب"
              title2={item.name}
              icon={require('../../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {item ? (
            <OrderViewItem
              title1="تاريخ الطلب"
              title2={Moment(item.create_date).format('D-MM-Y')}
              icon={require('../../../assets/images/order/date.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {item ? (
            <OrderViewItem
              title1="الحالة"
              title2={getStatus('Leave', item.state)['statusText']}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {item && item.reason ? (
            <OrderViewItem
              title1="سبب الرفض"
              title2={item.reason}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {false !== true ? (
            // && viewType === "approval"
            item ? (
              <OrderViewItem
                title1="صاحب الطلب"
                title2={item.employee_id[1].split(']')[1]}
                icon={require('../../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null
          ) : null}

          <OrderViewItem
            title1="الموضوع"
            title2={item.type_id[1].split(']')[1]}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="تاريخ الاستئذان"
            title2={Moment(item.date).format('DD-MM-YYYY')}
            icon={require('../../../assets/images/order/date.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {!item.all_day ? (
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
              icon={require('../../../assets/images/order/date.png')}
              endDate={
                item?.hour_to
                  ? convertNumToTime(item?.hour_to)
                  : // parseFloat(item.hour_to)
                    //     .toFixed(2)
                    //     .replace('.', ':')
                    '--'
              }
              duration={
                item?.hour_to && item?.hour_from
                  ? convertNumToTime(item.hour_to - item.hour_from)
                  : // parseFloat(item.hour_to - item.hour_from)
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
              isOn={!item.all_day}
              onColor="#EAEFF3"
              offColor="#007598"
              size="small"
              onToggle={(isOn) =>
                false
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
          {/* {!item.all_day ? (
            <View>
              <OrderViewItem
                title1="من الساعة"
                title2={item.hour_from}
                icon={require('../../../assets/images/order/date.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              {false ? (
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
              ) : (
                <OrderViewItem
                  title1="إلى الساعة"
                  title2={item.hour_to}
                  icon={require('../../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
            </View>
          ) : null} */}

          <OrderViewItem
            title1="سبب الاستئذان"
            title2={item.description}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => getHistoryApprove()}
              style={{
                alignSelf: 'center',
                padding: 8,
                width: '55%',
                marginTop: 20,
                alignItems: 'center',
                flexDirection: 'row-reverse',
                justifyContent: 'center',
                borderRadius: 25,
                borderWidth: 1,
                borderColor: '#008AC5',
              }}
            >
              {loading ? (
                <>
                  <Loader />
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
                </>
              ) : (
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
              )}
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
                    <Feather name="x-circle" size={23} color={'#E23636'} />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
              {/* </TouchableWithoutFeedback> */}
            </Modal3>
          </View>
        </View>
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
          true
            ? 'انت على وشك الموافقة على الطلب، هل انت متأكد؟'
            : 'انت على وشك إرسال الطلب، هل انت متأكد؟'
        }
        onClose={() => {
          if (!modal2) {
            return;
          }
          false ? handleLeave() : approveRequest();
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
    </KeyboardAwareScrollView>
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
});
