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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import * as leaveRequestActions from '../../redux/action/leaveRequestAction';
import * as loadingAction from '../../redux/action/loadingAction';
import { baseUrl, getStatus } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { checkWeekend } from '../../services/checkWeekend';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import OrderDateViewItem from '../../components/OrderDateViewItem';
import Feather from 'react-native-vector-icons/Feather';

let viewType = 'new';
let dataID = -1;
let item = null;
const NewLeaveRequest = (props) => {
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [height3, setHeight3] = useState(40);
  const [state, setState] = useState({
    leaveTypeData: [],
    leaveSelected: '',
    startDate: '',
    leaveId: '',
    endDate: '',
    duration: '',
    comments: '',
    startDateErr: '',
    endDateErr: '',
    durationErr: '',
    dateone: '',
    datetwo: '',
    datethree: '',
    showModal: false,
    editable: true,
    disabled: false,
    comeFrom: props.route.params.comeFrom,
    placeholderData: '',
    alternateEmployeeData: [],
    alternateEmployeeSelected: '',
    alternateEmployeeSelectedId: '',
    filename: [],
    arrayData: [],
    reason: null,
    isValidated: false,
    death_person: '',
    testUpdate: [],
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
    endDateDisabled: true,
    formData: {},
  });
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [isDatePickerVisibletwo, setDatePickerVisibilitytwo] = useState(false);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [date3, setDate3] = useState('');

  const [lastUpdate, setLastUpdate] = useState('');
  const [timelineData, setTimelineData] = useState('');
  const [isInActive, setIsInActive] = useState(true);


  const [isDatePickerVisiblethree, setDatePickerVisibilitythree] =
    useState(false);

  const allAternateEmployeeDataList = useSelector(
    (state) => state.LeaveRequestReducer.allAternateEmployeeDataList,
  );

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const allLeaveTypes = useSelector(
    (state) => state.LeaveRequestReducer.allLeaveTypes,
  );
  const leaveCredit = useSelector(
    (state) => state.LeaveRequestReducer.leaveCredit,
  );
  const leaveCreditSick = useSelector(
    (state) => state.LeaveRequestReducer.leaveCreditSick,
  );
  const leaveVacationRes = useSelector(
    (state) => state.LeaveRequestReducer.leaveVacationRes,
  );

  const deptId = useSelector((state) => state.LoginReducer.deptId);
  const managerID = useSelector((state) => state.LoginReducer.managerId);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Holiday_Request_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        // console.log('LISTENER.ITEM', item);
        // console.log('ITEM.ID', item.id);

        let url = `${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=${item.id}`;
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
              if (timelineData.length === 0) {
                return <Text>No records found</Text>;
              }
            });
        })();
      }
    });
  });

  const finalArray = (data) => {
    return data.map((obj) => {
      return {
        time: moment(obj.create_date).format('D-MM-Y hh:mm:ss'),
        // time: obj.create_date,
        title: obj.old_value_char == 'طلب' ? ' صاحب الطلب' : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        setState({
          ...state,
          formData: item,
          duration: item.duration,
          leaveSelected: item.holiday_status_id[1],
          dateone: item.date_from,
          datetwo: item.date_to,
          comments: item.notes,
          attachment_ids: item.attachment_ids,
          placeholderData: item.holiday_status_id[1],
          alternateEmployeeSelected: item.substitute_employee_id
            ? item.substitute_employee_id[1]
            : '',
          reason: item.reason ? item.refuse_reason : '',
          datethree: item.childbirth_date ? item.childbirth_date : '',
          death_person: item.death_person ? item.death_person : '',
          cancel_reason: item.cancel_reason ? item.cancel_reason : '',
        });
        setDate3(item.childbirth_date);
        dataID = item.id;
        viewType = props.route.params.viewType;
      } else {
        dispatch(leaveRequestActions.getLeavesType(accessToken));
        (async () => {
          let empID = await AsyncStorage.getItem('empID');
          let employee_id = parseInt(empID);
          dispatch(
            leaveRequestActions.getLeavesCredit(accessToken, employee_id),
          );
          dispatch(
            leaveRequestActions.getLeavesCreditSick(accessToken, employee_id),
          );
        })();

        if (deptId) {
          dispatch(
            leaveRequestActions.getAlternateEmployee(
              accessToken,
              deptId[0].department_id[0],
              managerID[0].parent_id[0],
            ),
          );
        }
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (
      typeof allAternateEmployeeDataList === 'object' &&
      allAternateEmployeeDataList.length
    ) {
      let data = [];
      allAternateEmployeeDataList.map((item) => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.complete_name,
        });
      });
      setState({
        ...state,
        alternateEmployeeData: data,
        alternateEmployeeSelected: null,
        alternateEmployeeSelecteduId: null,
      });
    }
  }, [allAternateEmployeeDataList]);

  useEffect(() => {
    if (typeof leaveVacationRes === 'object' && leaveVacationRes.length) {
      dispatch(leaveRequestActions.emptyVacationData());
      setState({ ...state, showModal: true });
    } else if (
      typeof leaveVacationRes === 'object' &&
      Object.keys(leaveVacationRes).length
    ) {
      // console.log(
      //   'leaveVacationRes.message',
      //   leaveVacationRes.message.replace('None', ''),
      // );
      dispatch(leaveRequestActions.emptyVacationData());
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: leaveVacationRes.message.replace('None', ''),
      });
    }
  }, [leaveVacationRes]);

  useEffect(() => {
    if (typeof allLeaveTypes === 'object' && allLeaveTypes.length) {
      let data = [];
      allLeaveTypes.map((item) => {
        data.push({ id: item.id, value: item.name, label: item.name });
      });
      setState({ ...state, leaveTypeData: data, leaveSelected: null });
    }
  }, [allLeaveTypes]);



  const addFile = async () => {
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        arrayData.push(mFile);
        filename.push({ name: mFile.name });
        setState({ ...state, arrayData, filename });
      }
    } catch (err) {
      throw err;
    }
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

  const handleLeaves = (value, index) => {
    if (index) {
      setState({
        ...state,
        leaveSelected: value,
        leaveId: state.leaveTypeData[index - 1].id,
      });
    }
  };

  const validator = () => {
    let { startDate, endDate, comments, duration } = state;
    if (!startDate) {
      setState({ ...state, startDateErr: '* Required' });
      return false;
    } else if (!endDate) {
      setState({ ...state, endDateErr: '* Required' });
      return false;
    } else if (!duration) {
      setState({ ...state, durationErr: '* Required' });
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (
      date1.length !== 0 &&
      date2.length !== 0 &&
      state.leaveId.length !== 0 &&
      (state.leaveSelected !== 'إجازة سنوية'
        ? state.filename.length > 0
        : true) &&
      (state.leaveSelected === 'إجازة المولود' ||
      state.leaveSelected === 'إجازة وضع'
        ? state.datethree
        : true) &&
      (state.leaveSelected === 'إجازة وفاة' ? state.death_person.length : true)
    ) {
      setIsInActive(false);
    } else {
      setIsInActive(true);
    }
  }, [state, date1, date2]);

  const sendLeaveRequest = async () => {
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    setModal2(false);
    if (
      date1 &&
      date2 &&
      state.leaveId &&
      (state.leaveSelected !== 'إجازة سنوية'
        ? state.filename.length > 0
        : true) &&
      (state.leaveSelected === 'إجازة المولود' ||
      state.leaveSelected === 'إجازة وضع'
        ? state.datethree
        : true) &&
      (state.leaveSelected === 'إجازة وفاة' ? state.death_person.length : true)
    ) {
      dispatch(loadingAction.commonLoader(true));
      let {
        leaveId,
        startDate,
        endDate,
        duration,
        dateone,
        datetwo,
        datethree,
        comments,
        alternateEmployeeSelectedId,
        death_person,
      } = state;

      let empID = await AsyncStorage.getItem('empID');
      let userId = await AsyncStorage.getItem('userid');

      
      let data = {
        employee_id: parseInt(empID),
        holiday_status_id: leaveId,
        duration: duration,
        date_from: moment(date1).format('MM/DD/YYYY'),
        date_to: moment(date2).format('MM/DD/YYYY'),
        notes: comments,
        childbirth_date:
          state.leaveSelected == 'إجازة المولود' ||
          state.leaveSelected == 'إجازة وضع'
            ? datethree
            : '',
        death_person: state.leaveSelected == 'إجازة وفاة' ? death_person : '',
        substitute_employee_id: alternateEmployeeSelectedId,
        is_from_mobile: true,
      };
      let data2={
        attachments:[]
      }
      if (state.arrayData) {
        data2['attachments'] = state.arrayData;

      }

      // const res = await CheckAltEmp(data, accessToken);
      // if (res == null) {
      // dispatch(loadingAction.commonLoader(true));
    
      dispatch(leaveRequestActions.leaveRequest(data, accessToken,data2));
      // } else {
      //   showMessage({
      //     style: { alignItems: "flex-end" },
      //     type: "danger",
      //     message: res.warning.message,
      //   });
      //   dispatch(loadingAction.commonLoader(false));
      // }
    } else {
      dispatch(loadingAction.commonLoader(false));
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }
  };

  const approveRequest = async () => {
    setModal2(false);
    let data = {
      id: dataID,
    };
    dispatch(loadingAction.commonLoader(true));
    dispatch(leaveRequestActions.leaveApprove(data, accessToken));
  };

  const rejectRequest = () => {
    setReasonInputVisible(true);
  };

  const rejectConfirm = () => {
    if (state.reason) {
      setReasonInputVisible(false);
      let data = {
        id: item.id,
        reason: { refuse_reason: state.reason },
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(leaveRequestActions.leaveReject(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
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

  const showDatePickerthree = () => {
    setDatePickerVisibilitythree(true);
  };

  const hideDatePickerthree = () => {
    setDatePickerVisibilitythree(false);
  };

  const handleConfirmone = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      // hideDatePickerone();
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء اختيار يوم عمل',
      });
      return;
    }
    setDate1(date);
    let a = moment(date).format('MM/DD/YYYY');
    // console.log("DURATION", a.day() )
    setDate2('');
    setState({
      ...state,
      dateone: a,
      datetwo: '',
      duration: '1',
      visible2: false,
      endDateDisabled: false,
    });
  };

  const handleConfirmtwo = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      // hideDatePickertwo();
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'الرجاء اختيار يوم عمل',
      });
      return;
    }

    let b = moment(date).format('MM/DD/YYYY');
    setState({ ...state, datetwo: b, visible3: false });
    setDate2(date);

    // hideDatePickertwo();
  };

  const handleConfirmthree = async (date) => {
    let b = moment(date).format('MM/DD/YYYY');
    setState({ ...state, datethree: b, visible4: false });
    // hideDatePickerthree();
    setDate3(date);
  };

  const handleAlternateEmployee = (value, index) => {
    // if (index) {
    setState({
      ...state,
      alternateEmployeeSelected: value,
      alternateEmployeeSelectedId: value,
    });

    // }
  };

  useEffect(() => {
    if (date1 && date2) {
      let now = moment(date1); //todays date
      let end = moment(date2); // another date
      let duration = moment.duration(end.diff(now));
      let days = duration.asDays() + 1;
      let diff = Math.round(days).toString();
      // console.log('diff', diff);
      setState({ ...state, duration: diff });
    }
    if (state.duration < 0) {
      dispatch(loadingAction.commonLoader(false));
      showMessage({
        style: {
          alignItems: 'flex-end',
          fontFamily: '29LTAzer-Regular',
        },
        type: 'danger',
        message: 'يرجى إختيار تاريخ البداية قبل النهاية',
      });
    }
  }, [date1, date2]);

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
              title="اجازة"
              icon={require('../../assets/images/agaza.png')}
            />
            <View style={{ width: '90%', paddingBottom: 6 }}>
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
                  title2={moment(item.date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}

              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={getStatus('Vacation', item.state).statusText}
                  icon={require('../../assets/images/order/type.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item && item.refuse_reason ? (
                <OrderViewItem
                  title1="سبب الرفض"
                  title2={item.refuse_reason}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item && item.cancel_reason ? (
                <OrderViewItem
                  title1="سبب الإلغاء"
                  title2={item.cancel_reason}
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

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor:
                        state.isValidated && !state.leaveSelected
                          ? 'red'
                          : '#e3e3e3',
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
                      state.placeholderData
                        ? state.placeholderData
                        : 'نوع الإجازة *'
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="نوع الإجازة"
                  title2={state.placeholderData}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {state.leaveSelected == 'إجازة وفاة' && (
                <>
                  {editableData ? (
                    <View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && state.death_person.length < 1
                                ? 'red'
                                : '#e3e3e3',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: height }]}
                          placeholder="المتوفي *"
                          changeText={(e) =>
                            setState({ ...state, death_person: e })
                          }
                          value={state.death_person}
                          editable={editableData}
                          multiline={true}
                          onContentSizeChange={(e) =>
                            setHeight(e.nativeEvent.contentSize.height)
                          }
                        />
                      </View>
                    </View>
                  ) : (
                    <OrderViewItem
                      title1="المتوفي"
                      title2={state.death_person ? state.death_person : '-'}
                      icon={require('../../assets/images/order/id.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </>
              )}
              {editableData ? (
                <View style={styles.creditContainer}>
                  <View style={styles.creditName}>
                    <Text style={styles.creditNameText}>رصيد الإجازات</Text>
                  </View>
                  <View style={styles.creditValue}>
                    <Text style={styles.creditValueText}>
                      {state.leaveSelected == 'إجازة مرضيّة'
                        ? parseInt(leaveCreditSick)
                        : state.leaveSelected == 'إجازة سنوية'
                        ? parseInt(leaveCredit)
                        : '--'}
                    </Text>
                  </View>
                </View>
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
                              onDateChange={handleConfirmone}
                              date={date1 ? new Date(date1) : new Date()}
                            />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
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
                    </TouchableOpacity>
                    <Modal
                      animationType={'slide'}
                      transparent={true}
                      visible={state.visible3}
                      hardwareAccelerated={true}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => setState({ ...state, visible3: false })}
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
                              initialDate={date1 ? new Date(date1) : new Date()}
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
                    minimumDate={date1 ? new Date(date1) : new Date()}
                  /> */}
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

              {(state.leaveSelected == 'إجازة المولود' ||
                state.leaveSelected === 'إجازة وضع') && (
                <View>
                  {editableData ? (
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity
                        onPress={
                          editableData
                            ? () => setState({ ...state, visible4: true })
                            : null
                        }
                        style={[
                          styles.dateStyle,
                          {
                            borderColor:
                              state.isValidated && !state.datethree
                                ? 'red'
                                : '#e2e2e2',
                          },
                        ]}
                      >
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            tintColor: '#c2c2c2',
                          }}
                          source={require('./../../assets/images/date2.png')}
                        />
                        <Text style={styles.dateText}>
                          {date3 //state.datethree
                            ? moment(date3).format('DD/MM/YYYY')
                            : 'تاريخ ولادة الطفل *'}
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={state.visible4}
                        hardwareAccelerated={true}
                      >
                        <TouchableWithoutFeedback
                          onPress={() =>
                            setState({ ...state, visible4: false })
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
                                onDateChange={handleConfirmthree}
                                date={
                                  state.datethree
                                    ? new Date(state.datethree)
                                    : new Date()
                                }
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
                          isVisible={isDatePickerVisiblethree}
                          mode="date"
                          onConfirm={handleConfirmthree}
                          onCancel={hideDatePickerthree}
                          date={
                            state.datethree
                              ? new Date(state.datethree)
                              : new Date()
                          }
                        /> */}
                    </View>
                  ) : (
                    <OrderViewItem
                      title1="تاريخ ولادة الطفل"
                      title2={state.datethree}
                      icon={require('../../assets/images/order/date.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </View>
              )}

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
                        customStyleData={[
                          styles.input,
                          { height: height2 + 3 },
                        ]}
                        placeholder="المدة الزمنية"
                        keyboardType="numeric"
                        value={state.duration}
                        editable={false}
                        multiline={true}
                        onContentSizeChange={(e) =>
                          setHeight2(e.nativeEvent.contentSize.height)
                        }
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
                      }}
                    >
                      أيام
                    </Text>
                  </View>
                ) : null
                // <OrderViewItem
                //   title1="المدة الزمنية"
                //   title2={state.duration + '  أيام'}
                //   icon={require('../../assets/images/order/subject.png')}
                //   title2Style={{
                //     backgroundColor: '#FFFFFF',
                //   }}
                // />
              }
              {!editableData ? (
                <OrderDateViewItem
                  title1="التاريخ"
                  startDate={moment(state.dateone).format('DD-MM-YYYY')}
                  endDate={moment(state.datetwo).format('DD-MM-YYYY')}
                  duration={state.duration}
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor: '#e3e3e3',
                      // state.isValidated && !state.alternateEmployeeSelected
                      //   ? "red"
                      //   : "#ffffff",
                      borderRadius: 6,
                      borderWidth: 1,
                      backgroundColor: 'white',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.alternateEmployeeData}
                    onValueChange={(value, index) =>
                      handleAlternateEmployee(value, index)
                    }
                    value={state.alternateEmployeeSelected}
                    placeholderText="الموظف البديل"
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الموظف البديل"
                  title2={state.alternateEmployeeSelected}
                  icon={require('../../assets/images/order/category2.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {editableData ? (
                <View>
                  <View style={styles.inputContainer}>
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={[styles.input, { height: height3 }]}
                      placeholder="الملاحظات"
                      changeText={(e) => setState({ ...state, comments: e })}
                      value={state.comments}
                      editable={editableData}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        setHeight3(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                </View>
              ) : (
                <OrderViewItem
                  title1="الملاحظات"
                  title2={state.comments ? state.comments : '-'}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {!editableData && (
                <OrderViewItem
                  title1="التنبيهات"
                  title2={state.text_warning ? state.text_warning : '-'}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {!editableData ? (
                viewType === 'approval' ? null : state.reason ? (
                  <OrderViewItem
                    title1="تعليق"
                    title2={state.reason ? state.reason : '-'}
                    icon={require('../../assets/images/order/id.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null
              ) : null}

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
                        borderColor:
                          state.isValidated &&
                          state.leaveSelected !== 'إجازة سنوية' &&
                          state.filename.length < 1
                            ? 'red'
                            : '#e3e3e3',
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
                      {state.leaveSelected !== 'إجازة سنوية'
                        ? 'المرفقات *'
                        : 'المرفقات'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : state.attachment_ids && state.attachment_ids.length > 0 ? (
                <OrderViewAttatchment
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={state.attachment_ids}
                />
              ) : (
                <OrderViewItem
                  title1="المرفقات"
                  title2="لا يوجد مرفق"
                  icon={require('../../assets/images/order/attatchments.png')}
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
            </View>
            {editableData === true ? (
              <View style={{ width: '80%' }}>
                <CommonFormButton
                  {...props}
                  onPress={() => setModal2(true)}
                  disabled={isInActive}
                />
              </View>
            ) : viewType === 'approval' ? (
              <View
                style={{
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
                        fontSize: 16,
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
                        fontSize: 16,
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
          editableData ? sendLeaveRequest() : approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
      {Platform.OS == 'android' ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isLoading}
            onRequestClose={() => {}}
          >
            <Loader />
          </Modal>
        ) : (
          isLoading && <Loader />
        )}

      {/* {isLoading ? <Loader /> : null} */}

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
                    customStyleData={[styles.input, { height: height }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
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

export default NewLeaveRequest;

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
  creditContainer: {
    height: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginVertical: 5,
    flexDirection: 'row-reverse',
  },
  creditName: {
    width: '35%',
    height: '100%',
    backgroundColor: '#007598',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditValue: {
    width: '65%',
    height: '100%',
    // backgroundColor:"red",
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditNameText: {
    fontFamily: '29LTAzer-Regular',
    color: '#ffffff',
    fontSize: hp('1.5%'),
  },
  creditValueText: {
    fontFamily: '29LTAzer-Regular',
    color: '#99b4c8',
    fontSize: hp('1.5%'),
  },
  accept: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#5CB366',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
    marginVertical: 8,
  },
  reject: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E23636',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
    marginVertical: 8,
  },
});
